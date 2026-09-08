import api from "../api/api.js";

export const obtenerPromociones = async () => {
  const response = await api.get("/promociones");

  return response.data.data;
};