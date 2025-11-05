import { Columns3, Plus, Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { getQuotes, getQuoteSelected } from "../../features/quote/selectors";
import { QuoteStatus, type QuoteInterface } from "../../types/QuoteInterface";
import { ModalViewQuote } from "../modal/ModalViewQuote";
import { selectQuote } from "../../features/quote/slice";
import { Progress } from "../organisms/ProgressBar";
import { formatDateISO } from "../../utils/utils";
import { ModalSendQuote } from "../modal/ModalSendQuote";
import { jsPDF as JSPDFType } from "jspdf";
import { ModalSignedRefusedQuote } from "../modal/ModalSignedRefusedQuote";
import { Modal } from "./Modal";
import { getLeads, getLeadSelected } from "../../features/leads/selectors";
import type { LeadInterface } from "../../types/LeadInterface";
import { selectLead } from "../../features/leads/slice";

export function TableQuote({
  openCreate
}: {
  setEditing: (user: QuoteInterface) => void;
  setOpen: () => void;
  openCreate: () => void;
}) {
    const dispatch = useAppDispatch();
    const quotes = useAppSelector(getQuotes)
    const leads = useAppSelector(getLeads)
    const quoteSelected = useAppSelector(getQuoteSelected)
    const leadSelected = useAppSelector(getLeadSelected)
    
    
    const [query, setQuery] = useState("");
    const [openModalDevice, setOpenModalDevice] = useState(false);
    const [openModalSendQuote, setOpenModalSendQuote] = useState(false);
    const [openModalSignedQuote, setOpenModalSignedQuote] = useState(false);
    const [typeModal, setTypeModal] = useState<"signed" | "refused">("signed");
    const printRef = useRef<HTMLDivElement>(null);
    const [exporting, setExporting] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [openCols, setOpenCols] = useState(false);
  
    const handleStatusChange = (status: string) => {
        setSelectedStatuses((prev) =>
            prev.includes(status)
            ? prev.filter((s) => s !== status) // décocher
            : [...prev, status] // cocher
        );
    };
    
   const filtered = useMemo(() => {
        let arr = !query
            ? quotes
            : quotes.filter((i) =>
                i.status.toLowerCase().includes(query.toLowerCase())
            );

        if (selectedStatuses.length > 0) {
            arr = arr.filter((i) => selectedStatuses.includes(i.status));
        }

        return arr;
    }, [quotes, query, selectedStatuses]) as QuoteInterface[];



    async function handleExportPDF() {
        try {
        setExporting(true);

        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

        
        const node = printRef.current;
        if (!node) throw new Error("printRef introuvable");

        const [{ default: html2canvas }, jsPDFModule] = await Promise.all([
            import("html2canvas"),
            import("jspdf"),
        ]);
        
        const jsPDF = jsPDFModule.jsPDF as typeof JSPDFType;

        
        const canvas = await html2canvas(node, {
            backgroundColor: "#ffffff",
            scale: Math.min(3, window.devicePixelRatio | 3),
            useCORS: true,
            allowTaint: false,
        });
        
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "pt", "a5");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const totalPages = Math.ceil(imgHeight / pageHeight);
        for (let i = 0; i < totalPages; i++) {
            const yOffset = -i * pageHeight;
            pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight);
            if (i < totalPages - 1) pdf.addPage();
        }

        pdf.save("Facture.pdf");
        } catch (e) {
        console.error("Export PDF failed:", e);
        alert("Échec de l’export PDF");
        } finally {
        setExporting(false);
        }
    }

    

    return (
        <div className=" rounded-2xl bg-[var(--card)] p-4 mb-8">
            <div className="flex flex-row justify-between items-center ">
                <div className="flex flex-row items-center gap-4">
                    <div><span className="2xl:text-sm text-[11px] font-bold">Devis</span></div>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <div className="relative 2xl:text-xs text-[11px]">
                        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 " />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher par nom ou email"
                            className="rounded-sm px-3 py-2 outline-none pl-9"
                        />
                    </div>
                    <div>
                        <button
                            onClick={() => setOpenCols(true)}
                            className="rounded-sm 2xl:px-3 px-2 2xl:py-2 py-1 text-[11px] bg-[var(--panel)] inline-flex items-center gap-2"
                            title="Choisir les colonnes"
                        >
                            <Columns3 size={16} /> Filtrer
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 rounded-sm 2xl:px-3 px-2 2xl:py-2 py-1 text-[11px] font-medium text-white hover:opacity-95" style={{ background: "var(--primary-text)" }}
                        >
                            <Plus size={16} /> Nouveau Devis
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <table className="table">
                    <thead className="sticky top-0 text-xs">
                    <tr className="border-b border-[var(--field)]">
                        <th>Lead</th>
                        <th>Info</th>
                        <th>Status</th>
                        <th>Element</th>
                        <th>Total</th>
                        <th>Expiré</th> 
                        <th>Signé </th> 
                        <th>Exporter</th>
                    </tr>
                    </thead>
                        {quotes?.length > 0 ? (
                            <tbody>
                                {filtered.map((item, index) => {
                                    const idx = leads.findIndex((n) => n.id === item.leadId)
                                    const lead : LeadInterface = leads[idx]
                                    return (
                                    <tr key={index}  className={`${index % 2 ? "bg-[var(--panel)]" : ""} 2xl:text-[11px] text-[10px] `}>
                                        <td>
                                            <div>{lead.firstName}</div>
                                            <div><span className="text-[10px] opacity-70">{lead.lastName}</span></div>
                                        </td>
                                        <td>
                                            <div>{lead.company }</div>
                                            <div>{lead.email }</div>
                                            <div><span className="text-[10px] opacity-70">{lead.phone}</span></div>
                                        </td>
                                        <td>
                                            <span
                                             className={` px-2 py-1 rounded-full text-white text-[10px] uppercase
                                                ${item.status === "DRAFT" ? "bg-gray-500" : ""}
                                                ${item.status === "SENT" ? "bg-blue-600" : ""}
                                                ${item.status === "SIGNED" ? "bg-green-600" : ""}
                                                ${item.status === "REFUSED" ? "bg-red-600" : ""}
                                                ${item.status === "EXPIRED" ? "bg-orange-600" : ""}
                                            `}
                                            >
                                                {item.status === "DRAFT" ? "En cours" : ""}
                                                {item.status === "SENT" ? "Envoyé" : ""}
                                                {item.status === "SIGNED" ? "Signé" : ""}
                                                {item.status === "REFUSED" ? "Réfusé" : ""}
                                                {item.status === "EXPIRED" ? "Expiré" : ""}
                                            </span>
                                        </td>
                                        <td onClick={() => {
                                            setOpenModalDevice(true)
                                            dispatch(selectQuote(item))
                                        }} className="cursor-pointer">
                                            {item.items.length}
                                        </td>
                                        <td>{item.totalAmount} Ar</td>
                                        <td>
                                            {
                                                item.expiresAt ? (
                                                    <div 
                                                        className="flex flex-col gap-1 "
                                                       
                                                    >
                                                        <div className="text-[10px] opacity-70">Date d'envoie : {formatDateISO(item.sentAt)}</div>
                                                        <div className="text-[10px] opacity-70">Date d'expiration : {formatDateISO(item.expiresAt)}</div>
                                                        <div> <Progress startDate={item.sentAt} endDate={item.expiresAt}/></div>
                                                       
                                                    </div>
                                                ):(
                                                   item.items.length > 0 ? (
                                                     <button 
                                                        className="text-[10px] bg-green-600 py-1 px-4 text-white cursor-pointer"
                                                        onClick={() => {
                                                            setOpenModalSendQuote(true)
                                                            dispatch(selectQuote(item))
                                                        }}
                                                    >Envoyer le devis</button>
                                                   ):(
                                                    <div>__</div>
                                                   )
                                                )
                                            }
                                        </td>
                                        <td>
                                            {
                                                item.signedAt ? (
                                                    <div className="text-[10px] opacity-70">
                                                        <div>Signé le : {formatDateISO(item.signedAt)}</div>
                                                        <div>Code : {item.signedProof?.ipAddress}</div>
                                                    </div>
                                                ):(
                                                    <div className="text-[10px] opacity-70">
                                                        {
                                                            item.status === "SENT" ? (
                                                                <div className="flex flex-col gap-1">
                                                                    <button 
                                                                        className="text-[10px] bg-blue-600 py-1 px-4 text-white cursor-pointer"
                                                                        onClick={() => {
                                                                            setOpenModalSignedQuote(true)
                                                                            setTypeModal("signed")
                                                                            dispatch(selectQuote(item))
                                                                        }}
                                                                    >Signer</button>
                                                                    <button 
                                                                        className="text-[10px] bg-red-600 py-1 px-4 text-white cursor-pointer"
                                                                        onClick={() => {
                                                                            setOpenModalSignedQuote(true)
                                                                            dispatch(selectQuote(item))
                                                                            setTypeModal("refused")
                                                                        }}
                                                                    >Refuser</button>
                                                                </div>
                                                            ):(
                                                                <div>__</div>
                                                            )
                                                        }
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td>
                                           {
                                            item.status === "SIGNED" ? (
                                                 <button 
                                                    disabled={exporting}
                                                    className="text-[10px] bg-green-600 py-1 px-4 text-white cursor-pointer"
                                                    onClick={() => {
                                                        dispatch(selectLead(lead))
                                                        dispatch(selectQuote(item))
                                                        handleExportPDF()
                                                    }}
                                                >{exporting ? "Export en cours..." : "Exporter"}</button>
                                            ):(
                                                <div>__</div>
                                            )
                                           }
                                        </td>
                                    </tr>
                                )
                                })}
                            </tbody>
                        ) : (
                            <div className="text-sm text-gray-500">Aucune lead.</div>
                        )}
                </table>
            </div>

            {/* modal export pdf */}
            {exporting && (
                <div style={{ position: "fixed", left: -99999, top: 0 }}>
                    <div ref={printRef} className="p-8 mt-6 rounded shadow max-w-2xl mx-auto"  style={{ width: "800px" }}>
                        <span className="font-bold text-center mb-15 text-[16px]">Facture</span>

                        <div className="flex justify-between mt-4 mb-8 text-[12px]">
                            <div>
                                <p><span>n°:</span> {quoteSelected?.id}</p>
                                <p><span>Client :</span> {leadSelected?.firstName} {leadSelected?.lastName}</p>
                                <p><span>Company : {leadSelected?.company}</span></p>
                                <p><span>Date :</span> {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="w-full">
                            <div className="flex flex-row justify-between text-[11px] font-bold">
                                <div className="w-1/4">Description</div>
                                <div className="w-1/4">Quantity</div>
                                <div className="w-1/4">Prix unitaire (Ar)</div>
                                <div className="w-1/4">Total (Ar)</div>
                            </div>
                            <div className="flex flex-col gap-1 mt-3 text-[11px]">
                                {
                                    quoteSelected?.items
                                        .map((n) =>{
                                        return  (
                                        <div
                                            key={n.id}
                                            className="flex flex-row justify-between items-start text-left gap-1"
                                        >
                                            <div className="text-left w-full bg-[var(--field)] p-1">{n.description}</div>
                                            <div className="text-left w-full bg-[var(--field)] p-1">{n.quantity}</div>
                                            <div className="text-left w-full bg-[var(--field)] p-1">{n.unitPrice}</div>
                                            <div className="text-left w-full bg-[var(--field)] p-1">{n.total}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="text-right font-semibold text-xs mt-2">
                        Total : {quoteSelected?.totalAmount.toLocaleString()} Ar
                        </div>
                    </div>
                </div>
            )}


            {/* modal filter */}
            <Modal open={openCols} onClose={() => setOpenCols(false)} title="Choisir les colonnes">
                <div className="flex flex-col flex-wrap items-start gap-2">
                    {Object.entries(QuoteStatus).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-1 text-xs">
                        <input
                            type="checkbox"
                            checked={selectedStatuses.includes(key)}
                            onChange={() => handleStatusChange(key)}
                            className="accent-[var(--primary-text)]"
                        />
                        {value}
                        </label>
                    ))}
                </div>

            </Modal>


            <ModalSendQuote
                open={openModalSendQuote}
                onClose={() => setOpenModalSendQuote(false)}
                title="Envoyer le devis"
            /> 

            <ModalSignedRefusedQuote
                open={openModalSignedQuote}
                onClose={() => setOpenModalSignedQuote(false)}
                title={typeModal === "signed" ? "Signer le devis" : "Refuser le devis"}
                type={typeModal}
            /> 


            <ModalViewQuote
                open={openModalDevice}
                onClose={() => setOpenModalDevice(false)}
            /> 

           
        </div>

    );
}