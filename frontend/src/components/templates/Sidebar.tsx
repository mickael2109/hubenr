import { NavLink, useNavigate } from "react-router-dom";
import logo from '../../assets/logo_min.png';
import { FaUsers } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { PATHNAME, TOKEN_KEY, TOKEN_KEY_REFRESH } from "../../storage/admin";
import { RiUserStarFill } from "react-icons/ri";
import { useAppDispatch } from "../../app/store";
import { resetApp } from "../../app/resetAction";
import { MdOutlineDownloadDone, MdRequestQuote } from "react-icons/md";

const Sidebar = ({ setOpenSettings }: { setOpenSettings: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [pathname, setPathname] = useState("dashboard");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const savedPath = localStorage.getItem(PATHNAME);
        if (savedPath) {
        setPathname(savedPath);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(PATHNAME, pathname);
    }, [pathname]);

    const handleLogout = async () => {
        Cookies.remove(TOKEN_KEY);
        Cookies.remove(TOKEN_KEY_REFRESH);
        localStorage.removeItem(PATHNAME); 
        dispatch(resetApp()); 
        navigate("/");
    };

    return (
        <div className="p-2 h-screen flex flex-col justify-between items-center bg-[var(--panel)] w-45">
            <div className="flex flex-col justify-between items-center gap-5 w-full">
                <div className="flex flex-row items-center justify-center ">
                    <img src={logo} alt="logo" className=" object-cover h-20 w-20 rounded-full"/>
                </div>
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                    
                    <NavLink to="/admin" className={`${pathname === "dashboard" ? "bg-[var(--primary-text)]/30 text-[var(--primary-text)]" : ""} text-[11px] p-2 rounded-full flex flex-row items-center justify-start w-full gap-2`} onClick={() => setPathname("dashboard")}><i><FaUsers /></i><span>Dashboard</span></NavLink>    
                    <NavLink to="/admin/leads" className={`${pathname === "leads" ? "bg-[var(--primary-text)]/30 text-[var(--primary-text)]" : ""} text-[11px] p-2 rounded-full flex flex-row items-center justify-start w-full gap-2`} onClick={() => setPathname("leads")}><i><RiUserStarFill /></i><span>Leads</span></NavLink>    
                    <NavLink to="/admin/quotes" className={`${pathname === "quotes" ? "bg-[var(--primary-text)]/30 text-[var(--primary-text)]" : ""} text-[11px] p-2 rounded-full flex flex-row items-center justify-start w-full gap-2`} onClick={() => setPathname("quotes")}><i><MdRequestQuote /></i><span>Devis</span></NavLink>    
                    <NavLink to="/admin/installations" className={`${pathname === "installations" ? "bg-[var(--primary-text)]/30 text-[var(--primary-text)]" : ""} text-[11px] p-2 rounded-full flex flex-row items-center justify-start w-full gap-2`} onClick={() => setPathname("installations")}><i><MdOutlineDownloadDone /></i><span>Installations</span></NavLink>    
                </div>
            </div>

            <div className="flex flex-col justify-start items-start gap-2 w-full ">
                <div className="p-2 rounded-full cursor-pointer flex flex-row items-center justify-start w-full gap-2" onClick={() => setOpenSettings(true)}>
                    <i className="text-[21px]"><IoSettingsOutline /></i><span className="text-[11px]">Paramêtre</span>
                </div>
                <NavLink to="/" className="p-2 rounded-full flex flex-row items-center justify-start w-full gap-2" onClick={handleLogout}>
                    <i className="text-[11px]">< IoMdExit /></i>
                    <span className="text-[11px]">Déconnexion</span>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;

 