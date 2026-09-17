import {
  Link,
} from "react-router-dom";

import "./PasoServicio.css";

function PasoServicio({
  servicios,
  promociones,
  servicioSeleccionado,
  promocionSeleccionada,
  cargandoBarbero,
  onSeleccionarServicio,
  onSeleccionarPromocion,
}) {
  const formatearPrecio = (
    precio
  ) => {
    if (
      precio === null ||
      precio === undefined
    ) {
      return "Consultar";
    }

    return Number(
      precio
    ).toLocaleString(
      "es-AR",
      {
        style:
          "currency",

        currency:
          "ARS",

        minimumFractionDigits:
          0,

        maximumFractionDigits:
          0,
      }
    );
  };

  return (
    <section className="paso-servicio">
      <header className="paso-servicio__header">
        <h1 className="paso-servicio__title">
          ¿Qué querés reservar?
        </h1>

        <p className="paso-servicio__description">
          Elegí un servicio o
          aprovechá alguna de
          nuestras promociones.
        </p>
      </header>

      <div className="paso-servicio__section-title">
        <span>
          SERVICIOS
        </span>

        <h2>
          Servicios disponibles
        </h2>
      </div>

      <div className="paso-servicio__grid">
        {servicios.map(
          (
            servicio
          ) => {
            const seleccionado =
              !promocionSeleccionada &&
              servicioSeleccionado
                ?.id ===
                servicio.id;

            return (
              <button
                key={`servicio-${servicio.id}`}
                type="button"
                className={[
                  "paso-servicio__card",

                  seleccionado
                    ? "paso-servicio__card--selected"
                    : "",
                ]
                  .filter(
                    Boolean
                  )
                  .join(
                    " "
                  )}
                disabled={
                  cargandoBarbero
                }
                onClick={() =>
                  onSeleccionarServicio(
                    servicio
                  )
                }
              >
                <div className="paso-servicio__card-header">
                  <h2 className="paso-servicio__card-title">
                    {
                      servicio.nombre
                    }
                  </h2>

                  <strong className="paso-servicio__card-price">
                    {formatearPrecio(
                      servicio.precio
                    )}
                  </strong>
                </div>

                <p className="paso-servicio__card-description">
                  {
                    servicio.descripcion
                  }
                </p>

                <p className="paso-servicio__card-duration">
                  Duración:{" "}
                  {
                    servicio.duracionMinutos
                  }{" "}
                  minutos
                </p>
              </button>
            );
          }
        )}
      </div>

      {promociones.length >
        0 && (
        <>
          <div className="paso-servicio__section-title paso-servicio__section-title--promos">
            <span>
              PROMOCIONES
            </span>

            <h2>
              Promociones
              especiales
            </h2>
          </div>

          <div className="paso-servicio__grid">
            {promociones.map(
              (
                promocion
              ) => {
                const seleccionado =
                  promocionSeleccionada
                    ?.id ===
                  promocion.id;

                const cantidad =
                  Number(
                    promocion
                      .cantidadServicios ||
                      1
                  );

                const esPaquete =
                  cantidad > 1;

                return (
                  <button
                    key={`promocion-${promocion.id}`}
                    type="button"
                    className={[
                      "paso-servicio__card",
                      "paso-servicio__card--promo",

                      seleccionado
                        ? "paso-servicio__card--selected"
                        : "",
                    ]
                      .filter(
                        Boolean
                      )
                      .join(
                        " "
                      )}
                    disabled={
                      cargandoBarbero
                    }
                    onClick={() =>
                      onSeleccionarPromocion(
                        promocion
                      )
                    }
                  >
                    <span className="paso-servicio__promo-badge">
                      {esPaquete
                        ? `PACK ${cantidad} TURNOS`
                        : "PROMO"}
                    </span>

                    <div className="paso-servicio__card-header">
                      <h2 className="paso-servicio__card-title">
                        {
                          promocion.titulo
                        }
                      </h2>

                      <strong className="paso-servicio__card-price">
                        {formatearPrecio(
                          promocion.precio
                        )}
                      </strong>
                    </div>

                    {promocion.descripcion && (
                      <p className="paso-servicio__card-description">
                        {
                          promocion.descripcion
                        }
                      </p>
                    )}

                    {esPaquete && (
                      <p className="paso-servicio__package-info">
                        Incluye{" "}
                        <strong>
                          {
                            cantidad
                          }{" "}
                          turnos
                        </strong>
                      </p>
                    )}

                    <p className="paso-servicio__card-duration">
                      Duración por
                      turno:{" "}
                      {
                        promocion.duracionMinutos
                      }{" "}
                      minutos
                    </p>
                  </button>
                );
              }
            )}
          </div>
        </>
      )}

      {cargandoBarbero && (
        <div className="paso-servicio__loading">
          <div
            className="spinner-border spinner-border-sm"
            role="status"
          />

          <span>
            Verificando
            profesional
            disponible...
          </span>
        </div>
      )}

      <div className="paso-servicio__actions">
        <Link
          to="/"
          className="paso-servicio__back-button"
        >
          ← Atrás
        </Link>
      </div>
    </section>
  );
}

export default PasoServicio;