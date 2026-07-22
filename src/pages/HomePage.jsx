import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main>
      <h1>Barbería El Estilo</h1>

      <p>Reservá tu turno de forma rápida y sencilla.</p>

      <Link to="/reservar">
        Reservar turno
      </Link>
    </main>
  );
}

export default HomePage;