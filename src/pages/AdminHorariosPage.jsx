import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  actualizarHorarioAdmin,
  crearHorarioAdmin,
  eliminarHorarioAdmin,
  obtenerHorariosAdmin,
} from "../services/adminHorarios.service.js";

import {
  alertaError,
  alertaExito,
  alertaSesionExpirada,
  confirmarAccion,
} from "../utils/alertas.js";

import "./AdminHorariosPage.css";

const DIAS = [
  {
    numero: 1,
    nombre: "Lunes",
    corto: "Lun",
  },
  {
    numero: 2,
    nombre: "Martes",
    corto: "Mar",
  },
  {
    numero: 3,
    nombre: "Miércoles",
    corto: "Mié",
  },
  {
    numero: 4,
    nombre: "Jueves",
    corto: "Jue",
  },
  {
    numero: 5,
    nombre: "Viernes",
    corto: "Vie",
  },
  {
    numero: 6,
    nombre: "Sábado",
    corto: "Sáb",
  },
  {
    numero: 7,
    nombre: "Domingo",
    corto: "Dom",
  },
];

const crearHorarioInicial = (
  diaSemana = 1
) => ({
  diaSemana,
  horaInicio: "09:00",
  horaFin: "13:00",
});

function AdminHorariosPage() {
  const navigate =
    useNavigate();

  const [
    horarios,
    setHorarios,
  ] = useState([]);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    errorCarga,
    setErrorCarga,
  ] = useState("");

  const [
    diaSeleccionado,
    setDiaSeleccionado,
  ] = useState(1);

  const [
    editandoId,
    setEditandoId,
  ] = useState(null);

  const [
    mostrarNuevaFranja,
    setMostrarNuevaFranja,
  ] = useState(false);

  const [
    guardando,
    setGuardando,
  ] = useState(false);

  const [
    eliminandoId,
    setEliminandoId,
  ] = useState(null);

  const [
    nuevoHorario,
    setNuevoHorario,
  ] = useState(
    crearHorarioInicial(1)
  );

  const manejarSesionExpirada =
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

  const cargarHorarios =
    async () => {
      try {
        setCargando(true);
        setErrorCarga("");

        const respuesta =
          await obtenerHorariosAdmin();

        setHorarios(
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
          "No se pudieron cargar los horarios.";

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
    cargarHorarios();
  }, []);

  const horariosPorDia =
    useMemo(() => {
      const resultado =
        {};

      DIAS.forEach(
        (dia) => {
          resultado[
            dia.numero
          ] = [];
        }
      );

      horarios.forEach(
        (horario) => {
          const dia =
            Number(
              horario.diaSemana
            );

          if (
            resultado[dia]
          ) {
            resultado[
              dia
            ].push(
              horario
            );
          }
        }
      );

      Object.keys(
        resultado
      ).forEach(
        (
          dia
        ) => {
          resultado[
            dia
          ].sort(
            (
              a,
              b
            ) =>
              a.horaInicio.localeCompare(
                b.horaInicio
              )
          );
        }
      );

      return resultado;
    }, [
      horarios,
    ]);

  const diaActual =
    useMemo(
      () =>
        DIAS.find(
          (
            dia
          ) =>
            dia.numero ===
            diaSeleccionado
        ),
      [
        diaSeleccionado,
      ]
    );

  const franjasDiaActual =
    horariosPorDia[
      diaSeleccionado
    ] || [];

  const seleccionarDia = (
    diaNumero
  ) => {
    setDiaSeleccionado(
      diaNumero
    );

    setEditandoId(
      null
    );

    setMostrarNuevaFranja(
      false
    );

    setNuevoHorario(
      crearHorarioInicial(
        diaNumero
      )
    );
  };

  const abrirNuevaFranja =
    () => {
      setEditandoId(
        null
      );

      setNuevoHorario(
        crearHorarioInicial(
          diaSeleccionado
        )
      );

      setMostrarNuevaFranja(
        true
      );
    };

  const cancelarNuevaFranja =
    () => {
      setMostrarNuevaFranja(
        false
      );

      setNuevoHorario(
        crearHorarioInicial(
          diaSeleccionado
        )
      );
    };

  const manejarCambioHorario = (
    horarioId,
    campo,
    valor
  ) => {
    setHorarios(
      (
        anteriores
      ) =>
        anteriores.map(
          (
            horario
          ) =>
            horario.id ===
            horarioId
              ? {
                  ...horario,
                  [campo]:
                    valor,
                }
              : horario
        )
    );
  };

  const guardarHorario =
    async (
      horario
    ) => {
      try {
        setGuardando(
          true
        );

        await actualizarHorarioAdmin({
          horarioId:
            horario.id,

          diaSemana:
            Number(
              horario.diaSemana
            ),

          horaInicio:
            horario.horaInicio,

          horaFin:
            horario.horaFin,

          activo:
            Boolean(
              horario.activo
            ),
        });

        setEditandoId(
          null
        );

        await cargarHorarios();

        await alertaExito(
          "Horario actualizado correctamente."
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
          "No se pudo modificar el horario."
        );
      } finally {
        setGuardando(
          false
        );
      }
    };

  const cancelarEdicion =
    async () => {
      setEditandoId(
        null
      );

      await cargarHorarios();
    };

  const agregarHorario =
    async () => {
      try {
        setGuardando(
          true
        );

        await crearHorarioAdmin({
          barberoId: 1,

          diaSemana:
            diaSeleccionado,

          horaInicio:
            nuevoHorario
              .horaInicio,

          horaFin:
            nuevoHorario
              .horaFin,
        });

        setMostrarNuevaFranja(
          false
        );

        setNuevoHorario(
          crearHorarioInicial(
            diaSeleccionado
          )
        );

        await cargarHorarios();

        await alertaExito(
          `Franja agregada al ${diaActual?.nombre || "día"} correctamente.`
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
          "No se pudo agregar la franja."
        );
      } finally {
        setGuardando(
          false
        );
      }
    };

  const eliminarHorario =
    async (
      horario
    ) => {
      const confirmar =
        await confirmarAccion({
          titulo:
            "¿Eliminar franja horaria?",

          texto:
            `Se eliminará la franja ${horario.horaInicio} - ${horario.horaFin} del ${diaActual?.nombre || "día seleccionado"}.`,

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
          horario.id
        );

        await eliminarHorarioAdmin(
          horario.id
        );

        await cargarHorarios();

        await alertaExito(
          "Franja horaria eliminada correctamente."
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
          "No se pudo eliminar el horario."
        );
      } finally {
        setEliminandoId(
          null
        );
      }
    };

  return (
    <main className="admin-horarios-page">
      <header className="admin-horarios-header">
        <button
          type="button"
          className="admin-horarios-volver"
          onClick={() =>
            navigate(
              "/admin"
            )
          }
        >
          ← Volver al panel
        </button>

        <p className="admin-horarios-eyebrow">
          Administración
        </p>

        <h1>
          Horarios
        </h1>

        <p>
          Elegí un día para ver,
          crear, editar o eliminar
          sus franjas horarias.
        </p>
      </header>

      {errorCarga && (
        <div className="admin-horarios-error">
          {errorCarga}
        </div>
      )}

      <section className="admin-horarios-selector">
        <div className="admin-horarios-selector__header">
          <div>
            <span>
              SEMANA
            </span>

            <h2>
              Seleccioná un día
            </h2>
          </div>

          <p>
            Administrá cada día
            por separado.
          </p>
        </div>

        <div className="admin-horarios-tabs">
          {DIAS.map(
            (
              dia
            ) => {
              const cantidad =
                horariosPorDia[
                  dia.numero
                ]?.length ||
                0;

              const activo =
                diaSeleccionado ===
                dia.numero;

              return (
                <button
                  key={
                    dia.numero
                  }
                  type="button"
                  className={
                    activo
                      ? "admin-horarios-tab admin-horarios-tab--activo"
                      : "admin-horarios-tab"
                  }
                  onClick={() =>
                    seleccionarDia(
                      dia.numero
                    )
                  }
                >
                  <span className="admin-horarios-tab__corto">
                    {
                      dia.corto
                    }
                  </span>

                  <span className="admin-horarios-tab__nombre">
                    {
                      dia.nombre
                    }
                  </span>

                  <small>
                    {cantidad}
                  </small>
                </button>
              );
            }
          )}
        </div>
      </section>

      {cargando ? (
        <div className="admin-horarios-estado">
          Cargando horarios...
        </div>
      ) : (
        <section className="admin-horario-dia admin-horario-dia--seleccionado">
          <div className="admin-horario-dia-top">
            <div>
              <span className="admin-horario-dia-eyebrow">
                DÍA SELECCIONADO
              </span>

              <div className="admin-horario-dia-titulo">
                <h2>
                  {
                    diaActual
                      ?.nombre
                  }
                </h2>

                <span>
                  {
                    franjasDiaActual
                      .length
                  }{" "}
                  {franjasDiaActual
                    .length ===
                  1
                    ? "franja"
                    : "franjas"}
                </span>
              </div>
            </div>

            {!mostrarNuevaFranja && (
              <button
                type="button"
                className="admin-horario-agregar"
                onClick={
                  abrirNuevaFranja
                }
              >
                <span>
                  +
                </span>

                Agregar franja
              </button>
            )}
          </div>

          {mostrarNuevaFranja && (
            <div className="admin-horario-nueva">
              <div className="admin-horario-nueva__titulo">
                <div>
                  <span>
                    NUEVA FRANJA
                  </span>

                  <h3>
                    Agregar horario
                    para{" "}
                    {
                      diaActual
                        ?.nombre
                    }
                  </h3>
                </div>

                <button
                  type="button"
                  className="admin-horario-nueva__cerrar"
                  onClick={
                    cancelarNuevaFranja
                  }
                  disabled={
                    guardando
                  }
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>

              <div className="admin-horario-nueva__form">
                <div>
                  <label>
                    Desde
                  </label>

                  <input
                    type="time"
                    value={
                      nuevoHorario
                        .horaInicio
                    }
                    onChange={(
                      event
                    ) =>
                      setNuevoHorario(
                        (
                          anterior
                        ) => ({
                          ...anterior,

                          horaInicio:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                  />
                </div>

                <div>
                  <label>
                    Hasta
                  </label>

                  <input
                    type="time"
                    value={
                      nuevoHorario
                        .horaFin
                    }
                    onChange={(
                      event
                    ) =>
                      setNuevoHorario(
                        (
                          anterior
                        ) => ({
                          ...anterior,

                          horaFin:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                  />
                </div>
              </div>

              <div className="admin-horario-nueva__acciones">
                <button
                  type="button"
                  className="admin-horario-cancelar"
                  onClick={
                    cancelarNuevaFranja
                  }
                  disabled={
                    guardando
                  }
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="admin-horario-guardar"
                  onClick={
                    agregarHorario
                  }
                  disabled={
                    guardando
                  }
                >
                  {guardando
                    ? "Guardando..."
                    : "Agregar franja"}
                </button>
              </div>
            </div>
          )}

          {franjasDiaActual.length ===
          0 ? (
            <div className="admin-horario-dia-vacio">
              <div className="admin-horario-dia-vacio__icono">
                ○
              </div>

              <strong>
                {
                  diaActual
                    ?.nombre
                }{" "}
                está cerrado
              </strong>

              <p>
                Todavía no tiene
                ninguna franja
                horaria configurada.
              </p>

              {!mostrarNuevaFranja && (
                <button
                  type="button"
                  onClick={
                    abrirNuevaFranja
                  }
                >
                  + Agregar primera
                  franja
                </button>
              )}
            </div>
          ) : (
            <div className="admin-horario-lista">
              {franjasDiaActual.map(
                (
                  horario,
                  indice
                ) => {
                  const editando =
                    editandoId ===
                    horario.id;

                  return (
                    <div
                      key={
                        horario.id
                      }
                      className={[
                        "admin-horario-franja",

                        !horario.activo
                          ? "admin-horario-franja--inactiva"
                          : "",

                        editando
                          ? "admin-horario-franja--editando"
                          : "",
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          " "
                        )}
                    >
                      {editando ? (
                        <div className="admin-horario-edicion">
                          <div className="admin-horario-edicion__numero">
                            Franja{" "}
                            {indice +
                              1}
                          </div>

                          <div className="admin-horario-edicion__campos">
                            <div>
                              <label>
                                Desde
                              </label>

                              <input
                                type="time"
                                value={
                                  horario
                                    .horaInicio
                                }
                                onChange={(
                                  event
                                ) =>
                                  manejarCambioHorario(
                                    horario.id,
                                    "horaInicio",
                                    event
                                      .target
                                      .value
                                  )
                                }
                              />
                            </div>

                            <div>
                              <label>
                                Hasta
                              </label>

                              <input
                                type="time"
                                value={
                                  horario
                                    .horaFin
                                }
                                onChange={(
                                  event
                                ) =>
                                  manejarCambioHorario(
                                    horario.id,
                                    "horaFin",
                                    event
                                      .target
                                      .value
                                  )
                                }
                              />
                            </div>

                            <label className="admin-horario-activo">
                              <input
                                type="checkbox"
                                checked={Boolean(
                                  horario
                                    .activo
                                )}
                                onChange={(
                                  event
                                ) =>
                                  manejarCambioHorario(
                                    horario.id,
                                    "activo",
                                    event
                                      .target
                                      .checked
                                  )
                                }
                              />

                              <span>
                                {
                                  horario.activo
                                    ? "Activo"
                                    : "Inactivo"
                                }
                              </span>
                            </label>
                          </div>

                          <div className="admin-horario-edicion__acciones">
                            <button
                              type="button"
                              className="admin-horario-cancelar"
                              onClick={
                                cancelarEdicion
                              }
                              disabled={
                                guardando
                              }
                            >
                              Cancelar
                            </button>

                            <button
                              type="button"
                              className="admin-horario-guardar"
                              onClick={() =>
                                guardarHorario(
                                  horario
                                )
                              }
                              disabled={
                                guardando
                              }
                            >
                              {guardando
                                ? "Guardando..."
                                : "Guardar cambios"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="admin-horario-franja__principal">
                            <div className="admin-horario-franja__numero">
                              {
                                indice +
                                1
                              }
                            </div>

                            <div className="admin-horario-horas">
                              <strong>
                                {
                                  horario
                                    .horaInicio
                                }
                              </strong>

                              <span>
                                —
                              </span>

                              <strong>
                                {
                                  horario
                                    .horaFin
                                }
                              </strong>
                            </div>

                            <span
                              className={
                                horario.activo
                                  ? "admin-horario-estado admin-horario-estado--activo"
                                  : "admin-horario-estado admin-horario-estado--inactivo"
                              }
                            >
                              {horario.activo
                                ? "Activo"
                                : "Inactivo"}
                            </span>
                          </div>

                          <div className="admin-horario-acciones">
                            <button
                              type="button"
                              onClick={() => {
                                setMostrarNuevaFranja(
                                  false
                                );

                                setEditandoId(
                                  horario.id
                                );
                              }}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="admin-horario-eliminar"
                              disabled={
                                eliminandoId ===
                                horario.id
                              }
                              onClick={() =>
                                eliminarHorario(
                                  horario
                                )
                              }
                            >
                              {eliminandoId ===
                              horario.id
                                ? "Eliminando..."
                                : "Eliminar"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}

          {franjasDiaActual.length >
            0 &&
            !mostrarNuevaFranja && (
              <button
                type="button"
                className="admin-horario-agregar admin-horario-agregar--inferior"
                onClick={
                  abrirNuevaFranja
                }
              >
                <span>
                  +
                </span>

                Agregar otra franja
                al{" "}
                {
                  diaActual
                    ?.nombre
                }
              </button>
            )}
        </section>
      )}
    </main>
  );
}

export default AdminHorariosPage;