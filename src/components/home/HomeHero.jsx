import {
  Link,
} from "react-router-dom";

import logobarber from "../../../public/Pitbull-Barber-Shop.png";

import {
  obtenerUrlImagen,
} from "../../utils/imagenUrl.js";

import "./HomeHero.css";

function HomeHero({
  contenido,
}) {
  const imagen =
    contenido?.heroImagenUrl
      ? obtenerUrlImagen(
          contenido.heroImagenUrl
        )
      : logobarber;

  const eyebrow =
    contenido?.heroEyebrow ||
    "Barbería · Estilo · Precisión";

  const titulo =
    contenido?.heroTitulo ||
    "Tu imagen merece";

  const tituloDestacado =
    contenido?.heroTituloDestacado ||
    "su mejor versión.";

  const descripcion =
    contenido?.heroDescripcion ||
    "Cortes clásicos, barba y atención personalizada. Reservá tu turno online de forma rápida y sencilla.";

  const botonReservar =
    contenido?.heroBotonReservar ||
    "Reservar mi turno";

  const botonServicios =
    contenido?.heroBotonServicios ||
    "Ver servicios";

  const botonHorarios =
    contenido?.heroBotonHorarios ||
    "Ver horarios";

  return (
    <section className="home-hero">
      <div className="home-hero__container">
        <div className="home-hero__logo-wrapper">
          <div className="home-hero__logo-frame">
            <img
              src={imagen}
              alt="Pitbull Barber Shop"
              className="home-hero__logo"
            />
          </div>
        </div>

        <div className="home-hero__content">
          <span className="home-hero__eyebrow">
            {eyebrow}
          </span>

          <h1 className="home-hero__title">
            {titulo}

            <span>
              {tituloDestacado}
            </span>
          </h1>

          <p className="home-hero__description">
            {descripcion}
          </p>

          <div className="home-hero__actions">
            <Link
              to="/reservar"
              className="home-hero__primary-button"
            >
              {botonReservar}
            </Link>

            <a
              href="#servicios"
              className="home-hero__secondary-button"
            >
              {botonServicios}
            </a>

            <a
              href="#horarios"
              className="home-hero__secondary-button"
            >
              {botonHorarios}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;