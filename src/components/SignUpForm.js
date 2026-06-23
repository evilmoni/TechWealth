import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const SignUpForm = ({ lang, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    tier: 'bronze',
    telegramHandle: '',
    linkedinUrl: '',
    paymentMethod: 'bank_transfer',
    paymentAmount: 0
  });

  const [submitted, setSubmitted] = useState(false);

  const tierPrices = {
    bronze: 1000,
    silver: 10000,
    gold: 100000,
    platinum: 1000000
  };

  const tierDisplayPrices = {
    bronze: 'HK$1,000',
    silver: 'HK$10,000',
    gold: 'HK$100K',
    platinum: 'HK$1M'
  };

  const tierLabels = {
    bronze: lang === 'en' ? '🥉 Bronze' : '銅級',
    silver: lang === 'en' ? '🥈 Silver' : '銀級',
    gold: lang === 'en' ? '🥇 Gold' : '金級',
    platinum: lang === 'en' ? '💎 Platinum' : '白金級'
  };

  const handleTierChange = (tier) => {
    setFormData(prev => ({
      ...prev,
      tier,
      paymentAmount: tierPrices[tier] || 0
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, () => setSubmitted(true));
  };

  const t = {
    en: {
      title: 'Apply for Membership',
      subtitle: 'Join the elite network of business leaders',
      personalInfo: 'Personal Information',
      businessInfo: 'Business Information',
      tierSelection: 'Select Membership Tier',
      contactInfo: 'Contact Information',
      paymentInfo: 'Payment Information',
      submitApplication: 'Submit Application',
      processing: 'Processing...',
      submittedTitle: 'Application Submitted!',
      submittedText: 'Your application is under review. Our team will contact you within 48 hours.',
      nextSteps: 'Next Steps:',
      step1: '1. We will review your application',
      step2: '2. Contact you for verification',
      step3: '3. Process payment upon approval',
      step4: '4. Grant full member access',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Business Email',
      phone: 'Phone / WhatsApp',
      company: 'Company Name',
      title: 'Job Title',
      telegram: 'Telegram Handle (optional)',
      linkedin: 'LinkedIn Profile (optional)',
      paymentMethod: 'Payment Method',
      bankTransfer: '🏦 Bank Transfer / FPS',
      stripe: '💳 Stripe',
      paypal: '🅿️ PayPal',
      crypto: '💰 Crypto',
      manual: '📝 Manual / Offline',
      amountDue: 'Amount Due (HKD)',
      note: 'Note: Payment will be requested after approval',
      required: 'Required'
    },
    zh: {
      title: '申請加入',
      subtitle: '加入商業領袖精英網絡',
      personalInfo: '個人資料',
      businessInfo: '商業資料',
      tierSelection: '選擇會員等級',
      contactInfo: '聯絡資料',
      paymentInfo: '付款資料',
      submitApplication: '提交申請',
      processing: '處理中...',
      submittedTitle: '申請已提交！',
      submittedText: '您的申請正在審核中。我們的團隊將在 48 小時內與您聯絡。',
      nextSteps: '下一步：',
      step1: '1. 我們將審核您的申請',
      step2: '2. 聯絡您進行驗證',
      step3: '3. 批准後處理付款',
      step4: '4. 授予完整會員權限',
      firstName: '名字',
      lastName: '姓氏',
      email: '商業電郵',
      phone: '電話 / WhatsApp',
      company: '公司名稱',
      title: '職位',
      telegram: 'Telegram 帳號（選填）',
      linkedin: 'LinkedIn 主頁（選填）',
      paymentMethod: '付款方式',
      bankTransfer: '🏦 銀行轉帳 / FPS',
      stripe: '💳 Stripe',
      paypal: '🅿️ PayPal',
      crypto: '💰 加密貨幣',
      manual: '📝 人手 / 離線',
      amountDue: '應付金額（港幣）',
      note: '注意：批准後才會要求付款',
      required: '必填'
    }
  };

  const labels = t[lang];

  if (submitted) {
    return (
      <div className="text-center p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-in zoom-in-95 duration-500">
        <CheckCircle2 className="mx-auto text-emerald-400 mb-4" size={48} />
        <h3 className="text-xl font-bold text-white mb-2">{labels.submittedTitle}</h3>
        <p className="text-zinc-400 mb-6">{labels.submittedText}</p>
        
        <div className="text-left bg-black/40 p-6 rounded-xl border border-emerald-500/10">
          <p className="text-sm font-bold text-emerald-400 mb-3">{labels.nextSteps}</p>
          <div className="space-y-2 text-sm text-zinc-300">
            <div>{labels.step1}</div>
            <div>{labels.step2}</div>
            <div>{labels.step3}</div>
            <div>{labels.step4}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tier Selection */}
      <div>
        <label className="block text-sm font-bold text-white mb-3">{labels.tierSelection}</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(tierLabels).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTierChange(key)}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                formData.tier === key
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="text-xs mb-1">{label}</div>
              <div className="text-xs font-bold">
                {tierDisplayPrices[key]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Personal Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">{labels.firstName} *</label>
          <input
            type="text"
            required
            value={formData.name.split(' ')[0] || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              name: `${e.target.value} ${prev.name.split(' ').slice(1).join(' ')}`
            }))}
            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">{labels.lastName} *</label>
          <input
            type="text"
            required
            value={formData.name.split(' ').slice(1).join(' ') || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              name: `${prev.name.split(' ')[0]} ${e.target.value}`
            }))}
            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs text-zinc-500 mb-1">{labels.email} *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs text-zinc-500 mb-1">{labels.phone} *</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
          placeholder="+852 XXXX XXXX"
        />
      </div>

      {/* Business Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">{labels.company}</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">{labels.title}</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">{labels.telegram}</label>
          <input
            type="text"
            value={formData.telegramHandle}
            onChange={(e) => setFormData(prev => ({ ...prev, telegramHandle: e.target.value }))}
            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
            placeholder="@username"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">{labels.linkedin}</label>
          <input
            type="url"
            value={formData.linkedinUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-xs text-zinc-500 mb-3">{labels.paymentMethod}</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { value: 'bank_transfer', label: labels.bankTransfer },
            { value: 'stripe', label: labels.stripe },
            { value: 'paypal', label: labels.paypal },
            { value: 'crypto', label: labels.crypto },
            { value: 'manual', label: labels.manual }
          ].map((method) => (
            <button
              key={method.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.value }))}
              className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                formData.paymentMethod === method.value
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>
      </div>

      {/* Amount Display */}
      {formData.paymentAmount > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">{labels.amountDue}</span>
            <span className="text-xl font-bold text-amber-400">
              {tierDisplayPrices[formData.tier] || `HK$${formData.paymentAmount.toLocaleString()}`}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">{labels.note}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {isSubmitting ? <Clock className="animate-spin" size={20} /> : <CreditCard size={20} />}
        {isSubmitting ? labels.processing : labels.submitApplication}
      </button>

      <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest">
        Your information is secure and confidential
      </p>
    </form>
  );
};

export default SignUpForm;
