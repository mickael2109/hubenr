import logo from '../../assets/logo_min.png'

const Navbar = () => {



  
  return (
    <div className="p-2 w-full flex flex-row justify-between items-center bg-[var(--panel)]">
      

      <div className="flex flex-row items-center justify-end w-full gap-4">
        

       

        {/* Logo */}
        <div className="flex flex-row items-center justify-center">
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 object-cover rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

 


