import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  cambiarEstadoTurnoAdmin,
  obtenerTurnosAdmin,
} from "../services/adminTurnos.service.js";

import "./AdminTurnosPage.css";

const ESTADOS = [
  "TODOS",
  "CONFIRMADO",
  "COMPLETADO",
  "CANCELADO",
  "AUSENTE",
];

function AdminTurnosPage() {
  const navigate = useNavigate();

  const [turnos, setTurnos] = useState([]);
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState("TODOS");

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [actualizandoId, setActualizandoId] =
    useState(null);

  const cargarTurnos = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta =
        await obtenerTurnosAdmin({
          fecha,
          estado:
            estado === "TODOS"
              ? ""
              : estado,
        });

      setTurnos(respuesta.data || []);
    } catch (error) {
      const mensaje =
        error.response?.data?.message ||
        "No se pudieron cargar los turnos.";

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
    cargarTurnos();
  }, [fecha, estado]);

  const cambiarEstado = async (
    turnoId,
    nuevoEstado
  ) => {
    try {
      setActualizandoId(turnoId);
      setError("");

      await cambiarEstadoTurnoAdmin({
        turnoId,
        estado: nuevoEstado,
      });

      await cargarTurnos();
    } catch (error) {
      const mensaje =
        error.response?.data?.message ||
        "No se pudo actualizar el turno.";

      setError(mensaje);
    } finally {
      setActualizandoId(null);
    }
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat(
      "es-AR",
      {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }
    ).format(Number(precio));
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) {
      return "-";
    }

    const [anio, mes, dia] =
      fechaISO.split("-");

    return `${dia}/${mes}/${anio}`;
  };

  return (
    <main className="admin-turnos-page">
      <header className="admin-turnos-header">
        <div>
          <button
            type="button"
            className="admin-turnos-volver"
            onClick={() => navigate("/admin")}
          >
            ← Volver al panel
          </button>

          <p className="admin-turnos-eyebrow">
            Administración
          </p>

          <h1>Turnos</h1>

          <p>
            Consultá y administrá los turnos
            de la barbería.
          </p>
        </div>
      </header>

      <section className="admin-turnos-filtros">
        <div className="admin-turnos-filtro">
          <label htmlFor="filtro-fecha">
            Fecha
          </label>

          <input
            id="filtro-fecha"
            type="date"
            value={fecha}
            onChange={(event) =>
              setFecha(event.target.value)
            }
          />
        </div>

        <div className="admin-turnos-filtro">
          <label htmlFor="filtro-estado">
            Estado
          </label>

          <select
            id="filtro-estado"
            value={estado}
            onChange={(event) =>
              setEstado(event.target.value)
            }
          >
            {ESTADOS.map((estadoItem) => (
              <option
                key={estadoItem}
                value={estadoItem}
              >
                {estadoItem}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="admin-turnos-limpiar"
          onClick={() => {
            setFecha("");
            setEstado("TODOS");
          }}
        >
          Limpiar filtros
        </button>
      </section>

      {error && (
        <div className="admin-turnos-error">
          {error}
        </div>
      )}

      {cargando ? (
        <div className="admin-turnos-estado">
          Cargando turnos...
        </div>
      ) : turnos.length === 0 ? (
        <div className="admin-turnos-estado">
          No hay turnos para los filtros
          seleccionados.
        </div>
      ) : (
        <section className="admin-turnos-lista">
          {turnos.map((turno) => (
            <article
              key={turno.id}
              className="admin-turno-card"
            >
              <div className="admin-turno-principal">
                <div>
                  <span className="admin-turno-codigo">
                    {turno.codigo}
                  </span>

                  <h2>
                    {turno.clienteNombre}
                  </h2>

                  <p>
                    {turno.clienteTelefono}
                  </p>
                </div>

                <span
                  className={`admin-turno-estado admin-turno-estado--${turno.estado.toLowerCase()}`}
                >
                  {turno.estado}
                </span>
              </div>

              <div className="admin-turno-datos">
                <div>
                  <span>Fecha</span>
                  <strong>
                    {formatearFecha(turno.fecha)}
                  </strong>
                </div>

                <div>
                  <span>Horario</span>
                  <strong>
                    {turno.horaInicio} -{" "}
                    {turno.horaFin}
                  </strong>
                </div>

                <div>
                  <span>Servicio</span>
                  <strong>
                    {turno.servicioNombre}
                  </strong>
                </div>

                <div>
                  <span>Precio</span>
                  <strong>
                    {formatearPrecio(turno.precio)}
                  </strong>
                </div>
              </div>

              {turno.observacion && (
                <div className="admin-turno-observacion">
                  <span>Observación</span>

                  <p>{turno.observacion}</p>
                </div>
              )}

              <div className="admin-turno-acciones">
                <label
                  htmlFor={`estado-${turno.id}`}
                >
                  Cambiar estado
                </label>

                <select
                  id={`estado-${turno.id}`}
                  value={turno.estado}
                  disabled={
                    actualizandoId === turno.id
                  }
                  onChange={(event) =>
                    cambiarEstado(
                      turno.id,
                      event.target.value
                    )
                  }
                >
                  <option value="CONFIRMADO">
                    Confirmado
                  </option>

                  <option value="COMPLETADO">
                    Completado
                  </option>

                  <option value="CANCELADO">
                    Cancelado
                  </option>

                  <option value="AUSENTE">
                    Ausente
                  </option>
                </select>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default AdminTurnosPage;