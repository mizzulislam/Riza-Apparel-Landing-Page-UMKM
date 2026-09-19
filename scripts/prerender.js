import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Prerendering script for Riza Apparel (FR-A1)
 * Injecting pre-rendered static HTML content into dist/index.html
 * so crawlers (Googlebot, WhatsApp preview) receive full HTML text without executing JS.
 */
async function prerender() {
  const distPath = path.resolve(__dirname, '../dist/index.html');
  
  if (!fs.existsSync(distPath)) {
    console.warn('⚠️ dist/index.html tidak ditemukan. Jalankan vite build terlebih dahulu.');
    return;
  }

  let html = fs.readFileSync(distPath, 'utf8');

  // Pre-rendered HTML payload for search engines & crawler fallback
  const staticBodyMarkup = `
  <div id="prerendered-content" style="display:none;" aria-hidden="true">
    <header>
      <h1>RIZA APPAREL Ende — Custom Jersey & Sportswear Sublimasi NTT</h1>
      <p>Spesialis konveksi dan custom jersey sportswear modern beridentitas budaya Ende Diamond Zawo dan Flores Ocean Waves.</p>
    </header>

    <main>
      <section id="hero">
        <h2>Mewujudkan Identitas Melalui Pakaian Berkualitas</h2>
        <p>Spesialis custom jersey & sportswear sublimasi presisi bermotif autentik Ende Diamond Zawo.</p>
        <p>Promo Beli 2 Bonus 1 Pcs • Gratis Ongkir Area Ende & NTT • 100% Bebas Biaya Desain</p>
      </section>

      <section id="katalog">
        <h2>Katalog Produk Custom Jersey Riza Apparel Ende</h2>
        <ul>
          <li>
            <h3>Jersey Pro Sepak Bola & Futsal — Mulai Rp 90.000</h3>
            <p>Bahan Dry-Fit Milano 160gsm, motif tenun sublimasi full print 1440 DPI anti-luntur, custom nama & nomor.</p>
          </li>
          <li>
            <h3>Jersey Tim Voli & Basket — Mulai Rp 95.000</h3>
            <p>Dry-Fit Serena Soft Flex, aksen Flores Ocean Waves gradasi dinamis, adem dan elastisitas tinggi.</p>
          </li>
          <li>
            <h3>Jersey Komunitas Lari & Sepeda — Mulai Rp 100.000</h3>
            <p>Dry-Fit Waffle Anti-UV UPF 30+, reflective strip lari malam, gradasi Danau Kelimutu.</p>
          </li>
          <li>
            <h3>Jersey Esports Gaming — Mulai Rp 95.000</h3>
            <p>V-Neck pro atletik, nickname & logo sponsor, sublimasi High Definition.</p>
          </li>
          <li>
            <h3>Polo Shirt Sublimasi Tenun — Mulai Rp 115.000</h3>
            <p>Kerah rajut polo premium, motif tenun Zawo di kerah & lengan, seragam panitia & kantor.</p>
          </li>
          <li>
            <h3>Jaket Windbreaker Sport — Mulai Rp 145.000</h3>
            <p>Taslan Milky windproof, full sublimasi motif tenun di hoodie & lengan.</p>
          </li>
        </ul>
      </section>

      <section id="tentang-kami">
        <h2>Tentang Riza Apparel Ende</h2>
        <p>Riza Apparel adalah UMKM produsen custom jersey dan sportswear di Ende, NTT. Kami mengombinasikan keahlian sublimasi digital presisi dengan kekayaan motif tradisional Ende Diamond Zawo dan Flores Ocean Waves.</p>
      </section>

      <section id="faq">
        <h2>Pertanyaan Umum (FAQ)</h2>
        <dl>
          <dt>Berapa minimal order di Riza Apparel?</dt>
          <dd>Tidak ada minimal order! Anda bisa memesan Satuan (1 Pcs) maupun per tim.</dd>
          <dt>Berapa lama estimasi pengerjaan?</dt>
          <dd>Estimasi pengerjaan presisi 3 hingga 5 hari kerja.</dd>
        </dl>
      </section>
    </main>

    <footer>
      <p>Alamat: JL. Gatot Subroto Gg. Sabar RT.022/RW.011, Mautapaga, Ende Timur, Kab. Ende, NTT 86317</p>
      <p>WhatsApp Owner: +62 812-4691-7740</p>
    </footer>
  </div>
  `;

  // Insert pre-rendered markup into <div id="root"></div>
  if (html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', `<div id="root">${staticBodyMarkup}</div>`);
    fs.writeFileSync(distPath, html, 'utf8');
    console.log('✅ Success: Pre-rendered static HTML content injected into dist/index.html');
  }
}

prerender();
