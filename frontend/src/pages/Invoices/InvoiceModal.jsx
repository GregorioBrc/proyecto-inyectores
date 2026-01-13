import { useState, useEffect } from "react";
import api from "../../service/api_Authorization";

export default function InvoiceModal({
  onClose,
  onSuccess,
  invoiceData = null,
}) {
  const [formData, setFormData] = useState({
    date: "",
    type: "",
    status: "",
    total_value: "",
    client_id: "",
  });

  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // cargar clientes y usuarios para selects
    const loadLists = async () => {
      try {
        const [cRes] = await Promise.all([
          api.get("/clients"),
        ]);
        setClients(cRes.data.data ?? cRes.data ?? []);
      } catch (err) {
        console.error("Error cargando listas", err);
      }
    };
    loadLists();
  }, []);

  useEffect(() => {
    if (invoiceData) {
      setFormData({
        date: invoiceData.date || "",
        type: invoiceData.type || "",
        status: invoiceData.status || "",
        total_value: invoiceData.total_value ?? "",
        client_id: invoiceData.client_id ?? "",
      });
    }
  }, [invoiceData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const payload = {
        date: formData.date,
        type: formData.type,
        status: formData.status,
        total_value: Number(formData.total_value),
        client_id: formData.client_id,
        user_id: formData.user_id,
      };

      if (invoiceData) {
        await api.put(`/invoices/${invoiceData.id}`, payload);
      } else {
        await api.post("/invoices", payload);
      }
      onSuccess();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        alert(err.response?.data?.message || "Error al procesar la solicitud");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div>
        <div>
          <h3>{invoiceData ? "✏️ Editar Factura" : "🧾 Nueva Factura"}</h3>
          <button onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Fecha</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            {errors.date && <p>{errors.date[0]}</p>}
          </div>

          <div>
            <label>Tipo</label>
            <input
              type="text"
              required
              maxLength={100}
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            />
            {errors.type && <p>{errors.type[0]}</p>}
          </div>

          <div>
            <label>Estado</label>
            <input
              type="text"
              required
              maxLength={100}
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            />
            {errors.status && <p>{errors.status[0]}</p>}
          </div>

          <div>
            <label>Valor Total</label>
            <input
              type="number"
              step="0.01"
              required
              min="0"
              value={formData.total_value}
              onChange={(e) =>
                setFormData({ ...formData, total_value: e.target.value })
              }
            />
            {errors.total_value && <p>{errors.total_value[0]}</p>}
          </div>

          <div>
            <label>Cliente</label>
            <select
              required
              value={formData.client_id}
              onChange={(e) =>
                setFormData({ ...formData, client_id: e.target.value })
              }
            >
              <option value="">-- Seleccione Cliente --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || c.full_name || `Cliente #${c.id}`}
                </option>
              ))}
            </select>
            {errors.client_id && <p>{errors.client_id[0]}</p>}
          </div>

          <div>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" disabled={saving}>
              {saving
                ? "Procesando..."
                : invoiceData
                ? "Actualizar Factura"
                : "Guardar Factura"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
