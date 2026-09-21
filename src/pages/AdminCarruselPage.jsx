import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  actualizarImagenCarruselAdmin,
  crearImagenCarruselAdmin,
  eliminarImagenCarruselAdmin,
  obtenerCarruselAdmin,
} from "../services/adminCarrusel.service.js";

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

import "./AdminCarruselPage.css";

const imagenInicial = {
  archivo: null,
  preview: "",
  titulo: "",
  orden: 0,
  activo: true,
};

function AdminCarruselPage() {
  const navigate =
    useNavigate();

  const [
    imagenes,
    setImagenes,
  ] = useState([]);

  const [
    nueva,
    setNueva,
  ] = useState(
    imagenInicial
  );

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    guardando,
    setGuardando,
  ] = useState(false);

  const [
    guardandoId,
    setGuardandoId,
  ] = useState(null);

  const [
    eliminandoId,
    setEliminandoId,
  ] = useState(null);

  const [
    errorCarga,
    setErrorCarga,
  ] = useState("");

  const manejarSesion =
    async (
      error
    ) => {
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
        setCargando(
          true
        );

        setErrorCarga("");

        const respuesta =
          await obtenerCarruselAdmin();

        setImagenes(
          respuesta.data ||
            []
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
          "No se pudo cargar el carrusel.";

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

  const seleccionarNuevaImagen =
    (
      event
    ) => {
      const archivo =
        event.target
          .files?.[0];

      if (!archivo) {
        return;
      }

      if (
        nueva.preview
      ) {
        URL.revokeObjectURL(
          nueva.preview
        );
      }

      const preview =
        URL.createObjectURL(
          archivo
        );

      setNueva(
        (
          anterior
        ) => ({
          ...anterior,

          archivo,
          preview,
        })
      );
    };

  const crear =
    async () => {
      if (
        !nueva.archivo
      ) {
        await alertaAdvertencia(
          "Seleccioná una imagen antes de agregarla al carrusel."
        );

        return;
      }

      try {
        setGuardando(
          true
        );

        const respuesta =
          await crearImagenCarruselAdmin({
            imagen:
              nueva.archivo,

            titulo:
              nueva.titulo,

            orden:
              Number(
                nueva.orden
              ),

            activo:
              nueva.activo,
          });

        setImagenes(
          (
            anteriores
          ) => [
            ...anteriores,
            respuesta.data,
          ]
        );

        if (
          nueva.preview
        ) {
          URL.revokeObjectURL(
            nueva.preview
          );
        }

        setNueva(
          imagenInicial
        );

        await alertaExito(
          "Imagen agregada al carrusel correctamente."
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
          "No se pudo subir la imagen."
        );
      } finally {
        setGuardando(
          false
        );
      }
    };

  const cambiarCampo = (
    id,
    campo,
    valor
  ) => {
    setImagenes(
      (
        anteriores
      ) =>
        anteriores.map(
          (
            imagen
          ) =>
            imagen.id ===
            id
              ? {
                  ...imagen,

                  [campo]:
                    valor,
                }
              : imagen
        )
    );
  };

  const seleccionarReemplazo =
    (
      id,
      event
    ) => {
      const archivo =
        event.target
          .files?.[0];

      if (!archivo) {
        return;
      }

      const preview =
        URL.createObjectURL(
          archivo
        );

      setImagenes(
        (
          anteriores
        ) =>
          anteriores.map(
            (
              imagen
            ) => {
              if (
                imagen.id !==
                id
              ) {
                return imagen;
              }

              if (
                imagen.previewNuevo
              ) {
                URL.revokeObjectURL(
                  imagen.previewNuevo
                );
              }

              return {
                ...imagen,

                archivoNuevo:
                  archivo,

                previewNuevo:
                  preview,
              };
            }
          )
      );
    };

  const guardar =
    async (
      imagen
    ) => {
      try {
        setGuardandoId(
          imagen.id
        );

        const respuesta =
          await actualizarImagenCarruselAdmin({
            imagenId:
              imagen.id,

            imagen:
              imagen.archivoNuevo ||
              null,

            titulo:
              imagen.titulo ||
              "",

            orden:
              Number(
                imagen.orden
              ),

            activo:
              Boolean(
                imagen.activo
              ),
          });

        if (
          imagen.previewNuevo
        ) {
          URL.revokeObjectURL(
            imagen.previewNuevo
          );
        }

        setImagenes(
          (
            anteriores
          ) =>
            anteriores.map(
              (
                item
              ) =>
                item.id ===
                imagen.id
                  ? respuesta.data
                  : item
            )
        );

        await alertaExito(
          "Imagen actualizada correctamente."
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
          "No se pudo actualizar la imagen."
        );
      } finally {
        setGuardandoId(
          null
        );
      }
    };

  const eliminar =
    async (
      imagen
    ) => {
      const confirmar =
        await confirmarAccion({
          titulo:
            "¿Eliminar imagen?",

          texto:
            imagen.titulo
              ? `Se eliminará "${imagen.titulo}" del carrusel.`
              : "Esta imagen será eliminada del carrusel.",

          textoConfirmar:
            "Sí, eliminar",

          textoCancelar:
            "Cancelar",

          peligro:
            true,
        });

      if (!confirmar) {
        return;
      }

      try {
        setEliminandoId(
          imagen.id
        );

        await eliminarImagenCarruselAdmin(
          imagen.id
        );

        setImagenes(
          (
            anteriores
          ) =>
            anteriores.filter(
              (
                item
              ) =>
                item.id !==
                imagen.id
            )
        );

        await alertaExito(
          "Imagen eliminada correctamente."
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
          "No se pudo eliminar la imagen."
        );
      } finally {
        setEliminandoId(
          null
        );
      }
    };

  return (
    <main className="admin-carrusel-page">
      <header className="admin-carrusel-header">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin"
            )
          }
          className="admin-carrusel-volver"
        >
          ← Volver al panel
        </button>

        <p>
          ADMINISTRACIÓN
        </p>

        <h1>
          Carrusel
        </h1>

        <span>
          Administrá las fotos
          que aparecen en el
          inicio de la barbería.
        </span>
      </header>

      {errorCarga && (
        <div className="admin-carrusel-error">
          {errorCarga}
        </div>
      )}

      <section className="admin-carrusel-nueva">
        <h2>
          Agregar imagen
        </h2>

        <label className="admin-carrusel-file">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={
              seleccionarNuevaImagen
            }
          />

          <span>
            Seleccionar imagen
            desde galería
          </span>
        </label>

        {nueva.preview && (
          <img
            src={
              nueva.preview
            }
            alt="Vista previa"
            className="admin-carrusel-preview"
          />
        )}

        <div className="admin-carrusel-form">
          <div>
            <label>
              Título
            </label>

            <input
              type="text"
              maxLength={120}
              placeholder="Ej: Corte degradado"
              value={
                nueva.titulo
              }
              onChange={(
                event
              ) =>
                setNueva(
                  (
                    anterior
                  ) => ({
                    ...anterior,

                    titulo:
                      event.target
                        .value,
                  })
                )
              }
            />
          </div>

          <div>
            <label>
              Orden
            </label>

            <input
              type="number"
              min="0"
              value={
                nueva.orden
              }
              onChange={(
                event
              ) =>
                setNueva(
                  (
                    anterior
                  ) => ({
                    ...anterior,

                    orden:
                      event.target
                        .value,
                  })
                )
              }
            />
          </div>
        </div>

        <label className="admin-carrusel-check">
          <input
            type="checkbox"
            checked={
              nueva.activo
            }
            onChange={(
              event
            ) =>
              setNueva(
                (
                  anterior
                ) => ({
                  ...anterior,

                  activo:
                    event.target
                      .checked,
                })
              )
            }
          />

          Mostrar en el Home
        </label>

        <button
          type="button"
          className="admin-carrusel-crear"
          disabled={
            guardando
          }
          onClick={
            crear
          }
        >
          {guardando
            ? "Subiendo..."
            : "Agregar al carrusel"}
        </button>
      </section>

      <section className="admin-carrusel-lista">
        <h2>
          Imágenes actuales
        </h2>

        {cargando ? (
          <div className="admin-carrusel-vacio">
            Cargando...
          </div>
        ) : imagenes.length ===
          0 ? (
          <div className="admin-carrusel-vacio">
            Todavía no hay
            imágenes cargadas.
          </div>
        ) : (
          imagenes.map(
            (
              imagen
            ) => (
              <article
                key={
                  imagen.id
                }
                className="admin-carrusel-card"
              >
                <img
                  src={
                    imagen.previewNuevo ||
                    obtenerUrlImagen(
                      imagen.imagenUrl
                    )
                  }
                  alt={
                    imagen.titulo ||
                    "Imagen del carrusel"
                  }
                />

                <label className="admin-carrusel-file admin-carrusel-file--small">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(
                      event
                    ) =>
                      seleccionarReemplazo(
                        imagen.id,
                        event
                      )
                    }
                  />

                  <span>
                    Cambiar imagen
                  </span>
                </label>

                <div className="admin-carrusel-form">
                  <div>
                    <label>
                      Título
                    </label>

                    <input
                      type="text"
                      maxLength={
                        120
                      }
                      value={
                        imagen.titulo ||
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        cambiarCampo(
                          imagen.id,
                          "titulo",
                          event.target
                            .value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Orden
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        imagen.orden
                      }
                      onChange={(
                        event
                      ) =>
                        cambiarCampo(
                          imagen.id,
                          "orden",
                          event.target
                            .value
                        )
                      }
                    />
                  </div>
                </div>

                <label className="admin-carrusel-check">
                  <input
                    type="checkbox"
                    checked={Boolean(
                      imagen.activo
                    )}
                    onChange={(
                      event
                    ) =>
                      cambiarCampo(
                        imagen.id,
                        "activo",
                        event.target
                          .checked
                      )
                    }
                  />

                  Mostrar en el Home
                </label>

                <div className="admin-carrusel-actions">
                  <button
                    type="button"
                    className="admin-carrusel-guardar"
                    disabled={
                      guardandoId ===
                      imagen.id
                    }
                    onClick={() =>
                      guardar(
                        imagen
                      )
                    }
                  >
                    {guardandoId ===
                    imagen.id
                      ? "Guardando..."
                      : "Guardar cambios"}
                  </button>

                  <button
                    type="button"
                    className="admin-carrusel-eliminar"
                    disabled={
                      eliminandoId ===
                      imagen.id
                    }
                    onClick={() =>
                      eliminar(
                        imagen
                      )
                    }
                  >
                    {eliminandoId ===
                    imagen.id
                      ? "Eliminando..."
                      : "Eliminar"}
                  </button>
                </div>
              </article>
            )
          )
        )}
      </section>
    </main>
  );
}

export default AdminCarruselPage;