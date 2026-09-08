import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  actualizarPromocionAdmin,
  crearPromocionAdmin,
  eliminarPromocionAdmin,
  obtenerPromocionesAdmin,
} from "../services/adminPromociones.service.js";

import {
  obtenerServiciosAdmin,
} from "../services/adminServicios.service.js";

import "./AdminPromocionesPage.css";

const promocionInicial = {
  servicioId: "",
  titulo: "",
  descripcion: "",
  precio: "",
  duracionMinutos: 30,
  activo: true,
};

function AdminPromocionesPage() {
  const navigate = useNavigate();

  const [
    promociones,
    setPromociones,
  ] = useState([]);

  const [
    servicios,
    setServicios,
  ] = useState([]);

  const [
    nuevaPromocion,
    setNuevaPromocion,
  ] = useState(
    promocionInicial
  );

  const [
    mostrarFormulario,
    setMostrarFormulario,
  ] = useState(false);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    guardandoNueva,
    setGuardandoNueva,
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
    error,
    setError,
  ] = useState("");

  const [
    mensaje,
    setMensaje,
  ] = useState("");

  const manejarSesionExpirada = (
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

      navigate(
        "/admin/login"
      );

      return true;
    }

    return false;
  };

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError("");

      const [
        respuestaPromociones,
        respuestaServicios,
      ] = await Promise.all([
        obtenerPromocionesAdmin(),
        obtenerServiciosAdmin(),
      ]);

      setPromociones(
        respuestaPromociones.data ||
          []
      );

      setServicios(
        respuestaServicios.data ||
          []
      );
    } catch (error) {
      if (
        manejarSesionExpirada(
          error
        )
      ) {
        return;
      }

      setError(
        error.response?.data
          ?.message ||
          "No se pudieron cargar las promociones."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarCambioNueva = (
    campo,
    valor
  ) => {
    setNuevaPromocion(
      (anterior) => ({
        ...anterior,
        [campo]: valor,
      })
    );
  };

  const manejarCambioExistente = (
    promocionId,
    campo,
    valor
  ) => {
    setPromociones(
      (anteriores) =>
        anteriores.map(
          (promocion) =>
            promocion.id ===
            promocionId
              ? {
                  ...promocion,
                  [campo]: valor,
                }
              : promocion
        )
    );
  };

  const abrirFormulario = () => {
    setNuevaPromocion(
      promocionInicial
    );

    setError("");
    setMensaje("");

    setMostrarFormulario(
      true
    );
  };

  const cerrarFormulario = () => {
    setNuevaPromocion(
      promocionInicial
    );

    setMostrarFormulario(
      false
    );

    setError("");
  };

  const crearPromocion =
    async () => {
      try {
        setGuardandoNueva(
          true
        );

        setError("");
        setMensaje("");

        const respuesta =
          await crearPromocionAdmin(
            {
              servicioId:
                nuevaPromocion
                  .servicioId,

              titulo:
                nuevaPromocion
                  .titulo,

              descripcion:
                nuevaPromocion
                  .descripcion,

              precio:
                nuevaPromocion
                  .precio,

              duracionMinutos:
                nuevaPromocion
                  .duracionMinutos,

              activo:
                nuevaPromocion
                  .activo,
            }
          );

        setPromociones(
          (anteriores) => [
            ...anteriores,
            respuesta.data,
          ]
        );

        setNuevaPromocion(
          promocionInicial
        );

        setMostrarFormulario(
          false
        );

        setMensaje(
          "Promoción creada correctamente."
        );
      } catch (error) {
        if (
          manejarSesionExpirada(
            error
          )
        ) {
          return;
        }

        setError(
          error.response?.data
            ?.message ||
            "No se pudo crear la promoción."
        );
      } finally {
        setGuardandoNueva(
          false
        );
      }
    };

  const guardarPromocion =
    async (
      promocion
    ) => {
      try {
        setGuardandoId(
          promocion.id
        );

        setError("");
        setMensaje("");

        const respuesta =
          await actualizarPromocionAdmin(
            {
              promocionId:
                promocion.id,

              servicioId:
                promocion
                  .servicioId,

              titulo:
                promocion.titulo,

              descripcion:
                promocion
                  .descripcion ||
                "",

              precio:
                promocion.precio,

              duracionMinutos:
                promocion
                  .duracionMinutos,

              activo:
                Boolean(
                  promocion.activo
                ),
            }
          );

        const actualizada =
          respuesta.data;

        setPromociones(
          (anteriores) =>
            anteriores.map(
              (item) =>
                item.id ===
                actualizada.id
                  ? actualizada
                  : item
            )
        );

        setMensaje(
          "Promoción actualizada correctamente."
        );
      } catch (error) {
        if (
          manejarSesionExpirada(
            error
          )
        ) {
          return;
        }

        setError(
          error.response?.data
            ?.message ||
            "No se pudo actualizar la promoción."
        );
      } finally {
        setGuardandoId(null);
      }
    };

  const eliminarPromocion =
    async (
      promocion
    ) => {
      const confirmar =
        window.confirm(
          `¿Seguro que querés eliminar la promoción "${promocion.titulo}"?`
        );

      if (!confirmar) {
        return;
      }

      try {
        setEliminandoId(
          promocion.id
        );

        setError("");
        setMensaje("");

        await eliminarPromocionAdmin(
          promocion.id
        );

        setPromociones(
          (anteriores) =>
            anteriores.filter(
              (item) =>
                item.id !==
                promocion.id
            )
        );

        setMensaje(
          "Promoción eliminada correctamente."
        );
      } catch (error) {
        if (
          manejarSesionExpirada(
            error
          )
        ) {
          return;
        }

        setError(
          error.response?.data
            ?.message ||
            "No se pudo eliminar la promoción."
        );
      } finally {
        setEliminandoId(null);
      }
    };

  return (
    <main className="admin-promociones-page">
      <header className="admin-promociones-header">
        <button
          type="button"
          className="admin-promociones-volver"
          onClick={() =>
            navigate("/admin")
          }
        >
          ← Volver al panel
        </button>

        <div className="admin-promociones-header__contenido">
          <div>
            <p className="admin-promociones-eyebrow">
              Administración
            </p>

            <h1>
              Promociones
            </h1>

            <p>
              Creá y administrá
              las promociones que
              querés ofrecer a tus
              clientes.
            </p>
          </div>

          {!mostrarFormulario && (
            <button
              type="button"
              className="admin-promociones-crear-boton"
              onClick={
                abrirFormulario
              }
            >
              + Crear promoción
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="admin-promociones-error">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="admin-promociones-mensaje">
          {mensaje}
        </div>
      )}

      {mostrarFormulario && (
        <section className="admin-promocion-nueva">
          <div className="admin-promocion-nueva__header">
            <div>
              <p>
                Nueva promoción
              </p>

              <h2>
                Crear promoción
              </h2>
            </div>

            <button
              type="button"
              className="admin-promocion-cerrar"
              onClick={
                cerrarFormulario
              }
              disabled={
                guardandoNueva
              }
            >
              ✕
            </button>
          </div>

          <div className="admin-promocion-form">
            <div className="admin-promocion-campo">
              <label>
                Título
              </label>

              <input
                type="text"
                placeholder="Ej: 2 cortes"
                maxLength={120}
                value={
                  nuevaPromocion
                    .titulo
                }
                onChange={(
                  event
                ) =>
                  manejarCambioNueva(
                    "titulo",
                    event.target
                      .value
                  )
                }
              />
            </div>

            <div className="admin-promocion-campo">
              <label>
                Servicio
                relacionado
              </label>

              <select
                value={
                  nuevaPromocion
                    .servicioId
                }
                onChange={(
                  event
                ) =>
                  manejarCambioNueva(
                    "servicioId",
                    event.target
                      .value
                  )
                }
              >
                <option value="">
                  Seleccionar
                  servicio
                </option>

                {servicios.map(
                  (servicio) => (
                    <option
                      key={
                        servicio.id
                      }
                      value={
                        servicio.id
                      }
                    >
                      {
                        servicio.nombre
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="admin-promocion-campo admin-promocion-campo--completo">
              <label>
                Descripción
              </label>

              <textarea
                placeholder="Ej: Promo especial para dos cortes."
                maxLength={500}
                value={
                  nuevaPromocion
                    .descripcion
                }
                onChange={(
                  event
                ) =>
                  manejarCambioNueva(
                    "descripcion",
                    event.target
                      .value
                  )
                }
              />
            </div>

            <div className="admin-promocion-campo">
              <label>
                Precio
              </label>

              <input
                type="number"
                min="0"
                step="100"
                placeholder="Ej: 18000"
                value={
                  nuevaPromocion
                    .precio
                }
                onChange={(
                  event
                ) =>
                  manejarCambioNueva(
                    "precio",
                    event.target
                      .value
                  )
                }
              />
            </div>

            <div className="admin-promocion-campo">
              <label>
                Duración total
                (minutos)
              </label>

              <input
                type="number"
                min="1"
                value={
                  nuevaPromocion
                    .duracionMinutos
                }
                onChange={(
                  event
                ) =>
                  manejarCambioNueva(
                    "duracionMinutos",
                    event.target
                      .value
                  )
                }
              />
            </div>
          </div>

          <div className="admin-promocion-nueva__footer">
            <label className="admin-promocion-switch">
              <input
                type="checkbox"
                checked={
                  nuevaPromocion
                    .activo
                }
                onChange={(
                  event
                ) =>
                  manejarCambioNueva(
                    "activo",
                    event.target
                      .checked
                  )
                }
              />

              <span>
                {nuevaPromocion
                  .activo
                  ? "Activa"
                  : "Inactiva"}
              </span>
            </label>

            <div className="admin-promocion-nueva__acciones">
              <button
                type="button"
                className="admin-promocion-cancelar"
                disabled={
                  guardandoNueva
                }
                onClick={
                  cerrarFormulario
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className="admin-promocion-crear"
                disabled={
                  guardandoNueva
                }
                onClick={
                  crearPromocion
                }
              >
                {guardandoNueva
                  ? "Creando..."
                  : "Crear promoción"}
              </button>
            </div>
          </div>
        </section>
      )}

      {cargando ? (
        <div className="admin-promociones-estado">
          Cargando
          promociones...
        </div>
      ) : promociones.length ===
        0 ? (
        <div className="admin-promociones-estado">
          Todavía no hay
          promociones cargadas.
        </div>
      ) : (
        <section className="admin-promociones-lista">
          <div className="admin-promociones-lista__titulo">
            <p>
              Promociones
              cargadas
            </p>

            <span>
              {
                promociones.length
              }
            </span>
          </div>

          {promociones.map(
            (promocion) => (
              <article
                key={
                  promocion.id
                }
                className="admin-promocion-card"
              >
                <div className="admin-promocion-top">
                  <div>
                    <span>
                      Promoción #
                      {
                        promocion.id
                      }
                    </span>

                    <h2>
                      {
                        promocion.titulo
                      }
                    </h2>
                  </div>

                  <label className="admin-promocion-switch">
                    <input
                      type="checkbox"
                      checked={Boolean(
                        promocion
                          .activo
                      )}
                      onChange={(
                        event
                      ) =>
                        manejarCambioExistente(
                          promocion.id,
                          "activo",
                          event.target
                            .checked
                        )
                      }
                    />

                    <span>
                      {promocion.activo
                        ? "Activa"
                        : "Inactiva"}
                    </span>
                  </label>
                </div>

                <div className="admin-promocion-form">
                  <div className="admin-promocion-campo">
                    <label>
                      Título
                    </label>

                    <input
                      type="text"
                      maxLength={120}
                      value={
                        promocion
                          .titulo
                      }
                      onChange={(
                        event
                      ) =>
                        manejarCambioExistente(
                          promocion.id,
                          "titulo",
                          event.target
                            .value
                        )
                      }
                    />
                  </div>

                  <div className="admin-promocion-campo">
                    <label>
                      Servicio
                      relacionado
                    </label>

                    <select
                      value={
                        promocion
                          .servicioId ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        manejarCambioExistente(
                          promocion.id,
                          "servicioId",
                          event.target
                            .value
                        )
                      }
                    >
                      <option value="">
                        Sin servicio
                        relacionado
                      </option>

                      {servicios.map(
                        (
                          servicio
                        ) => (
                          <option
                            key={
                              servicio.id
                            }
                            value={
                              servicio.id
                            }
                          >
                            {
                              servicio.nombre
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="admin-promocion-campo admin-promocion-campo--completo">
                    <label>
                      Descripción
                    </label>

                    <textarea
                      maxLength={500}
                      value={
                        promocion
                          .descripcion ||
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        manejarCambioExistente(
                          promocion.id,
                          "descripcion",
                          event.target
                            .value
                        )
                      }
                    />
                  </div>

                  <div className="admin-promocion-campo">
                    <label>
                      Precio
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={
                        promocion
                          .precio ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        manejarCambioExistente(
                          promocion.id,
                          "precio",
                          event.target
                            .value
                        )
                      }
                    />
                  </div>

                  <div className="admin-promocion-campo">
                    <label>
                      Duración total
                      (minutos)
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={
                        promocion
                          .duracionMinutos
                      }
                      onChange={(
                        event
                      ) =>
                        manejarCambioExistente(
                          promocion.id,
                          "duracionMinutos",
                          event.target
                            .value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="admin-promocion-acciones">
                  <button
                    type="button"
                    className="admin-promocion-guardar"
                    disabled={
                      guardandoId ===
                      promocion.id
                    }
                    onClick={() =>
                      guardarPromocion(
                        promocion
                      )
                    }
                  >
                    {guardandoId ===
                    promocion.id
                      ? "Guardando..."
                      : "Guardar cambios"}
                  </button>

                  <button
                    type="button"
                    className="admin-promocion-eliminar"
                    disabled={
                      eliminandoId ===
                      promocion.id
                    }
                    onClick={() =>
                      eliminarPromocion(
                        promocion
                      )
                    }
                  >
                    {eliminandoId ===
                    promocion.id
                      ? "Eliminando..."
                      : "Eliminar"}
                  </button>
                </div>
              </article>
            )
          )}
        </section>
      )}
    </main>
  );
}

export default AdminPromocionesPage;