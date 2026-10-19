'use client';

import { Phone, MessageCircle } from 'lucide-react';

interface StickyMobileBarProps {
  phone: string;
  whatsapp: string;
  whatsappMessage?: string;
}

export function StickyMobileBar({ phone, whatsapp, whatsappMessage }: StickyMobileBarProps) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const cleanWa = whatsapp.replace(/[^0-9]/g, '');
  const waNumber = cleanWa.startsWith('91') ? cleanWa : `91${cleanWa}`;
  const textMsg = encodeURIComponent(whatsappMessage || 'Hi, I saw your website on esitesz and would like more details.');
  const waUrl = `https://wa.me/${waNumber}?text=${textMsg}`;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur border-t border-slate-200 z-50 p-2 md:hidden shadow-lg">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>

        <a
          href={`tel:${phone}`}
          className="h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>
      </div>
      <p className="text-center text-[9px] text-slate-500 mt-1 font-medium">
        Instant WhatsApp &amp; Direct Phone Support • Developed by esitesz
      </p>
    </div>
  );
}
