import api from "../api/api.js";

export const obtenerContenidoHome =
  async () => {
    const response =
      await api.get(
        "/home-contenido"
      );

    return (
      response.data.data ||
      null
    );
  };