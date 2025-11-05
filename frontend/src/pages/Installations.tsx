import { TableInstallation } from "../components/templates/TableInstallation";

const Installations = () => {    



    return (
        <div className=" h-screen overflow-y-scroll no-scrollbar relative p-2 flex flex-col gap-4">
           <div>
                <TableInstallation
                ></TableInstallation>
           </div>

           
            
        </div>
    );
};

export default Installations;


