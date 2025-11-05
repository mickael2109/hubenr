import { useState } from "react";
import { TableQuote } from "../components/templates/TableQuote";
import type { QuoteInterface } from "../types/QuoteInterface";
import { ModalCreateUpdateQuote } from "../components/modal/ModalCreateUpdateQuote";

const Quote = () => {    

    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<QuoteInterface | null>(null);

    function openCreate() {
        setEditing(null);
        setOpen(true);
    }

    return (
        <div className=" h-screen overflow-y-scroll no-scrollbar relative p-2 flex flex-col gap-4">
           <div>
                <TableQuote 
                    setEditing={setEditing}
                    setOpen={() => setOpen(true)}
                    openCreate={openCreate}
                ></TableQuote>
           </div>

            <ModalCreateUpdateQuote
                open={open}
                onClose={() => setOpen(false)}
                title={editing ? "Modifier devis" : "Nouveau devis"}
                editing={editing}
            /> 
            
        </div>
    );
};

export default Quote;


