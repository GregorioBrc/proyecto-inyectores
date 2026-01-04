import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Wrench, 
  FileText, 
  LogOut 
} from "lucide-react"; // Opcional: instala lucide-react para iconos fáciles

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Clientes", path: "/clients", icon: <Users size={20} /> },
    { name: "Inventario", path: "/products", icon: <Package size={20} /> },
    { name: "Servicios", path: "/services", icon: <Wrench size={20} /> },
    { name: "Facturación", path: "/invoices", icon: <FileText size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR LATERAL */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">Inyectores Pro</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER SUPERIOR */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-gray-700">Panel de Gestión</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Bienvenido,</span>
            <span className="font-bold text-gray-800">{user?.name}</span>
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTENIDO VARIABLE */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          <Outlet /> {/* <-- AQUÍ SE RENDERIZAN LAS PÁGINAS */}
        </main>
      </div>
    </div>
  );
}