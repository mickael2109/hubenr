
import type { JSX } from "react";
import type { InstallationStatus } from "../../types/InstallationInterface";

interface installationProps {
  key?: number;
  id: string;
  lead: string;
  company: string;
  devis: number;
  status: InstallationStatus
  icon: JSX.Element;              
  colorIndex: number;                 
}
const COLORS1 = ["#fef084", "#bedbff", "#b8f8ce"];
const COLORS2 = ["#d18701", "#145cfc", "#00a73f"];

export function CardInstallation({ id, lead, company, devis, status, icon, colorIndex }: installationProps) {
    const color1 = COLORS1[colorIndex];
    const color2 = COLORS2[colorIndex];

   



  return (
     <div className=" text-[11px] w-50 p-2 flex flex-col justify-start gap-4" style={{backgroundColor: color1}}>
        <div>
            <div>n° : {id}</div>
            <div>Lead : {lead}</div>
            <div>Company : {company}</div>
            <div>Devis : {devis} Ar</div>
        </div>
        <div className="flex flex-row justify-between items-center">
            <div><i className="text-xl" style={{color: color2}}>{icon}</i></div>
            <div><span style={{backgroundColor: color2}} className="px-2 py-1 text-white rounded-4xl text-[10px]">{status}</span></div>
        </div>
    </div>
  );
}

