import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Wrench, 
  FileText, 
  LogOut,
  UserCircle 
} from "lucide-react"; 

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Limpia estado y localStorage
    navigate("/login", { replace: true }); // replace: true evita que el usuario pueda volver atrás
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Clientes", path: "/clients", icon: <Users size={20} /> },
    { name: "Inventario", path: "/products", icon: <Package size={20} /> },
    { name: "Servicios", path: "/services", icon: <Wrench size={20} /> },
    { name: "Facturación", path: "/invoices", icon: <FileText size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR LATERAL */}
      <aside className="w-64 bg-white border-r flex flex-col z-10">
        <div className="p-6">
          <h1 className="text-2xl font-black text-blue-600 tracking-tight italic">
            INJECT<span className="text-slate-800">PRO</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {item.icon}
              <span className="font-semibold">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* PERFIL DE USUARIO Y LOGOUT */}
        <div className="p-4 border-t bg-slate-50/50">
          <div className="flex items-center space-x-3 px-4 py-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
                <UserCircle size={20} className="text-blue-600" />
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-slate-800 truncate">{user?.name}</span>
                <span className="text-xs text-slate-500 truncate">{user?.email}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full p-3 text-sm font-bold text-red-600 hover:bg-red-100 rounded-xl transition-colors border border-transparent hover:border-red-200"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER SUPERIOR */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center space-x-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Sistema Activo</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400 font-bold uppercase">Rol Actual</p>
              <p className="text-sm font-semibold text-slate-700">Administrador</p>
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTENIDO VARIABLE */}
        <main className="flex-1 overflow-auto bg-slate-50 p-8">
           <div className="max-w-7xl mx-auto">
             <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
}