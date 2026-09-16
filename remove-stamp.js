const fs = require('fs');

const files = [
  'templates/leaseDeed/LeaseDeedPreview.tsx',
  'templates/panInstantSignatureAffidavit/PanInstantSignatureAffidavitPreview.tsx',
  'templates/sbiAliasGeneral/SbiAliasGeneralPreview.tsx',
  'templates/singleWomenAffidavit/SingleWomenAffidavitPreview.tsx',
  'templates/affidavit/AffidavitPreview.tsx',
  'templates/bobGoldLoanIndemnity/BobGoldLoanIndemnityPreview.tsx',
  'templates/plotAgreement/PlotAgreementPreview.tsx',
  'templates/rentAgreement/RentAgreementPreview.tsx',
  'templates/saleDeed/SaleDeedPreview.tsx',
  'templates/sscMemoAffidavit/SscMemoAffidavitPreview.tsx'
];

for (const f of files) {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    
    // Pattern to match the whole div containing the stamp text
    // The div usually looks like:
    // <div className={`${styles['...-stamp']} print:hidden`}> ... </div>
    // or <div className={styles['...-stamp']}> ... </div>
    // Let's just remove anything that matches <div className=...stamp...>[ 50 / 100...</div>
    
    // We can also just replace the entire <div className=...stamp...> block by searching for the class names.
    content = content.replace(/{\/\* Stamp Paper Top Space.*?\*\/}\n\s*<div[^>]*stamp[^>]*>[\s\S]*?<\/div>/gi, '');
    content = content.replace(/<div[^>]*stamp[^>]*>[\s\S]*?<\/div>/gi, '');
    
    fs.writeFileSync(f, content);
    console.log(`Cleaned ${f}`);
  }
}
