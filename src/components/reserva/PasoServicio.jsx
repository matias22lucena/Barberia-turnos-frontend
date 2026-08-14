import { Link } from "react-router-dom";

import "./PasoServicio.css";

function PasoServicio({
  servicios,
  servicioSeleccionado,
  cargandoBarbero,
  onSeleccionarServicio,
}) {
  const formatearPrecio = (precio) => {
    return Number(precio).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <section className="paso-servicio">
      <header className="paso-servicio__header">
        <h1 className="paso-servicio__title">
          ¿Qué servicio querés?
        </h1>

        <p className="paso-servicio__description">
          Seleccioná una opción para continuar con la reserva.
        </p>
      </header>

      <div className="paso-servicio__grid">
        {servicios.map((servicio) => {
          const seleccionado =
            servicioSeleccionado?.id === servicio.id;

          const clasesTarjeta = [
            "paso-servicio__card",
            seleccionado
              ? "paso-servicio__card--selected"
              : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={servicio.id}
              type="button"
              className={clasesTarjeta}
              disabled={cargandoBarbero}
              onClick={() => onSeleccionarServicio(servicio)}
              aria-pressed={seleccionado}
            >
              <div className="paso-servicio__card-header">
                <h2 className="paso-servicio__card-title">
                  {servicio.nombre}
                </h2>

                <strong className="paso-servicio__card-price">
                  {formatearPrecio(servicio.precio)}
                </strong>
              </div>

              <p className="paso-servicio__card-description">
                {servicio.descripcion}
              </p>

              <p className="paso-servicio__card-duration">
                Duración: {servicio.duracionMinutos} minutos
              </p>
            </button>
          );
        })}
      </div>

      {cargandoBarbero && (
        <div className="paso-servicio__loading">
          <div
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          />

          <span>Verificando profesional disponible...</span>
        </div>
      )}

      <div className="paso-servicio__actions">
        <Link
          to="/"
          className="paso-servicio__back-button"
        >
          <span aria-hidden="true">←</span>
          Atrás
        </Link>
      </div>
    </section>
  );
}

export default PasoServicio;