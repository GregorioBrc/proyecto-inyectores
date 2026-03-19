import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../service/api_Authorization";
import { AlertTriangle, Package, DollarSign, Clock, ArrowRight, TrendingDown } from "lucide-react";

function formatMoney(value) {
  const n = Number(value ?? 0);
  return `$${n.toLocaleString("es-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const defaultSummary = {
  totalDebts: 0,
  lowStockCount: 0,
  topDebts: [],
  lowStockList: [],
};

export default function DashboardPage() {
  const [summary, setSummary] = useState(defaultSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchSummary() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/dashboard");
        const payload = data?.data ?? data ?? {};

        if (!mounted) return;
        setSummary({ ...defaultSummary, ...payload });
      } catch (err) {
        if (!mounted) return;
        setError(
          err?.response?.status === 401
            ? "Sesión expirada"
            : "Error al cargar el dashboard"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchSummary();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-workshop-red space-y-4">
        <div className="w-10 h-10 border-4 border-workshop-red/30 border-t-workshop-red rounded-full animate-spin" />
        <span className="font-black uppercase tracking-widest text-sm">
          Cargando métricas...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 uppercase flex items-center gap-3">
            Atención <span className="text-workshop-red">Requerida</span>
          </h2>
          <p className="text-sm text-gray-500 font-bold tracking-tight uppercase mt-1">
            Resumen de alertas de inventario y cuentas por cobrar
          </p>
        </div>
        {error && (
          <div className="bg-red-50 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-workshop-red border border-red-100 flex items-center gap-2">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}
      </div>

      {/* Main Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PANEL: Deudas Activas */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/40 overflow-hidden flex flex-col h-[600px]">
          {/* Header Panel Deudas */}
          <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-workshop-red shadow-inner">
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="font-black text-xl text-gray-900 uppercase tracking-tighter">
                  Cuentas por Cobrar
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Total pendiente: <span className="text-workshop-red">{formatMoney(summary.totalDebts)}</span>
                </p>
              </div>
            </div>
            <Link
              to="/debts"
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-workshop-red hover:border-workshop-red transition-colors shadow-sm"
            >
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Lista Deudas */}
          <div className="p-6 overflow-y-auto flex-1 bg-white space-y-3">
            {summary.topDebts.length > 0 ? (
              summary.topDebts.map((d) => (
                <div
                  key={d.id}
                  className="group bg-white border border-gray-100 hover:border-red-200 p-5 rounded-2xl flex items-center justify-between gap-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-workshop-red transition-colors">
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="font-black text-gray-900 uppercase tracking-tighter text-sm">
                        {d.client_name ?? "Cliente Desconocido"}
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        Registrado: {d.created_at ?? "—"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-lg text-workshop-red">
                      {formatMoney(d.pending_balance)}
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Deuda Activa
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                <DollarSign size={48} className="text-gray-300" />
                <p className="text-sm font-black uppercase tracking-widest text-gray-400">
                  No hay deudas registradas
                </p>
              </div>
            )}
          </div>
        </div>

        {/* PANEL: Inventario Bajo */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/40 overflow-hidden flex flex-col h-[600px]">
          {/* Header Panel Inventario */}
          <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner">
                <Package size={24} />
              </div>
              <div>
                <h3 className="font-black text-xl text-gray-900 uppercase tracking-tighter">
                  Inventario Crítico
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Productos en alerta: <span className="text-orange-600">{summary.lowStockCount} ítems</span>
                </p>
              </div>
            </div>
            <Link
              to="/products"
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-orange-600 hover:border-orange-600 transition-colors shadow-sm"
            >
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Lista Inventario */}
          <div className="p-6 overflow-y-auto flex-1 bg-white space-y-3">
            {summary.lowStockList.length > 0 ? (
              summary.lowStockList.map((p) => {
                const stock = Number(p.actual_stock ?? 0);
                const min = Number(p.min_stock ?? 0);
                // Si el stock es 0, lo ponemos en rojo, si no en naranja
                const isZero = stock <= 0;

                return (
                  <div
                    key={p.id}
                    className="group bg-white border border-gray-100 hover:border-orange-200 p-5 rounded-2xl flex items-center justify-between gap-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isZero ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                        <TrendingDown size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-gray-900 uppercase tracking-tighter text-sm truncate">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                          Stock Mínimo Ideal: {min}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className={`font-black text-lg ${isZero ? 'text-red-600' : 'text-orange-600'}`}>
                        {stock} und.
                      </div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Disponibles
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                <Package size={48} className="text-gray-300" />
                <p className="text-sm font-black uppercase tracking-widest text-gray-400">
                  Inventario en niveles óptimos
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}