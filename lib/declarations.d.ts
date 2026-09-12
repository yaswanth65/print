// lib/declarations.d.ts
// Minimal typings for dependencies without bundled types.

declare module 'word-extractor' {
  export interface WordDocument {
    getBody(): string;
    getHeaders(): string;
    getFooters(): string;
    getFootnotes(): string;
  }
  export default class WordExtractor {
    extract(path: string): Promise<WordDocument>;
  }
}

declare module 'pdf-parse' {
  interface PdfParseResult {
    text: string;
    numpages: number;
    info: any;
  }
  const pdfParse: (data: Buffer, options?: any) => Promise<PdfParseResult>;
  export default pdfParse;
}