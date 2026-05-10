import { useDocumentStore, TemplateType } from '@/store/useDocumentStore';
import React, { useEffect, useRef, useState } from 'react';

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
  placeholder = '...' 
}) => {
  const { editMode, updateField } = useDocumentStore();
  const isDirectMode = editMode === 'direct';
  const spanRef = useRef<HTMLSpanElement>(null);
  const [localValue, setLocalValue] = useState(value);

  // Sync with global store if changed externally (e.g. form mode)
  useEffect(() => {
    if (!isDirectMode) {
      setLocalValue(value);
      if (spanRef.current && spanRef.current.innerText !== value) {
        spanRef.current.innerText = value || placeholder;
      }
    }
  }, [value, isDirectMode, placeholder]);

  const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
    setLocalValue(e.currentTarget.innerText);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
    const text = e.currentTarget.innerText;
    updateField(template, fieldPath, text.trim());
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLSpanElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    // Prevent creating new divs/paragraphs inside the span on enter
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <span
      ref={spanRef}
      contentEditable={isDirectMode}
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleBlur}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      className={`relative rounded-sm transition-colors ${
        isDirectMode 
          ? 'hover:bg-blue-50 focus:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-text px-1 -mx-1' 
          : ''
      } ${className}`}
      spellCheck={false}
      dangerouslySetInnerHTML={{ __html: value || `<span class="text-gray-400 font-normal opacity-50">${placeholder}</span>` }}
    />
  );
};
