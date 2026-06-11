import './index.css';
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import SignUpForm from './components/SignUpForm';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  Users, 
  Calendar, 
  Target, 
  CreditCard, 
  ShieldCheck, 
  Globe, 
  ChevronRight, 
  Clock, 
  Lock, 
  ExternalLink,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyDUDQti3a-SnstsakWSB6vTppsxDV_gh2Q",
  authDomain: "techwealth-website.firebaseapp.com",
  projectId: "techwealth-website",
  storageBucket: "techwealth-website.appspot.com",
  messagingSenderId: "36453865287",
  appId: "1:36453865287:web:22bef340b02a7b8e385e62",
  measurementId: "G-HLRMJ3E11E"
};

const resolvedFirebaseConfig = (() => {
  try {
    const fromWindow = globalThis?.__firebase_config;
    if (typeof fromWindow === 'string' && fromWindow.trim()) return JSON.parse(fromWindow);
  } catch (_) {
    // Fall back to bundled config.
  }
  return firebaseConfig;
})();

const appId = globalThis?.__app_id || 'tw-v5-stable';

const firebaseApp = initializeApp(resolvedFirebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// --- Translations ---
const translations = {
  en: {
    navHome: "Home",
    navEvents: "Events",
    navVision: "Vision",
    navJoin: "Join Us",
    navMembers: "VIP Access",
    heroTitle: "TechWealth Elite",
    heroSub: "The ultimate hub for high-net-worth business leaders. Leverage collective human capital for explosive client acquisition.",
    memberCount: "Global Members",
    ctaJoin: "Apply for Membership",
    standardEvents: "Standard Events",
    vipEvents: "VIP Masterminds",
    days: "d",
    hours: "h",
    mins: "m",
    secs: "s",
    attendees: "Attendees",
    visionTitle: "Our Mission & Strategy",
    visionStrategy: "The Roadmap to Affluence",
    regTitle: "Secure Gateway",
    regSub: "Elite status requires a singular commitment.",
    payMethod: "Select Payment Method",
    processPayment: "Complete Registration",
    membershipId: "Unique Membership ID",
    accessGranted: "Access Granted",
    redirectMsg: "Unauthorized access. Redirecting to payment...",
    telegramBtn: "Join Private Telegram",
    lockedContent: "This area is reserved for verified members only.",
    mission1: "Joint Ventures",
    mission1Desc: "Strategic partnerships between industry titans.",
    mission2: "High-Ticket Pipeline",
    mission2Desc: "Exclusive access to $1M+ lead generation networks.",
    mission3: "HR Leveraging",
    mission3Desc: "Optimizing human capital for maximum efficiency."
  },
  zh: {
    navHome: "首頁",
    navEvents: "活動",
    navVision: "願景",
    navJoin: "加入我們",
    navMembers: "貴賓登錄",
    heroTitle: "TechWealth 財富精英會",
    heroSub: "高淨值商業領袖的終極樞紐。利用集體人力資源實現爆炸式的客戶獲取。",
    memberCount: "全球會員人數",
    ctaJoin: "申請加入",
    standardEvents: "標準活動",
    vipEvents: "VIP 策劃會",
    days: "天",
    hours: "時",
    mins: "分",
    secs: "秒",
    attendees: "參與人數",
    visionTitle: "我們的使命與戰略",
    visionStrategy: "富足之路",
    regTitle: "安全網關",
    regSub: "精英地位需要專一的承諾。",
    payMethod: "選擇支付方式",
    processPayment: "完成註冊",
    membershipId: "唯一會員 ID",
    accessGranted: "授權訪問",
    redirectMsg: "未經授權。正在跳轉至支付頁面...",
    telegramBtn: "加入私密 Telegram 群組",
    lockedContent: "此區域僅限已驗證會員進入。",
    mission1: "合資經營",
    mission1Desc: "行業巨頭之間的戰略合作夥伴關係。",
    mission2: "高價成交渠道",
    mission2Desc: "獨家獲取 100 萬美元以上的潛在客戶網絡。",
    mission3: "人力資源優化",
    mission3Desc: "優化人力資本以實現最大效率。",
    tierBronze: "銅級會員",
    tierSilver: "銀級會員",
    tierGold: "金級會員",
    tierPlatinum: "白金級會員",
    tierDiamond: "鑽石級會員",
    tierPopular: "熱門",
    tierChoose: "選擇您的等級",
    tierCredit: "會員費轉換為平台積分。每筆交易從餘額中扣除 15% 平台費。",
    tierPaysForItself: "您的會員資格會自己付費。",
    slots: "數據庫名額",
    familyOverrides: "家庭優先覆蓋",
    earlyDealSignal: "⚡ 1 小時早期交易信號",
    standardAccess: "標準應用程式訪問",
    eliteHikes: "精英行山活動",
    dragonsBack: "龍脊活動",
    executiveLounges: "行政貴賓室",
    whiskeyBars: "私人威士忌酒吧",
    michelin: "米其林五道菜晚餐",
    wineVaults: "隱藏酒窖",
    unlimitedSlots: "無限數據庫名額",
    assetAudit: "需 100 萬美元資產審核",
    shadowDirectory: "影子目錄訪問權",
    superyacht: "超級遊艇巡航",
    mansionRetreats: "豪宅靜修",
    councilVote: "科技財富委員會投票權",
    vetoPower: "否決權",
    whalePool: "巨鯨資金池",
    platformDominance: "平台主導權",
    invitationOnly: "僅限邀請",
    amexMythos: "美國運通黑卡神話"
  }
};

// --- Components ---

const Navbar = ({ activePage, setActivePage, lang, setLang, isMember }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[lang];

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'events', label: t.navEvents },
    { id: 'vision', label: t.navVision },
    { id: 'register', label: t.navJoin },
    { id: 'members', label: t.navMembers, protected: true },
  ];

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-emerald-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActivePage('home')}>
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent tracking-tighter">
              TechWealth
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`text-sm font-medium transition-colors ${
                  activePage === item.id ? 'text-amber-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-1 text-xs px-3 py-1 border border-emerald-800 rounded-full text-emerald-400 hover:bg-emerald-900/20 transition-all"
            >
              <Globe size={14} /> {lang === 'en' ? '繁中' : 'EN'}
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-emerald-900/30 p-4 space-y-4 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActivePage(item.id); setIsOpen(false); }}
              className="block w-full text-left px-4 py-2 text-gray-400 hover:text-amber-400"
            >
              {item.label}
            </button>
          ))}
          <button 
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="w-full text-left px-4 py-2 text-emerald-400"
          >
            {lang === 'en' ? 'Switch to Traditional Chinese' : '切換至英文'}
          </button>
        </div>
      )}
    </nav>
  );
};

const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const formatEventDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const month = d.toLocaleString("en-US", { month: "short" });
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
};

const getTimeLeft = (target) => {
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

const useCountdown = (countdownTarget) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(countdownTarget));

  useEffect(() => {
    setTimeLeft(getTimeLeft(countdownTarget));
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(countdownTarget));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdownTarget]);

  return timeLeft;
};

const EventCard = ({ title, date, attendees, countdownDate, isVip, lang, thumbnailUrl }) => {
  const t = translations[lang];
  const timeLeft = useCountdown(countdownDate);

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
};

const App = () => {
  const [lang, setLang] = useState('en');
  const [activePage, setActivePage] = useState('home');
  const [user, setUser] = useState(null);
  const [membershipId, setMembershipId] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null); // 'pending', 'approved', 'rejected'
  const [isProcessing, setIsProcessing] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [eventsError, setEventsError] = useState(null);
  const t = translations[lang];

  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
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
    
    // Check for approved membership
    const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'membership', 'status');
    const unsub = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMembershipId(data.memberId);
        if (data.status === 'active') {
          setApplicationStatus('approved');
        }
      }
    }, (err) => console.error(err));
    
    // Check for pending applications
    const checkApplication = async () => {
      try {
        const email = localStorage.getItem('techwealth_email');
        if (!email) return;
        
        // Query Firestore for application (note: this requires index or we use a different approach)
        // For now, we'll rely on the user knowing their status after submission
      } catch (err) {
        console.error('Error checking application:', err);
      }
    };
    
    checkApplication();
    
    return () => unsub();
  }, [user]);

  // Security Guard for Page 5
  useEffect(() => {
    if (activePage === 'members' && !membershipId) {
      const timer = setTimeout(() => {
        setActivePage('register');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [activePage, membershipId]);

  useEffect(() => {
    if (activePage !== "events") return;
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
        setEventsError(e?.message || "Failed to load events");
        setEventsData([]);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [activePage]);

  const handlePayment = async () => {
    if (!user) return;
    setIsProcessing(true);
    // Simulate payment delay
    await new Promise(r => setTimeout(r, 2000));
    
    const newId = `TW-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'membership', 'status');
    await setDoc(userDocRef, {
      memberId: newId,
      joinedAt: new Date().toISOString(),
      tier: 'Elite'
    });
    
    setIsProcessing(false);
    setMembershipId(newId);
    setActivePage('members');
  };

  const handleApplicationSubmit = async (formData, markSubmitted) => {
    if (!user) {
      // Sign in anonymously first
      await signInAnonymously(auth);
    }
    
    setIsProcessing(true);
    
    try {
      // Save email to localStorage for status checking
      localStorage.setItem('techwealth_email', formData.email);
      
      // Submit to API
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

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <div className="pt-32 pb-20 px-4">
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
                <button 
                  onClick={() => setActivePage('register')}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  {t.ctaJoin} <ChevronRight size={20} />
                </button>
                <button 
                   onClick={() => setActivePage('events')}
                   className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all"
                >
                  {t.navEvents}
                </button>
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
                  <div className="text-zinc-500 font-medium">{lang === 'en' ? 'Asset Value' : '資產價值'}</div>
                </div>
                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50">
                  <div className="text-4xl font-bold text-emerald-400 mb-2">
                    <Counter target={12} />
                  </div>
                  <div className="text-zinc-500 font-medium">{lang === 'en' ? 'Global Chapters' : '全球分會'}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'events':
        {
        const standardEvents = eventsData.filter((e) => e?.category === "Standard");
        const vipEvents = eventsData.filter((e) => e?.category === "VIP");

        return (
          <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
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
          </div>
        );
        }

      case 'vision':
        return (
          <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
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
                       {lang === 'en' 
                        ? ["Identification of High-Ticket Opportunities", "Vetting Participants for Alignment", "Capital Pooling & Asset Synergy", "Scaled Acquisition & Dividends"][i-1]
                        : ["識別高價成交機會", "審查參與者的匹配度", "資本池化與資產協同", "規模化獲取與利潤分紅"][i-1]
                       }
                     </p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        );

      case 'register':
        return (
          <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
            {/* Tier Pricing Section */}
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-center text-white mb-4">
                {lang === 'en' ? 'Choose Your Tier' : '選擇您的等級'}
              </h2>
              <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
                {lang === 'en' 
                  ? <>Membership fees convert to platform credits. Every transaction deducts the 15% fee from your balance.<br/><span className="text-amber-400 font-semibold">Your membership pays for itself.</span></>
                  : <>會員費轉換為平台積分。每筆交易從餘額中扣除 15% 平台費。<br/><span className="text-amber-400 font-semibold">您的會員資格會自己付費。</span></>
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
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all hover:scale-105">
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
                <div className="bg-gradient-to-b from-amber-500/10 to-zinc-900/50 border border-amber-500/30 rounded-2xl p-6 hover:border-amber-500 transition-all hover:scale-105 relative">
                  <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                    {lang === 'en' ? 'POPULAR' : '熱門'}
                  </div>
                  <div className="text-3xl mb-2">🥇</div>
                  <h3 className="text-xl font-bold text-white">
                    {lang === 'en' ? 'Gold' : '金級'}
                  </h3>
                  <div className="text-3xl font-bold text-amber-400 my-4">HK$100,000</div>
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
                  <div className="text-3xl font-bold text-emerald-400 my-4">HK$1,000,000</div>
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
          </div>
        );

      case 'members':
        if (!membershipId) {
          return (
            <div className="pt-32 pb-20 px-4 flex flex-col items-center justify-center min-h-[70vh]">
              <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-6 animate-bounce">
                <Lock size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{t.lockedContent}</h2>
              <p className="text-zinc-500 text-center animate-pulse">{t.redirectMsg}</p>
            </div>
          );
        }
        return (
          <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-center">
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        lang={lang} 
        setLang={setLang}
        isMember={!!membershipId}
      />
      
      <main className="animate-in fade-in duration-700">
        {renderContent()}
      </main>

      <footer className="border-t border-zinc-900 py-10 text-center">
        <p className="text-zinc-600 text-xs tracking-widest uppercase">
          © 2024 TechWealth Collective. Privileged & Confidential.
        </p>
      </footer>
    </div>
  );
};

export default App;

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}

