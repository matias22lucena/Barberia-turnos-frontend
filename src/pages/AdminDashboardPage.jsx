import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaWhatsapp,
} from "react-icons/fa";

import {
  obtenerTurnosDashboard,
} from "../services/adminDashboard.service.js";

import "./AdminDashboardPage.css";

function AdminDashboardPage() {
  const navigate =
    useNavigate();

  const [
    turnos,
    setTurnos,
  ] = useState([]);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    turnoSeleccionado,
    setTurnoSeleccionado,
  ] = useState(null);

  const administradorGuardado =
    sessionStorage.getItem(
      "adminUsuario"
    );

  const administrador =
    administradorGuardado
      ? JSON.parse(
          administradorGuardado
        )
      : null;

  const obtenerFechaHoraArgentina =
    () => {
      const ahora =
        new Date();

      const partes =
        new Intl.DateTimeFormat(
          "es-AR",
          {
            timeZone:
              "America/Argentina/Buenos_Aires",

            year:
              "numeric",

            month:
              "2-digit",

            day:
              "2-digit",

            hour:
              "2-digit",

            minute:
              "2-digit",

            hour12:
              false,
          }
        ).formatToParts(
          ahora
        );

      const obtener = (
        tipo
      ) =>
        partes.find(
          (
            parte
          ) =>
            parte.type ===
            tipo
        )?.value;

      const anio =
        obtener(
          "year"
        );

      const mes =
        obtener(
          "month"
        );

      const dia =
        obtener(
          "day"
        );

      const hora =
        obtener(
          "hour"
        );

      const minuto =
        obtener(
          "minute"
        );

      return {
        fecha:
          `${anio}-${mes}-${dia}`,

        hora:
          `${hora}:${minuto}`,
      };
    };

  const convertirHoraAMinutos = (
    hora
  ) => {
    if (!hora) {
      return 0;
    }

    const [
      horas,
      minutos,
    ] =
      hora
        .slice(
          0,
          5
        )
        .split(
          ":"
        )
        .map(
          Number
        );

    return (
      horas * 60 +
      minutos
    );
  };

  const cargarDashboard =
    async () => {
      try {
        setCargando(
          true
        );

        setError("");

        const {
          fecha,
        } =
          obtenerFechaHoraArgentina();

        const respuesta =
          await obtenerTurnosDashboard(
            fecha
          );

        setTurnos(
          respuesta.data ||
            []
        );
      } catch (error) {
        const mensaje =
          error.response?.data
            ?.message ||
          "No se pudo cargar el dashboard.";

        setError(
          mensaje
        );

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
        }
      } finally {
        setCargando(
          false
        );
      }
    };

  useEffect(() => {
    cargarDashboard();
  }, []);

  /*
   * Cerramos el modal con ESC
   * y bloqueamos el scroll
   * mientras está abierto.
   */
  useEffect(() => {
    if (
      !turnoSeleccionado
    ) {
      return undefined;
    }

    const manejarEscape =
      (
        event
      ) => {
        if (
          event.key ===
          "Escape"
        ) {
          setTurnoSeleccionado(
            null
          );
        }
      };

    document.addEventListener(
      "keydown",
      manejarEscape
    );

    const overflowAnterior =
      document.body.style
        .overflow;

    document.body.style
      .overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        manejarEscape
      );

      document.body.style
        .overflow =
        overflowAnterior;
    };
  }, [
    turnoSeleccionado,
  ]);

  const estadisticas =
    useMemo(() => {
      return {
        total:
          turnos.length,

        confirmados:
          turnos.filter(
            (
              turno
            ) =>
              turno.estado ===
              "CONFIRMADO"
          ).length,

        completados:
          turnos.filter(
            (
              turno
            ) =>
              turno.estado ===
              "COMPLETADO"
          ).length,

        cancelados:
          turnos.filter(
            (
              turno
            ) =>
              turno.estado ===
              "CANCELADO"
          ).length,
      };
    }, [
      turnos,
    ]);

  const proximosTurnos =
    useMemo(() => {
      const {
        hora,
      } =
        obtenerFechaHoraArgentina();

      const minutosActuales =
        convertirHoraAMinutos(
          hora
        );

      return turnos
        .filter(
          (
            turno
          ) => {
            const minutosTurno =
              convertirHoraAMinutos(
                turno.horaInicio
              );

            return (
              turno.estado ===
                "CONFIRMADO" &&
              minutosTurno >=
                minutosActuales
            );
          }
        )
        .sort(
          (
            a,
            b
          ) =>
            convertirHoraAMinutos(
              a.horaInicio
            ) -
            convertirHoraAMinutos(
              b.horaInicio
            )
        )
        .slice(
          0,
          5
        );
    }, [
      turnos,
    ]);

  const cerrarSesion =
    () => {
      sessionStorage.removeItem(
        "adminToken"
      );

      sessionStorage.removeItem(
        "adminUsuario"
      );

      navigate(
        "/admin/login"
      );
    };

  const formatearPrecio = (
    precio
  ) => {
    if (
      precio === null ||
      precio === undefined ||
      precio === ""
    ) {
      return "-";
    }

    return new Intl.NumberFormat(
      "es-AR",
      {
        style:
          "currency",

        currency:
          "ARS",

        maximumFractionDigits:
          0,
      }
    ).format(
      Number(
        precio
      )
    );
  };

  const formatearFecha =
    (
      fecha
    ) => {
      if (!fecha) {
        return "Hoy";
      }

      const [
        anio,
        mes,
        dia,
      ] =
        fecha
          .slice(
            0,
            10
          )
          .split(
            "-"
          )
          .map(
            Number
          );

      if (
        !anio ||
        !mes ||
        !dia
      ) {
        return fecha;
      }

      return new Intl.DateTimeFormat(
        "es-AR",
        {
          weekday:
            "long",

          day:
            "numeric",

          month:
            "long",

          year:
            "numeric",
        }
      ).format(
        new Date(
          anio,
          mes - 1,
          dia
        )
      );
    };

  const prepararTelefonoWhatsApp =
    (
      telefono
    ) => {
      if (!telefono) {
        return "";
      }

      let numero =
        String(
          telefono
        ).replace(
          /\D/g,
          ""
        );

      if (
        numero.startsWith(
          "549"
        )
      ) {
        return numero;
      }

      if (
        numero.startsWith(
          "54"
        )
      ) {
        return `549${numero.slice(
          2
        )}`;
      }

      if (
        numero.startsWith(
          "0"
        )
      ) {
        numero =
          numero.slice(
            1
          );
      }

      if (
        numero.length ===
        10
      ) {
        return `549${numero}`;
      }

      return numero;
    };

  const enviarRecordatorioWhatsApp =
    () => {
      if (
        !turnoSeleccionado
      ) {
        return;
      }

      const telefono =
        turnoSeleccionado
          .clienteTelefono;

      if (!telefono) {
        return;
      }

      const numero =
        prepararTelefonoWhatsApp(
          telefono
        );

      if (!numero) {
        return;
      }

      const nombre =
        turnoSeleccionado
          .clienteNombre ||
        "cliente";

      const servicio =
        turnoSeleccionado
          .promocionTitulo ||
        turnoSeleccionado
          .servicioNombre ||
        "tu servicio";

      const hora =
        turnoSeleccionado
          .horaInicio?.slice(
            0,
            5
          ) ||
        "";

      const mensaje = [
        `Hola ${nombre} 👋`,
        "",
        "Te recordamos que hoy tenés un turno en Pitbull Barber Shop.",
        "",
        `Servicio: ${servicio}`,
        `Horario: ${hora} hs`,
        "",
        "¡Te esperamos!",
      ].join(
        "\n"
      );

      const url =
        `https://wa.me/${numero}?text=${encodeURIComponent(
          mensaje
        )}`;

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );
    };

  const cerrarModal =
    () => {
      setTurnoSeleccionado(
        null
      );
    };

  const manejarClickFondoModal =
    (
      event
    ) => {
      if (
        event.target ===
        event.currentTarget
      ) {
        cerrarModal();
      }
    };

  return (
    <main className="admin-dashboard-page">
      <header className="admin-dashboard-header">
        <div>
          <p className="admin-dashboard-eyebrow">
            Administración
          </p>

          <h1>
            Panel administrativo
          </h1>

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
          onClick={
            cerrarSesion
          }
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
          <span>
            Turnos de hoy
          </span>

          <strong>
            {cargando
              ? "..."
              : estadisticas.total}
          </strong>
        </article>

        <article>
          <span>
            Confirmados
          </span>

          <strong>
            {cargando
              ? "..."
              : estadisticas.confirmados}
          </strong>
        </article>

        <article>
          <span>
            Completados
          </span>

          <strong>
            {cargando
              ? "..."
              : estadisticas.completados}
          </strong>
        </article>

        <article>
          <span>
            Cancelados
          </span>

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
              <p>
                Agenda
              </p>

              <h2>
                Próximos turnos
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/turnos"
                )
              }
            >
              Ver todos
            </button>
          </div>

          {cargando ? (
            <div className="admin-dashboard-empty">
              Cargando turnos...
            </div>
          ) : proximosTurnos.length ===
            0 ? (
            <div className="admin-dashboard-empty">
              No quedan próximos turnos para hoy.
            </div>
          ) : (
            <div className="admin-dashboard-turnos">
              {proximosTurnos.map(
                (
                  turno
                ) => (
                  <button
                    key={
                      turno.id
                    }
                    type="button"
                    className="admin-dashboard-turno"
                    onClick={() =>
                      setTurnoSeleccionado(
                        turno
                      )
                    }
                    aria-label={`Ver turno de ${
                      turno.clienteNombre ||
                      "cliente"
                    }`}
                  >
                    <div className="admin-dashboard-turno-hora">
                      {
                        turno.horaInicio
                      }
                    </div>

                    <div className="admin-dashboard-turno-info">
                      <strong>
                        {turno.clienteNombre ||
                          "Reserva web"}
                      </strong>

                      <span>
                        {turno.promocionTitulo ||
                          turno.servicioNombre}
                      </span>
                    </div>

                    <div className="admin-dashboard-turno-precio">
                      {formatearPrecio(
                        turno.precio
                      )}
                    </div>

                    <span className="admin-dashboard-turno-arrow">
                      ›
                    </span>
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <aside className="admin-dashboard-accesos">
          <p>
            Accesos rápidos
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/turnos"
              )
            }
          >
            <strong>
              Turnos
            </strong>

            <span>
              Gestionar agenda y estados
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/servicios"
              )
            }
          >
            <strong>
              Servicios
            </strong>

            <span>
              Precios y duración
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/horarios"
              )
            }
          >
            <strong>
              Horarios
            </strong>

            <span>
              Días y franjas de atención
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/promociones"
              )
            }
          >
            <strong>
              Promociones
            </strong>

            <span>
              Crear y administrar promociones
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/carrusel"
              )
            }
          >
            <strong>
              Carrusel
            </strong>

            <span>
              Administrar imágenes de trabajos
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/home"
              )
            }
          >
            <strong>
              Contenido del inicio
            </strong>

            <span>
              Modificar textos y logo del Home
            </span>
          </button>
        </aside>
      </section>

      {turnoSeleccionado && (
        <div
          className="admin-dashboard-modal-overlay"
          onMouseDown={
            manejarClickFondoModal
          }
        >
          <div
            className="admin-dashboard-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detalle-turno-titulo"
          >
            <button
              type="button"
              className="admin-dashboard-modal-close"
              onClick={
                cerrarModal
              }
              aria-label="Cerrar"
            >
              ×
            </button>

            <div className="admin-dashboard-modal-header">
              <p>
                DETALLE DEL TURNO
              </p>

              <h2 id="detalle-turno-titulo">
                {turnoSeleccionado
                  .clienteNombre ||
                  "Reserva web"}
              </h2>

              <span
                className={`admin-dashboard-modal-estado admin-dashboard-modal-estado--${(
                  turnoSeleccionado.estado ||
                  ""
                ).toLowerCase()}`}
              >
                {turnoSeleccionado.estado ||
                  "SIN ESTADO"}
              </span>
            </div>

            <div className="admin-dashboard-modal-info">
              <div>
                <span>
                  Servicio
                </span>

                <strong>
                  {turnoSeleccionado
                    .promocionTitulo ||
                    turnoSeleccionado
                      .servicioNombre ||
                    "-"}
                </strong>
              </div>

              <div>
                <span>
                  Fecha
                </span>

                <strong>
                  {formatearFecha(
                    turnoSeleccionado
                      .fecha
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Horario
                </span>

                <strong>
                  {turnoSeleccionado
                    .horaInicio?.slice(
                      0,
                      5
                    ) ||
                    "-"}{" "}
                  hs
                </strong>
              </div>

              <div>
                <span>
                  Precio
                </span>

                <strong>
                  {formatearPrecio(
                    turnoSeleccionado
                      .precio
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Teléfono
                </span>

                <strong>
                  {turnoSeleccionado
                    .clienteTelefono ||
                    "No disponible"}
                </strong>
              </div>

              {turnoSeleccionado.codigo && (
                <div>
                  <span>
                    Código
                  </span>

                  <strong>
                    {
                      turnoSeleccionado
                        .codigo
                    }
                  </strong>
                </div>
              )}
            </div>

            <div className="admin-dashboard-modal-actions">
              {turnoSeleccionado.estado ===
                "CONFIRMADO" &&
                turnoSeleccionado
                  .clienteTelefono && (
                  <button
                    type="button"
                    className="admin-dashboard-modal-whatsapp"
                    onClick={
                      enviarRecordatorioWhatsApp
                    }
                  >
                    <FaWhatsapp
                      aria-hidden="true"
                    />

                    <span>
                      Enviar recordatorio
                    </span>
                  </button>
                )}

              {turnoSeleccionado.estado ===
                "CONFIRMADO" &&
                !turnoSeleccionado
                  .clienteTelefono && (
                  <div className="admin-dashboard-modal-sin-telefono">
                    Este turno no tiene un teléfono disponible para enviar el recordatorio.
                  </div>
                )}

              <button
                type="button"
                className="admin-dashboard-modal-ver"
                onClick={() => {
                  cerrarModal();

                  navigate(
                    "/admin/turnos"
                  );
                }}
              >
                Ver todos los turnos
              </button>

              <button
                type="button"
                className="admin-dashboard-modal-cancel"
                onClick={
                  cerrarModal
                }
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminDashboardPage;