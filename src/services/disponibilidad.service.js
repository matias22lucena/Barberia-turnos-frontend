import api from "../api/api.js";

export const obtenerDisponibilidad = async ({
  barberoId,
  servicioId,
  promocionId = null,
  fecha,
}) => {
  const response = await api.get(
    "/disponibilidad",
    {
      params: {
        barberoId,
        servicioId,
        promocionId:
          promocionId || undefined,
        fecha,
      },
    }
  );

  return response.data.data;
};