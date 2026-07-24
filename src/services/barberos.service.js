import api from "../api/api.js";

export const obtenerBarberosPorServicio = async (servicioId) => {
  const response = await api.get("/barberos", {
    params: {
      servicioId,
    },
  });

  return response.data.data;
};