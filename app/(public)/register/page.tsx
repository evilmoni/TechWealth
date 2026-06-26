'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SignUpForm from '../../components/SignUpForm';
import { Clock } from 'lucide-react';
import { Lang, translations, getInitialLang } from '../../../lib/translations';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  tier: string;
  telegramHandle: string;
  linkedinUrl: string;
  paymentMethod: string;
  paymentAmount: number;
}

export default function RegisterPage() {
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const [applicationStatus, setApplicationStatus] = useState<'pending' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const t = translations[lang];

  const handleApplicationSubmit = async (formData: FormData, markSubmitted: () => void) => {
    setIsProcessing(true);
    
    try {
      localStorage.setItem('techwealth_email', formData.email);
      
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('Application submitted:', result.applicationId);
        markSubmitted();
        setApplicationStatus('pending');
      } else {
        console.error('Application failed:', result.error);
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      <Navbar lang={lang} setLang={setLang} isMember={false} />
      
      <main className="pt-32 pb-20 px-4 max-w-6xl mx-auto animate-in fade-in duration-700">
        {/* Tier Pricing Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            {t.chooseTier}
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            <>{t.tierCredit}<br/><span className="text-amber-400 font-semibold">{t.tierPaysForItself}</span></>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Bronze */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all hover:scale-105">
              <div className="text-3xl mb-2">🥉</div>
              <h3 className="text-xl font-bold text-white">{t.tierBronze}</h3>
              <div className="text-3xl font-bold text-amber-400 my-4">HK$1,000</div>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>• 50 {t.slots}</li>
                <li>• {t.standardAccess}</li>
                <li>• {t.eliteHikes}</li>
                <li>• {t.dragonsBack}</li>
              </ul>
            </div>

            {/* Silver */}
            <div className="bg-zinc-900/50 border border-amber-500/50 rounded-2xl p-6 hover:border-amber-500 transition-all hover:scale-105 relative">
              <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                {t.tierPopular}
              </div>
              <div className="text-3xl mb-2">🥈</div>
              <h3 className="text-xl font-bold text-white">{t.tierSilver}</h3>
              <div className="text-3xl font-bold text-amber-400 my-4">HK$10,000</div>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>• 250 {t.slots}</li>
                <li>• 2 {t.familyOverrides}</li>
                <li>• {t.executiveLounges}</li>
                <li>• {t.whiskeyBars}</li>
              </ul>
            </div>

            {/* Gold */}
            <div className="bg-gradient-to-b from-amber-500/10 to-zinc-900/50 border border-amber-500/30 rounded-2xl p-6 hover:border-amber-500 transition-all hover:scale-105">
              <div className="text-3xl mb-2">🥇</div>
              <h3 className="text-xl font-bold text-white">{t.tierGold}</h3>
              <div className="text-3xl font-bold text-amber-400 my-4">HK$100K</div>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>• 1,000 {t.slots}</li>
                <li>• 5 {t.familyOverrides}</li>
                <li>• ⚡ {t.earlyDealSignal}</li>
                <li>• {t.michelin}</li>
                <li>• {t.wineVaults}</li>
              </ul>
            </div>

            {/* Platinum */}
            <div className="bg-gradient-to-b from-emerald-900/20 to-zinc-900/50 border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-500 transition-all hover:scale-105">
              <div className="text-3xl mb-2">💎</div>
              <h3 className="text-xl font-bold text-white">{t.tierPlatinum}</h3>
              <div className="text-3xl font-bold text-emerald-400 my-4">HK$1M</div>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>• {t.unlimitedSlots}</li>
                <li>• {t.assetAudit}</li>
                <li>• {t.shadowDirectory}</li>
                <li>• {t.superyacht}</li>
                <li>• {t.mansionRetreats}</li>
              </ul>
            </div>

            {/* Diamond */}
            <div className="bg-gradient-to-b from-purple-900/20 to-zinc-900/50 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500 transition-all hover:scale-105">
              <div className="text-3xl mb-2">👑</div>
              <h3 className="text-xl font-bold text-white">{t.tierDiamond}</h3>
              <div className="text-2xl font-bold text-purple-400 my-4">{t.invitationOnly}</div>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>• {t.councilVote}</li>
                <li>• {t.vetoPower}</li>
                <li>• {t.whalePool}</li>
                <li>• {t.platformDominance}</li>
                <li>• {t.amexMythos}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 shadow-2xl max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {applicationStatus === 'pending' ? t.appStatus : t.regTitle}
            </h2>
            <p className="text-zinc-500">
              {applicationStatus === 'pending' ? t.appUnderReview : t.regSub}
            </p>
          </div>

          {applicationStatus === 'pending' ? (
            <div className="text-center p-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl animate-in zoom-in-95 duration-500">
              <Clock className="mx-auto text-amber-400 mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">{t.pendingApproval}</h3>
              <p className="text-zinc-400 mb-6">{t.pendingMsg}</p>
              <div className="text-sm text-zinc-500">{t.checkEmail}</div>
            </div>
          ) : (
            <SignUpForm 
              lang={lang} 
              onSubmit={handleApplicationSubmit}
              isSubmitting={isProcessing}
            />
          )}
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
