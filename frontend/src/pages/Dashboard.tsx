import { FaUsers } from "react-icons/fa";
import { RiUserStarFill } from "react-icons/ri";
import { MdRequestQuote } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa";
import { MdOutlineDownloadDone } from "react-icons/md";
import { CardDash } from "../components/templates/CardDash";
import { useAppSelector } from "../app/store";
import { getQuotes } from "../features/quote/selectors";
import { useMemo, useState } from "react";
import { ChartDonutCard, ChartLine } from "../components/templates/Chart";
import { getAllInstallations } from "../features/installation/selectors";
import { getLeads } from "../features/leads/selectors";
import { getUsers } from "../features/user/selectors";
import { TableLead } from "../components/templates/TableLead";
import type { LeadInterface } from "../types/LeadInterface";
import { ModalCreateUpdateLead } from "../components/modal/ModalCreateUpdateLead";

const Dashboard = () => {    

    const users = useAppSelector(getUsers)
    const quotes = useAppSelector(getQuotes)
    const installations = useAppSelector(getAllInstallations)
    const leads = useAppSelector(getLeads)

    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<LeadInterface | null>(null);

    function openCreate() {
        setEditing(null);
        setOpen(true);
    }
    

    const quoteFiltred = useMemo(() => {
        return quotes.filter((item) => item.status === "SIGNED");
    }, [quotes]);

    const dailyCoverage = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth(); 
        const currentYear = now.getFullYear();

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const counts: Record<number, number> = {};
        quoteFiltred.forEach((quote) => {
        const date = new Date(quote.signedAt);
        if (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
        ) {
            const day = date.getDate();
            counts[day] = (counts[day] || 0) + 1;
        }
        });

        const result = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const label = `${day} ${now.toLocaleString("fr-FR", { month: "short" })}`;
        return {
            day,
            label,
            value: counts[day] || 0, 
        };
        });

        return result;
    }, [quoteFiltred]);
    

    
    
    
    return (
        <div className=" h-screen overflow-y-scroll no-scrollbar relative p-2 flex flex-col gap-4">
           <div className="flex flex-row justify-start items-center gap-4">
                <CardDash
                    title="Clients"
                    value={users!.length || 0}
                    type="up"
                    icon={<FaUsers />}
                    colorIndex={0}
                />

                <CardDash
                    title="Leads"
                    value={leads!.length  || 0}
                    type="up"
                    icon={<RiUserStarFill />}
                    colorIndex={1}
                />
                
                <CardDash
                    title="Devis"
                    value={quotes!.length  || 0}
                    type="up"
                    icon={<MdRequestQuote />}
                    colorIndex={2}
                />
                <CardDash
                    title="Signature"
                    value={quotes!.filter(item => item.status === "SIGNED").length  || 0}
                    type="up"
                    icon={<FaFileSignature />}
                    colorIndex={3}
                />
                <CardDash
                    title="Installation"
                    value={installations?.length || 0}
                    type="down"
                    icon={<MdOutlineDownloadDone />}
                    colorIndex={4}
                />
           </div>
           <div className="flex flex-row justify-between items-center gap-4">
                <div className=" w-2/3">
                    <ChartLine
                        title="Devis signé par jour"
                        data={dailyCoverage}
                        header="Novembre"
                    />
                </div>
                <div className="w-1/3 h-full"> <ChartDonutCard></ChartDonutCard></div>
           </div>
           <div>
               <TableLead 
                    setEditing={setEditing}
                    setOpen={() => setOpen(true)}
                    openCreate={openCreate}
                ></TableLead>
           </div>

            <ModalCreateUpdateLead
                open={open}
                onClose={() => setOpen(false)}
                title={editing ? "Modifier lead" : "Nouveau lead"}
                editing={editing}
            /> 
            
        </div>
    );
};

export default Dashboard;


