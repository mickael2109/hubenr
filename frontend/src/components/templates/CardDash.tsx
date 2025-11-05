
import type { JSX } from "react";

interface cardDashProps {
  type?: string;
  title: string;
  value: number;
  icon: JSX.Element;              
  colorIndex: number;                 
}
const COLORS = ["#F7931A", "#627EEA", "#00AAE4", "#26A17B", "#ffe900"];

export function CardDash({ title, value, icon, colorIndex }: cardDashProps) {
    const textColor = COLORS[colorIndex];
    const bgColor = COLORS[colorIndex];

   



  return (
    <div className={`bg-[var(--card)] 2xl:p-6 p-4 flex flex-row justify-between items-center w-full rounded-xl`}>
      <div className="flex flex-row-reverse justify-between items-center w-full">
        <div className={` w-10 h-10 flex items-center justify-center rounded-full`} style={{background : bgColor}}>
          <i className={`text-2xl text-[${textColor}]`} >{icon}</i>
        </div>
        <div className="flex flex-col 2xl:gap-4 gap-2">
            <div><span className="opacity-70 font-semibold 2xl:text-[14px] text-xs">{title}</span></div>
            <div><span className="2xl:text-[16px] text-sm font-bold">{value}</span></div>
        </div>
      </div>
    </div>
  );
}

