'use client';

import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Lang, translations } from '../../lib/translations';

interface EventCardProps {
  title: string;
  date: string;
  attendees: number;
  countdownDate: string | number;
  isVip?: boolean;
  lang: Lang;
  thumbnailUrl?: string;
}

const getTimeLeft = (target: string | number) => {
  const end = new Date(target).getTime();
  const now = Date.now();
  const distance = end - now;
  if (!Number.isFinite(end) || distance <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(distance / (1000 * 60 * 60 * 24)),
    h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    s: Math.floor((distance % (1000 * 60)) / 1000),
  };
};

export default function EventCard({ title, date, attendees, countdownDate, isVip, lang, thumbnailUrl }: EventCardProps) {
  const t = translations[lang];
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(countdownDate));

  useEffect(() => {
    setTimeLeft(getTimeLeft(countdownDate));
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(countdownDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdownDate]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border transition-all hover:scale-[1.02] duration-300 ${
      isVip ? 'bg-gradient-to-br from-emerald-950 to-black border-amber-500/30' : 'bg-zinc-900 border-zinc-800'
    }`}>
      <div className="h-48 w-full bg-zinc-800 flex items-center justify-center overflow-hidden">
         <img 
          src={thumbnailUrl || `https://images.unsplash.com/photo-${isVip ? '1507679799987-c73779587ccf' : '1515187029135-18ee286d815b'}?auto=format&fit=crop&q=80&w=800`} 
          alt="Event" 
          className="w-full h-full object-cover opacity-60"
        />
        {isVip && <div className="absolute top-4 left-4 bg-amber-500 text-black font-bold text-xs px-2 py-1 rounded">VIP EXCLUSIVE</div>}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">{date}</span>
          <div className="flex items-center gap-1 text-zinc-500 text-xs">
            <Users size={14} /> {attendees} {t.attendees}
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-4 line-clamp-1">{title}</h3>
        <div className="grid grid-cols-4 gap-2 bg-black/40 p-3 rounded-xl border border-white/5">
          <div className="text-center">
            <div className="text-lg font-bold text-amber-400">{timeLeft.d}</div>
            <div className="text-[10px] text-zinc-500 uppercase">{t.days}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-amber-400">{timeLeft.h}</div>
            <div className="text-[10px] text-zinc-500 uppercase">{t.hours}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-amber-400">{timeLeft.m}</div>
            <div className="text-[10px] text-zinc-500 uppercase">{t.mins}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-amber-400">{timeLeft.s}</div>
            <div className="text-[10px] text-zinc-500 uppercase">{t.secs}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
