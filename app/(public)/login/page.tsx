'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Lock, ShieldCheck, ExternalLink } from 'lucide-react';
import { Lang, translations, getInitialLang } from '../../../lib/translations';
import { auth, db } from '../../../lib/firebase';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const [user, setUser] = useState<User | null>(null);
  const [membershipId, setMembershipId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = translations[lang];
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== 'undefined' && !(auth.currentUser)) {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const userDocRef = doc(db, 'artifacts', (window as any).__app_id || 'default', 'users', user.uid, 'membership', 'status');
    const unsub = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMembershipId(data.memberId);
      }
      setIsLoading(false);
    }, (err) => {
      console.error(err);
      setIsLoading(false);
    });
    
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!isLoading && !membershipId) {
      const timer = setTimeout(() => {
        router.push('/register');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, membershipId, router]);

  if (!membershipId) {
    return (
      <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
        <Navbar lang={lang} setLang={setLang} isMember={false} />
        
        <main className="pt-32 pb-20 px-4 flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-700">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-6 animate-bounce">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{t.lockedContent}</h2>
          <p className="text-zinc-500 text-center animate-pulse">{t.redirectMsg}</p>
        </main>

        <footer className="border-t border-zinc-900 py-10 text-center">
          <p className="text-zinc-600 text-xs tracking-widest uppercase">
            {t.footerCopyright}
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      <Navbar lang={lang} setLang={setLang} isMember={true} />
      
      <main className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-center animate-in fade-in duration-700">
        <div className="bg-gradient-to-b from-emerald-950/20 to-black rounded-[3rem] p-12 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-emerald-900 opacity-20 rotate-12">
            <ShieldCheck size={160} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">Welcome, Elite Member</h2>
            <div className="inline-block px-4 py-1 bg-amber-500/20 text-amber-500 rounded-full text-sm font-mono mb-8">
               ID: {membershipId}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="bg-zinc-900/80 p-8 rounded-3xl border border-zinc-800 text-left">
                <h3 className="text-xl font-bold text-white mb-2">Member Portal</h3>
                <p className="text-zinc-500 text-sm mb-6">Manage your joint ventures and view exclusive leads.</p>
                <button className="w-full py-3 bg-zinc-800 text-zinc-300 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-700">
                  Dashboard <ExternalLink size={16} />
                </button>
              </div>
              
              <div className="bg-blue-600/10 p-8 rounded-3xl border border-blue-500/30 text-left">
                <h3 className="text-xl font-bold text-blue-400 mb-2">Telegram Group</h3>
                <p className="text-zinc-400 text-sm mb-6">Connect instantly with our $100M+ network of leaders.</p>
                <a 
                  href="https://t.me/techwealth_exclusive" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                >
                  {t.telegramBtn}
                </a>
              </div>
            </div>
            
            <div className="mt-12 pt-12 border-t border-zinc-800">
              <h4 className="text-zinc-500 uppercase tracking-[0.3em] text-xs font-bold mb-6">Active Chapters</h4>
              <div className="flex flex-wrap justify-center gap-4">
                {['Hong Kong', 'Singapore', 'London', 'Dubai', 'Zürich', 'New York'].map(city => (
                  <span key={city} className="px-4 py-1 bg-zinc-900 text-zinc-400 rounded-full text-xs border border-zinc-800">{city}</span>
                ))}
              </div>
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
