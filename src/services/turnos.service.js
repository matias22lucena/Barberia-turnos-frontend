import api from "../api/api.js";

export const crearTurno = async ({
  barberoId,
  servicioId,
  fecha,
  hora,
  cliente,
}) => {
  const response = await api.post("/turnos", {
    barberoId,
    servicioId,
    fecha,
    hora,
    cliente,
  });

  return response.data.data;
};