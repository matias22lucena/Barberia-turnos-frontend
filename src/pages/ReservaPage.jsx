import { useEffect, useState } from "react";
import { obtenerServicios } from "../services/servicios.service.js";

function ReservaPage() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        setCargando(true);
        setError("");

        const serviciosObtenidos = await obtenerServicios();

        setServicios(serviciosObtenidos);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los servicios.");
      } finally {
        setCargando(false);
      }
    };

    cargarServicios();
  }, []);

  const seleccionarServicio = (servicio) => {
    setServicioSeleccionado(servicio);
  };

  if (cargando) {
    return (
      <main>
        <h1>Reservar turno</h1>
        <p>Cargando servicios...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Reservar turno</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Reservar turno</h1>

      <p>Seleccioná el servicio que querés reservar.</p>

      <section>
        {servicios.map((servicio) => (
          <article
            key={servicio.id}
            onClick={() => seleccionarServicio(servicio)}
            style={{
              border:
                servicioSeleccionado?.id === servicio.id
                  ? "2px solid white"
                  : "1px solid gray",
              padding: "20px",
              marginBottom: "16px",
              cursor: "pointer",
            }}
          >
            <h2>{servicio.nombre}</h2>

            <p>{servicio.descripcion}</p>

            <p>Duración: {servicio.duracionMinutos} minutos</p>

            <p>
              Precio:{" "}
              {Number(servicio.precio).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </p>
          </article>
        ))}
      </section>

      {servicioSeleccionado && (
        <section>
          <h2>Servicio seleccionado</h2>

          <p>{servicioSeleccionado.nombre}</p>

          <button type="button">
            Continuar
          </button>
        </section>
      )}
    </main>
  );
}

export default ReservaPage;