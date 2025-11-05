import { useState } from "react";
import { TableLead } from "../components/templates/TableLead";
import type { LeadInterface } from "../types/LeadInterface";
import { ModalCreateUpdateLead } from "../components/modal/ModalCreateUpdateLead";

const Leads = () => {    

    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<LeadInterface | null>(null);

    function openCreate() {
        setEditing(null);
        setOpen(true);
    }

    return (
        <div className=" h-screen overflow-y-scroll no-scrollbar relative p-2 flex flex-col gap-4">
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

export default Leads;


