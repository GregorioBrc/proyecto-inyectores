import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State to control mobile menu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* SIDEBAR: Passes the state to handle open/close */}
      <Sidebar 
        user={user} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER */}
        <header className="md:hidden h-16 bg-workshop-dark border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* MOBILE MENU BUTTON (Hidden on Desktop) */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}