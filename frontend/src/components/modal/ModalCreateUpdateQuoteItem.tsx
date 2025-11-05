/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import type { QuoteItemDataInterface, QuoteItemInterface } from "../../types/QuoteInterface";
import { createQuoteItem, updateQuoteItem } from "../../features/quote/thunk";
import { getQuoteItemSelected, getQuoteSelected } from "../../features/quote/selectors";
import { toast } from "react-toastify";



export function ModalCreateUpdateQuoteItem({
  open,
  onClose,
  title,
  editing, 
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  editing: QuoteItemInterface | null;
}) {
  const dispatch = useAppDispatch();
  const quoteSelected = useAppSelector(getQuoteSelected)
  const quoteItemSelected = useAppSelector(getQuoteItemSelected)

  const status = useAppSelector((s) => s.quote.status);
  const error = useAppSelector((s) => s.quote.error as string | null);

  const [form, setForm] = useState<QuoteItemDataInterface>({
    quoteId: "",
    quoteItemId:"",
    description: "",
    quantity: 0,  
    unitPrice: 0
  });

  const isEditing = !!editing;

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({
        quoteId: editing.quoteId ?? "",
        quoteItemId: editing.id ?? "",
        description: editing.description ?? "",
        quantity: editing.quantity ?? 0,  
        unitPrice: editing.unitPrice ?? 0
      });
    } else {
      setForm({
        quoteId: "",
        quoteItemId:"",
        description: "",
        quantity: 0,  
        unitPrice: 0
      });
    }

    
  }, [open, editing]);

 
  const canSave = useMemo(() => {
    if (!form.description) return false;
    if (!form.quantity) return false;
    if (!form.unitPrice) return false;
    return true;
  }, [form.description, form.quantity, form.unitPrice]);

  async function onSave() {
    try {
      if (isEditing) {
         const payloadJson: QuoteItemDataInterface  = {
          quoteId: quoteSelected!.id,
          quoteItemId: quoteItemSelected!.id,
          description: form.description.trim(),
          quantity: form.quantity,  
          unitPrice: form.unitPrice
        };

        await dispatch(updateQuoteItem(payloadJson)).unwrap();

        toast.success(`${form.description} a été bien modifié !`);
      }
      else{
        const payloadJson: QuoteItemDataInterface  = {
          quoteId: quoteSelected!.id,
          quoteItemId: "",
          description: form.description.trim(),
          quantity: form.quantity,  
          unitPrice: form.unitPrice
        };

        await dispatch(createQuoteItem(payloadJson)).unwrap();

        toast.success(`${form.description} bien ajouté sur cette devis !`);
      }

      onClose();
    } catch (e) {
       toast.error(`Un erreur survenu, veuillez patienter !`);
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
            <label className="text-gray-600">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description du devis"
              className="rounded-sm bg-[var(--field)] border border-[var(--field)] px-3 py-2 outline-none"
            />
          </div>

          {/* quantity */}
          <div className="grid gap-2">
            <label className=" text-gray-600">Quantité *</label>
            <input
              type="text"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              placeholder="Total du devis"
              className="rounded-sm bg-[var(--field)] border border-[var(--field)] px-3 py-2 outline-none"
            />
          </div>

          {/* unitPrice */}
          <div className="grid gap-2">
            <label className=" text-gray-600">Unit Price *</label>
            <input
              type="number"
              value={form.unitPrice}
              onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })}
              placeholder="Total du devis"
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
               {status === "loading" ? (isEditing ? "Enregistrement..." : "Création...") : (isEditing ? "Modifier" : "Créer")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
