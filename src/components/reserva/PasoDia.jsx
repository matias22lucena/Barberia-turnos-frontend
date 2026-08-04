import { useEffect, useMemo, useState } from "react";

import { obtenerHorariosPorBarbero } from "../../services/horarios.service.js";
import { generarProximasFechas } from "../../utils/fechas.js";

import "./PasoDia.css";

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
      <section className="paso-dia">
        <header className="paso-dia__header">
          <h1 className="paso-dia__title">
            Elegí el día
          </h1>

          <p className="paso-dia__description">
            Cargando días disponibles...
          </p>
        </header>

        <div className="paso-dia__loading">
          <div
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          />

          <span>Buscando fechas disponibles...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="paso-dia">
      <header className="paso-dia__header">
        <h1 className="paso-dia__title">
          Elegí el día
        </h1>

        <p className="paso-dia__description">
          Seleccioná una fecha para{" "}
          <strong>{reserva.servicio?.nombre}</strong>.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="paso-dia__error"
        >
          {error}
        </div>
      )}

      {!error && fechasDisponibles.length === 0 && (
        <div className="paso-dia__empty">
          No hay días laborales configurados.
        </div>
      )}

      {!error && fechasDisponibles.length > 0 && (
        <div className="paso-dia__grid">
          {fechasDisponibles.map((fecha) => {
            const seleccionada =
              reserva.fecha?.fechaISO === fecha.fechaISO;

            const clasesTarjeta = [
              "paso-dia__card",
              seleccionada
                ? "paso-dia__card--selected"
                : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={fecha.fechaISO}
                type="button"
                className={clasesTarjeta}
                onClick={() => onSeleccionarFecha(fecha)}
                aria-pressed={seleccionada}
              >
                <span className="paso-dia__weekday">
                  {fecha.nombreDiaCorto}
                </span>

                <strong className="paso-dia__number">
                  {fecha.numeroDia}
                </strong>

                <span className="paso-dia__month">
                  {fecha.mesCorto}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="paso-dia__actions">
        <button
          type="button"
          className="paso-dia__back-button"
          onClick={onVolver}
        >
          <span aria-hidden="true">←</span>
          Atrás
        </button>
      </div>
    </section>
  );
}

export default PasoDia;