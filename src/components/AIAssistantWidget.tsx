import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  PhoneCall,
  User
} from 'lucide-react';
import { ChatMessage } from '../types';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'assistant',
    text: 'Halo! Saya AI Assistant RIZA APPAREL Ende 👋\nAda yang bisa saya bantu terkait custom jersey, promo Beli 2 Bonus 1, atau konsultasi desain?',
    timestamp: 'Baru saja',
    options: [
      { label: '💰 Berapa Harga Jersey?', action: 'faq_price' },
      { label: '🔥 Promo Beli 2 Bonus 1', action: 'faq_promo' },
      { label: '🎨 Konsultasi Desain Custom', action: 'consult_start' },
      { label: '📍 Alamat & Kontak Ende', action: 'faq_address' },
    ],
  },
];

// Helper to render bold markdown (*text*) into clean JSX without raw asterisks
const renderFormattedText = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*.*?\*)/g);
    return (
      <React.Fragment key={lineIdx}>
        {parts.map((part, partIdx) => {
          if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
            const content = part.slice(1, -1);
            return (
              <strong key={partIdx} className="font-extrabold">
                {content}
              </strong>
            );
          }
          return part;
        })}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};

interface AIAssistantWidgetProps {
  isDark?: boolean;
}

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({ isDark = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Handle Knowledge Base Query Logic
  const processQuery = (userQuery: string) => {
    const query = userQuery.toLowerCase();
    let replyText = '';
    let options: { label: string; action: string }[] | undefined = undefined;
    let isEscalation = false;

    if (query.includes('harga') || query.includes('price') || query.includes('biaya') || query.includes('faq_price')) {
      replyText = `🏷️ *DAFTAR HARGA RIZA APPAREL ENDE:*\n• *Jersey Sepakbola & Futsal*: Mulai Rp 90.000 / Pcs\n• *Jersey Voli & Basket*: Mulai Rp 95.000 / Pcs\n• *Jersey Komunitas & Trail Run*: Mulai Rp 100.000 / Pcs\n• *Jersey Esports Gaming*: Mulai Rp 95.000 / Pcs\n• *Polo Shirt Sublim Kasual*: Mulai Rp 115.000 / Pcs\n• *Jaket Windbreaker Sublim*: Mulai Rp 145.000 / Pcs\n\n💡 *Catatan*: Semua pemesanan jersey dapat dipesan *Satuan (1 Pcs)* maupun per tim!`;
      options = [
        { label: '🎨 Coba Studio Desain 2D', action: 'open_studio' },
        { label: '💬 Chat Owner via WA', action: 'escalate_wa' },
      ];
    } else if (query.includes('promo') || query.includes('bonus') || query.includes('ongkir') || query.includes('faq_promo')) {
      replyText = `🔥 *PAKET & PROMO AKTIF RIZA APPAREL:*\n1. *Beli 2 Bonus 1 Pcs*: Pemesanan kelipatan 2 pcs dapatkan 1 pcs bonus jersey gratis!\n2. *Gratis Ongkir Area Ende & NTT*: Bebas biaya pengiriman seluruh Ende & subsidi se-NTT!\n3. *100% Bebas Biaya Desain*: Kustomisasi pola tenun ikat bebas revisi sampai fix siap cetak!`;
      options = [
        { label: '⚽ Pesan Jersey Tim', action: 'consult_start' },
        { label: '💬 Tanya Detail Promo ke Owner', action: 'escalate_wa' },
      ];
    } else if (query.includes('visi') || query.includes('misi') || query.includes('tentang') || query.includes('sejarah')) {
      replyText = `🌟 *TENTANG & VISI MISI RIZA APPAREL:*\n\n• *Tagline*: "Mewujudkan Identitas Melalui Pakaian Berkualitas"\n• *Visi*: Menjadi merek custom apparel pilihan utama yang dikenal akan inovasi desain, estetika yang kuat, dan kualitas produk yang terpercaya di setiap karya.\n• *Misi*: Menghadirkan solusi pakaian kustom berstandar visual tinggi, menggabungkan kearifan budaya Ende Zawo dengan tren global, serta memberikan pelayanan yang mudah & transparan.`;
      options = [
        { label: '📍 Lihat Alamat & WA', action: 'faq_address' },
        { label: '🎨 Buka Studio Desain 2D', action: 'open_studio' },
      ];
    } else if (query.includes('alamat') || query.includes('lokasi') || query.includes('kontak') || query.includes('wa') || query.includes('faq_address')) {
      replyText = `📍 *LOKASI & KONTAK RESMI RIZA APPAREL:*\n• *Alamat*: JL. Gatot Subroto Gg. Sabar RT.022/RW.011, Mautapaga, Kec. Ende Timur, Kabupaten Ende, NTT 86317\n• *Titik Google Maps*: https://maps.app.goo.gl/9qd4THZzMF9231wv7 (-8.843675, 121.670762)\n• *WhatsApp Official*: +62 812-4691-7740\n• *Jam Operasional*: Senin - Sabtu (08:00 - 18:00 WITA)`;
      options = [
        { label: '🗺️ Buka Google Maps Presisi', action: 'open_maps' },
        { label: '📱 Buka WhatsApp Langsung', action: 'escalate_wa' },
      ];
    } else if (query.includes('bahan') || query.includes('kain') || query.includes('sublim')) {
      replyText = `👕 *SPESIFIKASI MATERIAL & TEKNOLOGI:*\n• *Kain*: Dry-Fit Milano 160gsm, Serena Soft Flex, dan Waffle Anti-UV yang adem & menyerap keringat.\n• *Sublimasi*: Cetak Digital High Resolution 1440 DPI (anti-luntur & tidak pecah).\n• *Jahitan*: Jahit Rantai Standar Garmen Liga Profesional.`;
      options = [
        { label: '🎨 Desain di Studio 2D', action: 'open_studio' },
        { label: '💬 Tanya Sampel Bahan', action: 'escalate_wa' },
      ];
    } else if (query.includes('consult_start') || query.includes('desain') || query.includes('custom')) {
      replyText = `🎨 *KONSULTASI DESAIN CUSTOM:*\nUntuk memulai konsultasi pre-qualifying:\n1. Pilih jenis jersey (Sepakbola/Futsal, Voli, Basket, Komunitas, Polo, Jaket).\n2. Berapa estimasi jumlah pcs yang dibutuhkan? (Bisa pesan Satuan 1 Pcs)\n3. Apakah sudah punya konsep/logo sendiri atau ingin dibuatkan motif Heritage Ende?`;
      options = [
        { label: '🎨 Gunakan Studio Desain 2D', action: 'open_studio' },
        { label: '💬 Hubungi Admin/Owner WA', action: 'escalate_wa' },
      ];
    } else if (query.includes('open_studio')) {
      replyText = `🚀 *Studio Desain 2D & 3D* telah siap! Anda dapat menggulir halaman ke seksi Studio Desain 2D di atas untuk merancang warna, motif Ende Diamond, dan nomor punggung secara instant!`;
    } else if (query.includes('escalate_wa')) {
      replyText = `📱 Mengalihkan Anda langsung ke WhatsApp resmi Owner RIZA APPAREL (+62 812-4691-7740)...`;
      isEscalation = true;
    } else {
      replyText = `Terima kasih! Pertanyaan Anda memerlukan konfirmasi spesifik dari Admin RIZA APPAREL Ende. Klik tombol di bawah ini untuk terhubung langsung via WhatsApp resmi kami:`;
      isEscalation = true;
      options = [
        { label: '💬 Obrolkan via WhatsApp', action: 'escalate_wa' },
      ];
    }

    return { replyText, options, isEscalation };
  };

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Simulate AI response latency (<400ms)
    setTimeout(() => {
      const { replyText, options, isEscalation } = processQuery(messageText);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options,
        isEscalation,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);

      if (isEscalation) {
        // Trigger auto escalation open after 1 second if explicitly requested
        setTimeout(() => {
          window.open(
            'https://wa.me/6281246917740?text=Halo%20Admin%20Riza%20Apparel,%20saya%20ingin%20bertanya%20mengenai%20custom%20jersey...',
            '_blank'
          );
        }, 1200);
      }
    }, 400);
  };

  const handleOptionClick = (option: { label: string; action: string }) => {
    if (option.action === 'open_studio') {
      const studioElem = document.getElementById('studio-2d');
      if (studioElem) {
        studioElem.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
      return;
    }
    if (option.action === 'open_maps') {
      window.open('https://maps.app.goo.gl/9qd4THZzMF9231wv7', '_blank', 'noopener,noreferrer');
      return;
    }
    handleSendMessage(option.label);
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON CONTAINER (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center group">
        {/* HOVER TOOLTIP DIALOG BOX (Triggers when cursor is over button) */}
        {!isOpen && (
          <div className={`mr-3 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-2xl shadow-xl border whitespace-nowrap ${
            isDark 
              ? 'bg-slate-900/95 text-white border-slate-700/80' 
              : 'bg-white/95 text-gray-900 border-gray-200'
          }`}>
            <Sparkles className="w-4 h-4 text-heritage-zawo" />
            <span>Tanya RIZA Assistant</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 active:scale-95 text-white p-4 rounded-full shadow-2xl hover:shadow-glow-brand transition-all duration-300 flex items-center justify-center border-2 border-white/20"
          aria-label="Buka AI Assistant Chat"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Bot className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* CHAT MODAL DRAWER (POSITIONED TO THE LEFT OF THE FLOATING BUTTON) */}
      {isOpen && (
        <div className={`fixed bottom-24 right-4 sm:bottom-6 sm:right-24 z-50 w-[90vw] sm:w-[380px] max-h-[600px] h-[80vh] backdrop-blur-2xl border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up transition-colors duration-300 ${
          isDark 
            ? 'bg-slate-900/95 border-slate-700/80 text-white' 
            : 'bg-white/95 border-gray-200 text-gray-900'
        }`}>
          
          {/* Drawer Header */}
          <div className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-heritage-zawo p-0.5 shadow-md flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  RIZA AI Assistant
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                    Online
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300">Knowledge Base Riza Apparel Ende</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream Container */}
          <div className={`flex-1 p-4 overflow-y-auto space-y-4 ${
            isDark ? 'bg-slate-950/50' : 'bg-slate-50/50'
          }`}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-brand-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-tr-none font-medium'
                      : isDark
                      ? 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-tl-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-xs'
                  }`}
                >
                  <p>{renderFormattedText(msg.text)}</p>
                  
                  {/* Action Suggestion Options */}
                  {msg.options && msg.options.length > 0 && (
                    <div className={`mt-3 pt-2.5 border-t flex flex-col gap-1.5 ${
                      isDark ? 'border-slate-700/60' : 'border-gray-100'
                    }`}>
                      {msg.options.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleOptionClick(opt)}
                          className={`w-full text-left font-semibold px-3 py-2 rounded-xl transition-all border flex items-center justify-between text-[11px] ${
                            isDark
                              ? 'bg-slate-900/80 hover:bg-slate-700 text-brand-300 border-slate-700/60'
                              : 'bg-slate-50 hover:bg-brand-50 text-brand-600 border-gray-200 hover:border-brand-200'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <Sparkles className="w-3 h-3 text-heritage-zawo" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Escalation WA Button */}
                  {msg.isEscalation && (
                    <a
                      href="https://wa.me/6281246917740?text=Halo%20Admin%20Riza%20Apparel,%20saya%20ingin%20berkonsultasi..."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-2 rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-md"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Hubungi WA Owner (+62 812-4691-7740)</span>
                    </a>
                  )}

                  <span className={`block text-[9px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-white/70' : isDark ? 'text-slate-400' : 'text-gray-400'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1 ${
                    isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className={`flex items-center gap-2 text-xs italic p-2 ${
                isDark ? 'text-slate-400' : 'text-gray-500'
              }`}>
                <Bot className="w-4 h-4 animate-spin text-brand-500" />
                <span>AI Assistant sedang mengetik...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className={`p-3 border-t flex items-center gap-2 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
          }`}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Tanyakan sesuatu (harga, bahan, promo)..."
              className={`flex-1 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500 transition-colors ${
                isDark 
                  ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className="p-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
