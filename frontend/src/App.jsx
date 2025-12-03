// src/App.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [csrfLoaded, setCsrfLoaded] = useState(false);

  useEffect(() => {
    // Función para obtener la cookie CSRF
    const getCsrfCookie = async () => {
      try {
        // Esta ruta está definida por Laravel Sanctum por defecto
        await axios.get('/sanctum/csrf-cookie');
        setCsrfLoaded(true);
        console.log("Cookie CSRF cargada exitosamente.");
      } catch (error) {
        console.error("Error al cargar la cookie CSRF:", error);
      }
    };

    getCsrfCookie();
  }, []);

  if (!csrfLoaded) {
    return <div>Cargando aplicación...</div>;
  }

  // Si la cookie está cargada, renderiza el resto de tu app
  return (
    <div className="App">
      <h1>Frontend React conectado a Laravel</h1>
      <LoginForm /> {/* Componente de Login que crearemos a continuación */}
    </div>
  );
}

export default App;