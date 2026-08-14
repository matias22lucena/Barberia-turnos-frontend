import api from "../api/api.js";

const obtenerToken = () => {
  return sessionStorage.getItem("adminToken");
};

const obtenerConfiguracion = () => {
  const token = obtenerToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const obtenerTurnosAdmin = async ({
  fecha = "",
  estado = "",
} = {}) => {
  const params = {};

  if (fecha) {
    params.fecha = fecha;
  }

  if (estado) {
    params.estado = estado;
  }

  const response = await api.get("/admin/turnos", {
    ...obtenerConfiguracion(),
    params,
  });

  return response.data;
};

export const cambiarEstadoTurnoAdmin = async ({
  turnoId,
  estado,
}) => {
  const response = await api.patch(
    `/admin/turnos/${turnoId}/estado`,
    {
      estado,
    },
    obtenerConfiguracion()
  );

  return response.data;
};