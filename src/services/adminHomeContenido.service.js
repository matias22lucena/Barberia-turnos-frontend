import api from "../api/api.js";

const obtenerConfiguracion =
  () => {
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

export const obtenerContenidoHomeAdmin =
  async () => {
    const response =
      await api.get(
        "/admin/home-contenido",
        obtenerConfiguracion()
      );

    return response.data;
  };

export const actualizarContenidoHomeAdmin =
  async (
    contenido
  ) => {
    const response =
      await api.patch(
        "/admin/home-contenido",
        contenido,
        obtenerConfiguracion()
      );

    return response.data;
  };

export const actualizarImagenHomeAdmin =
  async (
    imagen
  ) => {
    const formData =
      new FormData();

    formData.append(
      "imagen",
      imagen
    );

    const response =
      await api.post(
        "/admin/home-contenido/imagen",
        formData,
        obtenerConfiguracion()
      );

    return response.data;
  };

export const eliminarImagenHomeAdmin =
  async () => {
    const response =
      await api.delete(
        "/admin/home-contenido/imagen",
        obtenerConfiguracion()
      );

    return response.data;
  };