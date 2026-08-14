import { useEffect, useState } from "react";

import { obtenerDisponibilidad } from "../../services/disponibilidad.service.js";

import "./PasoHora.css";

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
      <section className="paso-hora">
        <header className="paso-hora__header">
          <h1 className="paso-hora__title">
            Horarios disponibles
          </h1>

          <p className="paso-hora__description">
            Cargando horarios...
          </p>
        </header>

        <div className="paso-hora__loading">
          <div
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          />

          <span>Consultando disponibilidad...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="paso-hora">
      <header className="paso-hora__header">
        <h1 className="paso-hora__title">
          Horarios disponibles
        </h1>

        <div className="paso-hora__summary">
          <p>
            <span>Servicio</span>
            <strong>{reserva.servicio?.nombre}</strong>
          </p>

          <p>
            <span>Día</span>
            <strong>{reserva.fecha?.textoCompleto}</strong>
          </p>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="paso-hora__error"
        >
          {error}
        </div>
      )}

      {!error && horarios.length === 0 && (
        <div className="paso-hora__empty">
          <div className="paso-hora__empty-icon">
            !
          </div>

          <div>
            <strong>No hay horarios disponibles</strong>

            <p>
              Volvé atrás y seleccioná otra fecha.
            </p>
          </div>
        </div>
      )}

      {!error && horarios.length > 0 && (
        <div className="paso-hora__grid">
          {horarios.map((hora) => {
            const seleccionada = reserva.hora === hora;

            const clasesHorario = [
              "paso-hora__button",
              seleccionada
                ? "paso-hora__button--selected"
                : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={hora}
                type="button"
                className={clasesHorario}
                onClick={() => onSeleccionarHora(hora)}
                aria-pressed={seleccionada}
              >
                {hora}
              </button>
            );
          })}
        </div>
      )}

      <div className="paso-hora__actions">
        <button
          type="button"
          className="paso-hora__back-button"
          onClick={onVolver}
        >
          <span aria-hidden="true">←</span>
          Atrás
        </button>
      </div>
    </section>
  );
}

export default PasoHora;