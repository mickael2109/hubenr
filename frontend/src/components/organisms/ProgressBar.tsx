

type ProgressProps = {
  startDate: string; // format ISO
  endDate: string;   // format ISO
  danger?: boolean;
};



export function Progress({ startDate, endDate }: ProgressProps) {
  
  const now = new Date().getTime();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  const total = end - start;
  
  
  const elapsed = now - start;

  

  let value = (elapsed / total) * 100;
  
  value = Math.min(100, Math.max(0, value)); 

  let gradientColor = "from-green-500 to-green-400";

  if (value >= 25 && value < 35) gradientColor = "from-yellow-400 to-yellow-300";
  else if (value >= 35 && value < 75) gradientColor = "from-orange-400 to-orange-300";
  else if (value >= 75) gradientColor = "from-rose-500 to-red-500";

  return (
    <div className="w-44">
      <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-1.5 rounded-full bg-gradient-to-r ${gradientColor} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="mt-1 text-xs tabular-nums text-gray-600">{value.toFixed(0)}%</div>
    </div>
  );
}

