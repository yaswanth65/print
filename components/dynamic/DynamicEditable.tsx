// components/dynamic/DynamicEditable.tsx
// Editable/display span for a single dynamic-form field.
// Direct Edit mode → contentEditable that writes back to the store.
// Form mode → bold filled value (or a dotted blank when empty).

import { useEffect, useRef } from 'react';
import { useDocumentStore } from '@/store/useDocumentStore';
import type { FormField } from '@/lib/types';

interface DynamicEditableProps {
  formId: string;
  field: FormField;
  value: string;
}

export const DynamicEditable = ({ formId, field, value }: DynamicEditableProps) => {
  const { editMode, setFormValue } = useDocumentStore();
  const isDirect = editMode === 'direct';
  const spanRef = useRef<HTMLSpanElement>(null);
  const editing = useRef(false);

  useEffect(() => {
    if (spanRef.current && !editing.current) {
      const t = value || '';
      if (spanRef.current.innerText !== t) {
        spanRef.current.innerText = t;
      }
    }
  }, [value, isDirect]);

  const commit = (e: React.FocusEvent<HTMLSpanElement>) => {
    editing.current = false;
    const t = e.currentTarget.innerText.trim();
    if (t !== value) setFormValue(formId, field.key, t);
    e.currentTarget.innerText = t;
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLSpanElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  if (!isDirect) {
    return value ? (
      <span className="font-bold">{value}</span>
    ) : (
      <span className="inline-block min-w-[2.5rem] border-b border-dotted border-slate-400 font-bold text-transparent select-none" aria-label={field.label}>
        .
      </span>
    );
  }

  return (
    <span
      ref={spanRef}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={field.label || 'Click to edit...'}
      onInput={() => { editing.current = true; }}
      onBlur={commit}
      onPaste={handlePaste}
      onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
      className="editable-field inline-block font-bold relative rounded-sm transition-colors hover:bg-blue-50 focus:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-text print:!bg-transparent print:!ring-0"
      spellCheck={false}
    />
  );
};