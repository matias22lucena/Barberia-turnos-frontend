import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  obtenerPromociones,
} from "../../services/promociones.service.js";

import "./HomePromociones.css";

function HomePromociones() {
  const [promociones, setPromociones] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const cargarPromociones =
      async () => {
        try {
          setCargando(true);
          setError("");

          const promocionesObtenidas =
            await obtenerPromociones();

          setPromociones(
            promocionesObtenidas
          );
        } catch (error) {
          console.error(error);

          setError(
            "No se pudieron cargar las promociones."
          );
        } finally {
          setCargando(false);
        }
      };

    cargarPromociones();
  }, []);

  const formatearPrecio = (
    precio
  ) => {
    if (
      precio === null ||
      precio === undefined ||
      precio === ""
    ) {
      return null;
    }

    return Number(
      precio
    ).toLocaleString(
      "es-AR",
      {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    );
  };

  /*
   * Si no hay promociones activas,
   * no mostramos toda la sección.
   */
  if (
    !cargando &&
    !error &&
    promociones.length === 0
  ) {
    return null;
  }

  return (
    <section
      id="promociones"
      className="home-promociones"
    >
      <div className="home-promociones__container">
        <header className="home-promociones__header">
          <span className="home-promociones__eyebrow">
            Promociones
          </span>

          <h2 className="home-promociones__title">
            Aprovechá nuestras promos
          </h2>

          <p className="home-promociones__description">
            Opciones especiales con
            precio y duración definidos.
          </p>
        </header>

        {cargando && (
          <div className="home-promociones__loading">
            <div
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            />

            <span>
              Cargando promociones...
            </span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="home-promociones__error"
          >
            {error}
          </div>
        )}

        {!cargando &&
          !error &&
          promociones.length > 0 && (
            <div className="home-promociones__grid">
              {promociones.map(
                (promocion) => {
                  const precio =
                    formatearPrecio(
                      promocion.precio
                    );

                  return (
                    <article
                      key={
                        promocion.id
                      }
                      className="home-promociones__card"
                    >
                      <div className="home-promociones__badge">
                        PROMO
                      </div>

                      <div className="home-promociones__card-top">
                        <div>
                          <span className="home-promociones__duration">
                            {
                              promocion.duracionMinutos
                            }{" "}
                            minutos
                          </span>

                          <h3 className="home-promociones__card-title">
                            {
                              promocion.titulo
                            }
                          </h3>
                        </div>

                        {precio && (
                          <strong className="home-promociones__price">
                            {precio}
                          </strong>
                        )}
                      </div>

                      {promocion.descripcion && (
                        <p className="home-promociones__card-description">
                          {
                            promocion.descripcion
                          }
                        </p>
                      )}

                      <Link
                        to="/reservar"
                        className="home-promociones__reserve-button"
                      >
                        Reservar promoción

                        <span
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </Link>
                    </article>
                  );
                }
              )}
            </div>
          )}
      </div>
    </section>
  );
}

export default HomePromociones;