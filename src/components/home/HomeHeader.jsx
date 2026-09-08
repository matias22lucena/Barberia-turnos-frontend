import { Link } from "react-router-dom";

import "./HomeHeader.css";

function HomeHeader() {
  return (
    <header className="home-header">
      <div className="home-header__container">
        <Link
          to="/"
          className="home-header__brand"
          aria-label="Ir al inicio"
        >
          <span className="home-header__name">
            Pitbull Barber Shop
          </span>
        </Link>

        <nav
          className="home-header__navigation"
          aria-label="Navegación principal"
        >
          <a href="#servicios">
            Servicios
          </a>

          <a href="#horarios">
            Horarios
          </a>

          <Link
            to="/reservar"
            className="home-header__reserve-button"
          >
            Reservar turno
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default HomeHeader;