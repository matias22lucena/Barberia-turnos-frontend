import { useEffect, useMemo, useState } from "react";
import { obtenerHorariosPorBarbero } from "../../services/horarios.service.js";
import { generarProximasFechas } from "../../utils/fechas.js";

function PasoDia({
  reserva,
  onSeleccionarFecha,
  onVolver,
}) {
  const [horariosLaborales, setHorariosLaborales] = useState([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarHorariosLaborales = async () => {
      if (!reserva.barbero?.id) {
        setError("No se encontró el profesional asignado.");
        setCargandoHorarios(false);
        return;
      }

      try {
        setCargandoHorarios(true);
        setError("");

        const horarios = await obtenerHorariosPorBarbero(
          reserva.barbero.id
        );

        setHorariosLaborales(horarios);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los días disponibles.");
      } finally {
        setCargandoHorarios(false);
      }
    };

    cargarHorariosLaborales();
  }, [reserva.barbero?.id]);

  const diasLaborales = useMemo(() => {
    return new Set(
      horariosLaborales.map((horario) => horario.diaSemana)
    );
  }, [horariosLaborales]);

  const fechasDisponibles = useMemo(() => {
    const proximasFechas = generarProximasFechas(14);

    return proximasFechas.filter((fecha) =>
      diasLaborales.has(fecha.diaSemanaBaseDatos)
    );
  }, [diasLaborales]);

  if (cargandoHorarios) {
    return (
      <section>
        <h1>Elegí el día</h1>
        <p>Cargando días disponibles...</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Elegí el día</h1>

      <p>
        Seleccioná una fecha para{" "}
        <strong>{reserva.servicio?.nombre}</strong>.
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

      {!error && fechasDisponibles.length === 0 && (
        <p>No hay días laborales configurados.</p>
      )}

      {!error && fechasDisponibles.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px",
            marginTop: "28px",
          }}
        >
          {fechasDisponibles.map((fecha) => {
            const seleccionada =
              reserva.fecha?.fechaISO === fecha.fechaISO;

            return (
              <button
                key={fecha.fechaISO}
                type="button"
                onClick={() => onSeleccionarFecha(fecha)}
                style={{
                  minHeight: "110px",
                  padding: "14px",
                  borderRadius: "10px",
                  border: seleccionada
                    ? "2px solid #f0b23e"
                    : "1px solid #3d3733",
                  backgroundColor: seleccionada
                    ? "#2b2114"
                    : "#1c1917",
                  color: "#f5f5f5",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#aaa",
                    fontSize: "12px",
                  }}
                >
                  {fecha.nombreDiaCorto}
                </span>

                <strong
                  style={{
                    display: "block",
                    fontSize: "24px",
                  }}
                >
                  {fecha.numeroDia}
                </strong>

                <span
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: "#aaa",
                  }}
                >
                  {fecha.mesCorto}
                </span>
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

export default PasoDia;