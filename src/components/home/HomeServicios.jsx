import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  obtenerServicios,
} from "../../services/servicios.service.js";

import "./HomeServicios.css";

function HomeServicios({
  contenido,
}) {
  const [
    servicios,
    setServicios,
  ] = useState([]);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const cargarServicios =
      async () => {
        try {
          setCargando(true);
          setError("");

          const serviciosObtenidos =
            await obtenerServicios();

          setServicios(
            serviciosObtenidos ||
              []
          );
        } catch (error) {
          console.error(
            error
          );

          setError(
            "No se pudieron cargar los servicios."
          );
        } finally {
          setCargando(false);
        }
      };

    cargarServicios();
  }, []);

  const formatearPrecio = (
    precio
  ) => {
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

  return (
    <section
      id="servicios"
      className="home-servicios"
    >
      <div className="home-servicios__container">
        <header className="home-servicios__header">
          <span className="home-servicios__eyebrow">
            {contenido?.serviciosEyebrow ||
              "Nuestros servicios"}
          </span>

          <h2 className="home-servicios__title">
            {contenido?.serviciosTitulo ||
              "Elegí el servicio que mejor va con tu estilo"}
          </h2>

          <p className="home-servicios__description">
            {contenido?.serviciosDescripcion ||
              "Consultá duración y precio antes de reservar tu turno."}
          </p>
        </header>

        {cargando && (
          <div className="home-servicios__loading">
            <div
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            />

            <span>
              Cargando servicios...
            </span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="home-servicios__error"
          >
            {error}
          </div>
        )}

        {!cargando &&
          !error &&
          servicios.length ===
            0 && (
            <div className="home-servicios__empty">
              No hay servicios disponibles actualmente.
            </div>
          )}

        {!cargando &&
          !error &&
          servicios.length >
            0 && (
            <div className="home-servicios__grid">
              {servicios.map(
                (
                  servicio
                ) => (
                  <article
                    key={
                      servicio.id
                    }
                    className="home-servicios__card"
                  >
                    <div className="home-servicios__card-top">
                      <div>
                        <span className="home-servicios__duration">
                          {
                            servicio.duracionMinutos
                          }{" "}
                          minutos
                        </span>

                        <h3 className="home-servicios__card-title">
                          {
                            servicio.nombre
                          }
                        </h3>
                      </div>

                      <strong className="home-servicios__price">
                        {formatearPrecio(
                          servicio.precio
                        )}
                      </strong>
                    </div>

                    <p className="home-servicios__card-description">
                      {
                        servicio.descripcion
                      }
                    </p>

                    <Link
                      to={`/reservar?servicio=${servicio.id}`}
                      className="home-servicios__reserve-button"
                    >
                      {contenido?.serviciosBotonReservar ||
                        "Reservar este servicio"}

                      <span
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </Link>
                  </article>
                )
              )}
            </div>
          )}
      </div>
    </section>
  );
}

export default HomeServicios;