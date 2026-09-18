import HomeHero from "../components/home/HomeHero.jsx";
import HomeCarrusel from "../components/home/HomeCarrusel.jsx";
import HomeServicios from "../components/home/HomeServicios.jsx";
import HomePromociones from "../components/home/HomePromociones.jsx";
import HomeHorarios from "../components/home/HomeHorarios.jsx";

import "./HomePage.css";

function HomePage() {
  return (
    <main className="home-page">
      <HomeHero />

      <HomeCarrusel />

      <HomeServicios />

      <HomePromociones />

      <HomeHorarios />
    </main>
  );
}

export default HomePage;