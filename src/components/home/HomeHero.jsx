import { Link } from "react-router-dom";

import logobarber from "../../../public/Pitbull-Barber-Shop.png";

import "./HomeHero.css";

function HomeHero() {
  return (
    <section className="home-hero">
      <div className="home-hero__container">
        <div className="home-hero__logo-wrapper">
          <div className="home-hero__logo-frame">
            <img
              src={logobarber}
              alt="Pitbull Barber Shop"
              className="home-hero__logo"
            />
          </div>
        </div>

        <div className="home-hero__content">
          <span className="home-hero__eyebrow">
            Barbería · Estilo · Precisión
          </span>

          <h1 className="home-hero__title">
            Tu imagen merece
            <span>
              {" "}
              su mejor versión.
            </span>
          </h1>

          <p className="home-hero__description">
            Cortes clásicos, barba y atención personalizada.
            Reservá tu turno online de forma rápida y sencilla.
          </p>

          <div className="home-hero__actions">
            <Link
              to="/reservar"
              className="home-hero__primary-button"
            >
              Reservar mi turno
            </Link>

            <a
              href="#servicios"
              className="home-hero__secondary-button"
            >
              Ver servicios
            </a>

            <a
              href="#horarios"
              className="home-hero__secondary-button"
            >
              Ver horarios
            </a>
          </div>

          <div className="home-hero__features">
            <span>
              Turnos online
            </span>

            <span>
              Atención personalizada
            </span>

            <span>
              Menos tiempo de espera
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;