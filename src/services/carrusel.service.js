import api from "../api/api.js";

export const obtenerCarrusel = async () => {
  const response = await api.get(
    "/carrusel"
  );

  return response.data.data || [];
};