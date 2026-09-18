import api from "../api/api.js";

export const obtenerUrlImagen = (
  ruta
) => {
  if (!ruta) {
    return "";
  }

  if (
    ruta.startsWith("http://") ||
    ruta.startsWith("https://")
  ) {
    return ruta;
  }

  const baseApi =
    api.defaults.baseURL || "";

  const baseServidor =
    baseApi.replace(
      /\/api\/?$/,
      ""
    );

  return `${baseServidor}${ruta}`;
};