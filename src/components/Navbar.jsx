import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { pb } from "../lib/pb";
import { 
  Building2, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  Bell, 
  LifeBuoy 
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // HIDE NAVBAR ON LANDING PAGE
  // The Landing page has its own custom transparent navbar, so we hide this global one.
  // Home page and Admin dashboard have their own header
  if (
    location.pathname === "/" ||
    location.pathname === "/home" ||
    location.pathname === "/dashboard/admin"
  ) {
    return null;
  }

  const isAuth = pb.authStore.isValid;
  const user = pb.authStore.model;

  // Determine which dashboard to send the user to
  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "agent") return "/dashboard/agent";
    return "/dashboard/user";
  };

  const handleLogout = () => {
    pb.authStore.clear(); // Clears the local PocketBase session
    setIsOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          
          {/* LOGO */}
          <Link to="/home" className="flex items-center gap-2 group" onClick={closeMenu}>
            <div className="bg-blue-50 p-2 rounded-xl group-hover:bg-accent transition-colors">
              <Building2 className="text-accent group-hover:text-white transition-colors w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold text-brand tracking-tight">EstateSync.</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/home" className="text-gray-600 hover:text-accent font-medium transition-colors">Home</Link>
            <Link to="/services" className="text-gray-600 hover:text-accent font-medium transition-colors">Services</Link>
            <Link to="/support" className="text-gray-600 hover:text-accent font-medium transition-colors">Support</Link>

            <div className="w-px h-6 bg-gray-200 mx-2"></div> {/* Divider */}

            {isAuth ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/notifications" 
                  className="p-2 text-gray-500 hover:text-accent hover:bg-blue-50 rounded-full transition-all"
                  title="Notifications"
                >
                  <Bell size={20} />
                </Link>
                
                <Link 
                  to={getDashboardLink()} 
                  className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-brand px-4 py-2 rounded-full font-bold hover:border-accent hover:text-accent transition-all"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                  title="Log Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-brand font-bold hover:text-accent transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="bg-accent text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-brand transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full shadow-xl pb-6">
          <div className="px-6 pt-4 space-y-4 flex flex-col">
            <Link to="/home" onClick={closeMenu} className="text-gray-600 font-medium text-lg hover:text-accent">Home</Link>
            <Link to="/services" onClick={closeMenu} className="text-gray-600 font-medium text-lg hover:text-accent">Services</Link>
            <Link to="/support" onClick={closeMenu} className="text-gray-600 font-medium text-lg hover:text-accent flex items-center gap-2">
              Support <LifeBuoy size={18}/>
            </Link>

            <div className="h-px bg-gray-100 my-2"></div>

            {isAuth ? (
              <>
                <Link to="/notifications" onClick={closeMenu} className="text-gray-600 font-medium text-lg hover:text-accent flex items-center gap-2">
                  <Bell size={18}/> Notifications
                </Link>
                <Link to={getDashboardLink()} onClick={closeMenu} className="bg-gray-50 border border-gray-200 text-brand px-4 py-3 rounded-xl font-bold flex justify-center items-center gap-2 mt-2">
                  <LayoutDashboard size={18} /> Go to Dashboard
                </Link>
                <button onClick={handleLogout} className="text-red-500 font-bold text-lg text-left mt-2 flex items-center gap-2">
                  <LogOut size={18} /> Log Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-4">
                <Link to="/login" onClick={closeMenu} className="w-full text-center border border-gray-200 text-brand px-6 py-3 rounded-xl font-bold">
                  Log In
                </Link>
                <Link to="/register" onClick={closeMenu} className="w-full text-center bg-accent text-white px-6 py-3 rounded-xl font-bold shadow-md">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}