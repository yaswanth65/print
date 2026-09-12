import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';

export const SscMemoAffidavitPreview = () => {
  const { data } = useDocumentStore();
  const d = data.ssc_memo_affidavit;
  const t = 'ssc_memo_affidavit';

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
          <h2 className="text-center text-sm font-bold uppercase mb-10">(For Issue of Duplicate SSC Memo)</h2>

          <p className="mb-6 indent-8">
            I, <EditableField template={t} fieldPath="name" value={d.name} className="font-bold" />&nbsp;
            (<EditableField template={t} fieldPath="relation" value={d.relation} className="font-bold" />)&nbsp;
            <EditableField template={t} fieldPath="fatherName" value={d.fatherName} className="font-bold" />,
            aged about <EditableField template={t} fieldPath="age" value={d.age} className="font-bold" /> years,
            R/o. <EditableField template={t} fieldPath="address" value={d.address} className="font-bold" />,
            on solemn oath and affirmation state as under:-
          </p>

          <ol className="list-decimal pl-10 space-y-6 mb-8">
            <li>
              That I have appeared for the <EditableField template={t} fieldPath="examination" value={d.examination} className="font-bold" /> held in the Month of <EditableField template={t} fieldPath="examMonth" value={d.examMonth} className="font-bold" /> <EditableField template={t} fieldPath="examYear" value={d.examYear} className="font-bold" /> with Roll No. <EditableField template={t} fieldPath="rollNo" value={d.rollNo} className="font-bold" /> through <EditableField template={t} fieldPath="school" value={d.school} className="font-bold" />.
            </li>
            <li>
              That the SSC Memo which was issued to me by the <EditableField template={t} fieldPath="board" value={d.board} className="font-bold" /> has been lost by me on <EditableField template={t} fieldPath="lostDate" value={d.lostDate} className="font-bold" /> while I was traveling by <EditableField template={t} fieldPath="journeyMode" value={d.journeyMode} className="font-bold" /> from <EditableField template={t} fieldPath="journeyFrom" value={d.journeyFrom} className="font-bold" /> to <EditableField template={t} fieldPath="journeyTo" value={d.journeyTo} className="font-bold" /> and in spite of best efforts, I am unable to trace it and it is lost beyond recovery. In case, if it is traced in future I shall submit it to the <EditableField template={t} fieldPath="board" value={d.board} className="font-bold" /> for cancellation.
            </li>
            <li>
              That I am in need for a duplicate copy of the said SSC Memo for which purpose I am hereby making this declaration as required by the Secretary, <EditableField template={t} fieldPath="board" value={d.board} className="font-bold" />.
            </li>
          </ol>
        </div>

        <div className="mt-16">
          <div className="flex justify-end mb-24">
            <div className="text-center w-64">
              <div className="border-b border-gray-400 w-full mb-2 h-16 flex items-end justify-center"><span className="text-gray-300 italic text-sm">(Signature)</span></div>
              <p className="font-bold uppercase tracking-wider">DEPONENT</p>
              <p className="text-sm">(<EditableField template={t} fieldPath="name" value={d.name} />)</p>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-[70%]">
              <p className="font-bold">Sworn and Signed before me</p>
              <p className="mt-1">
                On <EditableField template={t} fieldPath="declarationDate" value={d.declarationDate} className="font-bold" /> at <EditableField template={t} fieldPath="declarationPlace" value={d.declarationPlace} className="font-bold" />
              </p>
              <div className="border-t border-gray-400 w-48 mt-8 ml-auto h-16 flex items-end justify-center"><span className="text-gray-300 italic text-sm">(Signature &amp; Seal)</span></div>
              <p className="font-bold uppercase tracking-wider text-right">NOTARY PUBLIC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};