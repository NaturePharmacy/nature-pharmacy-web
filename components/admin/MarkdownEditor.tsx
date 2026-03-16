'use client';
import { useRef } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  height?: number;
}

const TOOLBAR = [
  { label: 'B', title: 'Gras', before: '**', after: '**' },
  { label: 'I', title: 'Italique', before: '_', after: '_' },
  { label: 'H2', title: 'Titre 2', before: '## ', after: '' },
  { label: 'H3', title: 'Titre 3', before: '### ', after: '' },
  { label: 'Liste', title: 'Liste à puces', before: '- ', after: '' },
  { label: '🔗', title: 'Lien', before: '[texte](', after: ')' },
];

export default function MarkdownEditor({ value, onChange, label, height = 300 }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (before: string, after: string) => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const newVal = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(newVal);
    setTimeout(() => {
      ta.selectionStart = start + before.length;
      ta.selectionEnd = end + before.length;
      ta.focus();
    }, 0);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-wrap">
          {TOOLBAR.map(btn => (
            <button
              key={btn.label}
              type="button"
              title={btn.title}
              onClick={() => insertFormat(btn.before, btn.after)}
              className="px-2 py-1 text-xs font-mono bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              {btn.label}
            </button>
          ))}
        </div>
        <textarea
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ height: `${height}px` }}
          className="w-full px-4 py-3 text-sm text-gray-800 font-mono resize-none focus:outline-none"
          placeholder="Contenu en Markdown..."
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">Supporte le Markdown : **gras**, _italique_, ## titre, - liste</p>
    </div>
  );
}
