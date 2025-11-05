import Cookies from "js-cookie";
import { TOKEN_KEY } from "../storage/admin";


export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // mois entre 0–11
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


export function toLocalISOFromParts(dateStr: string, timeStr: string) {
  if (!dateStr) return "";
  const iso = `${dateStr}T${timeStr || "09:00"}`;
  return new Date(iso).toISOString();
}




export function formatDateISO(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString(); // adapte au fuseau local
}


export function toISO(y: number, m: number, d: number) {
    const mm = (m + 1).toString().padStart(2, "0");
    const dd = d.toString().padStart(2, "0");
    return `${y}-${mm}-${dd}`;
}



export function prettyDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}


export function prettyHour(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}


export const access_token: string = Cookies.get(TOKEN_KEY) || "";
  
