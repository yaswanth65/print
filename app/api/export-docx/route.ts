import { NextRequest, NextResponse } from 'next/server';
import { promises as fsp } from 'node:fs';
import { join } from 'node:path';
import JSZip from 'jszip';

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

  const values = body.values || {};

  // CDMA Death Correction
  if (body.template === 'cdma_death_correction') {
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

  // Lease Deed
  if (body.template === 'lease_deed') {
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

  // SBI Alias General
  if (body.template === 'sbi_alias_general') {
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

  // Single Women Affidavit
  if (body.template === 'single_women_affidavit') {
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

  return NextResponse.json({ error: 'Unsupported template for DOCX export' }, { status: 400 });
}
