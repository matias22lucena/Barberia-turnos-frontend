import { Link } from "react-router-dom";
import "./ReservaHeader.css";

function ReservaHeader() {
  return (
    <header className="reserva-header">
      <div className="reserva-header__container">
        <Link to="/" className="reserva-header__brand">
          <span className="reserva-header__icon">✂</span>

          <span className="reserva-header__name">
            Barbería El Estilo
          </span>
        </Link>
      </div>
    </header>
  );
}

export default ReservaHeader;