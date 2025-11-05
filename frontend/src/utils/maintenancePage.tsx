import image from "../assets/svg/maintenance.svg";

const MaintenancePage = () => {
    return (
        <div className="bg-white flex flex-col items-center justify-center h-screen gap-2  w-full z-50">
           <div>
                <img
                    src={image} // ou "../assets/image9.png" selon ta structure
                    alt="image"
                    className="h-30 w-30 object-contain"
                />
           </div>
           <div><span className="text-black/80 text-sm">Ce page est en maintenance</span></div>
        </div>
    );
}

export default MaintenancePage;
