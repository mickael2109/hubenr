
import { FaPlus, FaUsers } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { getQuoteSelected } from "../../features/quote/selectors";
import { useState } from "react";
import { selectQuoteItem } from "../../features/quote/slice";
import type { QuoteItemDataInterface, QuoteItemInterface } from "../../types/QuoteInterface";
import { ModalCreateUpdateQuoteItem } from "./ModalCreateUpdateQuoteItem";
import { deleteQuoteItem } from "../../features/quote/thunk";
import { ActionsCell } from "../organisms/ActionsCell";


type ModalProps = {
  open: boolean;
  onClose: () => void;
};


export function ModalViewQuote({
  open,
  onClose
}: ModalProps) {

  const dispatch = useAppDispatch();
  const quoteSelected = useAppSelector(getQuoteSelected)
  const [editing, setEditing] = useState<QuoteItemInterface | null>(null);
  const [openModalQuoteItem, setOpenModalQuoteItem] =  useState(false);
  


  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300]  flex items-start justify-end bg-black/30 "
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-screen translate-y-0 animate-in slide-in-from-right duration-200 border border-black/5 bg-[var(--panel)] shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-black/5 px-4 py-3 2xl:text-xs text-[11px]">
          <div className="flex items-center gap-2 w-full">
            <span className="grid h-8 w-8 place-items-center">
              <i className="text-gray-700"><FaUsers /></i>
            </span>
            <div className="flex flex-row items-center justify-between w-full">
              <div className="font-semibold">Devis pour le lead</div>
              <div>
                <i 
                  className={`${quoteSelected?.status !== "DRAFT" && "opacity-30"}`}
                  onClick={() => {
                    if(quoteSelected?.status === "DRAFT"){
                      setEditing(null)
                      setOpenModalQuoteItem(true)
                    }
                  }}>
                      <FaPlus></FaPlus>
                </i>
              </div>
            </div>
          </div>
        </div>

        {/* Liste / Contenu */}
        <div className="max-h-[70vh] overflow-auto px-4 py-3">
          {quoteSelected?.items.length === 0 ? (
            <div className="grid place-items-center rounded-xl border border-dashed border-black/10 bg-[var(--card,white)] px-4 py-12 text-center">
              <div className="mt-1 text-xs text-gray-500">
                Aucun élément du devis en ce moment.
              </div>
            </div>
          ) : (
          <div>
            <div>
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
                          <div className="flex flex-row gap-2">
                            <ActionsCell
                                onEdit={() => {
                                  if(quoteSelected?.status === "DRAFT"){
                                    setEditing(n)
                                    dispatch(selectQuoteItem(n))
                                    setOpenModalQuoteItem(true)
                                  }
                                }}
                                onDelete={async() => {
                                  if(quoteSelected?.status === "DRAFT"){
                                    const payloadJson: QuoteItemDataInterface  = {
                                        quoteId: quoteSelected!.id,
                                        quoteItemId: n.id,
                                        description: "",
                                        quantity: 0,  
                                        unitPrice: 0
                                      };
                              
                                      await dispatch(deleteQuoteItem(payloadJson)).unwrap();
                                  }
                                  }
                                }
                              />
                            
                          </div>
                        </li>
                      )
                  })}
              </ul>
            </div>
            <div><span className="font-semibold text-[11px]">Total : {quoteSelected?.totalAmount} Ar</span></div>
          </div>
          )}
        </div>
      </div>

      <ModalCreateUpdateQuoteItem
          open={openModalQuoteItem}
          onClose={() => setOpenModalQuoteItem(false)}
          title={editing ? "Modifier l'élement" : "Nouveau élement"}
          editing={editing!}
      />
    </div>
  );
}
