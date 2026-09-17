import api from "../api/api.js";

const obtenerConfiguracion = () => {
  const token =
    sessionStorage.getItem(
      "adminToken"
    );

  return {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };
};

export const obtenerPromocionesAdmin =
  async () => {
    const response =
      await api.get(
        "/admin/promociones",
        obtenerConfiguracion()
      );

    return response.data;
  };

export const crearPromocionAdmin =
  async ({
    servicioId,
    titulo,
    descripcion,
    precio,
    duracionMinutos,
    cantidadServicios,
    activo,
  }) => {
    const response =
      await api.post(
        "/admin/promociones",
        {
          servicioId:
            servicioId === "" ||
            servicioId === null ||
            servicioId === undefined
              ? null
              : Number(
                  servicioId
                ),

          titulo,

          descripcion,

          precio:
            precio === "" ||
            precio === null ||
            precio === undefined
              ? null
              : Number(
                  precio
                ),

          duracionMinutos:
            Number(
              duracionMinutos
            ),

          cantidadServicios:
            Number(
              cantidadServicios ||
                1
            ),

          activo:
            Boolean(
              activo
            ),
        },
        obtenerConfiguracion()
      );

    return response.data;
  };

export const actualizarPromocionAdmin =
  async ({
    promocionId,
    servicioId,
    titulo,
    descripcion,
    precio,
    duracionMinutos,
    cantidadServicios,
    activo,
  }) => {
    const response =
      await api.patch(
        `/admin/promociones/${promocionId}`,
        {
          servicioId:
            servicioId === "" ||
            servicioId === null ||
            servicioId === undefined
              ? null
              : Number(
                  servicioId
                ),

          titulo,

          descripcion,

          precio:
            precio === "" ||
            precio === null ||
            precio === undefined
              ? null
              : Number(
                  precio
                ),

          duracionMinutos:
            Number(
              duracionMinutos
            ),

          cantidadServicios:
            Number(
              cantidadServicios ||
                1
            ),

          activo:
            Boolean(
              activo
            ),
        },
        obtenerConfiguracion()
      );

    return response.data;
  };

export const eliminarPromocionAdmin =
  async (
    promocionId
  ) => {
    const response =
      await api.delete(
        `/admin/promociones/${promocionId}`,
        obtenerConfiguracion()
      );

    return response.data;
  };