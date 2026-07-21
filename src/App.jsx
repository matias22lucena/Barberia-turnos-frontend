import { useEffect, useState } from "react";
import api from "./api/api";

function App() {
  const [mensaje, setMensaje] = useState("Conectando con el backend...");
  const [error, setError] = useState("");

  useEffect(() => {
    const verificarBackend = async () => {
      try {
        const response = await api.get("/health");

        setMensaje(response.data.message);
      } catch (err) {
        console.error(err);
        setError("No se pudo conectar con el backend");
      }
    };

    verificarBackend();
  }, []);

  return (
    <main>
      <h1>Sistema de turnos</h1>

      {error ? <p>{error}</p> : <p>{mensaje}</p>}
    </main>
  );
}

export default App;