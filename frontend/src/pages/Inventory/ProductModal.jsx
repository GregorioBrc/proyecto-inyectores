import { useState, useEffect } from 'react';
import api from '../../service/api_Authorization';

export default function ProductModal({ onClose, onSuccess, productData = null }) {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    actual_stock: '',
    min_stock: ''
  });
  
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Efecto para cargar datos si estamos en modo EDICIÓN
  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || '',
        actual_stock: productData.actual_stock || '',
        min_stock: productData.min_stock || ''
      });
    }
  }, [productData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      if (productData) {
        // MODO EDICIÓN
        await api.put(`/products/${productData.id}`, formData);
      } else {
        // MODO CREACIÓN
        await api.post('/products', formData);
      }
      onSuccess(); // Refresca la tabla y cierra el modal
    } catch (err) {
      if (err.response?.status === 422) {
        // Capturar validaciones de Laravel
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || 'Error al procesar la solicitud');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Cabecera dinámica */}
        <div className={`p-6 border-b flex justify-between items-center ${productData ? 'bg-orange-50' : 'bg-blue-50'}`}>
          <h3 className={`text-lg font-bold ${productData ? 'text-orange-700' : 'text-blue-700'}`}>
            {productData ? '🛠️ Editar Inyector' : '📦 Nuevo Inyector'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Producto</label>
            <input 
              type="text" required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ej. Inyector Bosch 0445"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Descripción (Opcional)</label>
            <textarea 
              rows="2"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detalles adicionales..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Precio */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Precio ($)</label>
              <input 
                type="number" step="0.01" required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            {/* Stock Mínimo */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Stock Mínimo</label>
              <input 
                type="number" required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.min_stock}
                onChange={(e) => setFormData({...formData, min_stock: e.target.value})}
              />
            </div>
          </div>

          {/* Stock Actual */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Stock Actual</label>
            <input 
              type="number" required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.actual_stock}
              onChange={(e) => setFormData({...formData, actual_stock: e.target.value})}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 mt-6">
            <button 
              type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 font-bold transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" disabled={saving}
              className={`flex-1 px-4 py-2.5 text-white rounded-xl font-bold transition-all shadow-md disabled:opacity-50 ${
                productData 
                  ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-100' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
              }`}
            >
              {saving ? 'Procesando...' : productData ? 'Actualizar Cambios' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}