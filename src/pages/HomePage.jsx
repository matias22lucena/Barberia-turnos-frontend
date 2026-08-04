import HomeHeader from "../components/home/HomeHeader.jsx";
import HomeHero from "../components/home/HomeHero.jsx";
import HomeServicios from "../components/home/HomeServicios.jsx";
import HomeHorarios from "../components/home/HomeHorarios.jsx";

import "./HomePage.css";

function HomePage() {
  return (
    <main className="home-page">
      <HomeHeader />
      <HomeHero />
      <HomeServicios />
      <HomeHorarios />
    </main>
  );
}

export default HomePage;