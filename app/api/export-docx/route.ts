import { NextRequest, NextResponse } from 'next/server';
import { promises as fsp } from 'node:fs';
import { join } from 'node:path';
import JSZip from 'jszip';
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

function escapeXml(str: any): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function POST(req: NextRequest) {
  let body: {
    template?: string;
    values?: Record<string, any>;
  } = {};

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const template = body.template || 'rent_agreement';
  const values = body.values || {};

  // 1. CDMA Death Correction (Uses existing template)
  if (template === 'cdma_death_correction') {
    const templatePath = join(process.cwd(), 'public', 'templates', 'cdma_death_correction_template.docx');
    const templateBuf = await fsp.readFile(templatePath);
    const zip = await JSZip.loadAsync(templateBuf);
    let xml = await zip.file('word/document.xml')!.async('string');

    const replaceMap: Record<string, string> = {
      '{{district}}': escapeXml(values.district),
      '{{registrationUnitId}}': escapeXml(values.registrationUnitId),
      '{{registrationNumber}}': escapeXml(values.registrationNumber),
      '{{registrationYear}}': escapeXml(values.registrationYear),
      '{{deathYear}}': escapeXml(values.deathYear),
      '{{changedChildSurname}}': escapeXml(values.changedChildSurname),
      '{{changedChildName}}': escapeXml(values.changedChildName),
      '{{changedDateOfDeath}}': escapeXml(values.changedDateOfDeath),
      '{{changedFatherSurname}}': escapeXml(values.changedFatherSurname),
      '{{changedFatherName}}': escapeXml(values.changedFatherName),
      '{{changedMotherSurname}}': escapeXml(values.changedMotherSurname),
      '{{changedMotherName}}': escapeXml(values.changedMotherName),
      '{{changedDeathPlace}}': escapeXml(values.changedDeathPlace),
      '{{changedDeathAddressLine1}}': escapeXml(values.changedDeathAddressLine1),
      '{{changedDeathAddressLine2}}': escapeXml(values.changedDeathAddressLine2),
      '{{changedDeathAddressLine3}}': escapeXml(values.changedDeathAddressLine3),
      '{{changedPermAddressLine1}}': escapeXml(values.changedPermAddressLine1),
      '{{changedPermAddressLine2}}': escapeXml(values.changedPermAddressLine2),
      '{{changedPermAddressLine3}}': escapeXml(values.changedPermAddressLine3),
      '{{informantName}}': escapeXml(values.informantName),
      '{{informantAddress1}}': escapeXml(values.informantAddress1),
      '{{informantAddress2}}': escapeXml(values.informantAddress2),
      '{{informantAddress3}}': escapeXml(values.informantAddress3),
      '{{mobileNumber}}': escapeXml(values.mobileNumber),
      '{{emailId}}': escapeXml(values.emailId),
      '{{remarks}}': escapeXml(values.remarks),
      '{{pincode}}': escapeXml(values.pincode),
      '{{purposeOfCertificate}}': escapeXml(values.purposeOfCertificate),
      '{{noOfCopies}}': escapeXml(values.noOfCopies),
    };

    const loc = values.locationType || '';
    replaceMap['{{box_p9_1}}'] = loc === 'Greater Municipality' ? '☑' : '☐';
    replaceMap['{{box_p9_2}}'] = loc === 'Municipality' ? '☑' : '☐';
    replaceMap['{{box_p9_3}}'] = loc === 'Municipal Corporation' ? '☑' : '☐';
    replaceMap['{{box_p9_4}}'] = loc === 'Gram Panchayat' ? '☑' : '☐';

    const g = values.gender || '';
    replaceMap['{{box_p9_5}}'] = g === 'Male' ? '☑' : '☐';
    replaceMap['{{box_p9_6}}'] = g === 'Female' ? '☑' : '☐';

    const upName = values.updateDeceasedName || 'No';
    replaceMap['{{box_p11_1}}'] = upName === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p11_2}}'] = upName === 'No' ? '☑' : '☐';

    const upDate = values.updateDateOfDeath || 'No';
    replaceMap['{{box_p13_1}}'] = upDate === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p13_2}}'] = upDate === 'No' ? '☑' : '☐';

    const upGender = values.updateGender || 'No';
    replaceMap['{{box_p13_3}}'] = upGender === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p13_4}}'] = upGender === 'No' ? '☑' : '☐';

    const chGender = values.changedGender || '';
    replaceMap['{{box_p13_5}}'] = chGender === 'Male' ? '☑' : '☐';
    replaceMap['{{box_p13_6}}'] = chGender === 'Female' ? '☑' : '☐';

    const upFather = values.updateFatherName || 'No';
    replaceMap['{{box_p14_1}}'] = upFather === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p14_2}}'] = upFather === 'No' ? '☑' : '☐';

    const upMother = values.updateMotherName || 'No';
    replaceMap['{{box_p16_1}}'] = upMother === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p16_2}}'] = upMother === 'No' ? '☑' : '☐';

    const upPlace = values.updateDeathPlace || 'No';
    replaceMap['{{box_p18_1}}'] = upPlace === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p18_2}}'] = upPlace === 'No' ? '☑' : '☐';

    const upDeathAddr = values.updateDeathAddress || 'No';
    replaceMap['{{box_p20_1}}'] = upDeathAddr === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p20_2}}'] = upDeathAddr === 'No' ? '☑' : '☐';

    const upPermAddr = values.updatePermAddress || 'No';
    replaceMap['{{box_p21_1}}'] = upPermAddr === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p21_2}}'] = upPermAddr === 'No' ? '☑' : '☐';

    const rel = values.informantRelation || '';
    replaceMap['{{box_relation_1}}'] = rel === 'S/o' ? '☑' : '☐';
    replaceMap['{{box_relation_2}}'] = rel === 'D/o' ? '☑' : '☐';
    replaceMap['{{box_relation_3}}'] = rel === 'w/o' ? '☑' : '☐';
    replaceMap['{{box_relation_4}}'] = rel === 'H/o' ? '☑' : '☐';
    replaceMap['{{box_relation_5}}'] = rel === 'M/o' ? '☑' : '☐';
    replaceMap['{{box_relation_6}}'] = rel === 'F/O' ? '☑' : '☐';
    replaceMap['{{box_relation_7}}'] = rel === 'C/o' ? '☑' : '☐';

    const del = values.deliveryType || '';
    replaceMap['{{box_delivery_1}}'] = del === 'Manual / In Person' ? '☑' : '☐';
    replaceMap['{{box_delivery_2}}'] = del.includes('Local') && !del.includes('Nonlocal') ? '☑' : '☐';
    replaceMap['{{box_delivery_3}}'] = del.includes('Nonlocal') ? '☑' : '☐';

    for (const [k, v] of Object.entries(replaceMap)) {
      xml = xml.replaceAll(k, v);
    }

    zip.file('word/document.xml', xml);
    const output = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(new Uint8Array(output), {
      headers: {
        'Content-Type': DOCX_MIME,
        'Content-Disposition': 'attachment; filename="CDMA_Death_Corrections_Application_Form.docx"',
        'Cache-Control': 'no-store',
      },
    });
  }

  // 2. Lease Deed (Uses existing template)
  if (template === 'lease_deed') {
    const templatePath = join(process.cwd(), 'public', 'templates', 'lease_deed_template.docx');
    const templateBuf = await fsp.readFile(templatePath);
    const zip = await JSZip.loadAsync(templateBuf);
    let xml = await zip.file('word/document.xml')!.async('string');

    const replaceMap: Record<string, string> = {
      '{{agreementDay}}': escapeXml(values.agreementDay || '18'),
      '{{agreementMonthYear}}': escapeXml(values.agreementMonthYear || '2022'),
      '{{wefDate}}': escapeXml(values.wefDate || '01/10/2022'),
      '{{lessorName}}': escapeXml(values.lessorName),
      '{{lessorFatherName}}': escapeXml(values.lessorFatherName),
      '{{lessorAge}}': escapeXml(values.lessorAge),
      '{{lessorOccupation}}': escapeXml(values.lessorOccupation),
      '{{lessorAddress}}': escapeXml(values.lessorAddress),
      '{{lesseeName}}': escapeXml(values.lesseeName),
      '{{lesseeFatherName}}': escapeXml(values.lesseeFatherName),
      '{{lesseeAge}}': escapeXml(values.lesseeAge),
      '{{lesseeOccupation}}': escapeXml(values.lesseeOccupation),
      '{{lesseeAddress}}': escapeXml(values.lesseeAddress),
      '{{doorNo}}': escapeXml(values.doorNo),
      '{{road}}': escapeXml(values.road),
      '{{landmark}}': escapeXml(values.landmark),
      '{{village}}': escapeXml(values.village),
      '{{mandal}}': escapeXml(values.mandal),
      '{{district}}': escapeXml(values.district),
      '{{monthlyRent}}': escapeXml(values.monthlyRent),
      '{{rentWords}}': escapeXml(values.rentWords),
      '{{rentDueDay}}': escapeXml(values.rentDueDay || '5th'),
      '{{extensionYears}}': escapeXml(values.extensionYears || '5'),
      '{{leasePeriod}}': escapeXml(values.leasePeriod || '5 years'),
      '{{commencementDate}}': escapeXml(values.commencementDate),
      '{{endDate}}': escapeXml(values.endDate),
      '{{businessName}}': escapeXml(values.businessName),
      '{{advanceAmount}}': escapeXml(values.advanceAmount),
      '{{advanceWords}}': escapeXml(values.advanceWords),
      '{{lessorSignature}}': escapeXml(values.lessorName),
      '{{lesseeSignature}}': escapeXml(values.lesseeName),
    };

    for (const [k, v] of Object.entries(replaceMap)) {
      xml = xml.replaceAll(k, v);
    }

    zip.file('word/document.xml', xml);
    const output = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(new Uint8Array(output), {
      headers: {
        'Content-Type': DOCX_MIME,
        'Content-Disposition': 'attachment; filename="LEASE_DEED.docx"',
        'Cache-Control': 'no-store',
      },
    });
  }

  // 3. SBI Alias General (Uses existing template)
  if (template === 'sbi_alias_general') {
    const templatePath = join(process.cwd(), 'public', 'templates', 'sbi_alias_general_template.docx');
    const templateBuf = await fsp.readFile(templatePath);
    const zip = await JSZip.loadAsync(templateBuf);
    let xml = await zip.file('word/document.xml')!.async('string');

    const replaceMap: Record<string, string> = {
      '{{bankName}}': escapeXml(values.bankName || 'STATE BANK OF INDIA'),
      '{{branchName}}': escapeXml(values.branchName || 'ARMOOR'),
      '{{assumedName}}': escapeXml(values.assumedName),
      '{{previousName}}': escapeXml(values.previousName),
      '{{relation}}': escapeXml(values.relation || 'SON OF'),
      '{{relativeName}}': escapeXml(values.relativeName),
      '{{previousDocType}}': escapeXml(values.previousDocType || 'Patta Pass Book'),
      '{{previousDocNumber}}': escapeXml(values.previousDocNumber),
      '{{aadharNumber}}': escapeXml(values.aadharNumber),
      '{{age}}': escapeXml(values.age),
      '{{occupation}}': escapeXml(values.occupation),
      '{{hNo}}': escapeXml(values.hNo),
      '{{village}}': escapeXml(values.village),
      '{{mandal}}': escapeXml(values.mandal),
      '{{district}}': escapeXml(values.district),
      '{{pincode}}': escapeXml(values.pincode),
      '{{declarationDate}}': escapeXml(values.declarationDate),
      '{{declarationPlace}}': escapeXml(values.declarationPlace || 'Armoor'),
    };

    for (const [k, v] of Object.entries(replaceMap)) {
      xml = xml.replaceAll(k, v);
    }

    zip.file('word/document.xml', xml);
    const output = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(new Uint8Array(output), {
      headers: {
        'Content-Type': DOCX_MIME,
        'Content-Disposition': 'attachment; filename="SBI_ALIAS_DECLARATION_AFFIDAVIT.docx"',
        'Cache-Control': 'no-store',
      },
    });
  }

  // 4. Single Women Affidavit (Uses existing template)
  if (template === 'single_women_affidavit') {
    const templatePath = join(process.cwd(), 'public', 'templates', 'single_women_affidavit_template.docx');
    const templateBuf = await fsp.readFile(templatePath);
    const zip = await JSZip.loadAsync(templateBuf);
    let xml = await zip.file('word/document.xml')!.async('string');

    const replaceMap: Record<string, string> = {
      '{{applicantName}}': escapeXml(values.applicantName),
      '{{relation}}': escapeXml(values.relation || 'DAUGHTER OF'),
      '{{relativeName}}': escapeXml(values.relativeName),
      '{{age}}': escapeXml(values.age),
      '{{occupation}}': escapeXml(values.occupation),
      '{{hNo}}': escapeXml(values.hNo),
      '{{village}}': escapeXml(values.village),
      '{{mandal}}': escapeXml(values.mandal),
      '{{district}}': escapeXml(values.district || 'Nizamabad'),
      '{{state}}': escapeXml(values.state || 'Telangana'),
      '{{pincode}}': escapeXml(values.pincode),
      '{{aadharNumber}}': escapeXml(values.aadharNumber),
      '{{exHusbandName}}': escapeXml(values.exHusbandName),
      '{{exHusbandFatherName}}': escapeXml(values.exHusbandFatherName),
      '{{exHusbandVillage}}': escapeXml(values.exHusbandVillage),
      '{{exHusbandMandal}}': escapeXml(values.exHusbandMandal),
      '{{marriageDate}}': escapeXml(values.marriageDate),
      '{{divorceTime}}': escapeXml(values.divorceTime),
      '{{affidavitDate}}': escapeXml(values.affidavitDate),
      '{{affidavitPlace}}': escapeXml(values.affidavitPlace || 'ARMOOR'),
    };

    for (const [k, v] of Object.entries(replaceMap)) {
      xml = xml.replaceAll(k, v);
    }

    zip.file('word/document.xml', xml);
    const output = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(new Uint8Array(output), {
      headers: {
        'Content-Type': DOCX_MIME,
        'Content-Disposition': 'attachment; filename="SINGLE_WOMEN_ONTARI_MAHILA_AFFIDAVIT.docx"',
        'Cache-Control': 'no-store',
      },
    });
  }

  // 5. CV / Resume (Generated natively via docx)
  if (template === 'cv_resume') {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: values.fullName || 'CURRICULUM VITAE',
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 },
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: `Address: ${values.address || 'India'} | ` }),
                new TextRun({ text: `Phone: ${values.phone || ''} | ` }),
                new TextRun({ text: `Email: ${values.email || ''}` }),
              ],
              spacing: { after: 240 },
            }),
            new Paragraph({
              text: 'PROFESSIONAL SUMMARY',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 180, after: 80 },
            }),
            new Paragraph({
              text: values.summary || 'Accomplished engineering professional with vast technical acumen.',
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: 'WORK EXPERIENCE',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 180, after: 80 },
            }),
            ...((values.workExperience || []).flatMap((work: any) => [
              new Paragraph({
                children: [
                  new TextRun({ text: work.role || 'Role', bold: true }),
                  new TextRun({ text: ` — ${work.company || ''} (${work.duration || ''})`, italics: true }),
                ],
                spacing: { before: 100, after: 40 },
              }),
              ...((work.points || []).map((pt: string) =>
                new Paragraph({
                  text: `• ${pt}`,
                  spacing: { after: 40 },
                  indent: { left: 400 },
                })
              )),
            ])),
            new Paragraph({
              text: 'EDUCATION',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 180, after: 80 },
            }),
            ...((values.education || []).flatMap((edu: any) => [
              new Paragraph({
                children: [
                  new TextRun({ text: edu.degree || 'Degree', bold: true }),
                  new TextRun({ text: ` — ${edu.institution || ''} (${edu.duration || ''})`, italics: true }),
                ],
                spacing: { before: 100, after: 40 },
              }),
              ...((edu.details || []).map((det: string) =>
                new Paragraph({
                  text: `• ${det}`,
                  spacing: { after: 40 },
                  indent: { left: 400 },
                })
              )),
            ])),
            new Paragraph({
              text: 'TECHNICAL SKILLS & ADDITIONAL INFORMATION',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 180, after: 80 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '• Skills: ', bold: true }),
                new TextRun({ text: values.additionalInfo?.technicalSkills || 'Technical proficiencies' }),
              ],
              spacing: { after: 60 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '• Languages: ', bold: true }),
                new TextRun({ text: values.additionalInfo?.languages || 'English, Telugu, Hindi' }),
              ],
              spacing: { after: 60 },
            }),
          ],
        },
      ],
    });

    const output = await Packer.toBuffer(doc);
    return new NextResponse(new Uint8Array(output), {
      headers: {
        'Content-Type': DOCX_MIME,
        'Content-Disposition': 'attachment; filename="CURRICULUM_VITAE.docx"',
        'Cache-Control': 'no-store',
      },
    });
  }

  // 6. Identity Card (Generated natively via docx)
  if (template === 'identity_card') {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: values.headerGovt || 'GOVERNMENT OF TELANGANA',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: values.headerDept || 'PANCHAYATHRAJ DEPARTMENT',
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: values.cardTitle || 'OFFICIAL IDENTITY CARD',
              heading: HeadingLevel.HEADING_3,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Name of the Cardholder: ', bold: true }),
                new TextRun({ text: values.name || '' }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Father's Name / Relative: ", bold: true }),
                new TextRun({ text: values.fatherName || '' }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Date of Birth: ', bold: true }),
                new TextRun({ text: values.dob || '' }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Designation / ID: ', bold: true }),
                new TextRun({ text: values.designation || '' }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Place of Working: ', bold: true }),
                new TextRun({ text: values.placeOfWorking || '' }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Address: ', bold: true }),
                new TextRun({ text: values.back?.address || values.address || '' }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Issuing Authority: ', bold: true }),
                new TextRun({ text: values.authorityTitle || 'MPDO' }),
              ],
            }),
          ],
        },
      ],
    });

    const output = await Packer.toBuffer(doc);
    return new NextResponse(new Uint8Array(output), {
      headers: {
        'Content-Type': DOCX_MIME,
        'Content-Disposition': 'attachment; filename="GOVERNMENT_IDENTITY_CARD.docx"',
        'Cache-Control': 'no-store',
      },
    });
  }

  // 7. General Sworn Affidavit (Generated natively via docx)
  if (template === 'affidavit') {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'AFFIDAVIT',
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `( For ${values.purpose || 'General Proof'} )`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `BEFORE THE NOTARY PUBLIC AT ${(values.place || 'ARMOOR').toUpperCase()}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 240 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'I, ' }),
                new TextRun({ text: values.deponent?.name || values.name || '', bold: true }),
                new TextRun({ text: `, aged about ${values.deponent?.age || values.age || '30'} years, child of ` }),
                new TextRun({ text: values.deponent?.fatherName || values.fatherName || '', bold: true }),
                new TextRun({ text: `, presently residing at ${values.deponent?.address || values.address || ''}, do hereby solemnly affirm and state on oath as under:-` }),
              ],
              spacing: { after: 200 },
            }),
            ...((values.statements || [
              'That I am the deponent herein and conversant with the facts deposed to below.',
              'That the statements made herein are true to the best of my knowledge and belief.',
            ]).map((st: string, idx: number) =>
              new Paragraph({
                text: `${idx + 1}. ${st}`,
                spacing: { after: 120 },
                indent: { left: 400 },
              })
            )),
            new Paragraph({
              text: 'VERIFICATION',
              heading: HeadingLevel.HEADING_3,
              alignment: AlignmentType.CENTER,
              spacing: { before: 240, after: 100 },
            }),
            new Paragraph({
              text: `Verified at ${values.place || 'Armoor'} on this date that the contents of this affidavit are true and correct to the best of my knowledge and belief.`,
              spacing: { after: 240 },
            }),
            new Paragraph({
              text: 'DEPONENT',
              alignment: AlignmentType.RIGHT,
              spacing: { before: 200 },
            }),
          ],
        },
      ],
    });

    const output = await Packer.toBuffer(doc);
    return new NextResponse(new Uint8Array(output), {
      headers: {
        'Content-Type': DOCX_MIME,
        'Content-Disposition': 'attachment; filename="AFFIDAVIT.docx"',
        'Cache-Control': 'no-store',
      },
    });
  }

  // 8. Residential Rent Agreement (Generated natively via docx)
  if (template === 'rent_agreement') {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'RESIDENTIAL RENTAL AGREEMENT',
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 180 },
            }),
            new Paragraph({
              text: `This Agreement of Rental is entered into at ${values.place || 'New Delhi'} on this ${values.date || new Date().toISOString().split('T')[0]} by and between:`,
              spacing: { after: 180 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'LANDLORD / FIRST PARTY: ', bold: true }),
                new TextRun({ text: `${values.landlord?.name || 'Landlord'}, aged ${values.landlord?.age || ''} years, S/o ${values.landlord?.fatherName || ''}, R/o ${values.landlord?.address || ''}.` }),
              ],
              spacing: { after: 140 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'AND TENANT / SECOND PARTY: ', bold: true }),
                new TextRun({ text: `${values.tenant?.name || 'Tenant'}, aged ${values.tenant?.age || ''} years, S/o ${values.tenant?.fatherName || ''}, R/o ${values.tenant?.address || ''}.` }),
              ],
              spacing: { after: 180 },
            }),
            new Paragraph({
              text: 'TERMS AND CONDITIONS:',
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 120, after: 80 },
            }),
            new Paragraph({
              text: `1. Premises: The First Party hereby leases out residential premises situated at ${values.propertyAddress || 'Residential Flat'}.`,
              spacing: { after: 100 },
              indent: { left: 300 },
            }),
            new Paragraph({
              text: `2. Rent: The monthly rent agreed is Rs. ${values.rentAmount || '25,000'}/- (${values.rentAmountWords || 'Rupees Twenty Five Thousand only'}).`,
              spacing: { after: 100 },
              indent: { left: 300 },
            }),
            new Paragraph({
              text: `3. Security Deposit: The Tenant has deposited Rs. ${values.securityDeposit || '50,000'}/- as refundable interest-free security deposit.`,
              spacing: { after: 100 },
              indent: { left: 300 },
            }),
            new Paragraph({
              text: `4. Tenure: The agreement shall remain in force for ${values.durationMonths || '11'} months commencing from ${values.startDate || '01/06/2024'}.`,
              spacing: { after: 100 },
              indent: { left: 300 },
            }),
            new Paragraph({
              text: `5. Notice Period: Either party may terminate with ${values.noticePeriodDays || '30'} days written notice.`,
              spacing: { after: 240 },
              indent: { left: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'FIRST PARTY (LANDLORD)                                  SECOND PARTY (TENANT)', bold: true }),
              ],
              spacing: { before: 300 },
            }),
          ],
        },
      ],
    });

    const output = await Packer.toBuffer(doc);
    return new NextResponse(new Uint8Array(output), {
      headers: {
        'Content-Type': DOCX_MIME,
        'Content-Disposition': 'attachment; filename="RENT_AGREEMENT.docx"',
        'Cache-Control': 'no-store',
      },
    });
  }

  // 9. Generic Fallback for Any Other Template (Sale Deed, Plot Agreement, SSC Memo, etc.)
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: (template || 'LEGAL DOCUMENT').toUpperCase().replace(/_/g, ' '),
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          ...Object.entries(values).map(([k, v]) => {
            if (typeof v === 'object' && v !== null) {
              return new Paragraph({
                children: [
                  new TextRun({ text: `${k}: `, bold: true }),
                  new TextRun({ text: JSON.stringify(v) }),
                ],
                spacing: { after: 80 },
              });
            }
            return new Paragraph({
              children: [
                new TextRun({ text: `${k}: `, bold: true }),
                new TextRun({ text: String(v) }),
              ],
              spacing: { after: 80 },
            });
          }),
        ],
      },
    ],
  });

  const output = await Packer.toBuffer(doc);
  return new NextResponse(new Uint8Array(output), {
    headers: {
      'Content-Type': DOCX_MIME,
      'Content-Disposition': `attachment; filename="${template.toUpperCase()}.docx"`,
      'Cache-Control': 'no-store',
    },
  });
}
