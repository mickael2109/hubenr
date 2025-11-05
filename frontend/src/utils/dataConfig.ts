
 // --- Helpers ISO week (sans lib) ---
export function getISOWeek(d: Date) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = date.getUTCDay() || 7;              
    date.setUTCDate(date.getUTCDate() + 4 - day);  
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return { year: date.getUTCFullYear(), week };
}

export function getISOWeekKey(d: Date) {
    const { year, week } = getISOWeek(d);
    return `${year}-W${String(week).padStart(2, "0")}`; 
}

// (optionnel) pour afficher la plage Lundi–Dimanche
export function parseWeekKey(weekKey: string) {
  const [y, w] = weekKey.split("-W");
  return { year: Number(y), week: Number(w) };
}


export function weekKeyToRange(weekKey: string) {
  const { year, week } = parseWeekKey(weekKey);
  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const dow = simple.getUTCDay(); // 0..6
  const ISOmonday = new Date(simple);
  const diff = (dow === 0 ? -6 : 1) - dow; // ramène au lundi
  ISOmonday.setUTCDate(simple.getUTCDate() + diff);

  const monday = new Date(ISOmonday);
  const sunday = new Date(ISOmonday);
  sunday.setUTCDate(ISOmonday.getUTCDate() + 6);

  return { monday, sunday };
}


export function formatWeekRangeFr(monday: Date, sunday: Date) {
  const sameMonth = monday.getMonth() === sunday.getMonth();
  const sameYear = monday.getFullYear() === sunday.getFullYear();

  const dayMon = monday.getDate();
  const daySun = sunday.getDate();

  const fmtMonth = new Intl.DateTimeFormat("fr-FR", { month: "short" }).format;
  const monPart = sameMonth
    ? `${dayMon}`
    : `${dayMon} ${fmtMonth(monday)}${sameYear ? "" : " " + monday.getFullYear()}`;
  const sunPart = `${daySun} ${fmtMonth(sunday)} ${sunday.getFullYear()}`;

  return `${monPart}–${sunPart}`;
}


