import api from "../api/api.js";

export const crearTurno = async ({
  barberoId,
  servicioId,
  promocionId = null,
  fecha,
  hora,
  cliente,
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
        cliente,
      }
    );

  return response.data.data;
};

export const crearTurnosPromocion = async ({
  barberoId,
  servicioId,
  promocionId,
  turnos,
  cliente,
}) => {
  const response =
    await api.post(
      "/turnos",
      {
        barberoId,
        servicioId,
        promocionId,
        turnos,
        cliente,
      }
    );

  return response.data.data;
};