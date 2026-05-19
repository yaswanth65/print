import { useDocumentStore, TemplateType } from '@/store/useDocumentStore';
import React, { useEffect, useRef } from 'react';

interface EditableFieldProps {
  template: TemplateType;
  fieldPath: string;
  value: string;
  className?: string;
  placeholder?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({ 
  template, 
  fieldPath, 
  value, 
  className = '', 
  placeholder = 'Click to edit...' 
}) => {
  const { editMode, updateField } = useDocumentStore();
  const isDirectMode = editMode === 'direct';
  const spanRef = useRef<HTMLSpanElement>(null);
  const isEditing = useRef(false);

  // Sync innerText from store when NOT in direct edit mode
  // In direct mode, the user controls the DOM via contentEditable
  useEffect(() => {
    if (spanRef.current && !isEditing.current) {
      const t = value || '';
      if (spanRef.current.innerText !== t) {
        spanRef.current.innerText = t;
      }
    }
  }, [value]);

  const handleInput = () => {
    isEditing.current = true;
  };

  const handleBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
    isEditing.current = false;
    const text = e.currentTarget.innerText;
    const trimmed = text.trim();
    if (trimmed !== value) {
      updateField(template, fieldPath, trimmed);
    }
    e.currentTarget.innerText = trimmed;
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  if (!isDirectMode) {
    return <span className={className}>{value || ''}</span>;
  }

  return (
    <span
      ref={spanRef}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onInput={handleInput}
      onBlur={handleBlur}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      className={`editable-field relative rounded-sm transition-colors hover:bg-blue-50 focus:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-text print:!bg-transparent print:!ring-0 print:cursor-text ${className}`}
      spellCheck={false}
    />
  );
};