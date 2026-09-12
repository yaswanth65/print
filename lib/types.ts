// lib/types.ts
// Shared types for dynamic (uploaded) form templates.

export type FieldSource = 'blank' | 'pattern' | 'manual' | 'docx-diff';
export type FieldType = 'text' | 'textarea' | 'date' | 'select' | 'checkbox';
export type TemplateStatus = 'DRAFT' | 'READY';
export type SourceType = 'cfa' | 'doc' | 'docx' | 'pdf' | 'txt';

export interface FormField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  group?: string;
  source?: FieldSource;
  placeholder?: string;
  // Checkbox groups: one logical field whose options map to individual box
  // positions in the document via positionTokens (e.g. {{gender:0}}).
  positionTokens?: string[];
}

// A paragraph is a list of inline segments: literal text or a field reference.
export interface LayoutSegment {
  t?: string;
  f?: string;
}

export type LayoutParagraph = LayoutSegment[];

export interface TemplateDef {
  fields: FormField[];
  layout: LayoutParagraph[];
}

// Structural template produced by the two-file DOCX diff (no text flattening).
// The actual document is persisted on disk as a .docx zip (template.docx)
// whose XML parts still hold `{{field_name}}` placeholders inside the ORIGINAL
// run text. The reader only ever swaps placeholder text back into the
// preserved skeleton — page breaks, headers/footers, tables, tabs, images and
// styles are never rebuilt.
export interface DocxTemplateDef extends TemplateDef {
  kind: 'docx';
  htmlSkeleton: string;
  inputFiles: { blank?: string; filled?: string };
}

export type AnyTemplateDef = TemplateDef | DocxTemplateDef;

export interface FormTemplateMeta {
  id: string;
  title: string;
  source_type: SourceType | null;
  original_filename: string | null;
  status: TemplateStatus;
  field_count: number;
  created_at: string | null;
}

export interface FormTemplate extends FormTemplateMeta {
  extracted_text: string | null;
  template_def: AnyTemplateDef | null;
  file_path: string | null;
}

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  cfa: 'CFA',
  doc: 'Word (.doc)',
  docx: 'Word (.docx)',
  pdf: 'PDF',
  txt: 'Text',
};