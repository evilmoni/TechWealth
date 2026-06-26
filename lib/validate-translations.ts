/**
 * Translation Validation Utility
 * Ensures all translations fit within reasonable length limits for UI components
 * Run this before deploying new languages
 */

import { translations, Lang } from './translations';

// Maximum character lengths for UI elements (mobile-first design)
const LENGTH_LIMITS = {
  footerCopyright: 60,      // Footer should fit on mobile without wrapping
  navItem: 20,               // Navigation items
  heroTitle: 40,             // Hero titles
  ctaButton: 30,             // Call-to-action buttons
  tierName: 20,              // Membership tier names
  default: 50                // Default limit for other fields
};

// Fields that need special attention for length
const CRITICAL_FIELDS = [
  'footerCopyright',
  'heroTitle',
  'ctaJoin',
  'tierBronze',
  'tierSilver',
  'tierGold',
  'tierPlatinum',
  'tierDiamond'
];

export interface ValidationResult {
  lang: Lang;
  field: string;
  value: string;
  length: number;
  limit: number;
  status: 'pass' | 'warning' | 'error';
  suggestion?: string;
}

export function validateTranslations(): ValidationResult[] {
  const results: ValidationResult[] = [];
  const en = translations.en; // Reference language

  (Object.keys(translations) as Lang[]).forEach((lang) => {
    const t = translations[lang];

    Object.entries(t).forEach(([field, value]) => {
      const fieldName = field as keyof typeof LENGTH_LIMITS;
      const limit = LENGTH_LIMITS[fieldName] || LENGTH_LIMITS.default;
      const length = value.length;

      let status: 'pass' | 'warning' | 'error' = 'pass';
      let suggestion: string | undefined;

      // Check if translation is significantly longer than English
      const enValue = en[field as keyof typeof en];
      const enLength = enValue?.length || 0;
      const ratio = enLength > 0 ? length / enLength : 1;

      if (length > limit) {
        status = 'error';
        suggestion = `Consider shortening to ${limit} chars or less`;
      } else if (ratio > 1.5 && CRITICAL_FIELDS.includes(field)) {
        status = 'warning';
        suggestion = `Translation is ${(ratio * 100).toFixed(0)}% longer than English - verify layout`;
      } else if (ratio > 2 && length > limit * 0.8) {
        status = 'warning';
        suggestion = `Approaching length limit (${length}/${limit})`;
      }

      results.push({
        lang,
        field,
        value,
        length,
        limit,
        status,
        suggestion
      });
    });
  });

  return results.filter(r => r.status !== 'pass');
}

export function printValidationReport(): void {
  const issues = validateTranslations();
  
  console.log('\n=== Translation Validation Report ===\n');
  
  if (issues.length === 0) {
    console.log('✅ All translations pass validation!\n');
    return;
  }

  const errors = issues.filter(i => i.status === 'error');
  const warnings = issues.filter(i => i.status === 'warning');

  if (errors.length > 0) {
    console.log('❌ ERRORS (must fix):');
    errors.forEach(issue => {
      console.log(`  [${issue.lang}] ${issue.field}: ${issue.length}/${issue.limit} chars`);
      console.log(`    Value: "${issue.value}"`);
      console.log(`    Suggestion: ${issue.suggestion}\n`);
    });
  }

  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (review recommended):');
    warnings.forEach(issue => {
      console.log(`  [${issue.lang}] ${issue.field}: ${issue.length}/${issue.limit} chars`);
      console.log(`    Value: "${issue.value}"`);
      console.log(`    Suggestion: ${issue.suggestion}\n`);
    });
  }

  console.log(`Total: ${errors.length} errors, ${warnings.length} warnings\n`);
}

// Auto-run when executed directly
if (typeof window === 'undefined' && process.argv[1]?.includes('validate-translations')) {
  printValidationReport();
}
