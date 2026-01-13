import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import InvoiceModal from "./InvoiceModal";
import { Trash2, Edit } from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/invoices");
      setInvoices(data.data ?? data ?? []);
    } catch (err) {
      console.error("Error cargando facturas", err);
      setError(
        err.response?.status === 401
          ? "Sesión expirada"
          : "Error al cargar facturas"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
        const { data } = await api.get("/clients");
        setClients(data.data ?? data ?? []);
    } catch (err) {
        console.error("Error cargando clientes de las facturas", err);
        setError(
            err.response?.status === 401
            ? "Sesion expirada"
            : "Error al cargar clientes de las facturas"
        );
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta factura?")) return;
    try {
      await api.delete(`/invoices/${id}`);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err) {
      alert("No se pudo eliminar la factura: " + (err.message || err));
    }
  };

  const openCreateModal = () => {
    setSelectedInvoice(null);
    setIsModalOpen(true);
  };

  const openEditModal = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  if (loading) return <div>Cargando facturas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div>
        <h2>Listado de Facturas</h2>
        <button onClick={openCreateModal}>+ Nueva Factura</button>
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Valor Total</th>
              <th>Cliente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.date}</td>
                <td>{invoice.type}</td>
                <td>{invoice.status}</td>
                <td>{invoice.total_value}</td>
                <td>
                  {clients.find(c => c.id === invoice.client_id)?.name}
                  {/* {invoice.client?.name ||
                    invoice.client_id ||
                    "—"} */}
                </td>
                <td>
                  <div>
                    <button onClick={() => openEditModal(invoice)} title="Editar">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(invoice.id)} title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && <div>No hay facturas.</div>}
      </div>

      {isModalOpen && (
        <InvoiceModal
          invoiceData={selectedInvoice}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchInvoices();
          }}
        />
      )}
    </div>
  );
}
