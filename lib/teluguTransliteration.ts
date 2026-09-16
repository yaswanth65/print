/**
 * English to Telugu Phonetic Transliteration & Language Helper
 * Supports:
 * - Direct copy-paste Telugu Unicode preservation
 * - Dictionary mapping for common legal terminology, places, and names
 * - Phonetic syllabic rule engine for arbitrary English text
 */

const COMMON_DICTIONARY: Record<string, string> = {
  // Common Telangana / Legal Names & Places
  armoor: 'ఆర్మూర్',
  nizamabad: 'నిజామాబాద్',
  kamareddy: 'కామారెడ్డి',
  hyderabad: 'హైదరాబాద్',
  telangana: 'తెలంగాణ',
  india: 'భారతదేశం',
  chintalapally: 'చింతలపల్లి',
  chintlapally: 'చింట్లపల్లి',
  gangareddy: 'గంగారెడ్డి',
  bojanna: 'భోజన్న',
  pedda: 'పెద్ద',
  chinna: 'చిన్న',
  maggidi: 'మగ్గిడి',
  vidyanagar: 'విద్యానగర్',
  'housing board colony': 'హౌసింగ్ బోర్డ్ కాలనీ',
  ramesh: 'రమేష్',
  suresh: 'సురేష్',
  mahesh: 'మహేష్',
  naresh: 'నరేష్',
  venkatesh: 'వెంకటేష్',
  srinivas: 'శ్రీనివాస్',
  laxman: 'లక్ష్మణ్',
  krishna: 'కృష్ణ',
  prasad: 'ప్రసాద్',
  ravi: 'రవి',
  sunil: 'సునీల్',
  poshetty: 'పోశెట్టి',
  vennela: 'వెన్నెల',
  manikanta: 'మణికంఠ',
  dhondi: 'ధోండి',
  jagadeeshwar: 'జగదీశ్వర్',
  pradhyumn: 'ప్రద్యుమ్న',

  // Occupations & Relations
  'home maker': 'గృహిణి',
  homemaker: 'గృహిణి',
  housewife: 'గృహిణి',
  agriculture: 'వ్యవసాయం',
  farmer: 'రైతు',
  business: 'వ్యాపారం',
  private: 'ప్రైవేట్ ఉద్యోగం',
  employee: 'ఉద్యోగి',
  student: 'విద్యార్థి',
  advocate: 'న్యాయవాది',
  notary: 'నోటరీ',
  driver: 'డ్రైవర్',
  coolie: 'కూలీ',
  labour: 'శ్రామికుడు',

  // Legal roles & terms
  deponent: 'ప్రమాణీకుడు / డిపోనెంట్',
  borrower: 'రుణగ్రహీత',
  guarantor: 'హామీదారు',
  purchaser: 'కొనుగోలుదారు',
  buyer: 'కొనుగోలుదారు',
  vendor: 'విక్రేత',
  seller: 'విక్రేత',
  tenant: 'అద్దెదారు',
  landlord: 'యజమాని',
  lessor: 'యజమాని / లెసర్',
  lessee: 'అద్దెదారు / లెస్సీ',
  executant: 'ఎగ్జిక్యూటెంట్',
  claimant: 'క్లెయిమెంట్',

  // Address terms
  'h.no': 'ఇంటి నెం.',
  'h.no.': 'ఇంటి నెం.',
  'house no': 'ఇంటి నెం.',
  village: 'గ్రామం',
  mandal: 'మండలం',
  district: 'జిల్లా',
  dist: 'జిల్లా',
  street: 'వీధి',
  colony: 'కాలనీ',
  road: 'రోడ్డు',
  years: 'సంవత్సరాలు',
  aged: 'వయస్సు',
  'resident of': 'నివాసి',
  's/o': 'తండ్రి',
  'd/o': 'తండ్రి',
  'w/o': 'భార్య',
  'h/o': 'భార్య',
  'son of': 'తండ్రి',
  'daughter of': 'తండ్రి',
  'wife of': 'భార్య',
  'husband of': 'భార్య',
};

const CONSONANTS: [string, string][] = [
  ['ksha', 'క్ష'],
  ['kh', 'ఖ'],
  ['gh', 'ఘ'],
  ['ch', 'చ'],
  ['chh', 'ఛ'],
  ['jh', 'ఝ'],
  ['th', 'థ'],
  ['dh', 'ధ'],
  ['ph', 'ఫ'],
  ['bh', 'భ'],
  ['sh', 'శ'],
  ['shh', 'ష'],
  ['k', 'క'],
  ['g', 'గ'],
  ['j', 'జ'],
  ['t', 'ట'],
  ['d', 'డ'],
  ['n', 'న'],
  ['p', 'ప'],
  ['f', 'ఫ'],
  ['b', 'బ'],
  ['m', 'మ'],
  ['y', 'య'],
  ['r', 'ర'],
  ['l', 'ల'],
  ['v', 'వ'],
  ['w', 'వ'],
  ['s', 'స'],
  ['h', 'హ'],
];

const VOWEL_SIGNS: [string, string][] = [
  ['aee', 'ై'],
  ['aai', 'ై'],
  ['ai', 'ై'],
  ['ou', 'ౌ'],
  ['au', 'ౌ'],
  ['aa', 'ా'],
  ['ee', 'ీ'],
  ['ii', 'ీ'],
  ['oo', 'ూ'],
  ['uu', 'ూ'],
  ['a', ''],
  ['i', 'ి'],
  ['u', 'ు'],
  ['e', 'ె'],
  ['o', 'ొ'],
];

const INDEPENDENT_VOWELS: [string, string][] = [
  ['aee', 'ఐ'],
  ['aai', 'ఐ'],
  ['ai', 'ఐ'],
  ['ou', 'ఔ'],
  ['au', 'ఔ'],
  ['aa', 'ఆ'],
  ['ee', 'ఈ'],
  ['ii', 'ఈ'],
  ['oo', 'ఊ'],
  ['uu', 'ఊ'],
  ['a', 'అ'],
  ['i', 'ఇ'],
  ['u', 'ఉ'],
  ['e', 'ఎ'],
  ['o', 'ఒ'],
];

export function hasTeluguCharacters(str: string): boolean {
  return /[\u0C00-\u0C7F]/.test(str);
}

/**
 * Phonetically transliterates a single English word into Telugu
 */
export function transliterateWord(rawWord: string): string {
  if (!rawWord || hasTeluguCharacters(rawWord)) return rawWord;

  const lower = rawWord.toLowerCase();

  // 1. Direct dictionary match
  if (COMMON_DICTIONARY[lower]) {
    return COMMON_DICTIONARY[lower];
  }

  // Handle punctuation/numbers inside word
  if (/^[0-9\/\-\.,#:]+$/.test(rawWord)) {
    return rawWord;
  }

  let result = '';
  let i = 0;
  const len = lower.length;

  while (i < len) {
    if (!/[a-z]/.test(lower[i])) {
      result += rawWord[i];
      i++;
      continue;
    }

    let matchedConsonant = '';
    let teluguConsonant = '';

    for (const [eng, tel] of CONSONANTS) {
      if (lower.startsWith(eng, i)) {
        matchedConsonant = eng;
        teluguConsonant = tel;
        break;
      }
    }

    if (matchedConsonant) {
      i += matchedConsonant.length;

      let matchedVowel = '';
      let teluguSign = '్'; // default pollu

      for (const [eng, sign] of VOWEL_SIGNS) {
        if (lower.startsWith(eng, i)) {
          matchedVowel = eng;
          teluguSign = sign;
          break;
        }
      }

      if (matchedVowel) {
        i += matchedVowel.length;
        result += teluguConsonant + teluguSign;
      } else {
        if (i >= len) {
          result += teluguConsonant;
        } else {
          result += teluguConsonant + '్';
        }
      }
    } else {
      let matchedIndep = '';
      let teluguIndep = '';

      for (const [eng, tel] of INDEPENDENT_VOWELS) {
        if (lower.startsWith(eng, i)) {
          matchedIndep = eng;
          teluguIndep = tel;
          break;
        }
      }

      if (matchedIndep) {
        result += teluguIndep;
        i += matchedIndep.length;
      } else {
        result += rawWord[i];
        i++;
      }
    }
  }

  return result || rawWord;
}

/**
 * Transliterates arbitrary text string (sentences, addresses, names)
 */
export function transliterateEnglishToTelugu(text: string): string {
  if (!text) return '';
  if (hasTeluguCharacters(text)) return text; // preserve native Telugu

  let processed = text;
  const lowerText = text.toLowerCase();
  for (const [key, val] of Object.entries(COMMON_DICTIONARY)) {
    if (key.includes(' ') && lowerText.includes(key)) {
      const regex = new RegExp(key, 'gi');
      processed = processed.replace(regex, val);
    }
  }

  return processed.replace(/([A-Za-z]+)/g, (match) => {
    return transliterateWord(match);
  });
}

/**
 * Universal formatter for preview templates:
 * - If language is 'te', auto-transliterates English text or keeps pasted Telugu.
 * - If language is 'en', returns original text.
 */
export function formatTeluguValue(value: string | undefined | null, language: 'en' | 'te'): string {
  if (!value) return '';
  if (language !== 'te') return value;
  if (hasTeluguCharacters(value)) return value;
  return transliterateEnglishToTelugu(value);
}
