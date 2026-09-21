import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  actualizarContenidoHomeAdmin,
  actualizarImagenHomeAdmin,
  eliminarImagenHomeAdmin,
  obtenerContenidoHomeAdmin,
} from "../services/adminHomeContenido.service.js";

import {
  obtenerUrlImagen,
} from "../utils/imagenUrl.js";

import {
  alertaAdvertencia,
  alertaError,
  alertaExito,
  alertaSesionExpirada,
  confirmarAccion,
} from "../utils/alertas.js";

import "./AdminHomePage.css";

function AdminHomePage() {
  const navigate =
    useNavigate();

  const [
    contenido,
    setContenido,
  ] = useState(null);

  const [
    archivoImagen,
    setArchivoImagen,
  ] = useState(null);

  const [
    preview,
    setPreview,
  ] = useState("");

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    guardando,
    setGuardando,
  ] = useState(false);

  const [
    subiendoImagen,
    setSubiendoImagen,
  ] = useState(false);

  const [
    errorCarga,
    setErrorCarga,
  ] = useState("");

  const manejarSesion =
    async (error) => {
      if (
        error.response?.status ===
        401
      ) {
        sessionStorage.removeItem(
          "adminToken"
        );

        sessionStorage.removeItem(
          "adminUsuario"
        );

        await alertaSesionExpirada();

        navigate(
          "/admin/login"
        );

        return true;
      }

      return false;
    };

  const cargar =
    async () => {
      try {
        setCargando(true);
        setErrorCarga("");

        const respuesta =
          await obtenerContenidoHomeAdmin();

        setContenido(
          respuesta.data
        );
      } catch (error) {
        if (
          await manejarSesion(
            error
          )
        ) {
          return;
        }

        const mensaje =
          error.response?.data
            ?.message ||
          "No se pudo cargar el contenido del inicio.";

        setErrorCarga(
          mensaje
        );

        await alertaError(
          mensaje
        );
      } finally {
        setCargando(
          false
        );
      }
    };

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(
          preview
        );
      }
    };
  }, [
    preview,
  ]);

  const cambiarCampo = (
    campo,
    valor
  ) => {
    setContenido(
      (
        anterior
      ) => ({
        ...anterior,

        [campo]:
          valor,
      })
    );
  };

  const guardarTextos =
    async () => {
      try {
        setGuardando(
          true
        );

        const respuesta =
          await actualizarContenidoHomeAdmin(
            contenido
          );

        setContenido(
          respuesta.data
        );

        await alertaExito(
          "Contenido del inicio actualizado correctamente."
        );
      } catch (error) {
        if (
          await manejarSesion(
            error
          )
        ) {
          return;
        }

        await alertaError(
          error.response?.data
            ?.message ||
          "No se pudo guardar el contenido."
        );
      } finally {
        setGuardando(
          false
        );
      }
    };

  const seleccionarImagen = (
    event
  ) => {
    const archivo =
      event.target
        .files?.[0];

    if (!archivo) {
      return;
    }

    if (preview) {
      URL.revokeObjectURL(
        preview
      );
    }

    setArchivoImagen(
      archivo
    );

    setPreview(
      URL.createObjectURL(
        archivo
      )
    );
  };

  const subirImagen =
    async () => {
      if (
        !archivoImagen
      ) {
        await alertaAdvertencia(
          "Seleccioná una imagen primero."
        );

        return;
      }

      try {
        setSubiendoImagen(
          true
        );

        const respuesta =
          await actualizarImagenHomeAdmin(
            archivoImagen
          );

        setContenido(
          respuesta.data
        );

        if (preview) {
          URL.revokeObjectURL(
            preview
          );
        }

        setPreview("");

        setArchivoImagen(
          null
        );

        await alertaExito(
          "Imagen principal actualizada correctamente."
        );
      } catch (error) {
        if (
          await manejarSesion(
            error
          )
        ) {
          return;
        }

        await alertaError(
          error.response?.data
            ?.message ||
          "No se pudo cambiar la imagen principal."
        );
      } finally {
        setSubiendoImagen(
          false
        );
      }
    };

  const restaurarImagen =
    async () => {
      const confirmar =
        await confirmarAccion({
          titulo:
            "¿Restaurar logo original?",

          texto:
            "La imagen personalizada será reemplazada por el logo predeterminado del proyecto.",

          textoConfirmar:
            "Sí, restaurar",

          textoCancelar:
            "Cancelar",
        });

      if (!confirmar) {
        return;
      }

      try {
        setSubiendoImagen(
          true
        );

        const respuesta =
          await eliminarImagenHomeAdmin();

        setContenido(
          respuesta.data
        );

        setArchivoImagen(
          null
        );

        if (preview) {
          URL.revokeObjectURL(
            preview
          );
        }

        setPreview("");

        await alertaExito(
          "Se restauró el logo predeterminado."
        );
      } catch (error) {
        if (
          await manejarSesion(
            error
          )
        ) {
          return;
        }

        await alertaError(
          error.response?.data
            ?.message ||
          "No se pudo restaurar la imagen."
        );
      } finally {
        setSubiendoImagen(
          false
        );
      }
    };

  if (cargando) {
    return (
      <main className="admin-home-page">
        <div className="admin-home-estado">
          Cargando contenido...
        </div>
      </main>
    );
  }

  if (!contenido) {
    return (
      <main className="admin-home-page">
        <div className="admin-home-error">
          {errorCarga ||
            "No se encontró la configuración del Home."}
        </div>
      </main>
    );
  }

  const imagenActual =
    preview ||
    (
      contenido.heroImagenUrl
        ? obtenerUrlImagen(
            contenido.heroImagenUrl
          )
        : null
    );

  return (
    <main className="admin-home-page">
      <header className="admin-home-header">
        <button
          type="button"
          className="admin-home-volver"
          onClick={() =>
            navigate(
              "/admin"
            )
          }
        >
          ← Volver al panel
        </button>

        <p className="admin-home-eyebrow">
          ADMINISTRACIÓN
        </p>

        <h1>
          Contenido del inicio
        </h1>

        <p>
          Modificá los textos y la
          imagen principal que ven
          tus clientes.
        </p>
      </header>

      <section className="admin-home-seccion">
        <div className="admin-home-seccion__header">
          <div>
            <span>
              IMAGEN PRINCIPAL
            </span>

            <h2>
              Logo del inicio
            </h2>
          </div>
        </div>

        <div className="admin-home-imagen">
          {imagenActual ? (
            <img
              src={
                imagenActual
              }
              alt="Imagen principal"
            />
          ) : (
            <div className="admin-home-imagen__default">
              Se está utilizando
              el logo predeterminado
              del proyecto.
            </div>
          )}

          <label className="admin-home-file">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={
                seleccionarImagen
              }
            />

            Seleccionar imagen
            desde galería
          </label>

          {archivoImagen && (
            <button
              type="button"
              className="admin-home-imagen-guardar"
              disabled={
                subiendoImagen
              }
              onClick={
                subirImagen
              }
            >
              {subiendoImagen
                ? "Subiendo..."
                : "Guardar nueva imagen"}
            </button>
          )}

          {contenido.heroImagenUrl && (
            <button
              type="button"
              className="admin-home-imagen-restaurar"
              disabled={
                subiendoImagen
              }
              onClick={
                restaurarImagen
              }
            >
              Restaurar logo original
            </button>
          )}
        </div>
      </section>

      <section className="admin-home-seccion">
        <div className="admin-home-seccion__header">
          <div>
            <span>
              HERO
            </span>

            <h2>
              Presentación principal
            </h2>
          </div>
        </div>

        <div className="admin-home-form">
          <Campo
            label="Texto superior"
            valor={
              contenido.heroEyebrow
            }
            maxLength={150}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "heroEyebrow",
                valor
              )
            }
          />

          <Campo
            label="Título principal"
            valor={
              contenido.heroTitulo
            }
            maxLength={200}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "heroTitulo",
                valor
              )
            }
          />

          <Campo
            label="Título destacado"
            valor={
              contenido
                .heroTituloDestacado
            }
            maxLength={200}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "heroTituloDestacado",
                valor
              )
            }
          />

          <Campo
            label="Descripción"
            valor={
              contenido.heroDescripcion
            }
            maxLength={500}
            textarea
            completo
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "heroDescripcion",
                valor
              )
            }
          />

          <Campo
            label="Botón reservar"
            valor={
              contenido.heroBotonReservar
            }
            maxLength={100}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "heroBotonReservar",
                valor
              )
            }
          />

          <Campo
            label="Botón servicios"
            valor={
              contenido.heroBotonServicios
            }
            maxLength={100}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "heroBotonServicios",
                valor
              )
            }
          />

          <Campo
            label="Botón horarios"
            valor={
              contenido.heroBotonHorarios
            }
            maxLength={100}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "heroBotonHorarios",
                valor
              )
            }
          />
        </div>
      </section>

      <section className="admin-home-seccion">
        <div className="admin-home-seccion__header">
          <div>
            <span>
              CARRUSEL
            </span>

            <h2>
              Nuestros trabajos
            </h2>
          </div>
        </div>

        <div className="admin-home-form">
          <Campo
            label="Texto superior"
            valor={
              contenido.carruselEyebrow
            }
            maxLength={150}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "carruselEyebrow",
                valor
              )
            }
          />

          <Campo
            label="Título"
            valor={
              contenido.carruselTitulo
            }
            maxLength={200}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "carruselTitulo",
                valor
              )
            }
          />

          <Campo
            label="Descripción"
            valor={
              contenido.carruselDescripcion
            }
            maxLength={500}
            textarea
            completo
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "carruselDescripcion",
                valor
              )
            }
          />
        </div>
      </section>

      <section className="admin-home-seccion">
        <div className="admin-home-seccion__header">
          <div>
            <span>
              SERVICIOS
            </span>

            <h2>
              Sección servicios
            </h2>
          </div>
        </div>

        <div className="admin-home-form">
          <Campo
            label="Texto superior"
            valor={
              contenido.serviciosEyebrow
            }
            maxLength={150}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "serviciosEyebrow",
                valor
              )
            }
          />

          <Campo
            label="Título"
            valor={
              contenido.serviciosTitulo
            }
            maxLength={250}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "serviciosTitulo",
                valor
              )
            }
          />

          <Campo
            label="Descripción"
            valor={
              contenido.serviciosDescripcion
            }
            maxLength={500}
            textarea
            completo
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "serviciosDescripcion",
                valor
              )
            }
          />

          <Campo
            label="Botón de reserva"
            valor={
              contenido.serviciosBotonReservar
            }
            maxLength={100}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "serviciosBotonReservar",
                valor
              )
            }
          />
        </div>
      </section>

      <section className="admin-home-seccion">
        <div className="admin-home-seccion__header">
          <div>
            <span>
              PROMOCIONES
            </span>

            <h2>
              Sección promociones
            </h2>
          </div>
        </div>

        <div className="admin-home-form">
          <Campo
            label="Texto superior"
            valor={
              contenido.promocionesEyebrow
            }
            maxLength={150}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "promocionesEyebrow",
                valor
              )
            }
          />

          <Campo
            label="Título"
            valor={
              contenido.promocionesTitulo
            }
            maxLength={250}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "promocionesTitulo",
                valor
              )
            }
          />

          <Campo
            label="Descripción"
            valor={
              contenido.promocionesDescripcion
            }
            maxLength={500}
            textarea
            completo
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "promocionesDescripcion",
                valor
              )
            }
          />

          <Campo
            label="Texto del distintivo"
            valor={
              contenido.promocionesBadge
            }
            maxLength={50}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "promocionesBadge",
                valor
              )
            }
          />

          <Campo
            label="Botón de reserva"
            valor={
              contenido.promocionesBotonReservar
            }
            maxLength={100}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "promocionesBotonReservar",
                valor
              )
            }
          />
        </div>
      </section>

      <section className="admin-home-seccion">
        <div className="admin-home-seccion__header">
          <div>
            <span>
              HORARIOS
            </span>

            <h2>
              Sección horarios
            </h2>
          </div>
        </div>

        <div className="admin-home-form">
          <Campo
            label="Texto superior"
            valor={
              contenido.horariosEyebrow
            }
            maxLength={150}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "horariosEyebrow",
                valor
              )
            }
          />

          <Campo
            label="Título"
            valor={
              contenido.horariosTitulo
            }
            maxLength={250}
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "horariosTitulo",
                valor
              )
            }
          />

          <Campo
            label="Descripción"
            valor={
              contenido.horariosDescripcion
            }
            maxLength={500}
            textarea
            completo
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "horariosDescripcion",
                valor
              )
            }
          />

          <Campo
            label="Nota inferior"
            valor={
              contenido.horariosNota
            }
            maxLength={500}
            textarea
            completo
            onChange={(
              valor
            ) =>
              cambiarCampo(
                "horariosNota",
                valor
              )
            }
          />
        </div>
      </section>

      <div className="admin-home-guardar-wrapper">
        <button
          type="button"
          className="admin-home-guardar"
          disabled={
            guardando
          }
          onClick={
            guardarTextos
          }
        >
          {guardando
            ? "Guardando..."
            : "Guardar todos los cambios"}
        </button>
      </div>
    </main>
  );
}

function Campo({
  label,
  valor,
  onChange,
  maxLength,
  textarea = false,
  completo = false,
}) {
  return (
    <div
      className={
        completo
          ? "admin-home-campo admin-home-campo--completo"
          : "admin-home-campo"
      }
    >
      <label>
        {label}
      </label>

      {textarea ? (
        <textarea
          value={
            valor || ""
          }
          maxLength={
            maxLength
          }
          onChange={(
            event
          ) =>
            onChange(
              event.target.value
            )
          }
        />
      ) : (
        <input
          type="text"
          value={
            valor || ""
          }
          maxLength={
            maxLength
          }
          onChange={(
            event
          ) =>
            onChange(
              event.target.value
            )
          }
        />
      )}
    </div>
  );
}

export default AdminHomePage;