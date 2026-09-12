// components/dynamic/DynamicPreview.tsx
// Renders a detected form layout (paragraph segments) with live field values.

import { useDocumentStore } from '@/store/useDocumentStore';
import { DynamicEditable } from './DynamicEditable';
import type { FormField } from '@/lib/types';

export const DynamicPreview = ({ formId }: { formId: string }) => {
  const { formDefs, formValues } = useDocumentStore();
  const def = formDefs[formId];
  const values = formValues[formId] ?? {};

  if (!def) {
    return (
      <div className="document-paper flex items-center justify-center text-slate-400 text-sm">
        Loading form…
      </div>
    );
  }

  const fieldByKey = new Map<string, FormField>();
  for (const f of def.fields) fieldByKey.set(f.key, f);

  if ('kind' in def && def.kind === 'docx' && def.htmlSkeleton) {
    // Hydrate tokens in htmlSkeleton with live values
    let hydratedHtml = def.htmlSkeleton;
    for (const f of def.fields) {
      if (f.type === 'checkbox' && f.positionTokens?.length) {
        const sel = values[f.key] ?? '';
        const selIdx = (f.options ?? []).indexOf(sel);
        for (let i = 0; i < f.positionTokens.length; i++) {
          const t = f.positionTokens[i]!;
          const boxGlyph = i === selIdx ? '☑' : '☐';
          hydratedHtml = hydratedHtml.split(t).join(boxGlyph);
        }
      } else {
        const token = `{{${f.key}}}`;
        const val = values[f.key];
        const displayVal = val && val.trim() ? val : `______`;
        hydratedHtml = hydratedHtml.split(token).join(displayVal);
      }
    }

    return (
      <div className="font-serif text-justify leading-relaxed text-[11pt]">
        <div
          className="document-paper pb-32"
          dangerouslySetInnerHTML={{ __html: hydratedHtml }}
        />
      </div>
    );
  }

  return (
    <div className="font-serif text-justify leading-relaxed text-[11pt]">
      <div className="document-paper pb-32">
        {def.layout.length === 0 && (
          <div className="text-center text-slate-400">(No content)</div>
        )}
        {def.layout.map((para, i) => (
          <p key={i} className="mb-1 whitespace-pre-wrap">
            {para.length === 0
              ? <>&nbsp;</>
              : para.map((seg, j) => {
                  if (seg.f) {
                    const field = fieldByKey.get(seg.f);
                    if (!field) return null;
                    return (
                      <DynamicEditable
                        key={j}
                        formId={formId}
                        field={field}
                        value={values[seg.f] ?? ''}
                      />
                    );
                  }
                  return <span key={j}>{seg.t}</span>;
                })}
          </p>
        ))}
      </div>
    </div>
  );
};