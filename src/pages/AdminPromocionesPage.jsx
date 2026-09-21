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

import {
  alertaError,
  alertaExito,
  alertaSesionExpirada,
  confirmarAccion,
} from "../utils/alertas.js";

import "./AdminPromocionesPage.css";

const crearPromocionInicial =
  () => ({
    servicioId: "",
    titulo: "",
    descripcion: "",
    precio: "",
    duracionMinutos: 30,
    cantidadServicios: 1,
    activo: true,
  });

function AdminPromocionesPage() {
  const navigate =
    useNavigate();

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
    crearPromocionInicial
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
    errorCarga,
    setErrorCarga,
  ] = useState("");

  const manejarSesionExpirada =
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

  const cargarDatos =
    async () => {
      try {
        setCargando(
          true
        );

        setErrorCarga("");

        const [
          respuestaPromociones,
          respuestaServicios,
        ] =
          await Promise.all([
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
          await manejarSesionExpirada(
            error
          )
        ) {
          return;
        }

        const mensaje =
          error.response?.data
            ?.message ||
          "No se pudieron cargar las promociones.";

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
    cargarDatos();
  }, []);

  const manejarCambioNueva = (
    campo,
    valor
  ) => {
    setNuevaPromocion(
      (
        anterior
      ) => ({
        ...anterior,

        [campo]:
          valor,
      })
    );
  };

  const manejarCambioExistente = (
    promocionId,
    campo,
    valor
  ) => {
    setPromociones(
      (
        anteriores
      ) =>
        anteriores.map(
          (
            promocion
          ) =>
            promocion.id ===
            promocionId
              ? {
                  ...promocion,

                  [campo]:
                    valor,
                }
              : promocion
        )
    );
  };

  const abrirFormulario =
    () => {
      setNuevaPromocion(
        crearPromocionInicial()
      );

      setMostrarFormulario(
        true
      );
    };

  const cerrarFormulario =
    () => {
      setNuevaPromocion(
        crearPromocionInicial()
      );

      setMostrarFormulario(
        false
      );
    };

  const crearPromocion =
    async () => {
      try {
        setGuardandoNueva(
          true
        );

        const respuesta =
          await crearPromocionAdmin({
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
              Number(
                nuevaPromocion
                  .duracionMinutos
              ),

            cantidadServicios:
              Number(
                nuevaPromocion
                  .cantidadServicios
              ),

            activo:
              nuevaPromocion
                .activo,
          });

        setPromociones(
          (
            anteriores
          ) => [
            ...anteriores,
            respuesta.data,
          ]
        );

        setNuevaPromocion(
          crearPromocionInicial()
        );

        setMostrarFormulario(
          false
        );

        await alertaExito(
          "Promoción creada correctamente."
        );
      } catch (error) {
        if (
          await manejarSesionExpirada(
            error
          )
        ) {
          return;
        }

        await alertaError(
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

        const respuesta =
          await actualizarPromocionAdmin({
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
              Number(
                promocion
                  .duracionMinutos
              ),

            cantidadServicios:
              Number(
                promocion
                  .cantidadServicios ||
                  1
              ),

            activo:
              Boolean(
                promocion.activo
              ),
          });

        const actualizada =
          respuesta.data;

        setPromociones(
          (
            anteriores
          ) =>
            anteriores.map(
              (
                item
              ) =>
                item.id ===
                actualizada.id
                  ? actualizada
                  : item
            )
        );

        await alertaExito(
          "Promoción actualizada correctamente."
        );
      } catch (error) {
        if (
          await manejarSesionExpirada(
            error
          )
        ) {
          return;
        }

        await alertaError(
          error.response?.data
            ?.message ||
          "No se pudo actualizar la promoción."
        );
      } finally {
        setGuardandoId(
          null
        );
      }
    };

  const eliminarPromocion =
    async (
      promocion
    ) => {
      const confirmar =
        await confirmarAccion({
          titulo:
            "¿Eliminar promoción?",

          texto:
            `Se eliminará "${promocion.titulo}". Esta acción no se puede deshacer.`,

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
          promocion.id
        );

        await eliminarPromocionAdmin(
          promocion.id
        );

        setPromociones(
          (
            anteriores
          ) =>
            anteriores.filter(
              (
                item
              ) =>
                item.id !==
                promocion.id
            )
        );

        await alertaExito(
          "Promoción eliminada correctamente."
        );
      } catch (error) {
        if (
          await manejarSesionExpirada(
            error
          )
        ) {
          return;
        }

        await alertaError(
          error.response?.data
            ?.message ||
          "No se pudo eliminar la promoción."
        );
      } finally {
        setEliminandoId(
          null
        );
      }
    };

  return (
    <main className="admin-promociones-page">
      <header className="admin-promociones-header">
        <button
          type="button"
          className="admin-promociones-volver"
          onClick={() =>
            navigate(
              "/admin"
            )
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

      {errorCarga && (
        <div className="admin-promociones-error">
          {errorCarga}
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
                placeholder="Ej: Promo mensual"
                maxLength={
                  120
                }
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
                Servicio relacionado
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
                  Seleccionar servicio
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
                placeholder="Ej: Promo mensual con 5 cortes de pelo."
                maxLength={
                  500
                }
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
                Precio total
              </label>

              <input
                type="number"
                min="0"
                step="100"
                placeholder="Ej: 30000"
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
                Duración de cada turno
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

            <div className="admin-promocion-campo">
              <label>
                Cantidad de cortes /
                turnos
              </label>

              <input
                type="number"
                min="1"
                max="50"
                value={
                  nuevaPromocion
                    .cantidadServicios
                }
                onChange={(
                  event
                ) =>
                  manejarCambioNueva(
                    "cantidadServicios",
                    event.target
                      .value
                  )
                }
              />

              <small>
                Ejemplo: para la
                promo mensual de 5
                cortes, colocá 5.
              </small>
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
                {nuevaPromocion.activo
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
          Cargando promociones...
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
              Promociones cargadas
            </p>

            <span>
              {
                promociones.length
              }
            </span>
          </div>

          {promociones.map(
            (
              promocion
            ) => (
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
                        promocion.activo
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
                      maxLength={
                        120
                      }
                      value={
                        promocion.titulo
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
                      Servicio relacionado
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
                        Sin servicio relacionado
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
                      maxLength={
                        500
                      }
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
                      Precio total
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={
                        promocion.precio ??
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
                      Duración de cada
                      turno (minutos)
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

                  <div className="admin-promocion-campo">
                    <label>
                      Cantidad de cortes /
                      turnos
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={
                        promocion
                          .cantidadServicios ||
                        1
                      }
                      onChange={(
                        event
                      ) =>
                        manejarCambioExistente(
                          promocion.id,
                          "cantidadServicios",
                          event.target
                            .value
                        )
                      }
                    />

                    <small>
                      Cada corte se
                      reservará con su
                      propio día y horario.
                    </small>
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