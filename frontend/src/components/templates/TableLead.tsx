import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { getLeads } from "../../features/leads/selectors";
import { useAppSelector } from "../../app/store";
import type { LeadInterface } from "../../types/LeadInterface";

export function TableLead({
  setEditing,
  setOpen,
  openCreate
}: {
  setEditing: (user: LeadInterface) => void;
  setOpen: () => void;
  openCreate: () => void;
}) {

    const leads = useAppSelector(getLeads)
    
    const [query, setQuery] = useState("");

  
    
    const filtered = useMemo(() => {
        const arr = !query
            ? leads
            : leads.filter(
                (i) =>
                i.firstName.toLowerCase().includes(query.toLowerCase()) ||
                i.lastName.toLowerCase().includes(query.toLowerCase())
            );

        return arr;
    }, [leads, query]) as LeadInterface[];




    return (
        <div className=" rounded-2xl bg-[var(--card)] p-4 mb-8">
            <div className="flex flex-row justify-between items-center ">
                <div className="flex flex-row items-center gap-4">
                    <div><span className="2xl:text-sm text-[11px] font-bold">Leads</span></div>
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
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 rounded-sm 2xl:px-3 px-2 2xl:py-2 py-1 text-[11px] font-medium text-white hover:opacity-95" style={{ background: "var(--primary-text)" }}
                        >
                            <Plus size={16} /> Nouveau Lead
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <table className="table">
                    <thead className="sticky top-0 text-xs">
                    <tr className="border-b border-[var(--field)]">
                        <th>Lead</th>
                        <th>Contacte</th>
                        <th>Company</th>
                        <th>Assigné par</th> 
                        <th>Status</th> 
                    </tr>
                    </thead>
                        {leads?.length > 0 ? (
                            <tbody>
                                {filtered.map((item, index) => {

                                    return (
                                    <tr key={index}  className={`${index % 2 ? "bg-[var(--panel)]" : ""} 2xl:text-[11px] text-[10px] `}>
                                        <td>
                                            <div>{item.firstName || item.lastName}</div>
                                            <div><span className="text-[10px] opacity-70">{item.email}</span></div>
                                        </td>
                                        <td>
                                            <div><span className="text-[10px] opacity-70">+261 345099342</span></div>
                                        </td>
                                        <td>{item.company}</td>
                                        <td>
                                            <div>{item.assignedToUser!.name || item.assignedToUser!.email}</div>
                                            <div><span className="text-[10px] opacity-70">{item.assignedToUser!.email}</span></div>
                                        </td>
                                        <td>
                                            <span className={` px-2 py-1 rounded-full text-white text-[10px] uppercase
                                                ${item.status === "NEW" ? "bg-blue-500" : ""}
                                                ${item.status === "CONTACTED" ? "bg-red-400" : ""}
                                                ${item.status === "RECONTACT" ? "bg-red-600" : ""}
                                                ${item.status === "APPOINTMENT" ? "bg-red-800" : ""}
                                                ${item.status === "QUOTESENT" ? "bg-green-600" : ""}
                                            `}
                                            >
                                                {item.status === "NEW" ? "Nouveau" : ""}
                                                {item.status === "CONTACTED" ? "Contacté" : ""}
                                                {item.status === "RECONTACT" ? "En relance" : ""}
                                                {item.status === "APPOINTMENT" ? "RDV pris" : ""}
                                                {item.status === "QUOTESENT" ? "Devis envoyé" : ""}
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={() => {
                                                setEditing(item)
                                                setOpen()
                                            }} className="text-[11px] bg-green-600 px-3 py-1 text-white opacity-80 cursor-pointer">Mettre à jour</button>
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

            {/* <ModalViewDevice
                open={openModalDevice}
                onClose={() => setOpenModalDevice(false)}
                users={users[index]}
            />  */}
        </div>

    );
}