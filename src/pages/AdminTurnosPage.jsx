import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaWhatsapp,
} from "react-icons/fa";

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

const obtenerFechaHoy =
  () => {
    const hoy =
      new Date();

    const anio =
      hoy.getFullYear();

    const mes =
      String(
        hoy.getMonth() +
          1
      ).padStart(
        2,
        "0"
      );

    const dia =
      String(
        hoy.getDate()
      ).padStart(
        2,
        "0"
      );

    return `${anio}-${mes}-${dia}`;
  };

function AdminTurnosPage() {
  const navigate =
    useNavigate();

  const inputFechaRef =
    useRef(null);

  const [
    turnos,
    setTurnos,
  ] = useState([]);

  const [
    fecha,
    setFecha,
  ] = useState(
    obtenerFechaHoy
  );

  const [
    estado,
    setEstado,
  ] = useState(
    "TODOS"
  );

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    actualizandoId,
    setActualizandoId,
  ] = useState(null);

  const abrirCalendario =
    () => {
      const input =
        inputFechaRef.current;

      if (
        !input
      ) {
        return;
      }

      if (
        typeof input.showPicker ===
        "function"
      ) {
        input.showPicker();
      } else {
        input.focus();
        input.click();
      }
    };

  const cargarTurnos =
    async () => {
      try {
        setCargando(
          true
        );

        setError("");

        const respuesta =
          await obtenerTurnosAdmin(
            {
              fecha,

              estado:
                estado ===
                "TODOS"
                  ? ""
                  : estado,
            }
          );

        setTurnos(
          respuesta.data ||
            []
        );
      } catch (error) {
        const mensaje =
          error.response?.data
            ?.message ||
          "No se pudieron cargar los turnos.";

        setError(
          mensaje
        );

        if (
          error.response
            ?.status ===
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
    cargarTurnos();
  }, [
    fecha,
    estado,
  ]);

  const cambiarEstado =
    async (
      turnoId,
      nuevoEstado
    ) => {
      try {
        setActualizandoId(
          turnoId
        );

        setError("");

        await cambiarEstadoTurnoAdmin(
          {
            turnoId,

            estado:
              nuevoEstado,
          }
        );

        await cargarTurnos();
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "No se pudo actualizar el turno."
        );
      } finally {
        setActualizandoId(
          null
        );
      }
    };

  const formatearPrecio = (
    precio
  ) => {
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
        precio || 0
      )
    );
  };

  const formatearFecha = (
    fechaISO
  ) => {
    if (
      !fechaISO
    ) {
      return "-";
    }

    const [
      anio,
      mes,
      dia,
    ] =
      fechaISO.split(
        "-"
      );

    return `${dia}/${mes}/${anio}`;
  };

  const prepararTelefonoWhatsApp = (
    telefono
  ) => {
    if (
      !telefono
    ) {
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

  const enviarRecordatorio =
    (
      turno
    ) => {
      if (
        !turno.clienteTelefono
      ) {
        window.alert(
          "Este turno no tiene un número de celular registrado."
        );

        return;
      }

      const numero =
        prepararTelefonoWhatsApp(
          turno.clienteTelefono
        );

      const nombre =
        turno.clienteNombre ||
        "cliente";

      const nombreReserva =
        turno.promocionTitulo ||
        turno.servicioNombre ||
        "tu servicio";

      const esPaquete =
        Number(
          turno.cantidadTurnosPromocion ||
            0
        ) >
          1 &&
        Number(
          turno.numeroTurnoPromocion ||
            0
        ) >
          0;

      const fechaHoy =
        obtenerFechaHoy();

      const textoFecha =
        turno.fecha ===
        fechaHoy
          ? "hoy"
          : `el ${formatearFecha(
              turno.fecha
            )}`;

      const mensaje =
        esPaquete
          ? [
              `Hola ${nombre} 👋`,
              "",
              `Te recordamos que ${textoFecha} tenés uno de tus turnos en Pitbull Barber Shop.`,
              "",
              `Promoción: ${nombreReserva}`,
              `Corte: ${turno.numeroTurnoPromocion} de ${turno.cantidadTurnosPromocion}`,
              `Horario: ${turno.horaInicio} hs`,
              "",
              "¡Te esperamos!",
            ].join(
              "\n"
            )
          : [
              `Hola ${nombre} 👋`,
              "",
              `Te recordamos que ${textoFecha} tenés un turno en Pitbull Barber Shop.`,
              "",
              `Horario: ${turno.horaInicio} hs`,
              `Servicio: ${nombreReserva}`,
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

  return (
    <main className="admin-turnos-page">
      <header className="admin-turnos-header">
        <div>
          <button
            type="button"
            className="admin-turnos-volver"
            onClick={() =>
              navigate(
                "/admin"
              )
            }
          >
            ← Volver al panel
          </button>

          <p className="admin-turnos-eyebrow">
            Administración
          </p>

          <h1>
            Turnos
          </h1>

          <p>
            Consultá y
            administrá los
            turnos de la
            barbería.
          </p>
        </div>
      </header>

      <section className="admin-turnos-filtros">
        <div className="admin-turnos-filtro">
          <label htmlFor="filtro-fecha">
            Fecha
          </label>

          <input
            ref={
              inputFechaRef
            }
            id="filtro-fecha"
            type="date"
            value={
              fecha
            }
            onClick={
              abrirCalendario
            }
            onChange={(
              event
            ) =>
              setFecha(
                event
                  .target
                  .value
              )
            }
          />
        </div>

        <div className="admin-turnos-filtro">
          <label htmlFor="filtro-estado">
            Estado
          </label>

          <select
            id="filtro-estado"
            value={
              estado
            }
            onChange={(
              event
            ) =>
              setEstado(
                event
                  .target
                  .value
              )
            }
          >
            {ESTADOS.map(
              (
                estadoItem
              ) => (
                <option
                  key={
                    estadoItem
                  }
                  value={
                    estadoItem
                  }
                >
                  {
                    estadoItem
                  }
                </option>
              )
            )}
          </select>
        </div>

        <button
          type="button"
          className="admin-turnos-limpiar"
          onClick={() => {
            setFecha(
              obtenerFechaHoy()
            );

            setEstado(
              "TODOS"
            );
          }}
        >
          Restablecer
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
      ) : turnos.length ===
        0 ? (
        <div className="admin-turnos-estado">
          No hay turnos
          para la fecha y
          filtros
          seleccionados.
        </div>
      ) : (
        <section className="admin-turnos-lista">
          {turnos.map(
            (
              turno
            ) => {
              const nombreReserva =
                turno.promocionTitulo ||
                turno.servicioNombre;

              const esPaquete =
                Number(
                  turno.cantidadTurnosPromocion ||
                    0
                ) >
                  1 &&
                Number(
                  turno.numeroTurnoPromocion ||
                    0
                ) >
                  0;

              const precioMostrado =
                esPaquete &&
                turno.precioTotalPromocion !==
                  null &&
                turno.precioTotalPromocion !==
                  undefined
                  ? turno.precioTotalPromocion
                  : turno.precio;

              return (
                <article
                  key={
                    turno.id
                  }
                  className="admin-turno-card"
                >
                  <div className="admin-turno-principal">
                    <div>
                      <span className="admin-turno-codigo">
                        {
                          turno.codigo
                        }
                      </span>

                      <h2>
                        {turno.clienteNombre ||
                          "Sin nombre"}
                      </h2>

                      <p>
                        {turno.clienteTelefono ||
                          "Sin teléfono"}
                      </p>

                      {esPaquete && (
                        <span className="admin-turno-paquete">
                          Corte{" "}
                          {
                            turno.numeroTurnoPromocion
                          }{" "}
                          de{" "}
                          {
                            turno.cantidadTurnosPromocion
                          }
                        </span>
                      )}
                    </div>

                    <span
                      className={`admin-turno-estado admin-turno-estado--${turno.estado.toLowerCase()}`}
                    >
                      {
                        turno.estado
                      }
                    </span>
                  </div>

                  <div className="admin-turno-datos">
                    <div>
                      <span>
                        Fecha
                      </span>

                      <strong>
                        {formatearFecha(
                          turno.fecha
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Horario
                      </span>

                      <strong>
                        {
                          turno.horaInicio
                        }{" "}
                        -{" "}
                        {
                          turno.horaFin
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        {turno.promocionTitulo
                          ? "Promoción"
                          : "Servicio"}
                      </span>

                      <strong>
                        {
                          nombreReserva
                        }
                      </strong>

                      {esPaquete && (
                        <small className="admin-turno-dato-extra">
                          Corte{" "}
                          {
                            turno.numeroTurnoPromocion
                          }{" "}
                          de{" "}
                          {
                            turno.cantidadTurnosPromocion
                          }
                        </small>
                      )}
                    </div>

                    <div>
                      <span>
                        {esPaquete
                          ? "Precio promo"
                          : "Precio"}
                      </span>

                      <strong>
                        {formatearPrecio(
                          precioMostrado
                        )}
                      </strong>
                    </div>
                  </div>

                  {turno.observacion && (
                    <div className="admin-turno-observacion">
                      <span>
                        Observación
                      </span>

                      <p>
                        {
                          turno.observacion
                        }
                      </p>
                    </div>
                  )}

                  <div className="admin-turno-acciones">
                    {turno.clienteTelefono &&
                      turno.estado ===
                        "CONFIRMADO" && (
                        <button
                          type="button"
                          className="admin-turno-recordatorio"
                          onClick={() =>
                            enviarRecordatorio(
                              turno
                            )
                          }
                        >
                          <FaWhatsapp
                            className="admin-turno-recordatorio__icon"
                            aria-hidden="true"
                          />

                          <span>
                            Enviar
                            recordatorio
                          </span>
                        </button>
                      )}

                    <div className="admin-turno-estado-control">
                      <label
                        htmlFor={`estado-${turno.id}`}
                      >
                        Cambiar
                        estado
                      </label>

                      <select
                        id={`estado-${turno.id}`}
                        value={
                          turno.estado
                        }
                        disabled={
                          actualizandoId ===
                          turno.id
                        }
                        onChange={(
                          event
                        ) =>
                          cambiarEstado(
                            turno.id,
                            event
                              .target
                              .value
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
                  </div>
                </article>
              );
            }
          )}
        </section>
      )}
    </main>
  );
}

export default AdminTurnosPage;