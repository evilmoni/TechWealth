'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Target, CreditCard, Users } from 'lucide-react';
import { Lang, translations } from '../../../lib/translations';

export default function VisionPage() {
  const [lang, setLang] = useState<Lang>('en');
  const t = translations[lang];

  const roadmapSteps = lang === 'en' 
    ? ["Identification of High-Ticket Opportunities", "Vetting Participants for Alignment", "Capital Pooling & Asset Synergy", "Scaled Acquisition & Dividends"]
    : ["識別高價成交機會", "審查參與者的匹配度", "資本池化與資產協同", "規模化獲取與利潤分紅"];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      <Navbar lang={lang} setLang={setLang} isMember={false} />
      
      <main className="pt-32 pb-20 px-4 max-w-6xl mx-auto animate-in fade-in duration-700">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{t.visionTitle}</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-zinc-900 p-10 rounded-[2rem] border border-zinc-800 shadow-2xl relative group">
            <div className="w-16 h-16 bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Target size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.mission1}</h3>
            <p className="text-zinc-400 leading-relaxed">{t.mission1Desc}</p>
          </div>
          <div className="bg-zinc-900 p-10 rounded-[2rem] border border-zinc-800 shadow-2xl relative group">
            <div className="w-16 h-16 bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <CreditCard size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.mission2}</h3>
            <p className="text-zinc-400 leading-relaxed">{t.mission2Desc}</p>
          </div>
          <div className="bg-zinc-900 p-10 rounded-[2rem] border border-zinc-800 shadow-2xl relative group">
            <div className="w-16 h-16 bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.mission3}</h3>
            <p className="text-zinc-400 leading-relaxed">{t.mission3Desc}</p>
          </div>
        </div>

        <div className="mt-20 p-12 bg-gradient-to-r from-emerald-950/40 to-black rounded-[3rem] border border-emerald-500/10">
           <h4 className="text-2xl font-bold text-amber-400 mb-6 uppercase tracking-widest">{t.visionStrategy}</h4>
           <div className="space-y-6">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="flex gap-4 items-start">
                 <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
                   {i}
                 </div>
                 <p className="text-zinc-300 text-lg">
                   {roadmapSteps[i-1]}
                 </p>
               </div>
             ))}
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
