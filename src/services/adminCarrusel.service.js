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

export const obtenerCarruselAdmin =
  async () => {
    const response =
      await api.get(
        "/admin/carrusel",
        obtenerConfiguracion()
      );

    return response.data;
  };

export const crearImagenCarruselAdmin =
  async ({
    imagen,
    titulo,
    orden,
    activo,
  }) => {
    const formData =
      new FormData();

    formData.append(
      "imagen",
      imagen
    );

    formData.append(
      "titulo",
      titulo || ""
    );

    formData.append(
      "orden",
      String(
        orden ?? 0
      )
    );

    formData.append(
      "activo",
      String(
        activo
      )
    );

    const response =
      await api.post(
        "/admin/carrusel",
        formData,
        obtenerConfiguracion()
      );

    return response.data;
  };

export const actualizarImagenCarruselAdmin =
  async ({
    imagenId,
    imagen,
    titulo,
    orden,
    activo,
  }) => {
    const formData =
      new FormData();

    if (imagen) {
      formData.append(
        "imagen",
        imagen
      );
    }

    formData.append(
      "titulo",
      titulo || ""
    );

    formData.append(
      "orden",
      String(
        orden ?? 0
      )
    );

    formData.append(
      "activo",
      String(
        activo
      )
    );

    const response =
      await api.patch(
        `/admin/carrusel/${imagenId}`,
        formData,
        obtenerConfiguracion()
      );

    return response.data;
  };

export const eliminarImagenCarruselAdmin =
  async (
    imagenId
  ) => {
    const response =
      await api.delete(
        `/admin/carrusel/${imagenId}`,
        obtenerConfiguracion()
      );

    return response.data;
  };