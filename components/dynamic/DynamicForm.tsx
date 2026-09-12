// components/dynamic/DynamicForm.tsx
// Side-panel editor for a dynamic form: field inputs grouped by section,
// with dropdown (select), date, textarea and text input types.

import { ChevronDown } from 'lucide-react';
import { useDocumentStore } from '@/store/useDocumentStore';
import type { FormField } from '@/lib/types';

interface DynamicFormProps {
  formId: string;
}

const inputBase =
  'w-full border border-slate-300 rounded p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500';

const Control = ({
  formId,
  field,
  value,
}: {
  formId: string;
  field: FormField;
  value: string;
}) => {
  const setFormValue = useDocumentStore((s) => s.setFormValue);

  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
          {field.label}
        </label>
        <div className="relative">
          <select
            value={value}
            onChange={(e) => setFormValue(formId, field.key, e.target.value)}
            className={`${inputBase} appearance-none pr-8 cursor-pointer ${value ? '' : 'text-slate-400'}`}
          >
            <option value="">— select —</option>
            {(field.options ?? []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          />
        </div>
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
          {field.label}
        </label>
        <div className="flex flex-wrap gap-4">
          {(field.options ?? []).map((opt) => (
            <label key={opt} className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="radio"
                name={`${formId}_${field.key}`}
                value={opt}
                checked={value === opt}
                onChange={() => setFormValue(formId, field.key, opt)}
                className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
          {field.label}
        </label>
        <textarea
          value={value}
          onChange={(e) => setFormValue(formId, field.key, e.target.value)}
          rows={3}
          placeholder={field.placeholder}
          className={inputBase}
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
        {field.label}
      </label>
      <input
        type={field.type === 'date' ? 'date' : 'text'}
        value={value}
        onChange={(e) => setFormValue(formId, field.key, e.target.value)}
        placeholder={field.placeholder}
        className={inputBase}
      />
    </div>
  );
};

export const DynamicForm = ({ formId }: DynamicFormProps) => {
  const { formDefs, formValues } = useDocumentStore();
  const def = formDefs[formId];
  const values = formValues[formId] ?? {};

  if (!def) return null;

  const groups = new Map<string, FormField[]>();
  for (const f of def.fields) {
    const g = f.group || 'General';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(f);
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
      {[...groups.entries()].map(([group, fields], gi) => (
        <div key={gi}>
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-500">
              {String(gi + 1).padStart(2, '0')}
            </span>
            {group}
          </h3>
          <div className="space-y-4">
            {fields.map((field) => (
              <Control
                key={field.key}
                formId={formId}
                field={field}
                value={values[field.key] ?? ''}
              />
            ))}
          </div>
        </div>
      ))}
      {def.fields.length === 0 && (
        <div className="text-center text-slate-400 text-sm pt-8">
          No form fields detected in this document.
        </div>
      )}
    </div>
  );
};