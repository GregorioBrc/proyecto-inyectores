// FILE: frontend/src/Login.jsx

import React, { useState, useEffect } from "react";
import api from "./service/api_Authorization";

export default function Login() {
  const Token_name = "Auth_Token";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("Inicializando...");

  // -----------------------------------------------------------------
  //  PASO 1: Obtener la cookie CSRF al cargar el componente
  // -----------------------------------------------------------------
  const fetchCsrfCookie = async () => {
    try {
      setStatus("Obteniendo cookie CSRF...");
      // Llama al endpoint que ya probaste con éxito
      await api("").get("/sanctum/csrf-cookie");
      setStatus("Cookie CSRF obtenida. Listo.");
      // Intenta cargar el usuario actual para ver si ya hay sesión
      fetchUser();
    } catch (err) {
      console.error("Error al obtener la cookie CSRF:", err);
      setStatus("Error al obtener la cookie CSRF.");
    }
  };

  useEffect(() => {
    fetchCsrfCookie();
  }, []);

  // -----------------------------------------------------------------
  //  PASO 2: Iniciar Sesión
  // -----------------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setStatus("Intentando iniciar sesión...");

    try {
      // El login envía las credenciales y establece la cookie de sesión
      let ax = await api("").post("/api/login", { email, password });
      if (ax.data != null) {
        localStorage.setItem(Token_name, ax.data.access_token);
        await fetchUser();
      }
    } catch (err) {
      setStatus("Error de credenciales.");
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Credenciales inválidas o error de red.");
      }
    }
  };

  // -----------------------------------------------------------------
  //  PASO 3: Obtener Usuario (Prueba de Sesión)
  // -----------------------------------------------------------------
  const fetchUser = async () => {
    try {
      if (localStorage.getItem(Token_name)) {
        setStatus("Verificando sesión...");
        const userResponse = await api(localStorage.getItem(Token_name)).get(
          "/api/user"
        );
        console.log(userResponse.data);
        let ax = userResponse.data.data;
        setUser(ax);
        setStatus("Sesión activa.");
      } else {
        setStatus("No hay sesión activa.-");
      }
    } catch {
      setUser(null);
      setStatus("No hay sesión activa.");
    }
  };

  // -----------------------------------------------------------------
  //  PASO 4: Cerrar Sesión
  // -----------------------------------------------------------------
  const handleLogout = async () => {
    try {
      setStatus("Cerrando sesión...");
      // Llama al endpoint de logout de Laravel
      await api(localStorage.getItem(Token_name)).post("/api/logout");
      localStorage.removeItem(Token_name);
      setUser(null);
      setStatus("Sesión cerrada con éxito.");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      setStatus("Error al intentar cerrar sesión.");
    }
  };

  // -----------------------------------------------------------------
  //  RENDERIZADO
  // -----------------------------------------------------------------
  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "400px",
        margin: "auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Login de Prueba (React & Laravel Sanctum) 🔐</h2>
      <p>
        <strong>Estado:</strong> {status}
      </p>

      {user ? (
        // Vista si el usuario está logueado
        <div>
          <h3>¡Bienvenido, {user.name || user.email}!</h3>
          <p>Tu sesión está activa en el backend.</p>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 15px",
              backgroundColor: "darkred",
              color: "white",
              border: "none",
              cursor: "pointer",
              marginTop: "15px",
            }}
          >
            Cerrar Sesión (Logout)
          </button>
        </div>
      ) : (
        // Vista del formulario de Login
        <form onSubmit={handleLogin}>
          {error && (
            <p
              style={{ color: "red", border: "1px solid red", padding: "10px" }}
            >
              {error}
            </p>
          )}

          <div style={{ marginBottom: "10px" }}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "10px 15px",
              backgroundColor: "darkgreen",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Iniciar Sesión
          </button>
        </form>
      )}
    </div>
  );
}
