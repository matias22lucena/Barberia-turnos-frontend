import api from "../api/api.js";

const obtenerConfiguracion = () => {
  const token = sessionStorage.getItem("adminToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const obtenerServiciosAdmin = async () => {
  const response = await api.get(
    "/admin/servicios",
    obtenerConfiguracion()
  );

  return response.data;
};

export const actualizarServicioAdmin = async ({
  servicioId,
  nombre,
  descripcion,
  duracionMinutos,
  precio,
  activo,
}) => {
  const response = await api.patch(
    `/admin/servicios/${servicioId}`,
    {
      nombre,
      descripcion,
      duracionMinutos,
      precio,
      activo,
    },
    obtenerConfiguracion()
  );

  return response.data;
};