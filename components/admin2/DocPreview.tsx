// components/admin2/DocPreview.tsx
// Renders a TemplateDef.layout as the document would read, with detected
// blank spots highlighted so the admin can review them before saving.

import type { TemplateDef, AnyTemplateDef, FormField } from '@/lib/types';

interface DocPreviewProps {
  def: AnyTemplateDef;
  mode?: 'review' | 'plain';
}

export function DocPreview({ def, mode = 'review' }: DocPreviewProps) {
  if (!def) {
    return (
      <div className="text-center text-slate-400 text-sm py-16 font-medium">
        No detected content in this document.
      </div>
    );
  }

  // Structural DOCX template with HTML skeleton
  if ('kind' in def && def.kind === 'docx' && def.htmlSkeleton) {
    const fieldByKey = new Map<string, FormField>();
    for (const f of def.fields) fieldByKey.set(f.key, f);

    // Replace {{tokens}} in HTML skeleton with review chips
    const htmlWithChips = def.htmlSkeleton.replace(
      /<span class="docx-field" data-f="([^"]+)">.*?<\/span>/g,
      (_match, token: string) => {
        const rawKey = token.replace(/^\{\{|\}\}$/g, '').split(':')[0]!;
        const field = fieldByKey.get(rawKey);
        const label = field?.label || rawKey;
        if (mode === 'review') {
          const isDropdown = field?.type === 'select';
          const isCheckbox = field?.type === 'checkbox';
          const badgeClass = isDropdown
            ? 'bg-amber-50 border border-amber-300 text-amber-800'
            : isCheckbox
            ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
            : 'bg-blue-50 border border-blue-300 text-blue-800';
          return `<span class="inline-block ${badgeClass} rounded px-1.5 py-0.5 text-xs font-semibold mx-0.5" title="${label}">${label}${isDropdown ? ' ▾' : isCheckbox ? ' ☑' : ''}</span>`;
        }
        return `<span class="font-bold border-b border-dotted border-slate-400 px-1 inline-block">${label}</span>`;
      }
    );

    return (
      <div
        className="font-serif leading-relaxed text-[13px] break-words text-slate-800"
        dangerouslySetInnerHTML={{ __html: htmlWithChips }}
      />
    );
  }

  if (!def.layout || def.layout.length === 0) {
    return (
      <div className="text-center text-slate-400 text-sm py-16 font-medium">
        No detected content in this document.
      </div>
    );
  }

  const fieldByKey = new Map<string, FormField>();
  for (const f of def.fields) fieldByKey.set(f.key, f);

  return (
    <div className="font-serif text-justify leading-relaxed text-[12px] break-words">
      {def.layout.map((para, i) => (
        <p key={i} className="mb-2 whitespace-pre-wrap">
          {para.length === 0 ? <>&nbsp;</> : para.map((seg, j) => {
            if (seg.f) {
              const field = fieldByKey.get(seg.f);
              if (mode === 'review') {
                return (
                  <span
                    key={j}
                    title={field ? `${field.label} (${field.type})` : seg.f}
                    className={
                      field?.type === 'select'
                        ? 'inline-block bg-amber-50 border border-amber-300 text-amber-800 rounded px-1 mx-0.5'
                        : 'inline-block bg-blue-50 border border-blue-300 text-blue-800 rounded px-1 mx-0.5'
                    }
                  >
                    {field?.label || seg.f}
                    {field?.type === 'select' ? ' ▾' : ''}
                  </span>
                );
              }
              return (
                <span key={j} className={field?.type === 'select' ? 'text-amber-700 font-bold' : 'font-bold border-b border-dotted border-slate-400 px-1 inline-block'}>
                  {field?.label || seg.f}
                </span>
              );
            }
            return <span key={j}>{seg.t}</span>;
          })}
        </p>
      ))}
    </div>
  );
}