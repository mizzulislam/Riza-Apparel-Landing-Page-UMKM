/**
 * AI Client & Quota Controller (FR-E4, FR-E5, FR-E6, UC19)
 * 
 * Mengelola pemanggilan backend proxy AI (Gemini 1.5 Flash) dengan:
 * 1. Tanpa API Key di client (FR-E6)
 * 2. Rate limiting & penangan kuota internal per sesi/hari (FR-E4)
 * 3. Circuit breaker penutupan otomatis saat kuota habis ke tombol WA (FR-E5)
 * 4. Fallback transparan jika offline / proxy tidak merespons
 */

export type AIQuotaStatus = 'normal' | 'approaching_limit' | 'quota_exceeded';

export interface AIQuotaInfo {
  status: AIQuotaStatus;
  usedToday: number;
  maxDailyQuota: number;
  sessionRemaining: number;
  message?: string;
}

const STORAGE_KEY_USAGE = 'riza_ai_daily_usage_v1';
const STORAGE_KEY_DATE = 'riza_ai_usage_date_v1';

const MAX_DAILY_QUOTA = 1000; // Kuota internal aman di bawah 1.500 RPD gratis Gemini
const MAX_SESSION_QUOTA = 15;  // Batas per sesi pengguna

// Dapatkan tanggal hari ini (YYYY-MM-DD)
const getTodayString = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Ambil statistik kuota saat ini
export const getAIQuotaInfo = (): AIQuotaInfo => {
  try {
    const today = getTodayString();
    const storedDate = localStorage.getItem(STORAGE_KEY_DATE);
    let usedToday = 0;

    if (storedDate === today) {
      usedToday = parseInt(localStorage.getItem(STORAGE_KEY_USAGE) || '0', 10);
    } else {
      // Reset kuota harian saat berganti hari
      localStorage.setItem(STORAGE_KEY_DATE, today);
      localStorage.setItem(STORAGE_KEY_USAGE, '0');
    }

    const sessionUsed = parseInt(sessionStorage.getItem('riza_ai_session_usage') || '0', 10);
    const sessionRemaining = Math.max(0, MAX_SESSION_QUOTA - sessionUsed);

    let status: AIQuotaStatus = 'normal';
    if (usedToday >= MAX_DAILY_QUOTA || sessionRemaining <= 0) {
      status = 'quota_exceeded';
    } else if (usedToday >= MAX_DAILY_QUOTA * 0.8 || sessionRemaining <= 3) {
      status = 'approaching_limit';
    }

    return {
      status,
      usedToday,
      maxDailyQuota: MAX_DAILY_QUOTA,
      sessionRemaining,
    };
  } catch (e) {
    return {
      status: 'normal',
      usedToday: 0,
      maxDailyQuota: MAX_DAILY_QUOTA,
      sessionRemaining: MAX_SESSION_QUOTA,
    };
  }
};

// Catat penggunaan kuota 1x pemanggilan
export const incrementAIUsage = (): AIQuotaInfo => {
  try {
    const today = getTodayString();
    const storedDate = localStorage.getItem(STORAGE_KEY_DATE);
    let usedToday = 0;

    if (storedDate === today) {
      usedToday = parseInt(localStorage.getItem(STORAGE_KEY_USAGE) || '0', 10);
    } else {
      localStorage.setItem(STORAGE_KEY_DATE, today);
    }

    usedToday += 1;
    localStorage.setItem(STORAGE_KEY_USAGE, usedToday.toString());

    let sessionUsed = parseInt(sessionStorage.getItem('riza_ai_session_usage') || '0', 10);
    sessionUsed += 1;
    sessionStorage.setItem('riza_ai_session_usage', sessionUsed.toString());
  } catch (e) {}

  return getAIQuotaInfo();
};

// Paksa status kuota habis jika API mengembalikan HTTP 429
export const setAIQuotaExceeded = (): AIQuotaInfo => {
  try {
    localStorage.setItem(STORAGE_KEY_USAGE, MAX_DAILY_QUOTA.toString());
  } catch (e) {}
  return getAIQuotaInfo();
};

export interface ChatRequestPayload {
  message: string;
  context?: string;
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
}

export interface ChatResponsePayload {
  success: boolean;
  replyText: string;
  quotaInfo: AIQuotaInfo;
  isFallback?: boolean;
}

/**
 * Panggil AI Chatbot via Proxy Endpoint
 */
export async function sendAIChatMessage(payload: ChatRequestPayload): Promise<ChatResponsePayload> {
  const quota = getAIQuotaInfo();

  if (quota.status === 'quota_exceeded') {
    return {
      success: false,
      replyText: '🙏 *KUOTA GRATIS AI HARI INI TELAH TERPAKAI FULL*\n\nFitur AI Assistant telah ditutup otomatis untuk menjaga operasional Rp 0. Anda tetap dapat berkonsultasi langsung dengan Owner RIZA APPAREL via WhatsApp!',
      quotaInfo: quota,
      isFallback: true,
    };
  }

  try {
    // Coba panggil proxy backend jika dikonfigurasi, jika tidak gunakan local Proxy helper
    const proxyEndpoint = import.meta.env.VITE_AI_PROXY_URL || '/api/chat';

    const response = await fetch(proxyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 429) {
      // Circuit breaker terpicu oleh rate limit penyedia API
      const updatedQuota = setAIQuotaExceeded();
      return {
        success: false,
        replyText: '🙏 *BATAS KECEPATAN API TERCAPAI (HTTP 429)*\n\nFitur AI ditutup sementara. Silakan berkonsultasi langsung via WhatsApp dengan Owner Riza Apparel!',
        quotaInfo: updatedQuota,
        isFallback: true,
      };
    }

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();
    const updatedQuota = incrementAIUsage();

    return {
      success: true,
      replyText: data.replyText || data.text || 'Terima kasih! Ada yang bisa saya bantu lagi?',
      quotaInfo: updatedQuota,
    };
  } catch (error) {
    // Fallback transparan jika proxy offline / dev mode lokal
    incrementAIUsage();
    return {
      success: false,
      replyText: '', // Klien akan menggunakan knowledge base fallback lokal
      quotaInfo: getAIQuotaInfo(),
      isFallback: true,
    };
  }
}
