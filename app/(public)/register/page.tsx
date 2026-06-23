'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import SignUpForm from '../../components/SignUpForm';
import { Clock } from 'lucide-react';
import { Lang, translations } from '../../../lib/translations';

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
  const [lang, setLang] = useState<Lang>('en');
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
            {lang === 'en' ? 'Choose Your Tier' : '選擇您的等級'}
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            {lang === 'en' 
              ? (<>Membership fees convert to platform credits. Every transaction deducts the 15% fee from your balance.<br/><span className="text-amber-400 font-semibold">Your membership pays for itself.</span></>)
              : (<>會員費轉換為平台積分。每筆交易從餘額中扣除 15% 平台費。<br/><span className="text-amber-400 font-semibold">您的會員資格會自己付費。</span></>)
            }
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Bronze */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all hover:scale-105">
              <div className="text-3xl mb-2">🥉</div>
              <h3 className="text-xl font-bold text-white">
                {lang === 'en' ? 'Bronze' : '銅級'}
              </h3>
              <div className="text-3xl font-bold text-amber-400 my-4">HK$1,000</div>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>• 50 {lang === 'en' ? 'Database Slots' : '數據庫名額'}</li>
                <li>• {lang === 'en' ? 'Standard App Access' : '標準應用程式訪問'}</li>
                <li>• {lang === 'en' ? 'Elite Group Hikes' : '精英行山活動'}</li>
                <li>• {lang === 'en' ? "Dragon's Back Events" : '龍脊活動'}</li>
              </ul>
            </div>

            {/* Silver */}
            <div className="bg-zinc-900/50 border border-amber-500/50 rounded-2xl p-6 hover:border-amber-500 transition-all hover:scale-105 relative">
              <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                {lang === 'en' ? 'POPULAR' : '熱門'}
              </div>
              <div className="text-3xl mb-2">🥈</div>
              <h3 className="text-xl font-bold text-white">
                {lang === 'en' ? 'Silver' : '銀級'}
              </h3>
              <div className="text-3xl font-bold text-amber-400 my-4">HK$10,000</div>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>• 250 {lang === 'en' ? 'Database Slots' : '數據庫名額'}</li>
                <li>• 2 {lang === 'en' ? 'Family Overrides' : '家庭優先權'}</li>
                <li>• {lang === 'en' ? 'Executive Lounges' : '行政貴賓室'}</li>
                <li>• {lang === 'en' ? 'Private Whiskey Bars' : '私人威士忌酒吧'}</li>
              </ul>
            </div>

            {/* Gold */}
            <div className="bg-gradient-to-b from-amber-500/10 to-zinc-900/50 border border-amber-500/30 rounded-2xl p-6 hover:border-amber-500 transition-all hover:scale-105">
              <div className="text-3xl mb-2">🥇</div>
              <h3 className="text-xl font-bold text-white">
                {lang === 'en' ? 'Gold' : '金級'}
              </h3>
              <div className="text-3xl font-bold text-amber-400 my-4">HK$100K</div>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>• 1,000 {lang === 'en' ? 'Database Slots' : '數據庫名額'}</li>
                <li>• 5 {lang === 'en' ? 'Family Overrides' : '家庭優先權'}</li>
                <li>• ⚡ {lang === 'en' ? '1-Hour Early Deal Signal' : '1 小時早期交易信號'}</li>
                <li>• {lang === 'en' ? 'Michelin 5-Course Dinners' : '米其林五道菜晚餐'}</li>
                <li>• {lang === 'en' ? 'Hidden Wine Vaults' : '隱藏酒窖'}</li>
              </ul>
            </div>

            {/* Platinum */}
            <div className="bg-gradient-to-b from-emerald-900/20 to-zinc-900/50 border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-500 transition-all hover:scale-105">
              <div className="text-3xl mb-2">💎</div>
              <h3 className="text-xl font-bold text-white">
                {lang === 'en' ? 'Platinum' : '白金級'}
              </h3>
              <div className="text-3xl font-bold text-emerald-400 my-4">HK$1M</div>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>• {lang === 'en' ? 'Unlimited Database Slots' : '無限數據庫名額'}</li>
                <li>• {lang === 'en' ? '$1M Asset Audit Required' : '需 100 萬美元資產審核'}</li>
                <li>• {lang === 'en' ? 'Shadow Directory Access' : '影子目錄訪問權'}</li>
                <li>• {lang === 'en' ? 'Superyacht Cruises' : '超級遊艇巡航'}</li>
                <li>• {lang === 'en' ? 'Mansion Retreats' : '豪宅靜修'}</li>
              </ul>
            </div>

            {/* Diamond */}
            <div className="bg-gradient-to-b from-purple-900/20 to-zinc-900/50 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500 transition-all hover:scale-105">
              <div className="text-3xl mb-2">👑</div>
              <h3 className="text-xl font-bold text-white">
                {lang === 'en' ? 'Diamond' : '鑽石級'}
              </h3>
              <div className="text-2xl font-bold text-purple-400 my-4">
                {lang === 'en' ? 'Invitation Only' : '僅限邀請'}
              </div>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>• {lang === 'en' ? 'Tech Wealth Council Vote' : '科技財富委員會投票'}</li>
                <li>• {lang === 'en' ? 'Veto Power' : '否決權'}</li>
                <li>• {lang === 'en' ? 'Whale Liquidity Pool' : '巨鯨資金池'}</li>
                <li>• {lang === 'en' ? 'Platform Dominance' : '平台主導權'}</li>
                <li>• {lang === 'en' ? 'AmEx Black Card Mythos' : '美國運通黑卡神話'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 shadow-2xl max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {applicationStatus === 'pending' 
                ? (lang === 'en' ? 'Application Status' : '申請狀態')
                : t.regTitle
              }
            </h2>
            <p className="text-zinc-500">
              {applicationStatus === 'pending'
                ? (lang === 'en' ? 'Your application is under review' : '您的申請正在審核中')
                : t.regSub
              }
            </p>
          </div>

          {applicationStatus === 'pending' ? (
            <div className="text-center p-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl animate-in zoom-in-95 duration-500">
              <Clock className="mx-auto text-amber-400 mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">
                {lang === 'en' ? 'Pending Approval' : '待審批'}
              </h3>
              <p className="text-zinc-400 mb-6">
                {lang === 'en' 
                  ? 'We will contact you within 48 hours to verify your information and process payment.'
                  : '我們將在 48 小時內與您聯絡以驗證資料並處理付款。'
                }
              </p>
              <div className="text-sm text-zinc-500">
                {lang === 'en' ? 'Check your email for updates.' : '請檢查您的電郵以獲取更新。'}
              </div>
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
          © 2024 TechWealth Collective. Privileged & Confidential.
        </p>
      </footer>
    </div>
  );
}
