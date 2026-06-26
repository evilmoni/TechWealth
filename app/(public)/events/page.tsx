'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EventCard from '../../components/EventCard';
import { Calendar, ShieldCheck } from 'lucide-react';
import { Lang, translations, getInitialLang } from '../../../lib/translations';

interface Event {
  _id: string;
  title: string;
  eventDate: string;
  attendees: number;
  countdownTarget: string | number;
  category: 'Standard' | 'VIP';
  thumbnailUrl?: string;
}

const formatEventDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const month = d.toLocaleString("en-US", { month: "short" });
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
};

export default function EventsPage() {
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const [eventsData, setEventsData] = useState<Event[]>([]);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const t = translations[lang];

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setEventsError(null);
        const res = await fetch("/api/events", { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`Failed to load events (${res.status})`);
        const json = await res.json();
        if (cancelled) return;
        setEventsData(Array.isArray(json?.events) ? json.events : []);
      } catch (e) {
        if (cancelled) return;
        setEventsError(e instanceof Error ? e.message : "Failed to load events");
        setEventsData([]);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const standardEvents = eventsData.filter((e) => e?.category === "Standard");
  const vipEvents = eventsData.filter((e) => e?.category === "VIP");

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      <Navbar lang={lang} setLang={setLang} isMember={false} />
      
      <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto animate-in fade-in duration-700">
        <h2 className="text-3xl font-bold text-amber-400 mb-12 flex items-center gap-3">
          <Calendar /> {t.standardEvents}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {standardEvents.map((evt) => (
            <EventCard
              key={evt._id}
              title={evt.title}
              date={formatEventDate(evt.eventDate)}
              attendees={evt.attendees}
              countdownDate={evt.countdownTarget}
              lang={lang}
              thumbnailUrl={evt.thumbnailUrl}
            />
          ))}
        </div>

        <h2 className="text-3xl font-bold text-emerald-400 mb-12 flex items-center gap-3">
          <ShieldCheck /> {t.vipEvents}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {vipEvents.map((evt) => (
            <EventCard
              key={evt._id}
              isVip
              title={evt.title}
              date={formatEventDate(evt.eventDate)}
              attendees={evt.attendees}
              countdownDate={evt.countdownTarget}
              lang={lang}
              thumbnailUrl={evt.thumbnailUrl}
            />
          ))}
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
