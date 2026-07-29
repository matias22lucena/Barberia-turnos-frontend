import { useEffect, useState } from "react";
import { obtenerDisponibilidad } from "../../services/disponibilidad.service.js";

function PasoHora({
  reserva,
  onSeleccionarHora,
  onVolver,
}) {
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDisponibilidad = async () => {
      const barberoId = reserva.barbero?.id;
      const servicioId = reserva.servicio?.id;
      const fecha = reserva.fecha?.fechaISO;

      if (!barberoId || !servicioId || !fecha) {
        setError("Faltan datos para consultar los horarios.");
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setError("");

        const disponibilidad = await obtenerDisponibilidad({
          barberoId,
          servicioId,
          fecha,
        });

        setHorarios(disponibilidad.horarios);
      } catch (error) {
        console.error(error);

        const mensaje =
          error.response?.data?.message ||
          "No se pudieron cargar los horarios disponibles.";

        setError(mensaje);
      } finally {
        setCargando(false);
      }
    };

    cargarDisponibilidad();
  }, [
    reserva.barbero?.id,
    reserva.servicio?.id,
    reserva.fecha?.fechaISO,
  ]);

  if (cargando) {
    return (
      <section>
        <h1>Horarios disponibles</h1>
        <p>Cargando horarios...</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Horarios disponibles</h1>

      <p>
        Servicio: <strong>{reserva.servicio?.nombre}</strong>
      </p>

      <p>
        Día: <strong>{reserva.fecha?.textoCompleto}</strong>
      </p>

      {error && (
        <div
          role="alert"
          style={{
            padding: "14px",
            marginTop: "20px",
            border: "1px solid #b94a48",
            borderRadius: "8px",
            backgroundColor: "#351a1a",
          }}
        >
          {error}
        </div>
      )}

      {!error && horarios.length === 0 && (
        <div
          style={{
            marginTop: "24px",
            padding: "20px",
            border: "1px solid #3d3733",
            borderRadius: "10px",
            backgroundColor: "#1c1917",
          }}
        >
          <p>No hay horarios disponibles para esta fecha.</p>
        </div>
      )}

      {!error && horarios.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "12px",
            marginTop: "28px",
          }}
        >
          {horarios.map((hora) => {
            const seleccionada = reserva.hora === hora;

            return (
              <button
                key={hora}
                type="button"
                onClick={() => onSeleccionarHora(hora)}
                style={{
                  minHeight: "52px",
                  padding: "12px",
                  borderRadius: "10px",
                  border: seleccionada
                    ? "2px solid #f0b23e"
                    : "1px solid #3d3733",
                  backgroundColor: seleccionada
                    ? "#2b2114"
                    : "#1c1917",
                  color: "#f5f5f5",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {hora}
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={onVolver}
        style={{
          marginTop: "28px",
          padding: "10px 18px",
          cursor: "pointer",
        }}
      >
        ← Atrás
      </button>
    </section>
  );
}

export default PasoHora;  