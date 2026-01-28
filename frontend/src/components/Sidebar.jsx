import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, Package, Wrench,
  FileText, LogOut, UserCircle, Calculator, X
} from "lucide-react";

export default function Sidebar({ user, onLogout, isOpen, setIsOpen }) {
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Clientes", path: "/clients", icon: <Users size={20} /> },
    { name: "Inventario", path: "/products", icon: <Package size={20} /> },
    { name: "Servicios", path: "/services", icon: <Wrench size={20} /> },
    { name: "Facturación", path: "/invoices", icon: <FileText size={20} /> },
    { name: "Cierres", path: "/registerClose", icon: <Calculator size={20} /> },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-workshop-dark 
        transform transition-transform duration-300 ease-in-out h-screen
        md:relative md:translate-x-0 md:flex
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col border-r border-white/10 shadow-2xl
      `}>
        
        {/* BRANDING */}
        <div className="p-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white">
              INJECT<span className="text-workshop-red">PRO</span>
            </h1>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-workshop-red text-white font-black shadow-lg shadow-red-900/20"
                    : "text-gray-300 hover:bg-white/5 hover:text-white font-medium"
                }`
              }
            >
              {/* This makes the icon inherit the font weight/color logic */}
              <span className="shrink-0">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* USER PROFILE & LOGOUT */}
        <div className="p-4 mt-auto bg-workshop-dark">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 shrink-0 rounded-full bg-workshop-red flex items-center justify-center text-white shadow-inner">
              <UserCircle size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-black text-white truncate">
                {user?.name || "Admin User"}
              </span>
              <span className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-tight">
                {user?.email}
              </span>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-workshop-red bg-worshop-dark rounded-xl hover:bg-workshop-red hover:text-white transition-all duration-300 group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span>CERRAR SESIÓN</span>
          </button>
        </div>
      </aside>
    </>
  );
}