import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';

export const PlotAgreementPreview = () => {
  const { data } = useDocumentStore();
  const d = data.plot_agreement;
  const t = 'plot_agreement';

  return (
    <div className="bg-gray-200 py-10 w-full flex flex-col items-center gap-10 print:bg-transparent print:py-0 print:gap-0">

      {/* PAGE 1 — Title & Parties */}
      <div className="sale-deed-paper bg-white shadow-xl flex flex-col text-justify font-[Times_New_Roman,serif] text-[12pt] leading-[1.25] w-[210mm] min-h-[297mm] p-[0.6in] box-border">
        <div className="flex-1">
          <h1 className="text-[14pt] font-bold text-center uppercase tracking-wide mb-[8.5pt]">
            PLOT SALE AGREEMENT
          </h1>
          <p className="text-[10pt] text-center italic mb-[8.5pt]">
            (Draft Format - Institutional / Legal Execution Version)
          </p>

          <p className="mb-[8.5pt]">
            This Plot Sale Agreement (&ldquo;Agreement&rdquo;) is made and executed on this <EditableField template={t} fieldPath="day" value={d.day} className="font-bold underline min-w-[30px] inline-block text-center" /> day of <EditableField template={t} fieldPath="month" value={d.month} className="font-bold underline min-w-[100px] inline-block text-center" />, <EditableField template={t} fieldPath="year" value={d.year} className="font-bold underline min-w-[50px] inline-block text-center" /> at <EditableField template={t} fieldPath="place" value={d.place} className="font-bold underline min-w-[120px] inline-block text-center" />, India.
          </p>

          <p className="font-bold tracking-wider mb-[8.5pt] text-center">BETWEEN SELLER</p>

          <p className="mb-[8.5pt]">
            <span className="font-bold">SELLER</span><br />
            Mr. <EditableField template={t} fieldPath="seller.name" value={d.seller.name} className="font-bold" />, Son of <EditableField template={t} fieldPath="seller.fatherName" value={d.seller.fatherName} className="font-bold" />, Aged about <EditableField template={t} fieldPath="seller.age" value={d.seller.age} className="font-bold" /> years, Occupation: <EditableField template={t} fieldPath="seller.occupation" value={d.seller.occupation} className="font-bold" />, Residing at: <EditableField template={t} fieldPath="seller.address" value={d.seller.address} className="font-bold" />, PAN: <EditableField template={t} fieldPath="seller.pan" value={d.seller.pan} className="font-bold" />, Aadhaar No.: <EditableField template={t} fieldPath="seller.aadhaar" value={d.seller.aadhaar} className="font-bold" />, Hereinafter referred to as the <span className="font-bold">&ldquo;Seller&rdquo;</span> (which expression shall, unless repugnant to the context or meaning thereof, mean and include his heirs, successors, nominees, legal representatives, executors, administrators, and assigns).
          </p>

          <p className="font-bold italic text-center mb-[8.5pt]">AND PURCHASER</p>

          <p className="mb-[8.5pt]">
            <span className="font-bold">PURCHASER</span><br />
            Mr. <EditableField template={t} fieldPath="purchaser.name" value={d.purchaser.name} className="font-bold" />, Son of <EditableField template={t} fieldPath="purchaser.fatherName" value={d.purchaser.fatherName} className="font-bold" />, Aged about <EditableField template={t} fieldPath="purchaser.age" value={d.purchaser.age} className="font-bold" /> years, Occupation: <EditableField template={t} fieldPath="purchaser.occupation" value={d.purchaser.occupation} className="font-bold" />, Residing at: <EditableField template={t} fieldPath="purchaser.address" value={d.purchaser.address} className="font-bold" />, PAN: <EditableField template={t} fieldPath="purchaser.pan" value={d.purchaser.pan} className="font-bold" />, Aadhaar No.: <EditableField template={t} fieldPath="purchaser.aadhaar" value={d.purchaser.aadhaar} className="font-bold" />, Hereinafter referred to as the <span className="font-bold">&ldquo;Purchaser&rdquo;</span> (which expression shall, unless repugnant to the context or meaning thereof, mean and include his heirs, successors, nominees, legal representatives, executors, administrators, and assigns).
          </p>

          <p className="mb-0">
            The Seller and Purchaser are hereinafter collectively referred to as the <span className="font-bold">&ldquo;Parties&rdquo;</span> and individually as a <span className="font-bold">&ldquo;Party.&rdquo;</span>
          </p>
        </div>
      </div>

      {/* PAGE 2 — RECITALS & Clause 1 */}
      <div className="sale-deed-paper bg-white shadow-xl flex flex-col text-justify font-[Times_New_Roman,serif] text-[12pt] leading-[1.25] w-[210mm] min-h-[297mm] p-[0.6in] box-border">
        <div className="flex-1">
          <p className="font-bold text-center uppercase tracking-wider mb-[8.5pt]">RECITALS</p>

          <p className="mb-[8.5pt]">
            <span className="font-bold">WHEREAS</span> <EditableField template={t} fieldPath="recital1" value={d.recital1} />
          </p>

          <p className="mb-[8.5pt]">
            <span className="font-bold">WHEREAS</span> <EditableField template={t} fieldPath="recital2" value={d.recital2} />
          </p>

          <p className="mb-[8.5pt]">
            <span className="font-bold">WHEREAS</span> <EditableField template={t} fieldPath="recital3" value={d.recital3} />
          </p>

          <p className="mb-[8.5pt]">
            <span className="font-bold">WHEREAS</span> <EditableField template={t} fieldPath="recital4" value={d.recital4} />
          </p>

          <p className="font-bold text-center uppercase tracking-wider mb-[8.5pt]">NOW THEREFORE,</p>
          <p className="mb-[8.5pt]">
            In consideration of the mutual covenants, assurances, representations, warranties, and agreements contained herein, the Parties hereby agree as follows:
          </p>

          <p className="font-bold mb-[8.5pt]">1. SALE OF PROPERTY</p>
          <p className="mb-0">
            The Seller hereby agrees to sell, transfer, convey, assign, and assure unto the Purchaser, and the Purchaser hereby agrees to purchase from the Seller, the immovable property more particularly described in <span className="font-bold">Schedule A</span> together with all easements, pathways, access rights, common usage rights, and appurtenances attached thereto.
          </p>
        </div>
      </div>

      {/* PAGE 3 — Clauses 2–7 (Property, Consideration, Payment, Execution, Representations) */}
      <div className="sale-deed-paper bg-white shadow-xl flex flex-col text-justify font-[Times_New_Roman,serif] text-[12pt] leading-[1.25] w-[210mm] min-h-[297mm] p-[0.6in] box-border">
        <div className="flex-1">
          <p className="font-bold mb-[8.5pt]">2. PROPERTY DETAILS</p>
          <p className="mb-[8.5pt]">The details of the Scheduled Property are as follows:</p>

          <table className="w-full border-collapse border border-black mb-[8.5pt] text-[11pt]">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 font-bold w-[40%]">Plot Number</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.plotNumber" value={d.property.plotNumber} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">Survey Number</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.surveyNumber" value={d.property.surveyNumber} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">Layout Name</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.layoutName" value={d.property.layoutName} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">Village</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.village" value={d.property.village} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">Mandal</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.mandal" value={d.property.mandal} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">District</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.district" value={d.property.district} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">State</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.state" value={d.property.state} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">Extent</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.extent" value={d.property.extent} className="font-bold" /> <EditableField template={t} fieldPath="property.extentUnit" value={d.property.extentUnit} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">Property Type</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.propertyType" value={d.property.propertyType} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">Approval Authority</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.approvalAuthority" value={d.property.approvalAuthority} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">Approval Number</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.approvalNumber" value={d.property.approvalNumber} className="font-bold" /></td>
              </tr>
            </tbody>
          </table>

          <p className="font-bold mb-[8.5pt]">3. SALE CONSIDERATION</p>
          <p className="mb-[8.5pt]">
            The total sale consideration agreed between the Parties for the Scheduled Property is:
          </p>
          <p className="mb-[8.5pt] font-bold text-center text-[13pt]">
            INR <EditableField template={t} fieldPath="consideration.total" value={d.consideration.total} className="font-bold" />/- (Indian Rupees <EditableField template={t} fieldPath="consideration.totalWords" value={d.consideration.totalWords} className="font-bold" /> Only)
          </p>
          <p className="mb-[8.5pt]">The Purchaser agrees to pay the same in the following manner:</p>
          <table className="w-full border-collapse border border-black mb-[8.5pt] text-[11pt]">
            <thead>
              <tr>
                <th className="border border-black px-2 py-1 font-bold text-left">Payment Description</th>
                <th className="border border-black px-2 py-1 font-bold text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1">Advance / Token Amount</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="consideration.advanceAmount" value={d.consideration.advanceAmount} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">Second Installment</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="consideration.secondInstallment" value={d.consideration.secondInstallment} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">Final Balance Amount</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="consideration.finalBalance" value={d.consideration.finalBalance} className="font-bold" /></td>
              </tr>
            </tbody>
          </table>
          <p className="mb-[8.5pt]">
            The Seller hereby acknowledges receipt of the advance amount.
          </p>

          <p className="font-bold mb-[8.5pt]">4. MODE OF PAYMENT</p>
          <p className="mb-[8.5pt]">
            All payments under this Agreement shall be made through lawful banking channels including:
          </p>
          <ul className="list-disc pl-[24pt] mb-[8.5pt]">
            <li>Bank Transfer (NEFT / RTGS / IMPS)</li>
            <li>Account Payee Cheque</li>
            <li>Demand Draft</li>
          </ul>
          <p className="mb-[8.5pt]">
            No cash transaction beyond permissible statutory limits shall be entertained.
          </p>

          <p className="font-bold mb-[8.5pt]">5. EXECUTION OF SALE DEED</p>
          <p className="mb-[8.5pt]">
            The Seller shall execute and register the Final Absolute Sale Deed in favor of the Purchaser within <EditableField template={t} fieldPath="executionDays" value={d.executionDays} className="font-bold underline min-w-[30px] inline-block text-center" /> days from the date of this Agreement upon receipt of full and final consideration. The registration shall be completed before the jurisdictional Sub-Registrar Office.
          </p>

          <p className="font-bold mb-[8.5pt]">6. REPRESENTATIONS AND WARRANTIES OF SELLER</p>
          <p className="mb-[4pt]">The Seller hereby represents and warrants that:</p>
          <ul className="list-disc pl-[24pt] mb-[8.5pt]">
            <li>The Seller has clear, marketable, lawful, and transferable title over the Scheduled Property.</li>
            <li>The property is free from: Mortgage, Charge, Encumbrance, Court litigation, Government acquisition, Family disputes, Tenancy claims, and Third-party claims.</li>
            <li>All taxes, land revenue, conversion charges, betterment charges, and statutory dues up to the execution date shall be borne by the Seller.</li>
            <li>No agreement, GPA, development rights, or prior sale rights exist in favor of any third party.</li>
            <li>The Seller has full authority and competency under applicable Indian laws to execute this Agreement.</li>
          </ul>

          <p className="font-bold mb-[8.5pt]">7. REPRESENTATIONS OF PURCHASER</p>
          <p className="mb-[4pt]">The Purchaser hereby confirms that:</p>
          <ul className="list-disc pl-[24pt] mb-0">
            <li>The Purchaser has independently verified the title and property documents.</li>
            <li>The Purchaser possesses sufficient lawful funds for the purchase.</li>
            <li>The Purchaser shall complete payment obligations within agreed timelines.</li>
          </ul>
        </div>
      </div>

      {/* PAGE 4 — Clauses 8–17 (Possession, Default, Indemnity, Taxes, Force Majeure, Dispute, Law, Entire Agreement, Amendments, Execution) */}
      <div className="sale-deed-paper bg-white shadow-xl flex flex-col text-justify font-[Times_New_Roman,serif] text-[12pt] leading-[1.25] w-[210mm] min-h-[297mm] p-[0.6in] box-border">
        <div className="flex-1">
          <p className="font-bold mb-[8.5pt]">8. POSSESSION</p>
          <p className="mb-[8.5pt]">
            Vacant, peaceful, and physical possession of the Scheduled Property shall be handed over to the Purchaser simultaneously upon:
          </p>
          <ul className="list-disc pl-[24pt] mb-[8.5pt]">
            <li>Full payment of consideration; and</li>
            <li>Execution &amp; registration of the Sale Deed.</li>
          </ul>

          <p className="font-bold mb-[8.5pt]">9. DEFAULT</p>
          <p className="font-bold mb-[4pt]">Seller Default</p>
          <p className="mb-[4pt]">
            If the Seller fails to execute the Sale Deed despite receiving full consideration, the Purchaser shall be entitled to:
          </p>
          <ul className="list-disc pl-[24pt] mb-[8.5pt]">
            <li>Specific performance under the Specific Relief Act, 1963</li>
            <li>Refund with interest @ <EditableField template={t} fieldPath="defaultInterest" value={d.defaultInterest} className="font-bold underline min-w-[30px] inline-block text-center" />% p.a.</li>
            <li>Damages and legal costs</li>
          </ul>
          <p className="font-bold mb-[4pt]">Purchaser Default</p>
          <p className="mb-[4pt]">
            If the Purchaser fails to make payment within agreed timelines, the Seller shall be entitled to:
          </p>
          <ul className="list-disc pl-[24pt] mb-[8.5pt]">
            <li>Cancel this Agreement</li>
            <li>Forfeit advance amount (subject to law)</li>
            <li>Recover damages</li>
          </ul>

          <p className="font-bold mb-[8.5pt]">10. INDEMNITY</p>
          <p className="mb-[4pt]">
            The Seller shall indemnify and keep indemnified the Purchaser against:
          </p>
          <ul className="list-disc pl-[24pt] mb-[8.5pt]">
            <li>Defective title, Encumbrances, Third-party disputes</li>
            <li>Litigation claims, Government claims, Fraudulent misrepresentation</li>
          </ul>

          <p className="font-bold mb-[8.5pt]">11. TAXES &amp; REGISTRATION CHARGES</p>
          <table className="w-full border-collapse border border-black mb-[8.5pt] text-[11pt]">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 w-[60%]">Stamp Duty</td>
                <td className="border border-black px-2 py-1 font-bold">To be borne by Purchaser</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">Registration Charges</td>
                <td className="border border-black px-2 py-1 font-bold">To be borne by Purchaser</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">Capital Gains Tax</td>
                <td className="border border-black px-2 py-1 font-bold">To be borne by Seller</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">Pending Statutory Dues till Registration Date</td>
                <td className="border border-black px-2 py-1 font-bold">To be borne by Seller</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-[18pt]">
          <p className="font-bold mb-[8.5pt]">12. FORCE MAJEURE</p>
          <p className="mb-[4pt]">
            Neither Party shall be liable for delay or failure due to:
          </p>
          <ul className="list-disc pl-[24pt] mb-[8.5pt]">
            <li>Natural disasters, War, Government restrictions</li>
            <li>Pandemic, Court injunctions, Civil disturbances</li>
          </ul>

          <p className="font-bold mb-[8.5pt]">13. DISPUTE RESOLUTION</p>
          <p className="mb-[8.5pt]">
            In the event of any dispute arising from this Agreement, the Parties shall first attempt amicable resolution. Failing such resolution, disputes shall be referred to Arbitration under the Arbitration and Conciliation Act, 1996. The seat and venue of arbitration shall be Hyderabad, Telangana.
          </p>

          <p className="font-bold mb-[8.5pt]">14. GOVERNING LAW &amp; JURISDICTION</p>
          <p className="mb-[4pt]">
            This Agreement shall be governed by:
          </p>
          <ul className="list-disc pl-[24pt] mb-[8.5pt]">
            <li>Transfer of Property Act, 1882</li>
            <li>Registration Act, 1908</li>
            <li>Indian Contract Act, 1872</li>
            <li>Specific Relief Act, 1963</li>
            <li>Indian Stamp Act, 1899</li>
            <li>Applicable State Land Laws</li>
          </ul>
          <p className="mb-[8.5pt]">
            Courts at Hyderabad, Telangana shall have exclusive jurisdiction.
          </p>

          <p className="font-bold mb-[8.5pt]">15. ENTIRE AGREEMENT</p>
          <p className="mb-[8.5pt]">
            This Agreement constitutes the complete understanding between the Parties and supersedes all prior discussions, negotiations, oral assurances, or representations.
          </p>

          <p className="font-bold mb-[8.5pt]">16. AMENDMENTS</p>
          <p className="mb-[8.5pt]">
            No amendment or modification to this Agreement shall be valid unless made in writing and signed by both Parties.
          </p>

          <p className="font-bold mb-[8.5pt]">17. EXECUTION</p>
          <p className="mb-[4pt]">
            The Parties confirm that:
          </p>
          <ul className="list-disc pl-[24pt] mb-0">
            <li>They have read and understood all terms;</li>
            <li>They are executing this Agreement voluntarily;</li>
            <li>No coercion, fraud, or undue influence exists.</li>
          </ul>
        </div>
      </div>

      {/* PAGE 5 — Schedule A, Boundaries, Signatures & Witnesses */}
      <div className="sale-deed-paper bg-white shadow-xl flex flex-col text-justify font-[Times_New_Roman,serif] text-[12pt] leading-[1.25] w-[210mm] min-h-[297mm] p-[0.6in] box-border">
        <div className="flex-1">
          <p className="font-bold text-center uppercase tracking-wider mb-[8.5pt]">SCHEDULE A</p>
          <p className="font-bold text-center mb-[8.5pt]">DESCRIPTION OF PROPERTY</p>
          <p className="mb-[8.5pt]">
            All that piece and parcel of residential immovable property bearing:
          </p>

          <table className="w-full border-collapse border border-black mb-[8.5pt] text-[11pt]">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 font-bold w-1/3">Plot No.</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.plotNumber" value={d.property.plotNumber} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">Survey No.</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.surveyNumber" value={d.property.surveyNumber} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">Admeasuring</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.extent" value={d.property.extent} className="font-bold" /> <EditableField template={t} fieldPath="property.extentUnit" value={d.property.extentUnit} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">Situated at</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.layoutName" value={d.property.layoutName} className="font-bold" />, <EditableField template={t} fieldPath="property.village" value={d.property.village} className="font-bold" />, <EditableField template={t} fieldPath="property.mandal" value={d.property.mandal} className="font-bold" />, <EditableField template={t} fieldPath="property.district" value={d.property.district} className="font-bold" />, <EditableField template={t} fieldPath="property.state" value={d.property.state} className="font-bold" /></td>
              </tr>
            </tbody>
          </table>

          <p className="font-bold mb-[4pt]">BOUNDARIES</p>
          <table className="w-full border-collapse border border-black mb-[8.5pt] text-[11pt]">
            <thead>
              <tr>
                <th className="border border-black px-2 py-1 font-bold text-left">Direction</th>
                <th className="border border-black px-2 py-1 font-bold text-left">Boundary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 font-bold w-1/4">East</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.east" value={d.property.east} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">West</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.west" value={d.property.west} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">North</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.north" value={d.property.north} className="font-bold" /></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold">South</td>
                <td className="border border-black px-2 py-1"><EditableField template={t} fieldPath="property.south" value={d.property.south} className="font-bold" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-[18pt]">
          <p className="mb-[8.5pt]">
            <span className="font-bold uppercase">IN WITNESS WHEREOF</span> The Parties hereto have executed this Plot Sale Agreement on the date and place first mentioned above.
          </p>

          <div className="flex justify-between mt-[18pt] mb-[12pt]">
            <div className="text-center w-64">
              <div className="border-b border-black w-full mb-2 h-10"></div>
              <p className="font-bold uppercase tracking-wider">SELLER</p>
              <p className="text-[11pt] mt-1">Signature</p>
              <p className="text-[11pt] mt-1">Name: <EditableField template={t} fieldPath="seller.name" value={d.seller.name} className="font-bold" /></p>
            </div>
            <div className="text-center w-64">
              <div className="border-b border-black w-full mb-2 h-10"></div>
              <p className="font-bold uppercase tracking-wider">PURCHASER</p>
              <p className="text-[11pt] mt-1">Signature</p>
              <p className="text-[11pt] mt-1">Name: <EditableField template={t} fieldPath="purchaser.name" value={d.purchaser.name} className="font-bold" /></p>
            </div>
          </div>

          <div>
            <p className="font-bold mb-[8.5pt]">WITNESSES</p>
            <div className="flex justify-between gap-10">
              <div className="w-1/2">
                <p className="font-bold mb-[4pt]">Witness 1</p>
                <div className="w-full flex mb-[4pt] items-end">
                  <span className="mr-4 w-20 text-[11pt]">Signature:</span>
                  <div className="border-b border-black flex-1 h-5"></div>
                </div>
                <div className="w-full flex mb-[4pt] items-end">
                  <span className="mr-4 w-20 text-[11pt]">Name:</span>
                  <div className="border-b border-black flex-1 h-5"></div>
                </div>
                <div className="w-full flex items-end">
                  <span className="mr-4 w-20 text-[11pt]">Address:</span>
                  <div className="border-b border-black flex-1 h-5"></div>
                </div>
              </div>
              <div className="w-1/2">
                <p className="font-bold mb-[4pt]">Witness 2</p>
                <div className="w-full flex mb-[4pt] items-end">
                  <span className="mr-4 w-20 text-[11pt]">Signature:</span>
                  <div className="border-b border-black flex-1 h-5"></div>
                </div>
                <div className="w-full flex mb-[4pt] items-end">
                  <span className="mr-4 w-20 text-[11pt]">Name:</span>
                  <div className="border-b border-black flex-1 h-5"></div>
                </div>
                <div className="w-full flex items-end">
                  <span className="mr-4 w-20 text-[11pt]">Address:</span>
                  <div className="border-b border-black flex-1 h-5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};