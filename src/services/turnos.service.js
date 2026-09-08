import api from "../api/api.js";

export const crearTurno = async ({
  barberoId,
  servicioId,
  promocionId = null,
  fecha,
  hora,
}) => {
  const response =
    await api.post(
      "/turnos",
      {
        barberoId,
        servicioId,
        promocionId,
        fecha,
        hora,
      }
    );

  return response.data.data;
};