import api from "../api/api.js";

const obtenerConfiguracion = () => {
  const token = sessionStorage.getItem("adminToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const obtenerHorariosAdmin = async () => {
  const response = await api.get(
    "/admin/horarios",
    obtenerConfiguracion()
  );

  return response.data;
};

export const crearHorarioAdmin = async ({
  barberoId = 1,
  diaSemana,
  horaInicio,
  horaFin,
}) => {
  const response = await api.post(
    "/admin/horarios",
    {
      barberoId,
      diaSemana,
      horaInicio,
      horaFin,
    },
    obtenerConfiguracion()
  );

  return response.data;
};

export const actualizarHorarioAdmin = async ({
  horarioId,
  diaSemana,
  horaInicio,
  horaFin,
  activo,
}) => {
  const response = await api.patch(
    `/admin/horarios/${horarioId}`,
    {
      diaSemana,
      horaInicio,
      horaFin,
      activo,
    },
    obtenerConfiguracion()
  );

  return response.data;
};

export const eliminarHorarioAdmin = async (
  horarioId
) => {
  const response = await api.delete(
    `/admin/horarios/${horarioId}`,
    obtenerConfiguracion()
  );

  return response.data;
};  