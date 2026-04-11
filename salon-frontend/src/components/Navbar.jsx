import { NavLink } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "./Avatar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext"
import { Sidebar } from "./sidebar";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/staffs", label: "Staff" },
  { to: "/contact", label: "Contact" },
];

export const Header = () => {
  const {user,setUser,logout} = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  

  // LOCK BODY SCROLL: Prevents background scrolling when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  const closeMenu = () => setOpen(false);


  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO & MOBILE TRIGGER */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-lg  text-white hover:bg-gray-800 transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <span className="text-white text-xl font-black italic tracking-tighter">
            GLOW & <span className="text-blue-500">GRACE</span>
          </span>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full
                 ${isActive ? " bg-bg-soft" : "text-text-invert! hover:text-white"}`
              }
            >
              
                    {link.label}
            </NavLink>
          ))}
        </nav>

        {/* LOGIN / PROFILE */}
        <div className="flex items-center">
         {user ? (
      <div className="relative">

        {/* Avatar trigger */}
        <div
          className="bg-bg-panel rounded-full cursor-pointer"
          onClick={() => setShowSidebar(prev => !prev)}
        >
          <Avatar name={user.name} size={40} />
        </div>

        {/* Dropdown — floats below avatar */}
        <Sidebar open={showSidebar} setOpen={setShowSidebar} />

      </div>
          ) : (
            <NavLink
              to="/auth/login"
              className="bg-blue-600 text-white text-sm font-bold px-6 py-2 rounded-full hover:bg-blue-500 hover:scale-105 transition-all shadow-lg shadow-blue-600/20"
            >
             <span className="text-text-invert"> Login </span>
            </NavLink>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER SYSTEM */}
      <AnimatePresence>
  {open && (
    <>
      {/* 1. ANIMATED BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeMenu}
        className="fixed inset-0 z-90 bg-black/80 backdrop-blur-sm md:hidden"
      />

      {/* 2. ANIMATED DRAWER */}
      <motion.nav
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-screen w-72 bg-bg-dark z-100 md:hidden flex flex-col shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-800 shrink-0">
          <p className="text-white text-sm font-bold uppercase tracking-widest">
            Navigation
          </p>
          <button onClick={closeMenu} className="p-2 text-white">
            <XMarkIcon className="w-10 h-10" />
          </button>
        </div>

        {/* SCROLLABLE LINKS AREA */}
        <div className="flex-1 overflow-y-auto bg-bg-dark">
          <ul className="flex flex-col w-full p-4 space-y-2">
            {navLinks.map((link, i) => (
              <motion.li 
                key={link.to}
                /* STAGGER ANIMATION: Each link slides in from the left */
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.1 + (i * 0.07), // Each link waits slightly longer
                  duration: 0.4,
                  ease: "easeOut" 
                }}
                className="w-full"
              >
               
                <NavLink
                  to={link.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex w-full px-5 py-4 rounded-xl transition-all duration-200 font-semibold
                     ${isActive ? " bg-bg-soft text-black shadow-lg shadow-blue-600/20" : "hover:bg-gray-900 text-white!"}`

                  }
                >        
                    {link.label}
                </NavLink>
             
              </motion.li>
            ))}
          </ul>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-800 shrink-0">
          <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">
            © 2024 Glow & Grace
          </p>
        </div>
      </motion.nav>
    </>
  )}
</AnimatePresence>
    </header>
  );
};
