import Swal from "sweetalert2";

const configuracionBase = {
  background: "#1b1816",
  color: "#f4f1ed",
  confirmButtonColor: "#efb342",
};

export const alertaExito = (
  mensaje
) => {
  return Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: mensaje,
    showConfirmButton: false,
    timer: 2600,
    timerProgressBar: true,
    background:
      configuracionBase.background,
    color:
      configuracionBase.color,
    iconColor: "#78cf91",

    didOpen: (toast) => {
      toast.onmouseenter =
        Swal.stopTimer;

      toast.onmouseleave =
        Swal.resumeTimer;
    },
  });
};

export const alertaError = (
  mensaje
) => {
  return Swal.fire({
    icon: "error",
    title: "Ocurrió un problema",
    text: mensaje,
    confirmButtonText: "Entendido",
    confirmButtonColor:
      configuracionBase.confirmButtonColor,
    background:
      configuracionBase.background,
    color:
      configuracionBase.color,
    iconColor: "#ef8888",
  });
};

export const alertaAdvertencia = (
  mensaje
) => {
  return Swal.fire({
    icon: "warning",
    title: "Atención",
    text: mensaje,
    confirmButtonText: "Entendido",
    confirmButtonColor:
      configuracionBase.confirmButtonColor,
    background:
      configuracionBase.background,
    color:
      configuracionBase.color,
    iconColor: "#efb342",
  });
};

export const alertaInfo = (
  mensaje
) => {
  return Swal.fire({
    icon: "info",
    title: "Información",
    text: mensaje,
    confirmButtonText: "Aceptar",
    confirmButtonColor:
      configuracionBase.confirmButtonColor,
    background:
      configuracionBase.background,
    color:
      configuracionBase.color,
    iconColor: "#efb342",
  });
};

export const confirmarAccion =
  async ({
    titulo,
    texto,
    textoConfirmar = "Confirmar",
    textoCancelar = "Cancelar",
    peligro = false,
  }) => {
    const resultado =
      await Swal.fire({
        icon: peligro
          ? "warning"
          : "question",

        title: titulo,
        text: texto,

        showCancelButton: true,

        confirmButtonText:
          textoConfirmar,

        cancelButtonText:
          textoCancelar,

        reverseButtons: true,

        confirmButtonColor:
          peligro
            ? "#d65b5b"
            : "#efb342",

        cancelButtonColor:
          "#3a342f",

        background:
          configuracionBase.background,

        color:
          configuracionBase.color,

        iconColor:
          peligro
            ? "#ef8888"
            : "#efb342",
      });

    return resultado.isConfirmed;
  };

export const alertaSesionExpirada =
  () => {
    return Swal.fire({
      icon: "warning",

      title:
        "Sesión finalizada",

      text:
        "Tu sesión expiró o ya no es válida. Iniciá sesión nuevamente.",

      confirmButtonText:
        "Ir al login",

      confirmButtonColor:
        configuracionBase.confirmButtonColor,

      background:
        configuracionBase.background,

      color:
        configuracionBase.color,

      iconColor:
        "#efb342",

      allowOutsideClick:
        false,

      allowEscapeKey:
        false,
    });
  };