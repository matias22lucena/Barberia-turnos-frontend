import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  actualizarServicioAdmin,
  crearServicioAdmin,
  obtenerServiciosAdmin,
} from "../services/adminServicios.service.js";

import {
  alertaError,
  alertaExito,
  alertaSesionExpirada,
} from "../utils/alertas.js";

import "./AdminServiciosPage.css";

const servicioInicial = {
  nombre: "",
  descripcion: "",
  duracionMinutos: 30,
  precio: "",
  activo: true,
};

function AdminServiciosPage() {
  const navigate =
    useNavigate();

  const [
    servicios,
    setServicios,
  ] = useState([]);

  const [
    nuevoServicio,
    setNuevoServicio,
  ] = useState(
    servicioInicial
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
    creando,
    setCreando,
  ] = useState(false);

  const [
    guardandoId,
    setGuardandoId,
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

  const cargarServicios =
    async () => {
      try {
        setCargando(true);
        setErrorCarga("");

        const respuesta =
          await obtenerServiciosAdmin();

        setServicios(
          respuesta.data ||
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
          "No se pudieron cargar los servicios.";

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
    cargarServicios();
  }, []);

  const manejarCambioNuevo = (
    campo,
    valor
  ) => {
    setNuevoServicio(
      (
        anterior
      ) => ({
        ...anterior,

        [campo]:
          valor,
      })
    );
  };

  const manejarCambio = (
    servicioId,
    campo,
    valor
  ) => {
    setServicios(
      (
        anteriores
      ) =>
        anteriores.map(
          (
            servicio
          ) =>
            servicio.id ===
            servicioId
              ? {
                  ...servicio,

                  [campo]:
                    valor,
                }
              : servicio
        )
    );
  };

  const abrirFormulario =
    () => {
      setNuevoServicio(
        servicioInicial
      );

      setMostrarFormulario(
        true
      );
    };

  const cerrarFormulario =
    () => {
      setNuevoServicio(
        servicioInicial
      );

      setMostrarFormulario(
        false
      );
    };

  const crearServicio =
    async () => {
      try {
        setCreando(
          true
        );

        const respuesta =
          await crearServicioAdmin({
            nombre:
              nuevoServicio.nombre,

            descripcion:
              nuevoServicio
                .descripcion,

            duracionMinutos:
              nuevoServicio
                .duracionMinutos,

            precio:
              nuevoServicio.precio,

            activo:
              nuevoServicio.activo,
          });

        const creado =
          respuesta.data;

        setServicios(
          (
            anteriores
          ) => [
            ...anteriores,
            creado,
          ]
        );

        setNuevoServicio(
          servicioInicial
        );

        setMostrarFormulario(
          false
        );

        await alertaExito(
          "Servicio creado correctamente."
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
          "No se pudo crear el servicio."
        );
      } finally {
        setCreando(
          false
        );
      }
    };

  const guardarServicio =
    async (
      servicio
    ) => {
      try {
        setGuardandoId(
          servicio.id
        );

        const respuesta =
          await actualizarServicioAdmin({
            servicioId:
              servicio.id,

            nombre:
              servicio.nombre,

            descripcion:
              servicio
                .descripcion ||
              "",

            duracionMinutos:
              Number(
                servicio
                  .duracionMinutos
              ),

            precio:
              Number(
                servicio.precio
              ),

            activo:
              Boolean(
                servicio.activo
              ),
          });

        const actualizado =
          respuesta.data;

        setServicios(
          (
            anteriores
          ) =>
            anteriores.map(
              (
                item
              ) =>
                item.id ===
                actualizado.id
                  ? actualizado
                  : item
            )
        );

        await alertaExito(
          "Servicio actualizado correctamente."
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
          "No se pudo actualizar el servicio."
        );
      } finally {
        setGuardandoId(
          null
        );
      }
    };

  return (
    <main className="admin-servicios-page">
      <header className="admin-servicios-header">
        <button
          type="button"
          className="admin-servicios-volver"
          onClick={() =>
            navigate(
              "/admin"
            )
          }
        >
          ← Volver al panel
        </button>

        <div className="admin-servicios-header__contenido">
          <div>
            <p className="admin-servicios-eyebrow">
              Administración
            </p>

            <h1>
              Servicios
            </h1>

            <p>
              Creá nuevos servicios y
              modificá precios,
              duración, descripción y
              disponibilidad.
            </p>
          </div>

          {!mostrarFormulario && (
            <button
              type="button"
              className="admin-servicios-crear-boton"
              onClick={
                abrirFormulario
              }
            >
              + Crear servicio
            </button>
          )}
        </div>
      </header>

      {errorCarga && (
        <div className="admin-servicios-error">
          {errorCarga}
        </div>
      )}

      {mostrarFormulario && (
        <section className="admin-servicio-nuevo">
          <div className="admin-servicio-nuevo__header">
            <div>
              <p>
                Nuevo servicio
              </p>

              <h2>
                Crear servicio
              </h2>
            </div>

            <button
              type="button"
              className="admin-servicio-cerrar"
              onClick={
                cerrarFormulario
              }
              disabled={
                creando
              }
            >
              ✕
            </button>
          </div>

          <div className="admin-servicio-form">
            <div className="admin-servicio-campo">
              <label>
                Nombre
              </label>

              <input
                type="text"
                placeholder="Ej: Corte premium"
                maxLength={100}
                value={
                  nuevoServicio.nombre
                }
                onChange={(
                  event
                ) =>
                  manejarCambioNuevo(
                    "nombre",
                    event.target.value
                  )
                }
              />
            </div>

            <div className="admin-servicio-campo admin-servicio-campo--completo">
              <label>
                Descripción
              </label>

              <textarea
                placeholder="Ej: Corte completo con lavado."
                maxLength={255}
                value={
                  nuevoServicio
                    .descripcion
                }
                onChange={(
                  event
                ) =>
                  manejarCambioNuevo(
                    "descripcion",
                    event.target.value
                  )
                }
              />
            </div>

            <div className="admin-servicio-campo">
              <label>
                Duración (minutos)
              </label>

              <input
                type="number"
                min="1"
                value={
                  nuevoServicio
                    .duracionMinutos
                }
                onChange={(
                  event
                ) =>
                  manejarCambioNuevo(
                    "duracionMinutos",
                    event.target.value
                  )
                }
              />
            </div>

            <div className="admin-servicio-campo">
              <label>
                Precio
              </label>

              <input
                type="number"
                min="0"
                step="100"
                placeholder="Ej: 12000"
                value={
                  nuevoServicio.precio
                }
                onChange={(
                  event
                ) =>
                  manejarCambioNuevo(
                    "precio",
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="admin-servicio-nuevo__footer">
            <label className="admin-servicio-switch">
              <input
                type="checkbox"
                checked={
                  nuevoServicio.activo
                }
                onChange={(
                  event
                ) =>
                  manejarCambioNuevo(
                    "activo",
                    event.target.checked
                  )
                }
              />

              <span>
                {nuevoServicio.activo
                  ? "Activo"
                  : "Inactivo"}
              </span>
            </label>

            <div className="admin-servicio-nuevo__acciones">
              <button
                type="button"
                className="admin-servicio-cancelar"
                disabled={
                  creando
                }
                onClick={
                  cerrarFormulario
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className="admin-servicio-crear"
                disabled={
                  creando
                }
                onClick={
                  crearServicio
                }
              >
                {creando
                  ? "Creando..."
                  : "Crear servicio"}
              </button>
            </div>
          </div>
        </section>
      )}

      {cargando ? (
        <div className="admin-servicios-estado">
          Cargando servicios...
        </div>
      ) : servicios.length ===
        0 ? (
        <div className="admin-servicios-estado">
          Todavía no hay
          servicios cargados.
        </div>
      ) : (
        <section className="admin-servicios-lista">
          <div className="admin-servicios-lista__titulo">
            <p>
              Servicios cargados
            </p>

            <span>
              {servicios.length}
            </span>
          </div>

          {servicios.map(
            (
              servicio
            ) => (
              <article
                key={
                  servicio.id
                }
                className="admin-servicio-card"
              >
                <div className="admin-servicio-top">
                  <div>
                    <span>
                      Servicio #
                      {
                        servicio.id
                      }
                    </span>

                    <h2>
                      {
                        servicio.nombre
                      }
                    </h2>
                  </div>

                  <label className="admin-servicio-switch">
                    <input
                      type="checkbox"
                      checked={Boolean(
                        servicio.activo
                      )}
                      onChange={(
                        event
                      ) =>
                        manejarCambio(
                          servicio.id,
                          "activo",
                          event.target
                            .checked
                        )
                      }
                    />

                    <span>
                      {servicio.activo
                        ? "Activo"
                        : "Inactivo"}
                    </span>
                  </label>
                </div>

                <div className="admin-servicio-form">
                  <div className="admin-servicio-campo">
                    <label>
                      Nombre
                    </label>

                    <input
                      type="text"
                      maxLength={100}
                      value={
                        servicio.nombre
                      }
                      onChange={(
                        event
                      ) =>
                        manejarCambio(
                          servicio.id,
                          "nombre",
                          event.target
                            .value
                        )
                      }
                    />
                  </div>

                  <div className="admin-servicio-campo admin-servicio-campo--completo">
                    <label>
                      Descripción
                    </label>

                    <textarea
                      maxLength={255}
                      value={
                        servicio
                          .descripcion ||
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        manejarCambio(
                          servicio.id,
                          "descripcion",
                          event.target
                            .value
                        )
                      }
                    />
                  </div>

                  <div className="admin-servicio-campo">
                    <label>
                      Duración
                      (minutos)
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={
                        servicio
                          .duracionMinutos
                      }
                      onChange={(
                        event
                      ) =>
                        manejarCambio(
                          servicio.id,
                          "duracionMinutos",
                          event.target
                            .value
                        )
                      }
                    />
                  </div>

                  <div className="admin-servicio-campo">
                    <label>
                      Precio
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={
                        servicio.precio
                      }
                      onChange={(
                        event
                      ) =>
                        manejarCambio(
                          servicio.id,
                          "precio",
                          event.target
                            .value
                        )
                      }
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="admin-servicio-guardar"
                  disabled={
                    guardandoId ===
                    servicio.id
                  }
                  onClick={() =>
                    guardarServicio(
                      servicio
                    )
                  }
                >
                  {guardandoId ===
                  servicio.id
                    ? "Guardando..."
                    : "Guardar cambios"}
                </button>
              </article>
            )
          )}
        </section>
      )}
    </main>
  );
}

export default AdminServiciosPage;