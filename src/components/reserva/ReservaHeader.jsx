import { Link } from "react-router-dom";

import "./ReservaHeader.css";

function ReservaHeader() {
  return (
    <header className="reserva-header">
      <div className="reserva-header__container">
        <Link
          to="/"
          className="reserva-header__brand"
        >
          <img
            src="/Pitbull-Barber-Shop.png"
            alt="Pitbull Barber Shop"
            className="reserva-header__logo"
          />

          <span className="reserva-header__name">
            Barbería Pitbull barber shop
          </span>
        </Link>
      </div>
    </header>
  );
}

export default ReservaHeader;