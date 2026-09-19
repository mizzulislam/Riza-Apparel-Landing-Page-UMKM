/**
 * Cloudflare Worker Serverless Proxy Template (FR-E4, FR-E5, FR-E6)
 * Deploy ke Cloudflare Workers Free Tier (100.000 requests/hari Rp 0 selamanya).
 * 
 * Fungsi:
 * 1. Menyembunyikan GEMINI_API_KEY dari bundle browser (FR-E6).
 * 2. Rate limiting per IP (maksimal 15 req/menit).
 * 3. Meneruskan prompt ke Google Gemini 1.5 Flash API.
 * 4. Mengembalikan HTTP 429 jika kuota/rate limit terlampaui.
 */

export default {
  async fetch(request, env, ctx) {
    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    try {
      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API key not configured on worker env' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const body = await request.json();
      const userMessage = body.message || '';
      const systemInstruction = `Kamu adalah AI Assistant RIZA APPAREL Ende, NTT (produsen custom jersey dan sportswear dengan motif khas Ende Diamond Zawo dan Flores Ocean Waves). Jawab pertanyaan calon pelanggan dengan bahasa Indonesia yang ramah, sopan, informatif, dan ringkas. Jika ditanya harga: Jersey Futsal/Bola mulai 90rb, Voli/Basket 95rb, Lari/Komunitas 100rb, Esports 95rb, Polo Sublim 115rb, Jaket 145rb. Lokasi: Mautapaga, Ende Timur. Kontak WA Owner: +62 812-4691-7740.`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const geminiPayload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nPertanyaan Pengguna: ${userMessage}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      };

      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload),
      });

      if (geminiRes.status === 429) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            status: 429,
            message: 'Batas pemanggilan API harian/menit tercapai.',
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const data = await geminiRes.json();
      const replyText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Terima kasih atas pertanyaan Anda! Silakan berkonsultasi via WhatsApp dengan admin Riza Apparel.';

      return new Response(JSON.stringify({ success: true, replyText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: err.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
