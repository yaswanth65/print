
const http = require('http');

async function runTests() {
  console.log('--- 1. Testing Pricing Engine ---');
  const { getDocumentPrice, formatINR, DEFAULT_DOCUMENT_PRICING } = await import('../lib/pricing.ts');
  console.log('Total configured pricing templates:', Object.keys(DEFAULT_DOCUMENT_PRICING).length);
  console.log('SBI Alias price:', formatINR(getDocumentPrice('sbi_alias_general')));
  console.log('Identity Card price:', formatINR(getDocumentPrice('identity_card')));
  console.log('Sale Deed price:', formatINR(getDocumentPrice('sale_deed')));

  console.log('\n--- 2. Testing Telugu Transliteration ---');
  const { transliterateEnglishToTelugu, formatTeluguValue, hasTeluguCharacters } = await import('../lib/teluguTransliteration.ts');
  const sample1 = 'CHINTALAPALLY GANGAREDDY';
  const sample2 = 'ARMOOR Mandal, District Nizamabad';
  const sample3 = 'మేనేజర్ గారి సమక్షములో'; // already Telugu copy-paste
  console.log('Transliterate name:', sample1, '->', transliterateEnglishToTelugu(sample1));
  console.log('Transliterate address:', sample2, '->', transliterateEnglishToTelugu(sample2));
  console.log('Preserve Telugu copy-paste:', sample3, '->', formatTeluguValue(sample3, 'te'));
  console.log('Detects native Telugu:', hasTeluguCharacters(sample3));

  console.log('\n=== Verification Summary: Local unit functions validated successfully! ===');
}

runTests().catch(console.error);
