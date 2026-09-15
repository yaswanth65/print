/**
 * English to Telugu Translation Layer for Varma Xerox
 * Input data remains strictly in English, while document headers,
 * legal boilerplate, declarations, and relations are converted to authentic Telugu.
 */

export const TELUGU_LEGAL_DICTIONARY: Record<string, string> = {
  // Document Titles
  'AFFIDAVIT': 'ప్రమాణ పత్రము (అఫిడవిట్)',
  'DECLARATION': 'ప్రకటన పత్రము',
  'GENERAL AFFIDAVIT': 'సాధారణ ప్రమాణ పత్రము',
  'RENT AGREEMENT': 'అద్దె ఒప్పంద పత్రము',
  'LEASE DEED': 'కౌలు / లీజు దస్తావేజు',
  'SALE DEED': 'విక్రయ దస్తావేజు',
  'IDENTITY CARD': 'గుర్తింపు కార్డు',
  'GOVERNMENT OF TELANGANA STATE': 'తెలంగాణ ప్రభుత్వము',
  'PANCHAYATHRAJ DEPARTMENT': 'పంచాయతీరాజ్ శాఖ',

  // Relational & Biographical
  'S/o': 'తండ్రి పేరు:',
  'D/o': 'తండ్రి పేరు:',
  'W/o': 'భర్త పేరు:',
  'Age': 'వయస్సు',
  'Years': 'సంవత్సరములు',
  'Resident of': 'నివాసి:',
  'H.No': 'ఇంటి నెం.',
  'Village': 'గ్రామము',
  'Mandal': 'మండలము',
  'District': 'జిల్లా',
  'State': 'రాష్ట్రము',
  'Telangana': 'తెలంగాణ',
  'Occupation': 'వృత్తి:',
  'Aadhar Card No': 'ఆధార్ కార్డు నెం.',

  // Common Declarations
  'I': 'నేను,',
  'do hereby solemnly affirm and state on oath as under': 'ఈ క్రింది విధంగా దైవసాక్షిగా ప్రమాణం చేసి తెలియజేయుచున్నాను:-',
  'do hereby make oath and state as under': 'సత్యనిష్ఠతో ప్రమాణం చేసి ఈ క్రింది వివరములు తెలియజేయుచున్నాను:-',
  'I state that I am the deponent herein': 'నేను ఈ ప్రమాణ పత్రము చేయు దరఖాస్తుదారుడను / ప్రమాణకర్తను.',
  'That the above contents are true and correct': 'పై తెలిపిన విషయాలన్నీ నా స్వంత జ్ఞానము మేరకు పూర్తిగా నిజమైనవి మరియు సరైనవి.',
  'DEPONENT': 'ప్రమాణకర్త',
  'VERIFICATION': 'ధృవీకరణ',
  'SWORN AND SIGNED BEFORE ME': 'నా సమక్షములో ప్రమాణము చేసి సంతకము చేయబడినది',
  'Name': 'పేరు',
  'Father Name': 'తండ్రి పేరు',
  'Date of Birth': 'పుట్టిన తేదీ',
  'Designation': 'హోదా',
  'Place of Working': 'పనిచేయు స్థలము',
};

export function translateLegalTerm(term: string, lang: 'en' | 'te'): string {
  if (lang === 'en') return term;
  return TELUGU_LEGAL_DICTIONARY[term] || term;
}
