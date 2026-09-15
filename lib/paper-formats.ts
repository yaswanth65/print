export type PaperFormatId = 'a4' | 'ledger' | 'bond' | 'stamp_paper' | 'id_card';

export interface PaperFormatConfig {
  id: PaperFormatId;
  name: string;
  description: string;
  widthMm: number;
  heightMm: number;
  topMarginMm: number;
  bottomMarginMm: number;
  leftMarginMm: number;
  rightMarginMm: number;
  headerReservedMm: number;
  footerReservedMm: number;
}

export const PAPER_FORMATS: Record<PaperFormatId, PaperFormatConfig> = {
  a4: {
    id: 'a4',
    name: 'A4 Format',
    description: 'Standard 210 x 297 mm with minimal margins for maximum usable area',
    widthMm: 210,
    heightMm: 297,
    topMarginMm: 8,
    bottomMarginMm: 8,
    leftMarginMm: 12,
    rightMarginMm: 12,
    headerReservedMm: 0,
    footerReservedMm: 0,
  },
  ledger: {
    id: 'ledger',
    name: 'Ledger Format',
    description: '279.4 x 431.8 mm (11x17 in) with bottom reserved advocate & stamp area',
    widthMm: 279.4,
    heightMm: 431.8,
    topMarginMm: 15,
    bottomMarginMm: 15,
    leftMarginMm: 18,
    rightMarginMm: 18,
    headerReservedMm: 0,
    footerReservedMm: 85,
  },
  bond: {
    id: 'bond',
    name: 'Bond / Stamp Paper',
    description: 'Pre-printed non-judicial stamp paper with top & bottom exclusion zones',
    widthMm: 210,
    heightMm: 297,
    topMarginMm: 10,
    bottomMarginMm: 10,
    leftMarginMm: 15,
    rightMarginMm: 15,
    headerReservedMm: 95,
    footerReservedMm: 35,
  },
  stamp_paper: {
    id: 'stamp_paper',
    name: '50/100 Rs Stamp Paper',
    description: 'Reserved 100mm top header for non-judicial stamp motifs',
    widthMm: 210,
    heightMm: 297,
    topMarginMm: 10,
    bottomMarginMm: 10,
    leftMarginMm: 15,
    rightMarginMm: 15,
    headerReservedMm: 100,
    footerReservedMm: 30,
  },
  id_card: {
    id: 'id_card',
    name: 'ID Card (CR80 / PVC)',
    description: 'Standard 85.6 x 54 mm card aspect ratio (scaled 130 x 82 mm preview)',
    widthMm: 130,
    heightMm: 82,
    topMarginMm: 0,
    bottomMarginMm: 0,
    leftMarginMm: 0,
    rightMarginMm: 0,
    headerReservedMm: 0,
    footerReservedMm: 0,
  },
};
