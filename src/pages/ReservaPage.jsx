import { useEffect, useState } from "react";
import { obtenerServicios } from "../services/servicios.service.js";
import { obtenerBarberosPorServicio } from "../services/barberos.service.js";

function ReservaPage() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState(null);
  const [cargandoBarbero, setCargandoBarbero] = useState(false);

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

  const seleccionarServicio = async (servicio) => {
    try {
      setServicioSeleccionado(servicio);
      setBarberoSeleccionado(null);
      setCargandoBarbero(true);
      setError("");

      const barberos = await obtenerBarberosPorServicio(servicio.id);

      if (barberos.length === 0) {
        setError("No hay ningún barbero disponible para este servicio.");
        return;
      }

      // Como por ahora hay un solo barbero, se selecciona automáticamente.
      setBarberoSeleccionado(barberos[0]);
    } catch (error) {
      console.error(error);
      setError("No se pudo obtener el barbero disponible.");
    } finally {
      setCargandoBarbero(false);
    }
  };

  const continuarReserva = () => {
    if (!servicioSeleccionado || !barberoSeleccionado) {
      return;
    }

    console.log("Servicio seleccionado:", servicioSeleccionado);
    console.log("Barbero seleccionado:", barberoSeleccionado);

    // En el próximo paso vamos a avanzar a la selección del día.
  };

  if (cargando) {
    return (
      <main>
        <h1>Reservar turno</h1>
        <p>Cargando servicios...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Reservar turno</h1>

      <p>Seleccioná el servicio que querés reservar.</p>

      {error && <p>{error}</p>}

      <section>
        {servicios.map((servicio) => {
          const estaSeleccionado =
            servicioSeleccionado?.id === servicio.id;

          return (
            <article
              key={servicio.id}
              onClick={() => seleccionarServicio(servicio)}
              style={{
                border: estaSeleccionado
                  ? "2px solid white"
                  : "1px solid gray",
                padding: "20px",
                marginBottom: "16px",
                cursor: cargandoBarbero ? "wait" : "pointer",
                opacity: cargandoBarbero && !estaSeleccionado ? 0.7 : 1,
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
          );
        })}
      </section>

      {cargandoBarbero && (
        <section>
          <p>Buscando el profesional disponible...</p>
        </section>
      )}

      {servicioSeleccionado &&
        barberoSeleccionado &&
        !cargandoBarbero && (
          <section>
            <h2>Servicio seleccionado</h2>

            <p>{servicioSeleccionado.nombre}</p>

            <h2>Profesional asignado</h2>

            <p>
              {barberoSeleccionado.nombre}
              {barberoSeleccionado.apellido
                ? ` ${barberoSeleccionado.apellido}`
                : ""}
            </p>

            {barberoSeleccionado.descripcion && (
              <p>{barberoSeleccionado.descripcion}</p>
            )}

            <button type="button" onClick={continuarReserva}>
              Elegir día
            </button>
          </section>
        )}
    </main>
  );
}

export default ReservaPage;