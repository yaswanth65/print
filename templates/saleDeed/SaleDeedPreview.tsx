import { EditableField } from '@/components/shared/EditableField';
import { useDocumentStore } from '@/store/useDocumentStore';

export const SaleDeedPreview = () => {
  const { data, language } = useDocumentStore();
  const isTe = language === 'te';
  const d = data.sale_deed;
  const t = 'sale_deed';

  return (
    <div className="bg-gray-200 py-10 w-full flex flex-col items-center gap-10 print:bg-transparent print:py-0 print:gap-0">
      
      {/* PAGE 1 */}
      <div className="sale-deed-paper bg-white shadow-xl flex flex-col text-justify font-[Times_New_Roman,serif] text-[12pt] leading-[1.25] w-[210mm] min-h-[297mm] p-[0.6in] box-border">
        <div className="flex-1">
          <h1 className="text-[14pt] font-bold text-center uppercase tracking-wide mb-[8.5pt]">
            DEED OF ABSOLUTE SALE
          </h1>

          <p className="mb-[8.5pt]">
            This DEED OF ABSOLUTE SALE is made and executed on this <EditableField template={t} fieldPath="day" value={d.day} className="font-bold underline min-w-[30px] inline-block text-center" /> day of <EditableField template={t} fieldPath="month" value={d.month} className="font-bold underline min-w-[100px] inline-block text-center" />, Two Thousand <EditableField template={t} fieldPath="year" value={d.year} className="font-bold underline min-w-[50px] inline-block text-center" />
          </p>

          <p className="font-bold tracking-wider mb-[8.5pt] text-center">BETWEEN</p>

          <p className="mb-[8.5pt]">
            Sri <EditableField template={t} fieldPath="seller.name" value={d.seller.name} className="font-bold" />, son/wife/daughter of Sri/Late <EditableField template={t} fieldPath="seller.fatherName" value={d.seller.fatherName} className="font-bold" />, aged about <EditableField template={t} fieldPath="seller.age" value={d.seller.age} className="font-bold" /> years, holding PAN <EditableField template={t} fieldPath="seller.pan" value={d.seller.pan} className="font-bold" />, by Caste <EditableField template={t} fieldPath="seller.caste" value={d.seller.caste} className="font-bold" />, by Nationality Indian, residing at <EditableField template={t} fieldPath="seller.address" value={d.seller.address} className="font-bold" />, hereinafter called the <span className="font-bold">&ldquo;SELLER&rdquo;</span> (which expression shall mean and include his legal heirs, successors, successors-in-interest, executors, administrators, legal representatives and assigns) of the ONE PART.
          </p>

          <p className="font-bold italic text-center mb-[8.5pt]">AND</p>

          <p className="mb-[8.5pt]">
            Sri <EditableField template={t} fieldPath="purchaser.name" value={d.purchaser.name} className="font-bold" />, son of <EditableField template={t} fieldPath="purchaser.fatherName" value={d.purchaser.fatherName} className="font-bold" />, aged about <EditableField template={t} fieldPath="purchaser.age" value={d.purchaser.age} className="font-bold" /> years, by Caste <EditableField template={t} fieldPath="purchaser.caste" value={d.purchaser.caste} className="font-bold" />, by Nationality Indian, holding PAN <EditableField template={t} fieldPath="purchaser.pan" value={d.purchaser.pan} className="font-bold" />, residing at <EditableField template={t} fieldPath="purchaser.address" value={d.purchaser.address} className="font-bold" />, hereinafter called the <span className="font-bold">&ldquo;PURCHASER&rdquo;</span> (which expression shall mean and include his legal heirs, successors, successors-in-interest, executors, administrators, legal representatives and assigns) of the OTHER PART.
          </p>

          <p className="mb-[8.5pt]">
            The SELLER and the PURCHASER are hereinafter referred collectively as parties and individually as party.
          </p>

          <p className="mb-[8.5pt]">
            <span className="font-bold uppercase">WHEREAS</span> the SELLER is the absolute owner, in possession and enjoyment of the piece and parcel of <EditableField template={t} fieldPath="property.landMeasurement" value={d.property.landMeasurement} className="font-bold" /> land measuring about <EditableField template={t} fieldPath="property.landDecimal" value={d.property.landDecimal} className="font-bold" /> decimal, lying and situated in R.S. Plot Number <EditableField template={t} fieldPath="property.rsPlotNumber" value={d.property.rsPlotNumber} className="font-bold" />, corresponding L.R. Plot Number <EditableField template={t} fieldPath="property.lrPlotNumber" value={d.property.lrPlotNumber} className="font-bold" />, Recorded in R.S. Khatian Number <EditableField template={t} fieldPath="property.rsKhatianNumber" value={d.property.rsKhatianNumber} className="font-bold" /> and L.R. Khatian Number <EditableField template={t} fieldPath="property.lrKhatianNumber" value={d.property.lrKhatianNumber} className="font-bold" />, at Mouza <EditableField template={t} fieldPath="property.mouza" value={d.property.mouza} className="font-bold" />, J.L. Number <EditableField template={t} fieldPath="property.jlNumber" value={d.property.jlNumber} className="font-bold" />, Touzi Number <EditableField template={t} fieldPath="property.touziNumber" value={d.property.touziNumber} className="font-bold" />, under Police Station <EditableField template={t} fieldPath="property.policeStation" value={d.property.policeStation} className="font-bold" />, Registration Sub-District <EditableField template={t} fieldPath="property.registrationSubDistrict" value={d.property.registrationSubDistrict} className="font-bold" />, in the district of <EditableField template={t} fieldPath="property.district" value={d.property.district} className="font-bold" />, more fully and particularly described in the schedule here under written and hereafter referred to as the <span className="font-bold">SCHEDULE PROPERTY</span>
          </p>

          <p className="mb-0">
            <span className="font-bold uppercase">AND WHEREAS</span> the SCHEDULE PROPERTY was the self acquired property of <EditableField template={t} fieldPath="previousOwner.deceasedFatherName" value={d.previousOwner.deceasedFatherName} className="font-bold" />, deceased father of the SELLER and he purchased the same from Sri <EditableField template={t} fieldPath="previousOwner.purchasedFromName" value={d.previousOwner.purchasedFromName} className="font-bold" />, son of <EditableField template={t} fieldPath="previousOwner.purchasedFromFatherName" value={d.previousOwner.purchasedFromFatherName} className="font-bold" /> of <EditableField template={t} fieldPath="previousOwner.purchasedFromAddress" value={d.previousOwner.purchasedFromAddress} className="font-bold" />, by virtue of a Sale Deed dated <EditableField template={t} fieldPath="previousOwner.saleDeedDate" value={d.previousOwner.saleDeedDate} className="font-bold" />, registered in the office of the <EditableField template={t} fieldPath="previousOwner.registrationOffice" value={d.previousOwner.registrationOffice} className="font-bold" />, in Book 1, Volume No. <EditableField template={t} fieldPath="previousOwner.bookVolume" value={d.previousOwner.bookVolume} className="font-bold" />, Pages <EditableField template={t} fieldPath="previousOwner.pagesFrom" value={d.previousOwner.pagesFrom} className="font-bold" /> to <EditableField template={t} fieldPath="previousOwner.pagesTo" value={d.previousOwner.pagesTo} className="font-bold" />, Being Number <EditableField template={t} fieldPath="previousOwner.deedNumber" value={d.previousOwner.deedNumber} className="font-bold" /> for the Year <EditableField template={t} fieldPath="previousOwner.deedYear" value={d.previousOwner.deedYear} className="font-bold" />.
          </p>
        </div>
      </div>

      {/* PAGE 2 */}
      <div className="sale-deed-paper bg-white shadow-xl flex flex-col text-justify font-[Times_New_Roman,serif] text-[12pt] leading-[1.25] w-[210mm] min-h-[297mm] p-[0.6in] box-border">
        <div className="flex-1">
          <p className="mb-[8.5pt]">
            <span className="font-bold uppercase">AND WHEREAS</span> the said <EditableField template={t} fieldPath="previousOwner.deceasedFatherName" value={d.previousOwner.deceasedFatherName} className="font-bold" /> died in-estate on <EditableField template={t} fieldPath="fatherDeathDate" value={d.fatherDeathDate} className="font-bold" /> leaving behind his only son namely, Sri <EditableField template={t} fieldPath="seller.name" value={d.seller.name} className="font-bold" />, the SELLER herein, as the only legal heir.
          </p>

          <p className="mb-[8.5pt]">
            <span className="font-bold uppercase">AND WHEREAS</span> the SELLER herein, as the only legal heirs of the deceased <EditableField template={t} fieldPath="previousOwner.deceasedFatherName" value={d.previousOwner.deceasedFatherName} className="font-bold" />, have become the absolute owner of the SCHEDULE PROPERTY since the death of his father <EditableField template={t} fieldPath="previousOwner.deceasedFatherName" value={d.previousOwner.deceasedFatherName} className="font-bold" /> on and he has been enjoying the same with absolute right, title and interest sice then and he has clear and marketable title to the SCHEDULE PROPERTY.
          </p>

          <p className="mb-[8.5pt]">
            <span className="font-bold uppercase">AND WHEREAS</span> the SELLER being in need of funds to meet his personal commitments and family expenses have decided to sell the SCHEDULE PROPERTY and the PURCHASER has agreed to purchase the same.
          </p>

          <p className="mb-[8.5pt]">
            <span className="font-bold uppercase">AND WHEREAS</span> the SELLER agreed to sell, convey and transfer the SCHEDULE PROPERTY to the PURCHASER for a total consideration of Rs. <EditableField template={t} fieldPath="consideration.amount" value={d.consideration.amount} className="font-bold" /> (Rupees <EditableField template={t} fieldPath="consideration.amountWords" value={d.consideration.amountWords} className="font-bold" />) only and the PURCHASER herein agreed to purchase the same for the aforesaid consideration and to that effect the parties entered into an agreement on the <EditableField template={t} fieldPath="agreementDate" value={d.agreementDate} className="font-bold" />.
          </p>

          <p className="font-bold text-center uppercase tracking-wider mb-[8.5pt]">NOW THIS DEED OF SALE WITNESSETH:</p>

          <p className="mb-0">
            <span className="font-bold">THAT</span> in pursuance of the aforesaid agreement and in consideration of a sum of Rs. <EditableField template={t} fieldPath="consideration.amount" value={d.consideration.amount} className="font-bold" /> (Rupees <EditableField template={t} fieldPath="consideration.amountWords" value={d.consideration.amountWords} className="font-bold" />) only received by the SELLER in <EditableField template={t} fieldPath="consideration.paymentMode" value={d.consideration.paymentMode} className="font-bold" /> and upon receipt of the said entire consideration of Rs. <EditableField template={t} fieldPath="consideration.amount" value={d.consideration.amount} className="font-bold" /> (Rupees <EditableField template={t} fieldPath="consideration.amountWords" value={d.consideration.amountWords} className="font-bold" />) only (the SELLER doth hereby admit, acknowledge, acquit, release and discharge the PURCHASER from making further payment thereof) the SELLER doth hereby sells, conveys, transfers, and assigns unto and to the use of the PURCHASER the SCHEDULE PROPERTY together with the water ways, easements, advantages and appurtenances, and all estate, rights, title and interest of the SELLER to and upon the SCHEDULE PROPERTY TO HAVE AND TO HOLD the SCHEDULE PROPERTY hereby conveyed unto the PURCHASER absolutely and forever.
          </p>
        </div>
      </div>

      {/* PAGE 3 */}
      <div className="sale-deed-paper bg-white shadow-xl flex flex-col text-justify font-[Times_New_Roman,serif] text-[12pt] leading-[1.25] w-[210mm] min-h-[297mm] p-[0.6in] box-border">
        <div className="flex-1">
          <p className="font-bold text-center uppercase tracking-wider mb-[8.5pt]">THAT THE SELLER DOTH HEREBY COVENANT WITH THE PURCHASER AS FOLLOWS:</p>

          <div className="space-y-[8.5pt]">
            <p className="pl-[18pt] relative">
              <span className="font-bold absolute left-0">1.</span> That the SCHEDULE PROPERTY shall be quietly and peacefully entered into and held and enjoyed by the PURCHASER without any interference, interruption, or disturbance from the SELLER or any person claiming through or under him.
            </p>

            <p className="pl-[18pt] relative">
              <span className="font-bold absolute left-0">2.</span> That the SELLER have absolute right, title and full power to sell, convey and transfer unto the PURCHASER by way of absolute sale and that the SELLER have not done anything or knowingly suffered anything whereby their right and power to sell and convey the SCHEDULE PROPERTY to the PURCHASER is diminished.
            </p>

            <p className="pl-[18pt] relative">
              <span className="font-bold absolute left-0">3.</span> That the property is not subjected to any encumbrances, mortgages, charges, lien, attachments, claim, demand, acquisition proceedings by Government or any kind whatsoever and should thereby and the SELLER shall discharge the same from and out of his own fund and keep the PURCHASER indemnified.
            </p>

            <p className="pl-[18pt] relative">
              <span className="font-bold absolute left-0">4.</span> That the SELLER hereby declares with the PURCHASER that the SELLER have paid all the taxes, rates and other outgoings due to local bodies, revenue, urban and other authorities in respect of the SCHEDULE PROPERTY up to the date of execution of this sale deed and the PURCHASER shall bear and pay the same hereafter. If any arrears are found due for the earlier period, the same shall be discharged/borne by the SELLER.
            </p>

            <p className="pl-[18pt] relative">
              <span className="font-bold absolute left-0">5.</span> That the SELLER have handed over the vacant possession of the SCHEDULE PROPERTY to the PURCHASER on <EditableField template={t} fieldPath="possessionDate" value={d.possessionDate} className="font-bold" /> and delivered the connected original title document in respect of the SCHEDULE PROPERTY hereby conveyed on the date of execution of these presents.
            </p>

            <p className="pl-[18pt] relative">
              <span className="font-bold absolute left-0">6.</span> That the SELLER will at all times and at the cost of the PURCHASER execute, register or cause to be done, all such acts and deeds for perfecting the title to the PURCHASER in the property hereby sold and conveyed herein.
            </p>

            <p className="pl-[18pt] relative">
              <span className="font-bold absolute left-0">7.</span> That the SELLER do hereby covenants and assures that the PURCHASER is entitled to have mutation of his name in all public records, local body and also obtain all documents in the name of the PURCHASER and undertakes to execute any deed in this respect.
            </p>
          </div>
        </div>

        <div className="mt-[24pt]">
          <p className="mb-[8.5pt]">
            <span className="font-bold uppercase">IN WITNESS WHEREOF</span> the SELLER and the PURCHASER have set their signatures on the day month and year first above written.
          </p>

          <div className="flex justify-between mt-[24pt] mb-[18pt]">
            <div className="text-center w-64">
              <div className="border-b border-black w-full mb-2 h-10"></div>
              <p className="font-bold uppercase tracking-wider">SELLER</p>
            </div>
            <div className="text-center w-64">
              <div className="border-b border-black w-full mb-2 h-10"></div>
              <p className="font-bold uppercase tracking-wider">PURCHASER</p>
            </div>
          </div>

          <div>
            <p className="font-bold mb-[8.5pt]">WITNESSES:</p>
            <div className="flex flex-col gap-[8.5pt]">
              <div className="w-full flex">
                <span className="mr-4">1.</span>
                <div className="border-b border-dotted border-black w-1/2"></div>
              </div>
              <div className="w-full flex">
                <span className="mr-4">2.</span>
                <div className="border-b border-dotted border-black w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};