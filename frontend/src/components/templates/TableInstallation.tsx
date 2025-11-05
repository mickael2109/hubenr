import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppSelector } from "../../app/store";
import { getQuotes } from "../../features/quote/selectors";
import { ModalViewQuote } from "../modal/ModalViewQuote";
import { getAllInstallations } from "../../features/installation/selectors";
import type { InstallationInterface } from "../../types/InstallationInterface";
import { getLeads } from "../../features/leads/selectors";
import type { QuoteInterface } from "../../types/QuoteInterface";
import type { LeadInterface } from "../../types/LeadInterface";
import { VscDebugStart } from "react-icons/vsc";
import { CardInstallation } from "./CardInstallation";
import { FaHourglassStart } from "react-icons/fa";
import { MdCheckBox } from "react-icons/md";

export function TableInstallation() {
    const quotes = useAppSelector(getQuotes)
    const installations = useAppSelector(getAllInstallations)
    const leads = useAppSelector(getLeads)
    
    
    const [query, setQuery] = useState("");
    const [openModalDevice, setOpenModalDevice] = useState(false);
  
    
    const filtered = useMemo(() => {
        const arr = !query
            ? installations
            : installations.filter(
                (i) =>
                i.status.toLowerCase().includes(query.toLowerCase())
            );

        return arr;
    }, [installations, query]) as InstallationInterface[];




    return (
        <div className=" rounded-2xl bg-[var(--card)] p-4 mb-8">
            <div className="flex flex-row justify-between items-center ">
                <div className="flex flex-row items-center gap-4">
                    <div><span className="2xl:text-sm text-[11px] font-bold">Installations</span></div>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <div className="relative 2xl:text-xs text-[11px]">
                        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 " />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher par status"
                            className="rounded-sm px-3 py-2 outline-none pl-9"
                        />
                    </div>
                </div>
            </div>

            {/* installation en préparation */}
             <div className="mt-4">
                
                {installations?.filter(n => n.status === "PREPARATION").length > 0 ? (
                        <div>
                            <div className="mb-2"><span className="text-[12px] font-bold">Installation en préparation</span></div>
                            <div className="flex flex-wrap gap-2 justify-start items-start">
                                {
                                    filtered
                                        .filter(item => item.status === "PREPARATION")
                                        .map((item, index) => {
                                            const idxQuote =  quotes.findIndex((n) => n.id === item.quoteId)
                                            const quote : QuoteInterface = quotes[idxQuote]
                                            const idx = leads.findIndex((n) => n.id === quote.leadId)
                                            const lead : LeadInterface = leads[idx]

                                            return (
                                                <CardInstallation 
                                                    key={index}
                                                    id={item.id}
                                                    lead= {lead.firstName}
                                                    company={lead.company}
                                                    devis={quote.totalAmount}
                                                    status={item.status}
                                                    icon={<VscDebugStart />}
                                                    colorIndex={0}
                                                />
                                            )
                                        }
                                    )
                                }
                                        
                            </div>
                        </div>
                    ):
                    (
                        <div></div>
                    )
                }
            </div>

            {/* installation en cours */}
             <div className="mt-4">
                {installations?.filter(n => n.status === "INPROGRESS").length > 0 ? (
                       <div>
                            <div className="mb-2"><span className="text-[12px] font-bold">Installation en cours</span></div>
                            <div className="flex flex-wrap gap-2 justify-start items-start">
                                {
                                    filtered
                                        .filter(item => item.status === "INPROGRESS")
                                        .map((item, index) => {
                                            const idxQuote =  quotes.findIndex((n) => n.id === item.quoteId)
                                            const quote : QuoteInterface = quotes[idxQuote]
                                            const idx = leads.findIndex((n) => n.id === quote.leadId)
                                            const lead : LeadInterface = leads[idx]

                                            return (
                                                <CardInstallation 
                                                    key={index}
                                                    id={item.id}
                                                    lead= {lead.firstName}
                                                    company={lead.company}
                                                    devis={quote.totalAmount}
                                                    status={item.status}
                                                    icon={<FaHourglassStart />}
                                                    colorIndex={1}
                                                />
                                            )
                                        }
                                    )
                                }
                                        
                            </div>
                       </div>
                    ):
                    (
                        <div></div>
                    )
                }
            </div>

            {/* installation terminée */}
            <div className="mt-4">
                
                {installations?.filter(n => n.status === "COMPLETED").length > 0 ? (
                        <div>
                            <div className="mb-2"><span className="text-[12px] font-bold">Installation terminée</span></div>
                            <div className="flex flex-wrap gap-2 justify-start items-start">
                                {
                                    filtered
                                        .filter(item => item.status === "COMPLETED")
                                        .map((item, index) => {
                                            const idxQuote =  quotes.findIndex((n) => n.id === item.quoteId)
                                            const quote : QuoteInterface = quotes[idxQuote]
                                            const idx = leads.findIndex((n) => n.id === quote.leadId)
                                            const lead : LeadInterface = leads[idx]

                                            return (
                                                <CardInstallation 
                                                    key={index}
                                                    id={item.id}
                                                    lead= {lead.firstName}
                                                    company={lead.company}
                                                    devis={quote.totalAmount}
                                                    status={item.status}
                                                    icon={<MdCheckBox />}
                                                    colorIndex={2}
                                                />
                                            )
                                        }
                                    )
                                }
                                        
                            </div>
                        </div>
                    ):
                    (
                        <div></div>
                    )
                }
            </div>

            <ModalViewQuote
                open={openModalDevice}
                onClose={() => setOpenModalDevice(false)}
            /> 

           
        </div>

    );
}