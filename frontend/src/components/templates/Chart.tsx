
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip,  XAxis, YAxis } from "recharts";
import React, { useMemo } from "react";
import { FaRegUser } from "react-icons/fa";
import { getQuotes } from "../../features/quote/selectors";
import { useAppSelector } from "../../app/store";

const COLORS = ["#F7931A", "#627EEA", "#00AAE4", "#26A17B"];

export function ChartLine({
  title,
  data,
  header,
}: {
  title: string;
  header: string;
  data: { value: number; label: string; day: number }[];
}) {
  const gid = React.useId(); // id unique pour les dégradés
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "var(--card)", color: "var(--text)"}}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="2xl:text-sm text-[11px] font-semibold">{title}</div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="rounded-full border px-2 py-0.5 2xl:text-sm text-[11px]" style={{ borderColor: "var(--border)" }}>
            { header }
          </span>
        </div>
      </div>

      <div className="2xl:h-60 h-50">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`area-${gid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#d33a50" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#d33a50" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor" }} />
            <YAxis hide />
            <Tooltip
              cursor={{ strokeWidth: 0, fill: "rgba(0,0,0,0.04)" }}
              content={({ active, payload }) =>
                active && payload && payload.length ? (
                  <div className="rounded-md bg-[var(--card)]/95 p-2 text-xs shadow border border-gray-100">
                    <div className="font-medium">{payload[0].payload.label}</div>
                    <div>Valeur : <strong>{nf.format(payload[0].payload.value)}</strong></div>
                  </div>
                ) : null
              }
            />
            <Area type="monotone" dataKey="value" stroke="#db3c53" strokeWidth={2.5} fill={`url(#area-${gid})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


const nf = new Intl.NumberFormat(undefined);


export function ChartDonutCard() {
  const quotes = useAppSelector(getQuotes)

  
  // ✅ Regrouper les devis par status
  const finalData = useMemo(() => {
    const counts: Record<string, number> = {};

    // Compter chaque statut
    quotes.forEach((quote) => {
      const status = quote.status.toUpperCase();
      counts[status] = (counts[status] || 0) + 1;
    });

    // Transformer en tableau utilisable par le graphique
    return Object.entries(counts).map(([status, total], index) => ({
      name: status,          // SIGNED, EXPIRED, SENT, etc.
      value: total,          // nombre total de devis pour ce statut
      color: COLORS[index % COLORS.length],
      icon: <FaRegUser size={16} />,
    }));
  }, [quotes]);



  return (
    <div className="rounded-2xl p-6 bg-[var(--card)] h-full relative">
      <div className="flex items-center justify-between mb-4 ">
        <div className="2xl:text-sm text-[11px] font-semibold">Les clients les plus actifs</div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span
            className="rounded-full border px-2 py-0.5 2xl:text-sm text-[11px]"
            style={{ borderColor: "var(--border)" }}
          >
            Devis
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* --- Donut Chart --- */}
        <div className="w-2/3 flex items-center justify-center h-full bg-[var(--panel)] relative">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={finalData}
                dataKey="value"
                innerRadius={70}
                outerRadius={90}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {finalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              {/* ✅ Tooltip intégré */}
              <Tooltip
                // formatter={(value, name, props) => [`${value}`, props.payload.name]}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
                cursor={{ strokeWidth: 0, fill: "rgba(0,0,0,0.04)" }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* --- Valeur centrale --- */}
          {finalData[0] && (
            <div className="absolute text-center">
              <div className="2xl:text-2xl text-sm font-bold">{finalData[0].value}</div>
              <div className="text-xs text-gray-500">{finalData[0].name}</div>
            </div>
          )}
        </div>

        {/* --- Légende droite --- */}
        <div className="flex flex-col gap-3 items-start w-1/2 pl-2 text-[11px]">
          {finalData.map((item, i) => (
            <div key={i} className="flex flex-row items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <span style={{background: item.color}} className="px-2 py-1 rounded-2xl">{item.name} </span>
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm" style={{color: item.color}}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}