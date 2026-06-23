'use client';

import React, { useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { Lang, translations } from '../../lib/translations';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
  isMember: boolean;
}

export default function Navbar({ lang, setLang, isMember }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[lang];
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: t.navHome },
    { href: '/events', label: t.navEvents },
    { href: '/vision', label: t.navVision },
    { href: '/register', label: t.navJoin },
  ];

  const memberNavItems = [
    { href: '/login', label: 'Member Login', icon: '🔐' },
    { href: '/admin/dashboard', label: 'Admin Panel', icon: '⚙️' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-emerald-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <img src="/logo.png" alt="TechWealth Logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent tracking-tighter">
              TechWealth
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href) ? 'text-amber-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 pl-4 border-l border-emerald-900/30">
              {memberNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <span>{item.icon}</span>{item.label}
                </Link>
              ))}
            </div>
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
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-4 py-2 text-gray-400 hover:text-amber-400"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-emerald-900/30">
            {memberNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-4 py-2 text-emerald-400 hover:text-emerald-300"
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
          </div>
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
}
// Navbar updated Tue Jun 23 07:54:40 UTC 2026
