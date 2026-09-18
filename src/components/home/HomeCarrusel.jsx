/* import {
  useEffect,
  useState,
} from "react";

import {
  obtenerCarrusel,
} from "../../services/carrusel.service.js";

import {
  obtenerUrlImagen,
} from "../../utils/imagenUrl.js";

import "./HomeCarrusel.css";

function HomeCarrusel() {
  const [
    imagenes,
    setImagenes,
  ] = useState([]);

  const [
    indiceActual,
    setIndiceActual,
  ] = useState(0);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  useEffect(() => {
    const cargar =
      async () => {
        try {
          const datos =
            await obtenerCarrusel();

          setImagenes(
            datos
          );
        } catch (error) {
          console.error(
            error
          );
        } finally {
          setCargando(
            false
          );
        }
      };

    cargar();
  }, []);

  useEffect(() => {
    if (
      imagenes.length <=
      1
    ) {
      return undefined;
    }

    const intervalo =
      setInterval(
        () => {
          setIndiceActual(
            (anterior) =>
              (
                anterior +
                1
              ) %
              imagenes.length
          );
        },
        5000
      );

    return () =>
      clearInterval(
        intervalo
      );
  }, [
    imagenes.length,
  ]);

  if (
    cargando ||
    imagenes.length ===
      0
  ) {
    return null;
  }

  const anterior =
    () => {
      setIndiceActual(
        (actual) =>
          actual === 0
            ? imagenes.length -
              1
            : actual - 1
      );
    };

  const siguiente =
    () => {
      setIndiceActual(
        (actual) =>
          (
            actual + 1
          ) %
          imagenes.length
      );
    };

  return (
    <section className="home-carrusel">
      <div className="home-carrusel__container">
        <header className="home-carrusel__header">
          <span>
            NUESTROS TRABAJOS
          </span>

          <h2>
            Estilo que se nota
          </h2>

          <p>
            Mirá algunos de nuestros
            trabajos realizados en
            Pitbull Barber Shop.
          </p>
        </header>

        <div className="home-carrusel__viewer">
          <div className="home-carrusel__image-wrapper">
            <img
              src={obtenerUrlImagen(
                imagenes[
                  indiceActual
                ].imagenUrl
              )}
              alt={
                imagenes[
                  indiceActual
                ].titulo ||
                "Trabajo de barbería"
              }
              className="home-carrusel__image"
            />

            {imagenes[
              indiceActual
            ].titulo && (
              <div className="home-carrusel__caption">
                {
                  imagenes[
                    indiceActual
                  ].titulo
                }
              </div>
            )}
          </div>

          {imagenes.length >
            1 && (
            <>
              <button
                type="button"
                className="home-carrusel__arrow home-carrusel__arrow--left"
                onClick={
                  anterior
                }
                aria-label="Imagen anterior"
              >
                ‹
              </button>

              <button
                type="button"
                className="home-carrusel__arrow home-carrusel__arrow--right"
                onClick={
                  siguiente
                }
                aria-label="Imagen siguiente"
              >
                ›
              </button>
            </>
          )}
        </div>

        {imagenes.length >
          1 && (
          <div className="home-carrusel__dots">
            {imagenes.map(
              (
                imagen,
                indice
              ) => (
                <button
                  key={
                    imagen.id
                  }
                  type="button"
                  className={
                    indice ===
                    indiceActual
                      ? "home-carrusel__dot home-carrusel__dot--active"
                      : "home-carrusel__dot"
                  }
                  onClick={() =>
                    setIndiceActual(
                      indice
                    )
                  }
                  aria-label={`Ver imagen ${indice + 1}`}
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default HomeCarrusel; */


import {
  useEffect,
  useState,
} from "react";

import {
  obtenerCarrusel,
} from "../../services/carrusel.service.js";

import {
  obtenerUrlImagen,
} from "../../utils/imagenUrl.js";

import "./HomeCarrusel.css";

function HomeCarrusel() {
  const [
    imagenes,
    setImagenes,
  ] = useState([]);

  const [
    indiceActual,
    setIndiceActual,
  ] = useState(0);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  useEffect(() => {
    const cargar =
      async () => {
        try {
          const datos =
            await obtenerCarrusel();

          setImagenes(
            datos
          );
        } catch (error) {
          console.error(
            error
          );
        } finally {
          setCargando(
            false
          );
        }
      };

    cargar();
  }, []);

  useEffect(() => {
    if (
      imagenes.length <=
      1
    ) {
      return undefined;
    }

    const intervalo =
      setInterval(
        () => {
          setIndiceActual(
            (anterior) =>
              (
                anterior +
                1
              ) %
              imagenes.length
          );
        },
        5000
      );

    return () =>
      clearInterval(
        intervalo
      );
  }, [
    imagenes.length,
  ]);

  if (
    cargando ||
    imagenes.length ===
      0
  ) {
    return null;
  }

  const imagenActual =
    imagenes[
      indiceActual
    ];

  const urlImagenActual =
    obtenerUrlImagen(
      imagenActual.imagenUrl
    );

  const anterior =
    () => {
      setIndiceActual(
        (actual) =>
          actual === 0
            ? imagenes.length -
              1
            : actual - 1
      );
    };

  const siguiente =
    () => {
      setIndiceActual(
        (actual) =>
          (
            actual + 1
          ) %
          imagenes.length
      );
    };

  return (
    <section className="home-carrusel">
      <div className="home-carrusel__container">
        <header className="home-carrusel__header">
          <span>
            NUESTROS TRABAJOS
          </span>

          <h2>
            Estilo que se nota
          </h2>

          <p>
            Mirá algunos de nuestros
            trabajos realizados en
            Pitbull Barber Shop.
          </p>
        </header>

        <div className="home-carrusel__viewer">
          <div
            className="home-carrusel__image-wrapper"
            style={{
              "--imagen-fondo":
                `url("${urlImagenActual}")`,
            }}
          >
            <div
              className="home-carrusel__background"
              aria-hidden="true"
            />

            <img
              src={
                urlImagenActual
              }
              alt={
                imagenActual.titulo ||
                "Trabajo de barbería"
              }
              className="home-carrusel__image"
            />

            {imagenActual.titulo && (
              <div className="home-carrusel__caption">
                {
                  imagenActual.titulo
                }
              </div>
            )}
          </div>

          {imagenes.length >
            1 && (
            <>
              <button
                type="button"
                className="home-carrusel__arrow home-carrusel__arrow--left"
                onClick={
                  anterior
                }
                aria-label="Imagen anterior"
              >
                ‹
              </button>

              <button
                type="button"
                className="home-carrusel__arrow home-carrusel__arrow--right"
                onClick={
                  siguiente
                }
                aria-label="Imagen siguiente"
              >
                ›
              </button>
            </>
          )}
        </div>

        {imagenes.length >
          1 && (
          <div className="home-carrusel__dots">
            {imagenes.map(
              (
                imagen,
                indice
              ) => (
                <button
                  key={
                    imagen.id
                  }
                  type="button"
                  className={
                    indice ===
                    indiceActual
                      ? "home-carrusel__dot home-carrusel__dot--active"
                      : "home-carrusel__dot"
                  }
                  onClick={() =>
                    setIndiceActual(
                      indice
                    )
                  }
                  aria-label={`Ver imagen ${indice + 1}`}
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default HomeCarrusel;