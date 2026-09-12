// Dev-only engine test: builds a blank + filled DOCX pair, runs the structural
// diff, renders with values, verifies fidelity of the output document.
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType } from 'docx';
import { openDocx, readPartText } from '../lib/docx/zip';
import { buildStructuralTemplate } from '../lib/docx/template';
import { renderDocx } from '../lib/docx/render';
import { extractTextFromBuffer } from '../lib/extract';

const R = (text: string, o: Record<string, unknown> = {}) => new TextRun({ text, ...o });

const blankRuns: Record<string, TextRun[]> = {
  B: [R('I, '), R('_______________'), R(', son of '), R('_______________'), R(', aged '), R('__'), R(' years, resident of '), R('________________________________________'), R(', do hereby solemnly affirm and state as follows:')],
  C: [R('Gender: '), R('☐'), R(' Male     '), R('☐'), R(' Female')],
  D: [R('Date: '), R('__/__/____')],
  T: [R('________')],
  T2: [R('_______________')],
};

const filledRuns: Record<string, TextRun[]> = {
  B: [R('I, '), R('K. Sona Bai'), R(', son of '), R('Ramu'), R('Kumar'), R(', aged '), R('32'), R(' years, resident of '), R('H.No. 12-3/4, Main Road, Guntur, Andhra Pradesh'), R(', do hereby solemnly affirm and state as follows:')],
  C: [R('Gender: '), R('☑'), R(' Male     '), R('☐'), R(' Female')],
  D: [R('Date: '), R('12/03/2025')],
  T: [R('A12345')],
  T2: [R('_______________')],
};

const cell = (run: TextRun) =>
  new TableCell({ children: [new Paragraph({ children: [run] })] });

async function buildDoc(kind: 'blank' | 'filled'): Promise<Buffer> {
  const src = kind === 'blank' ? blankRuns : filledRuns;
  const main = src as Record<string, TextRun[]>;
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, children: [R('AFFIDAVIT', { bold: true, size: 32 })] }),
          new Paragraph({ children: main.B }),
          new Paragraph({ children: main.C }),
          new Paragraph({ children: main.D }),
          new Table({
            rows: [
              new TableRow({ children: [cell(R('Roll No.')), cell(main.T[0]!)] }),
              new TableRow({ children: [cell(R('Name')), cell(main.T2[0]!)] }),
            ],
          }),
          new Paragraph({ children: [R('Signature of Deponent')] }),
        ],
      },
    ],
  });
  return Packer.toBuffer(doc);
}

async function countParagraphs(zip: any): Promise<number> {
  const xml = await readPartText(zip, 'word/document.xml');
  return (xml.match(/<w:p[ >]/g) ?? []).length;
}

async function main() {
  const [blank, filled] = await Promise.all([buildDoc('blank'), buildDoc('filled')]);

  const out = await buildStructuralTemplate(blank, filled);
  console.log('=== FIELDS ===');
  for (const f of out.templateDef.fields) {
    console.log(`  ${f.key} | ${f.type} | label="${f.label}"${f.options ? ` | ${f.options.join(',')}` : ''}${f.positionTokens ? ` | pos=${f.positionTokens.join(' ')}` : ''}`);
  }

  const blockCount = await countParagraphs(await openDocx(blank));

  const values: Record<string, string> = {
    applicant_name: 'K. SONA BAI',
    son_of: 'Ramu Kumar',
    aged: '32',
    resident_of: 'H.No. 12-3/4, Main Road, Guntur, Andhra Pradesh',
    date: '12/03/2025',
    value: 'A12345',
  };
  for (const f of out.templateDef.fields) {
    if (values[f.key] === undefined) {
      values[f.key] = f.type === 'checkbox' ? (f.options?.[0] ?? '') : `[${f.key}]`;
    }
  }

  const rendered = await renderDocx(out.templateZip, values, out.templateDef.fields);
  const rz = await openDocx(rendered);
  const rXml = await readPartText(rz, 'word/document.xml');

  const noTokens = !/{{/.test(rXml);
  const sameParaCount = blockCount === (await countParagraphs(rz));
  const hasValues = ['K. SONA BAI', 'Ramu Kumar', '32', 'A12345'].every((s) => rXml.includes(s));
  const boxChecked = rXml.includes('☑');

  console.log('=== CHECKS ===');
  console.log('  no leftover tokens     :', noTokens);
  console.log('  paragraph count same   :', sameParaCount, `(${blockCount})`);
  console.log('  all values present     :', hasValues);
  console.log('  checkbox ☑ present     :', boxChecked);

  const ext = await extractTextFromBuffer(rendered, 'out.docx');
  console.log('  text extract has values:', ['K. SONA BAI', 'Ramu Kumar', 'A12345', '☑'].every((s) => ext.text.includes(s)));

  const { writeFile } = await import('node:fs/promises');
  await writeFile('scripts/out-rendered.docx', rendered);
  console.log('  wrote scripts/out-rendered.docx');

  const allOk = noTokens && sameParaCount && hasValues && boxChecked;
  console.log(allOk ? '\nPASS' : '\nFAIL');
  process.exit(allOk ? 0 : 1);
}

void main();