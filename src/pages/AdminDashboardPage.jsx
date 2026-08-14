import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { obtenerTurnosDashboard } from "../services/adminDashboard.service.js";

import "./AdminDashboardPage.css";

function AdminDashboardPage() {
  const navigate = useNavigate();

  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const administradorGuardado =
    sessionStorage.getItem("adminUsuario");

  const administrador = administradorGuardado
    ? JSON.parse(administradorGuardado)
    : null;

  const obtenerFechaHoraArgentina = () => {
    const ahora = new Date();

    const partes = new Intl.DateTimeFormat(
      "es-AR",
      {
        timeZone: "America/Argentina/Buenos_Aires",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    ).formatToParts(ahora);

    const obtener = (tipo) =>
      partes.find(
        (parte) => parte.type === tipo
      )?.value;

    const anio = obtener("year");
    const mes = obtener("month");
    const dia = obtener("day");
    const hora = obtener("hour");
    const minuto = obtener("minute");

    return {
      fecha: `${anio}-${mes}-${dia}`,
      hora: `${hora}:${minuto}`,
    };
  };

  // ESTA FUNCIÓN TIENE QUE ESTAR AFUERA DE cargarDashboard
  const convertirHoraAMinutos = (hora) => {
    if (!hora) {
      return 0;
    }

    const [horas, minutos] = hora
      .slice(0, 5)
      .split(":")
      .map(Number);

    return horas * 60 + minutos;
  };

  const cargarDashboard = async () => {
    try {
      setCargando(true);
      setError("");

      const { fecha } =
        obtenerFechaHoraArgentina();

      const respuesta =
        await obtenerTurnosDashboard(fecha);

      setTurnos(respuesta.data || []);
    } catch (error) {
      const mensaje =
        error.response?.data?.message ||
        "No se pudo cargar el dashboard.";

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
    cargarDashboard();
  }, []);

  const estadisticas = useMemo(() => {
    return {
      total: turnos.length,

      confirmados: turnos.filter(
        (turno) =>
          turno.estado === "CONFIRMADO"
      ).length,

      completados: turnos.filter(
        (turno) =>
          turno.estado === "COMPLETADO"
      ).length,

      cancelados: turnos.filter(
        (turno) =>
          turno.estado === "CANCELADO"
      ).length,
    };
  }, [turnos]);

  const proximosTurnos = useMemo(() => {
    const { hora } =
      obtenerFechaHoraArgentina();

    const minutosActuales =
      convertirHoraAMinutos(hora);

    return turnos
      .filter((turno) => {
        const minutosTurno =
          convertirHoraAMinutos(
            turno.horaInicio
          );

        return (
          turno.estado === "CONFIRMADO" &&
          minutosTurno >= minutosActuales
        );
      })
      .sort(
        (a, b) =>
          convertirHoraAMinutos(
            a.horaInicio
          ) -
          convertirHoraAMinutos(
            b.horaInicio
          )
      )
      .slice(0, 5);
  }, [turnos]);

  const cerrarSesion = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsuario");

    navigate("/admin/login");
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

  return (
    <main className="admin-dashboard-page">
      <header className="admin-dashboard-header">
        <div>
          <p className="admin-dashboard-eyebrow">
            Administración
          </p>

          <h1>Panel administrativo</h1>

          <p>
            Bienvenido,{" "}
            <strong>
              {administrador?.nombre ||
                "Administrador"}
            </strong>
          </p>
        </div>

        <button
          type="button"
          className="admin-dashboard-logout"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>
      </header>

      {error && (
        <div className="admin-dashboard-error">
          {error}
        </div>
      )}

      <section className="admin-dashboard-stats">
        <article>
          <span>Turnos de hoy</span>
          <strong>
            {cargando
              ? "..."
              : estadisticas.total}
          </strong>
        </article>

        <article>
          <span>Confirmados</span>
          <strong>
            {cargando
              ? "..."
              : estadisticas.confirmados}
          </strong>
        </article>

        <article>
          <span>Completados</span>
          <strong>
            {cargando
              ? "..."
              : estadisticas.completados}
          </strong>
        </article>

        <article>
          <span>Cancelados</span>
          <strong>
            {cargando
              ? "..."
              : estadisticas.cancelados}
          </strong>
        </article>
      </section>

      <section className="admin-dashboard-content">
        <div className="admin-dashboard-proximos">
          <div className="admin-dashboard-section-header">
            <div>
              <p>Agenda</p>
              <h2>Próximos turnos</h2>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/turnos")
              }
            >
              Ver todos
            </button>
          </div>

          {cargando ? (
            <div className="admin-dashboard-empty">
              Cargando turnos...
            </div>
          ) : proximosTurnos.length === 0 ? (
            <div className="admin-dashboard-empty">
              No quedan próximos turnos para hoy.
            </div>
          ) : (
            <div className="admin-dashboard-turnos">
              {proximosTurnos.map((turno) => (
                <article
                  key={turno.id}
                  className="admin-dashboard-turno"
                >
                  <div className="admin-dashboard-turno-hora">
                    {turno.horaInicio}
                  </div>

                  <div className="admin-dashboard-turno-info">
                    <strong>
                      {turno.clienteNombre}
                    </strong>

                    <span>
                      {turno.servicioNombre}
                    </span>
                  </div>

                  <div className="admin-dashboard-turno-precio">
                    {formatearPrecio(
                      turno.precio
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="admin-dashboard-accesos">
          <p>Accesos rápidos</p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/turnos")
            }
          >
            <strong>Turnos</strong>
            <span>
              Gestionar agenda y estados
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/servicios")
            }
          >
            <strong>Servicios</strong>
            <span>
              Precios y duración
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/horarios")
            }
          >
            <strong>Horarios</strong>
            <span>
              Días y franjas de atención
            </span>
          </button>
        </aside>
      </section>
    </main>
  );
}

export default AdminDashboardPage;