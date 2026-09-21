import {
  useEffect,
  useState,
} from "react";

import HomeHero from "../components/home/HomeHero.jsx";
import HomeCarrusel from "../components/home/HomeCarrusel.jsx";
import HomeServicios from "../components/home/HomeServicios.jsx";
import HomePromociones from "../components/home/HomePromociones.jsx";
import HomeHorarios from "../components/home/HomeHorarios.jsx";

import {
  obtenerContenidoHome,
} from "../services/homeContenido.service.js";

import "./HomePage.css";

function HomePage() {
  const [
    contenido,
    setContenido,
  ] = useState(null);

  useEffect(() => {
    const cargarContenido =
      async () => {
        try {
          const datos =
            await obtenerContenidoHome();

          setContenido(
            datos
          );
        } catch (error) {
          /*
           * No rompemos el Home.
           *
           * Cada componente posee
           * valores predeterminados.
           */
          console.error(
            "No se pudo cargar el contenido personalizado del Home:",
            error
          );
        }
      };

    cargarContenido();
  }, []);

  return (
    <main className="home-page">
      <HomeHero
        contenido={
          contenido
        }
      />

      <HomeCarrusel
        contenido={
          contenido
        }
      />

      <HomeServicios
        contenido={
          contenido
        }
      />

      <HomePromociones
        contenido={
          contenido
        }
      />

      <HomeHorarios
        contenido={
          contenido
        }
      />
    </main>
  );
}

export default HomePage;