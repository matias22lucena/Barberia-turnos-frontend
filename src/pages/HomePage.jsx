import HomeHero from "../components/home/HomeHero.jsx";
import HomeServicios from "../components/home/HomeServicios.jsx";
import HomePromociones from "../components/home/HomePromociones.jsx";
import HomeHorarios from "../components/home/HomeHorarios.jsx";

import "./HomePage.css";

function HomePage() {
  return (
    <main className="home-page">
      <HomeHero />

      <HomeServicios />

      <HomePromociones />

      <HomeHorarios />
    </main>
  );
}

export default HomePage;