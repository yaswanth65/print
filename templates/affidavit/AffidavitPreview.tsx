import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';

export const AffidavitPreview = () => {
  const { data } = useDocumentStore();
  const d = data.affidavit;
  const t = 'affidavit';

  return (
    <div className="font-serif text-justify leading-relaxed text-[11pt]">
      
      {/* PAGE 1 */}
      <div className="document-paper pb-32 flex flex-col justify-between">
        <div>
           {/* Stamp Paper Placeholder */}
          <div className="w-full h-32 border-4 border-double border-gray-300 flex items-center justify-center mb-12 bg-gray-50 flex-col">
            <div className="text-xl font-bold tracking-widest text-gray-500">INDIA NON JUDICIAL</div>
          </div>

          <h1 className="text-2xl font-bold text-center underline uppercase tracking-wide mb-2">AFFIDAVIT</h1>
          <h2 className="text-center text-sm font-bold uppercase mb-10">(For <EditableField template={t} fieldPath="purpose" value={d.purpose} />)</h2>
          
          <p className="text-center font-bold mb-8 uppercase tracking-widest underline underline-offset-4">BEFORE THE NOTARY PUBLIC AT <EditableField template={t} fieldPath="place" value={d.place} className="uppercase" /></p>

          <p className="mb-6 indent-8">
            I, <EditableField template={t} fieldPath="deponent.name" value={d.deponent.name} className="font-bold" />, aged about <EditableField template={t} fieldPath="deponent.age" value={d.deponent.age} className="font-bold" /> years, child of <EditableField template={t} fieldPath="deponent.fatherName" value={d.deponent.fatherName} className="font-bold" />, presently residing at <EditableField template={t} fieldPath="deponent.address" value={d.deponent.address} className="font-bold" />, do hereby solemnly affirm and state on oath as under:
          </p>

          <ol className="list-decimal pl-10 space-y-6 mb-8">
            {d.statements.map((statement: string, index: number) => (
              <li key={index}>
                <EditableField template={t} fieldPath={`statements.${index}`} value={statement} />
              </li>
            ))}
          </ol>

          <p className="indent-8 mb-8">
            That the statements made above are true to the best of my knowledge, information, and belief, and nothing material has been concealed therefrom.
          </p>
        </div>

        <div className="mt-16">
          <div className="flex justify-between items-end mb-16">
            <div>
              <p>Place: <EditableField template={t} fieldPath="place" value={d.place} className="font-bold" /></p>
              <p>Date: <EditableField template={t} fieldPath="date" value={d.date} className="font-bold" /></p>
            </div>
            <div className="text-center w-64">
              <div className="border-b border-gray-400 w-full mb-2 h-16 flex items-end justify-center"><span className="text-gray-300 italic text-sm">(Signature)</span></div>
              <p className="font-bold uppercase tracking-wider">DEPONENT</p>
              <p className="text-sm">(<EditableField template={t} fieldPath="deponent.name" value={d.deponent.name} />)</p>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-400 pt-8 mt-12">
            <h3 className="text-center font-bold underline mb-8">VERIFICATION</h3>
            <p className="indent-8 mb-16">
              Verified at <EditableField template={t} fieldPath="place" value={d.place} className="font-bold" /> on this <EditableField template={t} fieldPath="date" value={d.date} className="font-bold" />, that the contents of this affidavit are true and correct to the best of my knowledge and belief. No part of it is false and nothing material has been concealed therefrom.
            </p>

            <div className="flex justify-end">
               <div className="text-center w-64">
                <div className="border-b border-gray-400 w-full mb-2 h-16 flex items-end justify-center"><span className="text-gray-300 italic text-sm">(Signature)</span></div>
                <p className="font-bold uppercase tracking-wider">DEPONENT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
