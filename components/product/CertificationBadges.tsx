'use client';

import { useLocale } from 'next-intl';
import { CERTIFICATION_NAMES } from '@/lib/medical-constants';

interface CertificationBadgesProps {
  certifications: string[];
}

const CERTIFICATION_ICONS: { [key: string]: string } = {
  organic: '🌱',
  fair_trade: '🤝',
  traditional: '🏺',
  wildcrafted: '🌿',
  sustainable: '♻️',
  gmp: '✓',
  halal: '☪️',
  kosher: '✡️',
};

const CERTIFICATION_COLORS: { [key: string]: string } = {
  organic: 'bg-green-100 text-green-800 border-green-300',
  fair_trade: 'bg-blue-100 text-blue-800 border-blue-300',
  traditional: 'bg-amber-100 text-amber-800 border-amber-300',
  wildcrafted: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  sustainable: 'bg-teal-100 text-teal-800 border-teal-300',
  gmp: 'bg-purple-100 text-purple-800 border-purple-300',
  halal: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  kosher: 'bg-cyan-100 text-cyan-800 border-cyan-300',
};

export default function CertificationBadges({ certifications }: CertificationBadgesProps) {
  const locale = useLocale() as 'fr' | 'en' | 'es';

  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {certifications.map((cert) => {
        const name = CERTIFICATION_NAMES[cert as keyof typeof CERTIFICATION_NAMES]?.[locale];
        const icon = CERTIFICATION_ICONS[cert];
        const colorClass = CERTIFICATION_COLORS[cert] || 'bg-gray-100 text-gray-800 border-gray-300';

        if (!name) return null;

        return (
          <div
            key={cert}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 font-semibold text-sm ${colorClass} shadow-sm`}
          >
            {icon && <span className="text-base">{icon}</span>}
            <span>{name}</span>
          </div>
        );
      })}
    </div>
  );
}
