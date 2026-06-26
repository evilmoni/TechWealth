# Internationalization (i18n) Guide

**Purpose:** Add new languages to TechWealth without breaking layouts or requiring manual fixes.

---

## 🎯 Automatic Layout Protection

The TechWealth platform now includes **built-in responsive design** that automatically adapts to any language:

### ✅ What's Already Protected:

1. **Footer Component** (`app/components/Footer.tsx`)
   - Auto-wraps long text
   - Mobile-first responsive padding
   - Word-break and hyphenation enabled
   - Works for ANY language length

2. **Navbar Component** 
   - Logo shows "TechWealth" for non-Chinese languages
   - Language dropdown auto-populates from `langNames`
   - Responsive mobile menu

3. **CSS Classes**
   - `break-words` - breaks long words
   - `tracking-widest` - adds letter spacing
   - `leading-relaxed` - comfortable line height
   - `max-w-full` - prevents overflow

---

## 📝 Adding a New Language

### Step 1: Add Translations

Edit `lib/translations.ts`:

```typescript
export type Lang = 'en' | 'zh' | 'zh-cn' | 'de' | 'fr'; // Add your language code

export const translations = {
  // ... existing languages
  fr: {
    navHome: "Accueil",
    navEvents: "Événements",
    // ... all other keys
  }
};

export const langNames: Record<Lang, string> = {
  en: 'English',
  zh: '繁體中文',
  'zh-cn': '简体中文',
  de: 'Deutsch',
  fr: 'Français' // Add display name
};
```

### Step 2: Run Validation

Before deploying, check text lengths:

```bash
npm run validate:i18n
```

This will show:
- ✅ **Pass** - Translation fits within limits
- ⚠️ **Warning** - Translation is long but acceptable (review layout)
- ❌ **Error** - Translation too long, must shorten

### Step 3: Test on Mobile

1. Deploy to staging
2. Open on mobile device or Chrome DevTools mobile view
3. Check these critical areas:
   - Footer (should not overflow)
   - Navigation menu (all items visible)
   - CTA buttons (text fits)
   - Membership tier cards

### Step 4: Deploy

If validation passes and mobile tests look good:

```bash
git add -A
git commit -m "feat: Add [Language Name] support"
git push origin main
```

---

## 📏 Length Guidelines

| Element | Max Characters | Notes |
|---------|----------------|-------|
| Footer Copyright | 60 | Most critical - appears on every page |
| Navigation Items | 20 | Desktop + mobile menus |
| CTA Buttons | 30 | Must fit without wrapping |
| Hero Title | 40 | Main headline |
| Tier Names | 20 | Bronze, Silver, Gold, etc. |
| Descriptions | 150 | Can wrap, but keep concise |

### German Example:
```typescript
// ❌ TOO LONG (44 chars)
footerCopyright: "© 2024 TechWealth Collective. Vertraulich & Exklusiv."

// ✅ PERFECT (43 chars)
footerCopyright: "© 2024 TechWealth Collective. Alle Rechte vorbehalten."
```

---

## 🛠️ Troubleshooting

### Issue: Text Overflowing on Mobile

**Solution:** The CSS should handle this automatically, but if you see overflow:

1. Check the component uses responsive classes:
   ```tsx
   className="text-xs sm:text-sm md:text-base break-words"
   ```

2. Add word-break if needed:
   ```tsx
   style={{ wordBreak: 'break-word' }}
   ```

### Issue: Navigation Menu Breaking

**Solution:** Reduce translation length or abbreviate:

```typescript
// Instead of:
navMembers: "Mitgliedschaftsbereich"  // 22 chars

// Use:
navMembers: "VIP-Zugang"  // 11 chars
```

### Issue: Buttons Too Wide

**Solution:** Use shorter action verbs:

```typescript
// Instead of:
ctaJoin: "Jetzt Mitgliedschaft beantragen"  // 33 chars

// Use:
ctaJoin: "Mitglied werden"  // 17 chars
```

---

## 🔍 Validation Script

Run before every deployment with new languages:

```bash
npm run validate:i18n
```

**Output Example:**
```
=== Translation Validation Report ===

⚠️  WARNINGS (review recommended):
  [de] footerCopyright: 43/60 chars
    Value: "© 2024 TechWealth Collective. Alle Rechte vorbehalten."
    Suggestion: Approaching length limit (43/60)

Total: 0 errors, 1 warnings
```

---

## 📱 Mobile-First Design Principles

All translations are designed with mobile in mind:

1. **Shorter is Better** - Mobile screens have limited space
2. **No Horizontal Scroll** - Everything should wrap naturally
3. **Touch-Friendly** - Buttons need adequate size
4. **Readable Font Sizes** - Minimum 10px on mobile

---

## 🌐 Supported Languages (Current)

| Code | Language | Status |
|------|----------|--------|
| `en` | English | ✅ Active |
| `zh` | Traditional Chinese | ✅ Active |
| `zh-cn` | Simplified Chinese | ✅ Active |
| `de` | German | ✅ Active |

**Ready to Add:**
- `fr` - French
- `es` - Spanish
- `ja` - Japanese
- `ko` - Korean
- `ar` - Arabic (RTL support needed)

---

## 🎯 Checklist for New Languages

Before deploying a new language:

- [ ] All translation keys present
- [ ] Ran `npm run validate:i18n` - no errors
- [ ] Footer displays correctly on mobile
- [ ] Navigation menu items fit
- [ ] CTA buttons don't wrap awkwardly
- [ ] Membership tier cards look balanced
- [ ] Tested in Chrome DevTools mobile view
- [ ] Tested on actual mobile device
- [ ] Language appears in dropdown menu
- [ ] Logo shows correct text ("TechWealth" or Chinese)

---

**Last Updated:** 2026-06-26  
**Maintainer:** YBOT - Executive Personal Assistant  
**Next Review:** When adding 5th+ language
