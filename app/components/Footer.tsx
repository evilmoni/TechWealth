import React from 'react';
import { Lang, translations } from '../../lib/translations';

interface FooterProps {
  lang: Lang;
}

export default function Footer({ lang }: FooterProps) {
  const t = translations[lang];

  return (
    <footer className="border-t border-zinc-900 py-8 md:py-10 text-center px-4">
      <p 
        className="text-zinc-600 text-[10px] sm:text-xs tracking-widest uppercase break-words leading-relaxed max-w-full"
        style={{ 
          wordBreak: 'break-word',
          hyphens: 'auto',
          maxWidth: '100%'
        }}
      >
        {t.footerCopyright}
      </p>
    </footer>
  );
}
