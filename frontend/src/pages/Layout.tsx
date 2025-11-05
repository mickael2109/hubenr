import Cookies from 'js-cookie';

import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../app/store';
import { TOKEN_KEY } from '../storage/admin';
import LoadingPage from '../utils/loadingPage';
import Sidebar from '../components/templates/Sidebar';
import Navbar from '../components/templates/Navbar';
import ModalParametre from '../components/modal/ModalParametre';
import { getAllUsers, getInfoUser } from '../features/user/thunk';
import type { UserInterface } from '../types/UserInterface';
import { selectUserConnected } from '../features/user/slice';
import { getAllLeads } from '../features/leads/thunk';
import { getAllQuotes } from '../features/quote/thunk';
import { getAllInstallation } from '../features/installation/thunk';


// -------- Thème (stocké en localStorage) -------------------------------------
export type ThemeState = {
  mode: "light" | "dark";
  primary: "indigo" | "emerald" | "rose" | "amber" | "sky";
  density: "normal" | "compact";
};
const DEFAULT_THEME: ThemeState = { mode: "light", primary: "indigo", density: "normal" };

function loadTheme(): ThemeState {
  try {
    const raw = localStorage.getItem("smillin_theme");
    if (!raw) return DEFAULT_THEME;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_THEME, ...parsed };
  } catch {
    return DEFAULT_THEME;
  }
}

function saveTheme(t: ThemeState) {
  localStorage.setItem("smillin_theme", JSON.stringify(t));
}
function applyTheme(t: ThemeState) {
  const root = document.documentElement;
  // couleurs primaires (nuances proches Tailwind)
  const map: Record<ThemeState["primary"], { bg: string; text: string; ring: string }> = {
    indigo:  { bg: "#EEF2FF", text: "#4338CA", ring: "rgba(67,56,202,0.15)" },
    emerald: { bg: "#ECFDF5", text: "#047857", ring: "rgba(4,120,87,0.15)" },
    rose:    { bg: "#FFF1F2", text: "#BE123C", ring: "rgba(190,18,60,0.15)" },
    amber:   { bg: "#FFFBEB", text: "#B45309", ring: "rgba(180,83,9,0.15)" },
    sky:     { bg: "#E0F2FE", text: "#0369A1", ring: "rgba(3,105,161,0.15)" },
  };

  const prim = map[t.primary];
  root.style.setProperty("--primary-bg", prim.bg);
  root.style.setProperty("--primary-text", prim.text);
  root.style.setProperty("--primary-ring", prim.ring);

  // mode
  const isDark = t.mode === "dark";
  root.style.setProperty("--bg", isDark ? "#0b0d12" : "#fffffd");
  root.style.setProperty("--panel", isDark ? "#111318" : "#faf9f7");
  root.style.setProperty("--field", isDark ? "#0b0d12" : "#f2f0f0");
  root.style.setProperty("--text", isDark ? "#F3F4F6" : "#111827");
  root.style.setProperty("--muted", isDark ? "#9CA3AF" : "#6B7280");
  root.style.setProperty("--card", isDark ? "#151922" : "#ffffff");
  root.style.setProperty("--border", isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)");

  // densité
  root.style.setProperty("--space", t.density === "compact" ? "0.5rem" : "0.75rem");
}




const Layout = () => {

    const dispatch = useAppDispatch()
    const tokenUser = Cookies.get(TOKEN_KEY);
    const [isLoading, setIsLoading] = useState(false);

    const [theme, setTheme] = useState<ThemeState>(loadTheme());
    const [openSettings, setOpenSettings] = useState(false);

    const [value, setValue] = useState(0)
    const [text, setText] = useState("Chargement")

    useEffect(() => { applyTheme(theme); saveTheme(theme); }, [theme]);
    

    useEffect(() => {
        const fetchData = async () => {
            if (tokenUser) {
            
                setText("Chargement")

                // get user info 
                const rep = await dispatch(getInfoUser(tokenUser));
                const payload = rep.payload.data as UserInterface;
                const success = rep.payload.success as boolean;
                if (success) dispatch(selectUserConnected(payload))
                setValue(10)

                // get all users
                await dispatch(getAllUsers(tokenUser || "")).unwrap();
                setValue(20)


                // get all leads
                await dispatch(getAllLeads(tokenUser || "")).unwrap();
                setValue(30)


                // get all quotes
                await dispatch(getAllQuotes(tokenUser || "")).unwrap();
                setValue(50)


                 // get all installations
                await dispatch(getAllInstallation(tokenUser || "")).unwrap();
                setValue(70)
              

                setText('Terminé')
                setIsLoading(false);
            }
        }
        fetchData();

    }, [dispatch, tokenUser]);

    
    if (isLoading) {
        return <LoadingPage text={text} value={value}></LoadingPage>
    }

    return (
      <div className="fixed top-0 left-0 w-full flex flex-row h-screen " style={{ background: "var(--bg)", color: "var(--text)" }}>

            <div className=''><Sidebar setOpenSettings={setOpenSettings}/></div>
        
            <div className='flex flex-col w-full '>
                <div className=''><Navbar /></div>
                <div className="w-full h-screen ">
                  <div className="absolute -z-1 top-10 left-20 w-full h-screen bg-[var(--primary-text)] rounded-full mix-blend-multiply filter blur-3xl opacity-4 "></div>
                    <Outlet />
                </div>
            </div>

              <ModalParametre 
                open={openSettings}
                onClose={() => setOpenSettings(false)}
                theme={theme}
                setTheme={setTheme}
              />

      </div>

    );
}

export default Layout;

