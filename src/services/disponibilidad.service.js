import api from "../api/api.js";

export const obtenerDisponibilidad = async ({
  barberoId,
  servicioId,
  fecha,
}) => {
  const response = await api.get("/disponibilidad", {
    params: {
      barberoId,
      servicioId,
      fecha,
    },
  });

  return response.data.data;
};