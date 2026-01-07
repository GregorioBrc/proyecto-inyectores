import { useEffect, useState } from 'react';
import api from '../../service/api_Authorization';
import ProductModal from './ProductModal'; 
import { Trash2, Edit } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ESTADOS PARA EL MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products');
      setProducts(data.data);
    } catch (err) {
      console.error('Error cargando productos', err);
      setError(err.response?.status === 401 ? 'Sesión expirada' : 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert('No se pudo eliminar el producto');
      }
    }
  };

  const openCreateModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Cargando inventario...</div>;
  if (error) return <div className="p-10 text-center text-red-600 font-bold">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Inventario de Productos</h2>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          + Nuevo Producto
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4 border-b">Nombre</th>
              <th className="px-6 py-4 border-b">Precio</th>
              <th className="px-6 py-4 border-b">Stock Actual</th>
              <th className="px-6 py-4 border-b">Stock Mín.</th>
              <th className="px-6 py-4 border-b">Estado</th>
              <th className="px-6 py-4 border-b text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-gray-600">${product.price}</td>
                <td className="px-6 py-4 text-gray-600">{product.actual_stock}</td>
                <td className="px-6 py-4 text-gray-600">{product.min_stock}</td>
                <td className="px-6 py-4">
                  {product.actual_stock <= product.min_stock ? (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-bold">Bajo Stock</span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">Disponible</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => openEditModal(product)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-10 text-center text-gray-400">No hay productos en el inventario.</div>
        )}
      </div>

      {isModalOpen && (
        <ProductModal 
          productData={selectedProduct}
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchProducts();
          }} 
        />
      )}
    </div>
  );
}