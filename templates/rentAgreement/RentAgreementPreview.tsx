import React from 'react';
import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';
import { formatTeluguValue } from '@/lib/teluguTransliteration';
import styles from './rentAgreement.module.css';

export const RentAgreementPreview: React.FC = () => {
  const { data, language } = useDocumentStore();
  const isTe = language === 'te';
  const d = data.rent_agreement;
  const t = 'rent_agreement';

  const ownerName = formatTeluguValue(d.ownerName, language);
  const tenantName = formatTeluguValue(d.tenantName, language);
  const propertyAddress = formatTeluguValue(d.propertyAddress, language);

  return (
    <div className={styles['rent-container']}>
      <div className="document-paper">
        <div>
          <div className="${styles['rent-stamp']} print:hidden">
            <span className="text-gray-400 font-sans text-xs tracking-widest uppercase font-semibold">
              {isTe ? '[ 100 రూ. నాన్-జ్యుడీషియల్ స్టాంప్ పేపర్ స్థలము ]' : '[ 100 Rs. Non-Judicial Stamp Paper Space ]'}
            </span>
          </div>

          <h1 className={styles['rent-title']}>
            {isTe ? 'గృహ అద్దె ఒప్పంద పత్రము' : 'RESIDENTIAL RENT AGREEMENT'}
          </h1>

          <p className={styles['rent-intro']}>
            {isTe ? (
              <>
                ఈ అద్దె ఒప్పందము తేది: <EditableField template={t} fieldPath="agreementDate" value={d.agreementDate} className="font-bold" /> నాడు, మొదటి పక్షమైన యజమాని (ఓనర్) <span className="font-bold uppercase">{ownerName}</span> (ఇకపై 'లెస్సర్/యజమాని' అని పిలువబడును) మరియు రెండవ పక్షమైన అద్దెదారు <span className="font-bold uppercase">{tenantName}</span> (ఇకపై 'లెస్సీ/అద్దెదారు' అని పిలువబడును) ల మధ్య కుదుర్చుకోబడినది.
              </>
            ) : (
              <>
                This Rent Agreement is made and executed on this <EditableField template={t} fieldPath="agreementDate" value={d.agreementDate} className="font-bold" />, by and between{' '}
                <EditableField template={t} fieldPath="ownerName" value={d.ownerName} className="font-bold uppercase" /> (hereinafter called the 'LESSOR / OWNER') of the FIRST PART, and{' '}
                <EditableField template={t} fieldPath="tenantName" value={d.tenantName} className="font-bold uppercase" /> (hereinafter called the 'LESSEE / TENANT') of the SECOND PART.
              </>
            )}
          </p>

          <p className="mb-4 text-justify font-medium">
            {isTe
              ? 'సదరు ఒప్పంద ఆస్తి చిరునామా: '
              : 'WHEREAS the Lessor is absolute owner of property situated at: '}
            <span className="font-bold uppercase">{propertyAddress}</span>.
          </p>

          <div className="space-y-3 text-justify leading-relaxed">
            <h3 className="font-bold text-sm uppercase underline">{isTe ? 'నిబంధనలు మరియు షరతులు:' : 'TERMS AND CONDITIONS:'}</h3>
            <p>
              {isTe
                ? '1. ఈ అద్దె ఒప్పంద కాలపరిమితి మొత్తం ' + d.durationMonths + ' నెలలు మాత్రమే అమలులో ఉండును. ఇరు పక్షముల పరస్పర అంగీకారముతో దీనిని పొడిగించవచ్చును.'
                : '1. That the tenancy is for a fixed period of ' + d.durationMonths + ' months commencing from the date of agreement.'}
            </p>
            <p>
              {isTe
                ? '2. అద్దెదారు నెలకు రూ. ' + d.monthlyRent + '/- లను ప్రతి నెలా ' + d.rentDueDay + 'వ తేదీ లోపు చెల్లించవలెను.'
                : '2. That the Lessee shall pay a monthly rent of Rs. ' + d.monthlyRent + '/- payable in advance on or before ' + d.rentDueDay + 'th of every month.'}
            </p>
            <p>
              {isTe
                ? '3. అద్దెదారు యజమానికి రూ. ' + d.securityDeposit + '/- లను వడ్డీ లేని రీఫండబుల్ సెక్యూరిటీ డిపాజిట్‌గా చెల్లించినారు. అద్దె ఇల్లు ఖాళీ చేసే సమయంలో ఈ మొత్తము తిరిగి చెల్లించబడును.'
                : '3. That the Lessee has deposited an interest-free refundable Security Deposit of Rs. ' + d.securityDeposit + '/- with the Lessor.'}
            </p>
            <p>
              {isTe
                ? '4. విద్యుత్ బిల్లు మరియు నీటి బిల్లులు అద్దెదారు స్వయంగా వినియోగం ఆధారంగా చెల్లించవలెను.'
                : '4. That electricity charges and water bills shall be paid regularly by the Tenant as per meter readings.'}
            </p>
            <p>
              {isTe
                ? '5. ఇల్లు ఖాళీ చేయదలచినచో ఇరు పక్షములలో ఎవరైనా ఒక నెల ముందు నోటీసు ఇవ్వవలెను.'
                : '5. That either party may terminate this tenancy by serving one month advance written notice.'}
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-300 grid grid-cols-2 gap-8">
          <div>
            <p className="font-bold uppercase">{ownerName}</p>
            <p className="text-[9pt] text-gray-600">{isTe ? 'మొదటి పక్షం (యజమాని సంతకము)' : 'FIRST PARTY (LESSOR / OWNER)'}</p>
          </div>
          <div className="text-right">
            <p className="font-bold uppercase">{tenantName}</p>
            <p className="text-[9pt] text-gray-600">{isTe ? 'రెండవ పక్షం (అద్దెదారు సంతకము)' : 'SECOND PARTY (LESSEE / TENANT)'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
