import api from "../api/api.js";

export const obtenerServicios = async () => {
  const response = await api.get("/servicios");

  return response.data.data;
};