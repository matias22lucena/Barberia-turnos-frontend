import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  actualizarHorarioAdmin,
  crearHorarioAdmin,
  eliminarHorarioAdmin,
  obtenerHorariosAdmin,
} from "../services/adminHorarios.service.js";

import "./AdminHorariosPage.css";

const DIAS = [
  { numero: 1, nombre: "Lunes" },
  { numero: 2, nombre: "Martes" },
  { numero: 3, nombre: "Miércoles" },
  { numero: 4, nombre: "Jueves" },
  { numero: 5, nombre: "Viernes" },
  { numero: 6, nombre: "Sábado" },
  { numero: 7, nombre: "Domingo" },
];

function AdminHorariosPage() {
  const navigate = useNavigate();

  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [editandoId, setEditandoId] =
    useState(null);

  const [guardando, setGuardando] =
    useState(false);

  const [nuevoHorario, setNuevoHorario] =
    useState({
      diaSemana: 1,
      horaInicio: "09:00",
      horaFin: "13:00",
    });

  const cargarHorarios = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta =
        await obtenerHorariosAdmin();

      setHorarios(respuesta.data || []);
    } catch (error) {
      const mensaje =
        error.response?.data?.message ||
        "No se pudieron cargar los horarios.";

      setError(mensaje);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminUsuario");

        navigate("/admin/login");
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHorarios();
  }, []);

  const horariosPorDia = useMemo(() => {
    const resultado = {};

    DIAS.forEach((dia) => {
      resultado[dia.numero] = [];
    });

    horarios.forEach((horario) => {
      resultado[horario.diaSemana]?.push(
        horario
      );
    });

    return resultado;
  }, [horarios]);

  const manejarCambioHorario = (
    horarioId,
    campo,
    valor
  ) => {
    setHorarios((anteriores) =>
      anteriores.map((horario) =>
        horario.id === horarioId
          ? {
              ...horario,
              [campo]: valor,
            }
          : horario
      )
    );
  };

  const guardarHorario = async (horario) => {
    try {
      setGuardando(true);
      setError("");

      await actualizarHorarioAdmin({
        horarioId: horario.id,
        diaSemana: Number(
          horario.diaSemana
        ),
        horaInicio: horario.horaInicio,
        horaFin: horario.horaFin,
        activo: Boolean(horario.activo),
      });

      setEditandoId(null);

      await cargarHorarios();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "No se pudo modificar el horario."
      );
    } finally {
      setGuardando(false);
    }
  };

  const agregarHorario = async () => {
    try {
      setGuardando(true);
      setError("");

      await crearHorarioAdmin({
        barberoId: 1,
        diaSemana: Number(
          nuevoHorario.diaSemana
        ),
        horaInicio:
          nuevoHorario.horaInicio,
        horaFin: nuevoHorario.horaFin,
      });

      await cargarHorarios();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "No se pudo agregar la franja."
      );
    } finally {
      setGuardando(false);
    }
  };

  const eliminarHorario = async (
    horarioId
  ) => {
    const confirmar = window.confirm(
      "¿Querés eliminar esta franja horaria?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setError("");

      await eliminarHorarioAdmin(
        horarioId
      );

      await cargarHorarios();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "No se pudo eliminar el horario."
      );
    }
  };

  return (
    <main className="admin-horarios-page">
      <header className="admin-horarios-header">
        <button
          type="button"
          className="admin-horarios-volver"
          onClick={() => navigate("/admin")}
        >
          ← Volver al panel
        </button>

        <p className="admin-horarios-eyebrow">
          Administración
        </p>

        <h1>Horarios</h1>

        <p>
          Configurá los días y franjas
          horarias de atención.
        </p>
      </header>

      <section className="admin-horarios-nuevo">
        <div>
          <h2>Agregar franja</h2>
          <p>
            Creá una nueva franja horaria.
          </p>
        </div>

        <div className="admin-horarios-nuevo-form">
          <select
            value={nuevoHorario.diaSemana}
            onChange={(event) =>
              setNuevoHorario(
                (anterior) => ({
                  ...anterior,
                  diaSemana:
                    event.target.value,
                })
              )
            }
          >
            {DIAS.map((dia) => (
              <option
                key={dia.numero}
                value={dia.numero}
              >
                {dia.nombre}
              </option>
            ))}
          </select>

          <input
            type="time"
            value={nuevoHorario.horaInicio}
            onChange={(event) =>
              setNuevoHorario(
                (anterior) => ({
                  ...anterior,
                  horaInicio:
                    event.target.value,
                })
              )
            }
          />

          <input
            type="time"
            value={nuevoHorario.horaFin}
            onChange={(event) =>
              setNuevoHorario(
                (anterior) => ({
                  ...anterior,
                  horaFin:
                    event.target.value,
                })
              )
            }
          />

          <button
            type="button"
            disabled={guardando}
            onClick={agregarHorario}
          >
            Agregar
          </button>
        </div>
      </section>

      {error && (
        <div className="admin-horarios-error">
          {error}
        </div>
      )}

      {cargando ? (
        <div className="admin-horarios-estado">
          Cargando horarios...
        </div>
      ) : (
        <section className="admin-horarios-dias">
          {DIAS.map((dia) => {
            const franjas =
              horariosPorDia[dia.numero] ||
              [];

            return (
              <article
                key={dia.numero}
                className="admin-horario-dia"
              >
                <div className="admin-horario-dia-header">
                  <h2>{dia.nombre}</h2>

                  {franjas.length === 0 && (
                    <span>Cerrado</span>
                  )}
                </div>

                {franjas.map((horario) => {
                  const editando =
                    editandoId === horario.id;

                  return (
                    <div
                      key={horario.id}
                      className="admin-horario-franja"
                    >
                      {editando ? (
                        <>
                          <input
                            type="time"
                            value={
                              horario.horaInicio
                            }
                            onChange={(event) =>
                              manejarCambioHorario(
                                horario.id,
                                "horaInicio",
                                event.target
                                  .value
                              )
                            }
                          />

                          <span>—</span>

                          <input
                            type="time"
                            value={
                              horario.horaFin
                            }
                            onChange={(event) =>
                              manejarCambioHorario(
                                horario.id,
                                "horaFin",
                                event.target
                                  .value
                              )
                            }
                          />

                          <label className="admin-horario-activo">
                            <input
                              type="checkbox"
                              checked={Boolean(
                                horario.activo
                              )}
                              onChange={(
                                event
                              ) =>
                                manejarCambioHorario(
                                  horario.id,
                                  "activo",
                                  event.target
                                    .checked
                                )
                              }
                            />

                            Activo
                          </label>

                          <button
                            type="button"
                            className="admin-horario-guardar"
                            disabled={guardando}
                            onClick={() =>
                              guardarHorario(
                                horario
                              )
                            }
                          >
                            Guardar
                          </button>

                          <button
                            type="button"
                            className="admin-horario-cancelar"
                            onClick={() => {
                              setEditandoId(null);
                              cargarHorarios();
                            }}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="admin-horario-horas">
                            <strong>
                              {
                                horario.horaInicio
                              }
                            </strong>

                            <span>—</span>

                            <strong>
                              {horario.horaFin}
                            </strong>

                            {!horario.activo && (
                              <small>
                                Inactivo
                              </small>
                            )}
                          </div>

                          <div className="admin-horario-acciones">
                            <button
                              type="button"
                              onClick={() =>
                                setEditandoId(
                                  horario.id
                                )
                              }
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="admin-horario-eliminar"
                              onClick={() =>
                                eliminarHorario(
                                  horario.id
                                )
                              }
                            >
                              Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default AdminHorariosPage;