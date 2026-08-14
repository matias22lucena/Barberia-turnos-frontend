import api from "../api/api.js";

const obtenerConfiguracion = () => {
  const token = sessionStorage.getItem("adminToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const obtenerTurnosDashboard = async (fecha) => {
  const response = await api.get(
    "/admin/turnos",
    {
      ...obtenerConfiguracion(),
      params: {
        fecha,
      },
    }
  );

  return response.data;
};