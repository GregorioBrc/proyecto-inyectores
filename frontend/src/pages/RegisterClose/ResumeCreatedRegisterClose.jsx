import { X, CheckCircle2, Calendar, DollarSign, BadgeCent, Banknote } from "lucide-react";

export default function ResumeCreatedRegisterClose({ data, onClose }) {
    if (!data) return null;

    // Opcional: Formatear la fecha para que se lea mejor (ej. 16/03/2026)
    const formattedDate = new Date(data.date).toLocaleDateString('es-ES', {
        timeZone: 'UTC', // Ajusta según cómo manejes tus zonas horarias
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo oscuro con blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Contenedor del Modal */}
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* HEADER */}
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-200">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <h3 className="font-black tracking-tighter text-gray-900 uppercase">
                                Cierre Exitoso
                            </h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                Resumen de la operación
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 p-2 rounded-full hover:bg-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* BODY / DATOS DEL CIERRE */}
                <div className="p-8 space-y-6">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">

                        {/* Fecha */}
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Calendar size={16} className="text-workshop-red" />
                                <span className="text-xs font-black uppercase tracking-widest">Fecha</span>
                            </div>
                            <span className="font-bold text-gray-700">
                                {formattedDate}
                            </span>
                        </div>

                        {/* Monto en dolares*/}
                        <div className="flex justify-between items-center pt-1">
                            <div className="flex items-center gap-2 text-gray-500">
                                <DollarSign size={16} className="text-workshop-red" />
                                <span className="text-xs font-black uppercase tracking-widest">Monto Dolares</span>
                            </div>
                            <span className="font-black text-2xl text-green-600">
                                ${data.USD_amount}
                            </span>
                        </div>

                        {/* Monto en pesos*/}
                        <div className="flex justify-between items-center pt-1">
                            <div className="flex items-center gap-2 text-gray-500">
                                <BadgeCent size={16} className="text-workshop-red" />
                                <span className="text-xs font-black uppercase tracking-widest">Monto Pesos</span>
                            </div>
                            <span className="font-black text-2xl text-green-600">
                                ${data.COP_amount}
                            </span>
                        </div>
                        
                        {/* Monto en bolivares*/}
                        <div className="flex justify-between items-center pt-1">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Banknote size={16} className="text-workshop-red" />
                                <span className="text-xs font-black uppercase tracking-widest">Monto Bolivares</span>
                            </div>
                            <span className="font-black text-2xl text-green-600">
                                ${data.VES_amount}
                            </span>
                        </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-workshop-dark text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-black/10"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}