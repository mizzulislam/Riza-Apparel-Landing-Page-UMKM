/**
 * Google Analytics 4 (GA4) Funnel Tracking Instrumentation (FR-B6)
 * Mengirimkan event kustom pada titik-titik funnel utama:
 * - kunjungan_studio
 * - desain_dimulai
 * - desain_selesai
 * - lead_terkirim
 * - klik_whatsapp
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const trackGA4Event = (eventName: string, eventParams: Record<string, any> = {}) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...eventParams,
        app_name: 'Riza Apparel Web',
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log(`[GA4 Track Event]: ${eventName}`, eventParams);
    }
  } catch (e) {}
};

export const trackStudioVisit = () => trackGA4Event('kunjungan_studio');
export const trackDesignStart = (mode: string) => trackGA4Event('desain_dimulai', { mode });
export const trackDesignFinish = (summary: string) => trackGA4Event('desain_selesai', { summary });
export const trackLeadSubmitted = (leadId: string, quantity: number) => trackGA4Event('lead_terkirim', { leadId, quantity });
export const trackWhatsAppClick = (source: string) => trackGA4Event('klik_whatsapp', { source });
export const trackEvent = trackGA4Event;
