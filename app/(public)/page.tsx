'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Counter from '../components/Counter';
import { ShieldCheck, Calendar, ChevronRight } from 'lucide-react';
import { Lang, translations, getInitialLang } from '../../lib/translations';
import Link from 'next/link';

export default function HomePage() {
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      <Navbar lang={lang} setLang={setLang} isMember={false} />
      
      <main className="pt-32 pb-20 px-4 animate-in fade-in duration-700">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium animate-pulse">
            <ShieldCheck size={16} /> Elite Networking Group
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {t.heroSub}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link 
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2"
            >
              {t.ctaJoin} <ChevronRight size={20} />
            </Link>
            <Link 
              href="/events"
              className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all"
            >
              {t.navEvents}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="text-4xl font-bold text-emerald-400 mb-2">
                <Counter target={1250} />+
              </div>
              <div className="text-zinc-500 font-medium">{t.memberCount}</div>
            </div>
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="text-4xl font-bold text-emerald-400 mb-2">
                $<Counter target={450} />M+
              </div>
              <div className="text-zinc-500 font-medium">{t.assetValue}</div>
            </div>
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="text-4xl font-bold text-emerald-400 mb-2">
                <Counter target={12} />
              </div>
              <div className="text-zinc-500 font-medium">{t.globalChapters}</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-900 py-10 text-center">
        <p className="text-zinc-600 text-xs tracking-widest uppercase">
          {t.footerCopyright}
        </p>
      </footer>
    </div>
  );
}
