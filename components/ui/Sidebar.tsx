import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconMenu2,
  IconX,
  IconLogout,
  IconSparkles
} from "@tabler/icons-react";
import { cn } from "../../lib/utils";
import { LordIcon } from "./LordIcon";
import { useStore } from "../../lib/store";

interface SidebarLink {
  label: string;
  href: string;
  iconSrc: string;
}

export const Sidebar = () => {
  const [open, setOpen] = useState(false); // Mobile state
  const [expanded, setExpanded] = useState(false); // Desktop hover state
  const location = useLocation();
  const { user } = useStore();

  const links: SidebarLink[] = [
    { label: "Home", href: "/dashboard", iconSrc: "https://cdn.lordicon.com/wmwqvixz.json" },
    { label: "Prepare", href: "/dashboard/prepare", iconSrc: "https://cdn.lordicon.com/osuxyevn.json" },
    { label: "Interview Results", href: "/dashboard/results", iconSrc: "https://cdn.lordicon.com/gqdnbnwt.json" },
    { label: "HR Round", href: "/dashboard/hr", iconSrc: "https://cdn.lordicon.com/dxjqoygy.json" },
    { label: "Coding Questions", href: "/dashboard/coding", iconSrc: "https://cdn.lordicon.com/nocovwne.json" },
    { label: "Feedback AI", href: "/dashboard/feedback", iconSrc: "https://cdn.lordicon.com/jxztsmnk.json" },
    { label: "Settings", href: "/dashboard/settings", iconSrc: "https://cdn.lordicon.com/sbiheqdr.json" },
  ];

  return (
    <>
      {/* Mobile Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg bg-neutral-900 border border-white/10 text-white shadow-lg"
        >
          {open ? <IconX size={24} /> : <IconMenu2 size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed inset-y-0 left-0 z-40 w-64 bg-neutral-950 border-r border-white/10 p-4 flex flex-col md:hidden"
          >
            <div className="flex items-center gap-2 mb-8 mt-12 px-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">IX</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">InterviewX</span>
            </div>
            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarItem key={idx} link={link} active={location.pathname === link.href} onClick={() => setOpen(false)} />
              ))}
            </div>
            
            <div className="mt-auto border-t border-white/5 pt-4 flex items-center gap-3">
               <img src={user.avatar} alt="User" className="h-10 w-10 rounded-full border border-white/10 bg-neutral-800" />
               <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white truncate max-w-[140px]">{user.name}</span>
                  <span className="text-xs text-neutral-500 truncate">{user.role}</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div
        className={cn(
          "hidden md:flex flex-col h-screen sticky top-0 left-0 z-30 bg-neutral-950 border-r border-white/10 transition-all duration-300 ease-in-out",
          expanded ? "w-64" : "w-20"
        )}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="h-full flex flex-col p-4">
           {/* Logo */}
          <div className="flex items-center gap-3 mb-8 h-10 px-2">
            <div className="h-8 w-8 min-w-[32px] rounded-lg bg-gradient-to-br from-cyan-500 via-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
               <IconSparkles size={18} className="text-white" />
            </div>
             <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: expanded ? 1 : 0, width: expanded ? "auto" : 0 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-bold text-white whitespace-nowrap overflow-hidden"
              >
                InterviewX
              </motion.span>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2 flex-1">
             {links.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                    location.pathname === link.href
                      ? "bg-white/10 text-white shadow-inner"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="flex-shrink-0">
                    <LordIcon 
                        src={link.iconSrc} 
                        size={24} 
                        trigger="hover" 
                        colors={{
                            primary: location.pathname === link.href ? "#ffffff" : "#a1a1aa",
                            secondary: location.pathname === link.href ? "#22d3ee" : "#a1a1aa"
                        }}
                    />
                  </div>
                   <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: expanded ? 1 : 0, width: expanded ? "auto" : 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden font-medium"
                  >
                    {link.label}
                  </motion.span>
                  {location.pathname === link.href && !expanded && (
                     <motion.div
                        layoutId="active-pill"
                        className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-full"
                     />
                  )}
                </Link>
             ))}
          </div>

          {/* User Profile Footer */}
          <div className="mt-auto border-t border-white/5 pt-4">
             <Link to="/dashboard/settings" className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
               <img src={user.avatar} alt="User" className="h-9 w-9 min-w-[36px] rounded-full border border-white/10 bg-neutral-800" />
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: expanded ? 1 : 0, width: expanded ? "auto" : 0 }}
                  className="flex flex-col overflow-hidden"
                >
                  <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                  <span className="text-xs text-neutral-500 truncate">{user.role}</span>
                </motion.div>
                {expanded && <IconLogout size={18} className="ml-auto text-neutral-500 hover:text-red-400" />}
             </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const SidebarItem: React.FC<{ link: SidebarLink; active: boolean; onClick?: () => void }> = ({ link, active, onClick }) => (
  <Link
    to={link.href}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
      active ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-white"
    )}
  >
    <LordIcon 
        src={link.iconSrc} 
        size={20} 
        trigger="hover"
        colors={{
            primary: active ? "#ffffff" : "#a1a1aa",
            secondary: active ? "#22d3ee" : "#a1a1aa"
        }}
    />
    <span className="font-medium">{link.label}</span>
  </Link>
);
