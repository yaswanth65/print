import { NextRequest, NextResponse } from 'next/server';
import { promises as fsp } from 'node:fs';
import { join } from 'node:path';
import JSZip from 'jszip';
import { renderDocx } from '@/lib/docx/render';
import { getTemplate } from '@/lib/templateRepo';
import type { DocxTemplateDef } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export async function POST(req: NextRequest) {
  let body: {
    template?: string;
    formId?: string;
    values?: Record<string, any>;
  } = {};

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const values = body.values || {};

  // Case 1: Uploaded Dynamic Form ID
  if (body.formId) {
    const row = await getTemplate(body.formId);
    if (!row) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

    const def = row.template_def as DocxTemplateDef | null;
    if (!def || def.kind !== 'docx') {
      return NextResponse.json({ error: 'Not a structural DOCX template' }, { status: 400 });
    }

    const templatePath = join(process.cwd(), 'uploads', body.formId, 'template.docx');
    let templateZip: Buffer;
    try {
      templateZip = await fsp.readFile(templatePath);
    } catch {
      return NextResponse.json({ error: 'Stored template file is missing' }, { status: 500 });
    }

    const output = await renderDocx(templateZip, values, def.fields);
    const filename = (row.title || 'document').replace(/[^a-zA-Z0-9 _-]/g, '').replace(/\s+/g, '_') || 'document';

    return new NextResponse(new Uint8Array(output), {
      headers: {
        'Content-Type': DOCX_MIME,
        'Content-Disposition': `attachment; filename="${filename}.docx"`,
        'Cache-Control': 'no-store',
      },
    });
  }

  // Case 2: Built-in Templates (CDMA Death Correction, Lease Deed, etc.)
  if (body.template === 'cdma_death_correction') {
    const templatePath = join(process.cwd(), 'public', 'templates', 'cdma_death_correction_template.docx');
    const templateBuf = await fsp.readFile(templatePath);
    const zip = await JSZip.loadAsync(templateBuf);
    let xml = await zip.file('word/document.xml')!.async('string');

    // Substitute direct tokens
    const replaceMap: Record<string, string> = {
      '{{district}}': values.district || '',
      '{{registrationUnitId}}': values.registrationUnitId || '',
      '{{registrationNumber}}': values.registrationNumber || '',
      '{{registrationYear}}': values.registrationYear || '',
      '{{deathYear}}': values.deathYear || '',
      '{{changedChildSurname}}': values.changedChildSurname || '',
      '{{changedChildName}}': values.changedChildName || '',
      '{{changedDateOfDeath}}': values.changedDateOfDeath || '',
      '{{changedFatherSurname}}': values.changedFatherSurname || '',
      '{{changedFatherName}}': values.changedFatherName || '',
      '{{changedMotherSurname}}': values.changedMotherSurname || '',
      '{{changedMotherName}}': values.changedMotherName || '',
      '{{changedDeathPlace}}': values.changedDeathPlace || '',
      '{{changedDeathAddressLine1}}': values.changedDeathAddressLine1 || '',
      '{{changedDeathAddressLine2}}': values.changedDeathAddressLine2 || '',
      '{{changedDeathAddressLine3}}': values.changedDeathAddressLine3 || '',
      '{{changedPermAddressLine1}}': values.changedPermAddressLine1 || '',
      '{{changedPermAddressLine2}}': values.changedPermAddressLine2 || '',
      '{{changedPermAddressLine3}}': values.changedPermAddressLine3 || '',
      '{{informantName}}': values.informantName || '',
      '{{informantAddress1}}': values.informantAddress1 || '',
      '{{informantAddress2}}': values.informantAddress2 || '',
      '{{informantAddress3}}': values.informantAddress3 || '',
      '{{mobileNumber}}': values.mobileNumber || '',
      '{{emailId}}': values.emailId || '',
      '{{remarks}}': values.remarks || '',
      '{{pincode}}': values.pincode || '',
      '{{purposeOfCertificate}}': values.purposeOfCertificate || '',
      '{{noOfCopies}}': values.noOfCopies || '',
    };

    // Location checkboxes: Greater Municipality(1), Municipality(2), Municipal Corporation(3), Gram Panchayat(4)
    const loc = values.locationType || '';
    replaceMap['{{box_p9_1}}'] = loc === 'Greater Municipality' ? '☑' : '☐';
    replaceMap['{{box_p9_2}}'] = loc === 'Municipality' ? '☑' : '☐';
    replaceMap['{{box_p9_3}}'] = loc === 'Municipal Corporation' ? '☑' : '☐';
    replaceMap['{{box_p9_4}}'] = loc === 'Gram Panchayat' ? '☑' : '☐';

    // Gender: Male(5), Female(6)
    const g = values.gender || '';
    replaceMap['{{box_p9_5}}'] = g === 'Male' ? '☑' : '☐';
    replaceMap['{{box_p9_6}}'] = g === 'Female' ? '☑' : '☐';

    // Update Deceased Name: Yes(1), No(2)
    const upName = values.updateDeceasedName || 'No';
    replaceMap['{{box_p11_1}}'] = upName === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p11_2}}'] = upName === 'No' ? '☑' : '☐';

    // Update Date of Death: Yes(1), No(2)
    const upDate = values.updateDateOfDeath || 'No';
    replaceMap['{{box_p13_1}}'] = upDate === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p13_2}}'] = upDate === 'No' ? '☑' : '☐';

    // Update Gender: Yes(3), No(4)
    const upGender = values.updateGender || 'No';
    replaceMap['{{box_p13_3}}'] = upGender === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p13_4}}'] = upGender === 'No' ? '☑' : '☐';

    // Changed Gender: Male(5), Female(6)
    const chGender = values.changedGender || '';
    replaceMap['{{box_p13_5}}'] = chGender === 'Male' ? '☑' : '☐';
    replaceMap['{{box_p13_6}}'] = chGender === 'Female' ? '☑' : '☐';

    // Update Father Name: Yes(1), No(2)
    const upFather = values.updateFatherName || 'No';
    replaceMap['{{box_p14_1}}'] = upFather === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p14_2}}'] = upFather === 'No' ? '☑' : '☐';

    // Update Mother Name: Yes(1), No(2)
    const upMother = values.updateMotherName || 'No';
    replaceMap['{{box_p16_1}}'] = upMother === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p16_2}}'] = upMother === 'No' ? '☑' : '☐';

    // Update Death Place: Yes(1), No(2)
    const upPlace = values.updateDeathPlace || 'No';
    replaceMap['{{box_p18_1}}'] = upPlace === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p18_2}}'] = upPlace === 'No' ? '☑' : '☐';

    // Update Death Address: Yes(1), No(2)
    const upDeathAddr = values.updateDeathAddress || 'No';
    replaceMap['{{box_p20_1}}'] = upDeathAddr === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p20_2}}'] = upDeathAddr === 'No' ? '☑' : '☐';

    // Update Perm Address: Yes(1), No(2)
    const upPermAddr = values.updatePermAddress || 'No';
    replaceMap['{{box_p21_1}}'] = upPermAddr === 'Yes' ? '☑' : '☐';
    replaceMap['{{box_p21_2}}'] = upPermAddr === 'No' ? '☑' : '☐';

    // Informant Relation: S/o(1), D/o(2), w/o(3), H/o(4), M/o(5), F/O(6), C/o(7)
    const rel = values.informantRelation || '';
    replaceMap['{{box_relation_1}}'] = rel === 'S/o' ? '☑' : '☐';
    replaceMap['{{box_relation_2}}'] = rel === 'D/o' ? '☑' : '☐';
    replaceMap['{{box_relation_3}}'] = rel === 'w/o' ? '☑' : '☐';
    replaceMap['{{box_relation_4}}'] = rel === 'H/o' ? '☑' : '☐';
    replaceMap['{{box_relation_5}}'] = rel === 'M/o' ? '☑' : '☐';
    replaceMap['{{box_relation_6}}'] = rel === 'F/O' ? '☑' : '☐';
    replaceMap['{{box_relation_7}}'] = rel === 'C/o' ? '☑' : '☐';

    // Delivery Type: Manual / In Person(1), Post − Local(2), Post − Nonlocal(3)
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

  if (body.template === 'lease_deed') {
    const templatePath = join(process.cwd(), 'public', 'templates', 'lease_deed_template.docx');
    const templateBuf = await fsp.readFile(templatePath);
    const zip = await JSZip.loadAsync(templateBuf);
    let xml = await zip.file('word/document.xml')!.async('string');

    const replaceMap: Record<string, string> = {
      '{{agreementDay}}': values.agreementDay || '18',
      '{{wefDate}}': values.wefDate || '01/10/2022',
      '{{lessorName}}': values.lessorName || '',
      '{{lessorFatherName}}': values.lessorFatherName || '',
      '{{lessorAge}}': values.lessorAge || '',
      '{{lessorAddress}}': values.lessorAddress || '',
      '{{lesseeName}}': values.lesseeName || '',
      '{{lesseeFatherName}}': values.lesseeFatherName || '',
      '{{lesseeAge}}': values.lesseeAge || '',
      '{{lesseeAddress}}': values.lesseeAddress || '',
      '{{doorNo}}': values.doorNo || '',
      '{{landmark}}': values.landmark || '',
      '{{village}}': values.village || '',
      '{{mandal}}': values.mandal || '',
      '{{monthlyRent}}': values.monthlyRent || '',
      '{{rentWords}}': values.rentWords || '',
      '{{commencementDate}}': values.commencementDate || '',
      '{{endDate}}': values.endDate || '',
      '{{businessName}}': values.businessName || '',
      '{{advanceAmount}}': values.advanceAmount || '',
      '{{advanceWords}}': values.advanceWords || '',
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

  if (body.template === 'sbi_alias_general') {
    const templatePath = join(process.cwd(), 'public', 'templates', 'sbi_alias_general_template.docx');
    const templateBuf = await fsp.readFile(templatePath);
    const zip = await JSZip.loadAsync(templateBuf);
    let xml = await zip.file('word/document.xml')!.async('string');

    const replaceMap: Record<string, string> = {
      '{{bankName}}': values.bankName || 'STATE BANK OF INDIA',
      '{{branchName}}': values.branchName || 'ARMOOR',
      '{{assumedName}}': values.assumedName || '',
      '{{previousName}}': values.previousName || '',
      '{{relation}}': values.relation || 'SON OF',
      '{{relativeName}}': values.relativeName || '',
      '{{previousDocType}}': values.previousDocType || 'Patta Pass Book',
      '{{previousDocNumber}}': values.previousDocNumber || '',
      '{{aadharNumber}}': values.aadharNumber || '',
      '{{age}}': values.age || '',
      '{{occupation}}': values.occupation || '',
      '{{hNo}}': values.hNo || '',
      '{{village}}': values.village || '',
      '{{mandal}}': values.mandal || '',
      '{{district}}': values.district || '',
      '{{pincode}}': values.pincode || '',
      '{{declarationDate}}': values.declarationDate || '',
      '{{declarationPlace}}': values.declarationPlace || '',
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

  if (body.template === 'single_women_affidavit') {
    const templatePath = join(process.cwd(), 'public', 'templates', 'single_women_affidavit_template.docx');
    const templateBuf = await fsp.readFile(templatePath);
    const zip = await JSZip.loadAsync(templateBuf);
    let xml = await zip.file('word/document.xml')!.async('string');

    const replaceMap: Record<string, string> = {
      '{{applicantName}}': values.applicantName || '',
      '{{relation}}': values.relation || 'DAUGHTER OF',
      '{{relativeName}}': values.relativeName || '',
      '{{age}}': values.age || '',
      '{{occupation}}': values.occupation || '',
      '{{hNo}}': values.hNo || '',
      '{{village}}': values.village || '',
      '{{mandal}}': values.mandal || '',
      '{{district}}': values.district || 'Nizamabad',
      '{{state}}': values.state || 'Telangana',
      '{{pincode}}': values.pincode || '',
      '{{aadharNumber}}': values.aadharNumber || '',
      '{{exHusbandName}}': values.exHusbandName || '',
      '{{exHusbandFatherName}}': values.exHusbandFatherName || '',
      '{{exHusbandVillage}}': values.exHusbandVillage || '',
      '{{exHusbandMandal}}': values.exHusbandMandal || '',
      '{{marriageDate}}': values.marriageDate || '',
      '{{divorceTime}}': values.divorceTime || '',
      '{{affidavitDate}}': values.affidavitDate || '',
      '{{affidavitPlace}}': values.affidavitPlace || 'ARMOOR',
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

  return NextResponse.json({ error: 'Unsupported template for direct DOCX export' }, { status: 400 });
}
