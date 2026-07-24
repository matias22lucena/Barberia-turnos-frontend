import api from "../api/api.js";

export const obtenerHorariosPorBarbero = async (barberoId) => {
  const response = await api.get("/horarios", {
    params: {
      barberoId,
    },
  });

  return response.data.data;
};