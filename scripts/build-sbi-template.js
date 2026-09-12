const fs = require('fs');
const JSZip = require('jszip');

async function buildSbiTemplate() {
  const buf = fs.readFileSync('C:/Users/YASWANTH/Downloads/SBI ALIAS GENERAL AS PER AADHAR CARD 2020 (1).docx');
  const zip = await JSZip.loadAsync(buf);
  let xml = await zip.file('word/document.xml').async('string');

  // We only need the Armoor SBI branch deed (Paragraphs 153 to 170)
  // Let's create a single-deed clean docx for SBI Alias General
  // Or replace tokens in the Armoor section
  xml = xml.replace('BRANCH: ARMOOR ', 'BRANCH: {{branchName}} ');
  xml = xml.replace('Sri. CHINTALAPALLY GANGAREDDY', '{{assumedName}}');
  xml = xml.replace('CHINTLAPALLY PEDDA GANGAREDDY', '{{previousName}}');
  xml = xml.replace('CHINTALAPALLY BOJANNA', '{{relativeName}}');
  xml = xml.replace('aged about 34 Years', 'aged about {{age}} Years');
  xml = xml.replace('OCCU: HOME MAKER', 'OCCU: {{occupation}}');
  xml = xml.replace('H.No.2-22', 'H.No.{{hNo}}');
  xml = xml.replace('MAGGIDI Village', '{{village}} Village');
  xml = xml.replace('ARMOOR   Mandal', '{{mandal}} Mandal');
  xml = xml.replace('District Nizamabad', 'District {{district}}');
  xml = xml.replace('Pin Code No.503224', 'Pin Code No.{{pincode}}');
  xml = xml.replace('6017 8940 6754', '{{aadharNumber}}');
  xml = xml.replace('T11010090078', '{{previousDocNumber}}');
  xml = xml.replace('On 01/09/2026 at armoor', 'On {{declarationDate}} at {{declarationPlace}}');

  zip.file('word/document.xml', xml);
  const out = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync('public/templates/sbi_alias_general_template.docx', out);
  console.log('Saved public/templates/sbi_alias_general_template.docx');
}
buildSbiTemplate();
