/**
 * English to Telugu Translation Layer for Varma Xerox
 * Translates document boilerplate, legal declarations, titles, and labels
 * while user input values remain in English.
 */

export const TELUGU_LEGAL_DICTIONARY: Record<string, string> = {
  // Document Titles
  'AFFIDAVIT': 'ప్రమాణ పత్రము (అఫిడవిట్)',
  'DECLARATION': 'ప్రకటన పత్రము',
  'GENERAL AFFIDAVIT': 'సాధారణ ప్రమాణ పత్రము',
  'RENT AGREEMENT': 'గృహ అద్దె ఒప్పంద పత్రము',
  'RESIDENTIAL RENT AGREEMENT': 'గృహ అద్దె ఒప్పంద పత్రము',
  'LEASE DEED': 'వాణిజ్య లీజు దస్తావేజు (Lease Deed)',
  'SALE DEED': 'స్థిరాస్తి విక్రయ దస్తావేజు (Sale Deed)',
  'PLOT SALE AGREEMENT': 'ప్లాట్ విక్రయ ఒప్పంద పత్రము',
  'IDENTITY CARD': 'గుర్తింపు కార్డు',
  'GOVERNMENT OF TELANGANA STATE': 'తెలంగాణ ప్రభుత్వము',
  'GOVERNMENT OF TELANGANA': 'తెలంగాణ ప్రభుత్వము',
  'PANCHAYATHRAJ DEPARTMENT': 'పంచాయతీరాజ్ శాఖ',
  'AFFIDAVIT FOR DECLARATION OF': 'డిక్లరేషన్ ప్రమాణ పత్రము',
  '“ONTARI  MAHILA / SINGLE WOMEN’’': '“ఒంటరి మహిళ / SINGLE WOMEN”',
  'AFFIDAVIT Cum DECLARATION IN REGARD TO ALIAS NAME AND GENUINITY OF ACCOUNT HOLDER':
    'ఖాతాదారుని పేరు మార్పు / ఏలియాస్ పేరు మరియు ధృవీకరణ ప్రమాణ పత్రము',
  'AFFIDAVIT (FOR LOSS OF SSC MEMO)': 'ఎస్.ఎస్.సి మార్కుల మెమో పోయినందుకు ప్రమాణ పత్రము (అఫిడవిట్)',

  // Relational & Biographical
  'S/o': 'తండ్రి:',
  'D/o': 'తండ్రి:',
  'W/o': 'భర్త:',
  'H/o': 'భార్య:',
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
  'Date of Birth': 'పుట్టిన తేదీ',
  'Place': 'స్థలము',
  'Date': 'తేదీ',
  'Phone': 'ఫోన్',
  'Address': 'చిరునామా',

  // Common Declarations & Legal Text
  'I': 'నేను,',
  'do hereby solemnly affirm and state on oath as under': 'ఈ క్రింది విధంగా దైవసాక్షిగా ప్రమాణం చేసి తెలియజేయుచున్నాను:-',
  'do hereby make oath and state as under': 'సత్యనిష్ఠతో ప్రమాణం చేసి ఈ క్రింది వివరములు తెలియజేయుచున్నాను:-',
  'I state that I am the deponent herein': 'నేను ఈ ప్రమాణ పత్రము చేయు దరఖాస్తుదారుడను / ప్రమాణకర్తను.',
  'That the above content are true and correct to my personal knowledge and belief':
    'పై తెలిపిన విషయాలన్నీ నా వ్యక్తిగత జ్ఞానం మరియు నమ్మకం మేరకు పూర్తిగా నిజమైనవి మరియు సరైనవి.',
  'That the above contents are true and correct': 'పై తెలిపిన విషయాలన్నీ నా స్వంత జ్ఞానము మేరకు పూర్తిగా నిజమైనవి మరియు సరైనవి.',
  'DEPONENT': 'ప్రమాణకర్త (DEPONENT)',
  'VERIFICATION': 'ధృవీకరణ (VERIFICATION)',
  'SWORN AND SIGNED BEFORE ME': 'నా సమక్షములో ప్రమాణము చేసి సంతకము చేయబడినది',
  'Sworn and signed before me': 'నా సమక్షములో ప్రమాణము చేసి సంతకము చేయబడినది',
  'Witnesses:': 'సాక్షులు (Witnesses):',
  'BEFORE THE NOTARY PUBLIC AT': 'నోటరీ పబ్లిక్ సమక్షములో,',
  'BEFORE THE MANAGER,': 'మేనేజర్ గారి సమక్షములో,',

  // ID Card Labels
  'Employee ID': 'Employee ID / ఉద్యోగి ఐడి',
  'Date of Appointment': 'Date of Appointment / నియామక తేదీ',
  'Pan No.': 'Pan No. / పాన్ నెం.',
  'Aadhar No.': 'Aadhar No. / ఆధార్ నెం.',
  'Blood Group': 'Blood Group / రక్త గ్రూప్',
  'Residential Address': 'Residential Address / నివాస చిరునామా',
  'Mobile Number': 'Mobile Number / మొబైల్ నంబర్',
  'Sign. of the employee': 'Sign. of the employee / ఉద్యోగి సంతకము',
  'Name': 'పేరు (Name)',
  'Father Name': 'తండ్రి పేరు (Father Name)',
  'Designation': 'హోదా (Designation)',
  'Place of Working': 'పనిచేయు స్థలము (Place of Working)',
  'Issuing Authority': 'జారీ అధికారి (Authority)',
};

export function translateLegalTerm(term: string, lang: 'en' | 'te'): string {
  if (lang === 'en') return term;
  return TELUGU_LEGAL_DICTIONARY[term] || term;
}

export function isTelugu(lang: 'en' | 'te'): boolean {
  return lang === 'te';
}
