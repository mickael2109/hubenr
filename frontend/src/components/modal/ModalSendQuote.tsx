/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import type { sendQuoteDataInterface } from "../../types/QuoteInterface";
import { sendQuote } from "../../features/quote/thunk";
import { getQuoteSelected } from "../../features/quote/selectors";
import { formatDateISO, toLocalISOFromParts } from "../../utils/utils";
import { toast } from "react-toastify";
import { getLeads } from "../../features/leads/selectors";
import { updateLead } from "../../features/leads/thunk";
import type { LeadInterface } from "../../types/LeadInterface";



export function ModalSendQuote({
  open,
  onClose,
  title,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
}) {
  const dispatch = useAppDispatch();
  const quoteSelected = useAppSelector(getQuoteSelected)
  const leads = useAppSelector(getLeads)

  const [date, setDate] = useState<string>("");     

  const status = useAppSelector((s) => s.quote.status);
  const error = useAppSelector((s) => s.quote.error as string | null);


  useEffect(() => {
    if (!open) return;
    setDate("");

    
  }, [open]);

 
  const canSave = useMemo(() => {
    if (!date) return false;
    return true;
  }, [date]);


  async function onSave() {
    try {

      const isoPublish = toLocalISOFromParts(date, "00:00");

      const payloadJson: sendQuoteDataInterface  = {
        quoteId: quoteSelected!.id,
        expiresAt: isoPublish
      };

      await dispatch(sendQuote(payloadJson)).unwrap();
      

      const idx = leads.findIndex(item => item.id === quoteSelected?.leadId)
      const lead = leads[idx]

      const payloadJsonUpdate: LeadInterface = {
        ...lead,
        status: "QUOTESENT"
        
      };
      await dispatch(updateLead(payloadJsonUpdate)).unwrap();


      toast.success(`Devis envoyé avec succès !`);

      onClose();
    } catch (e) {
      // erreur gérée par redux
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[var(--panel)] shadow-xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base 2xl:text-sm text-[11px] font-semibold">{title}</h3>
          <div className="flex items-center gap-2">


            <button
              className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 transition"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="h-1 w-full border-b-1 border-gray-800 mb-4 opacity-20"></div>

        <div className="grid grid-cols-1 gap-4 2xl:text-xs text-[11px]">
          {/* LeadIs */}
          <div className="grid gap-2">
            <label className="text-gray-600">Leads</label>
            <input
              type="text"
              disabled
              value={quoteSelected?.leadId || ''}
              className="rounded-sm bg-[var(--field)] border border-[var(--field)] px-3 py-2 outline-none"
            />   
          </div>


          {/* items */}
          <div className="grid gap-2">
            <label className="text-gray-600">Elements</label>
            <ul className="space-y-3">
                {quoteSelected?.items
                  .map((n) =>{
                    return  (
                        <li
                          key={n.id}
                          className="flex flex-row justify-between items-center text-[11px] bg-[var(--field)] p-2 rounded-[10px]"
                        >
                          <div className="flex flex-col gap-2 justify-start items-start">
                            <div>
                              {n.description}
                            </div>
                            <div className="flex flex-row gap-1">
                              <span>Quantité: {n.quantity}</span>
                              <span>| Prix Unitaire: {n.unitPrice} Ar</span>
                              <span>| Total: {n.total} Ar</span>    
                            </div>
                          </div>
                        </li>
                      )
                })}
            </ul>
          </div>

          {/* Total */}
          <div className="grid gap-2">
            <label className="text-gray-600">Prix Net ( Ariary )</label>
            <input
              type="text"
              disabled
              value={quoteSelected?.totalAmount || 0}
              className="rounded-sm bg-[var(--field)] border border-[var(--field)] px-3 py-2 outline-none"
            />   
          </div>


          {/* Total */}
          <div className="grid gap-2">
            <label className="text-gray-600">Date d'envoie</label>
            <input
              type="text"
              disabled
              value={formatDateISO(new Date().toISOString())}
              className="rounded-sm bg-[var(--field)] border border-[var(--field)] px-3 py-2 outline-none"
            />   
          </div>

          {/* date expiration */}
          <div className="grid gap-2">
            <label className="text-gray-600">Date d'éxpiration</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-sm bg-[var(--field)] border border-[var(--field)] px-3 py-2 outline-none"
            />   
          </div>

        
         
          {/* Error */}
          {error && <div className="text-rose-600">{error}</div>}

          {/* Actions */}
          <div className="mt-1 flex items-center justify-end gap-2  2xl:text-xs text-[11px]">
            <button
              onClick={onClose}
              className="rounded-sm bg-red-400 px-4 py-2 font-medium text-white hover:opacity-95 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={onSave}
              disabled={!canSave || status === "loading"}
              className="rounded-sm bg-green-700 px-4 py-2 font-medium text-white hover:opacity-95 disabled:opacity-50"
            >
               {status === "loading" ? "Enregistrement..." : "Envoyer le devis"} 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
