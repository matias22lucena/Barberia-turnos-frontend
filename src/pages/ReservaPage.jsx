import {
  useEffect,
  useState,
} from "react";

import {
  FaWhatsapp,
} from "react-icons/fa";

import {
  obtenerServicios,
} from "../services/servicios.service.js";

import {
  obtenerPromociones,
} from "../services/promociones.service.js";

import {
  obtenerBarberosPorServicio,
} from "../services/barberos.service.js";

import {
  crearTurno,
  crearTurnosPromocion,
} from "../services/turnos.service.js";

import ReservaHeader from "../components/reserva/ReservaHeader.jsx";
import ReservaStepper from "../components/reserva/ReservaStepper.jsx";
import PasoServicio from "../components/reserva/PasoServicio.jsx";
import PasoFechaHora from "../components/reserva/PasoFechaHora.jsx";
import PasoFechasPromocion from "../components/reserva/PasoFechasPromocion.jsx";
import PasoDatos from "../components/reserva/PasoDatos.jsx";
import PasoConfirmacion from "../components/reserva/PasoConfirmacion.jsx";

import "./ReservaPage.css";

function ReservaPage() {
  const [
    pasoActual,
    setPasoActual,
  ] = useState(1);

  const [
    servicios,
    setServicios,
  ] = useState([]);

  const [
    promociones,
    setPromociones,
  ] = useState([]);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    cargandoBarbero,
    setCargandoBarbero,
  ] = useState(false);

  const [
    confirmandoTurno,
    setConfirmandoTurno,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    turnoConfirmado,
    setTurnoConfirmado,
  ] = useState(null);

  const [
    reserva,
    setReserva,
  ] = useState({
    servicio: null,
    promocion: null,
    barbero: null,

    fecha: null,
    hora: null,

    turnosPromocion:
      [],

    cliente: {
      nombre: "",
      telefono: "",
    },
  });

  const esPaquetePromocion =
    Boolean(
      reserva.promocion &&
      Number(
        reserva.promocion
          .cantidadServicios ||
          1
      ) > 1
    );

  /*
   * Cada vez que cambia el paso
   * de la reserva, volvemos arriba.
   *
   * Esto evita que en celular
   * el siguiente paso aparezca
   * manteniendo el scroll anterior.
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [
    pasoActual,
    turnoConfirmado,
  ]);

  useEffect(() => {
    const cargarOpciones =
      async () => {
        try {
          setCargando(true);
          setError("");

          const [
            serviciosObtenidos,
            promocionesObtenidas,
          ] =
            await Promise.all([
              obtenerServicios(),
              obtenerPromociones(),
            ]);

          setServicios(
            serviciosObtenidos ||
              []
          );

          setPromociones(
            (
              promocionesObtenidas ||
              []
            ).filter(
              (
                promocion
              ) =>
                promocion.servicioId
            )
          );
        } catch (error) {
          console.error(
            error
          );

          setError(
            "No se pudieron cargar los servicios y promociones."
          );
        } finally {
          setCargando(false);
        }
      };

    cargarOpciones();
  }, []);

  const seleccionarServicio =
    async (
      servicio
    ) => {
      try {
        setCargandoBarbero(
          true
        );

        setError("");

        const barberos =
          await obtenerBarberosPorServicio(
            servicio.id
          );

        if (
          barberos.length ===
          0
        ) {
          setError(
            "No hay ningún profesional disponible para este servicio."
          );

          return;
        }

        setReserva(
          (
            anterior
          ) => ({
            ...anterior,

            servicio,
            promocion:
              null,

            barbero:
              barberos[0],

            fecha: null,
            hora: null,

            turnosPromocion:
              [],
          })
        );

        setPasoActual(2);
      } catch (error) {
        console.error(
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "No se pudo obtener el profesional disponible."
        );
      } finally {
        setCargandoBarbero(
          false
        );
      }
    };

  const seleccionarPromocion =
    async (
      promocion
    ) => {
      try {
        setCargandoBarbero(
          true
        );

        setError("");

        if (
          !promocion.servicioId
        ) {
          setError(
            "Esta promoción todavía no tiene un servicio relacionado."
          );

          return;
        }

        const servicioRelacionado =
          servicios.find(
            (
              servicio
            ) =>
              Number(
                servicio.id
              ) ===
              Number(
                promocion.servicioId
              )
          );

        if (
          !servicioRelacionado
        ) {
          setError(
            "No se encontró el servicio relacionado con esta promoción."
          );

          return;
        }

        const barberos =
          await obtenerBarberosPorServicio(
            servicioRelacionado.id
          );

        if (
          barberos.length ===
          0
        ) {
          setError(
            "No hay ningún profesional disponible para esta promoción."
          );

          return;
        }

        setReserva(
          (
            anterior
          ) => ({
            ...anterior,

            servicio:
              servicioRelacionado,

            promocion,

            barbero:
              barberos[0],

            fecha: null,
            hora: null,

            turnosPromocion:
              [],
          })
        );

        setPasoActual(2);
      } catch (error) {
        console.error(
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "No se pudo preparar la promoción seleccionada."
        );
      } finally {
        setCargandoBarbero(
          false
        );
      }
    };

  const seleccionarFechaHora = ({
    fecha,
    hora,
  }) => {
    setReserva(
      (
        anterior
      ) => ({
        ...anterior,
        fecha,
        hora,
      })
    );

    setPasoActual(3);

    setError("");
  };

  const seleccionarTurnosPromocion = (
    turnos
  ) => {
    setReserva(
      (
        anterior
      ) => ({
        ...anterior,

        turnosPromocion:
          turnos,

        fecha: null,
        hora: null,
      })
    );

    setPasoActual(3);

    setError("");
  };

  const guardarDatosCliente = (
    cliente
  ) => {
    setReserva(
      (
        anterior
      ) => ({
        ...anterior,
        cliente,
      })
    );

    setPasoActual(4);

    setError("");
  };

  const confirmarTurno =
    async () => {
      if (
        !reserva.barbero?.id ||
        !reserva.servicio?.id ||
        !reserva.cliente
          ?.nombre ||
        !reserva.cliente
          ?.telefono
      ) {
        setError(
          "Faltan datos para confirmar la reserva."
        );

        return;
      }

      try {
        setConfirmandoTurno(
          true
        );

        setError("");

        let resultado;

        if (
          esPaquetePromocion
        ) {
          const cantidad =
            Number(
              reserva.promocion
                .cantidadServicios
            );

          if (
            reserva
              .turnosPromocion
              .length !==
            cantidad
          ) {
            setError(
              `Debés seleccionar los ${cantidad} turnos de la promoción.`
            );

            return;
          }

          resultado =
            await crearTurnosPromocion(
              {
                barberoId:
                  reserva
                    .barbero
                    .id,

                servicioId:
                  reserva
                    .servicio
                    .id,

                promocionId:
                  reserva
                    .promocion
                    .id,

                turnos:
                  reserva
                    .turnosPromocion
                    .map(
                      (
                        turno
                      ) => ({
                        fecha:
                          turno
                            .fecha
                            .fechaISO,

                        hora:
                          turno
                            .hora,
                      })
                    ),

                cliente:
                  reserva.cliente,
              }
            );
        } else {
          if (
            !reserva.fecha
              ?.fechaISO ||
            !reserva.hora
          ) {
            setError(
              "Falta seleccionar fecha y horario."
            );

            return;
          }

          resultado =
            await crearTurno({
              barberoId:
                reserva
                  .barbero
                  .id,

              servicioId:
                reserva
                  .servicio
                  .id,

              promocionId:
                reserva
                  .promocion
                  ?.id ||
                null,

              fecha:
                reserva
                  .fecha
                  .fechaISO,

              hora:
                reserva.hora,

              cliente:
                reserva.cliente,
            });
        }

        setTurnoConfirmado(
          resultado
        );
      } catch (error) {
        console.error(
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "No se pudo confirmar la reserva."
        );
      } finally {
        setConfirmandoTurno(
          false
        );
      }
    };

  const compartirPorWhatsApp =
    () => {
      if (
        !turnoConfirmado
      ) {
        return;
      }

      const numeroWhatsApp =
        import.meta.env
          .VITE_WHATSAPP_NUMBER;

      if (
        !numeroWhatsApp
      ) {
        window.alert(
          "No está configurado el número de WhatsApp de la barbería."
        );

        return;
      }

      let mensaje;

      if (
        turnoConfirmado.esPaquete
      ) {
        const lineasTurnos =
          turnoConfirmado.turnos.map(
            (
              turno,
              indice
            ) =>
              `${indice + 1}. ${turno.fecha} - ${turno.horaInicio} hs`
          );

        mensaje = [
          "Hola, reservé una promoción en Pitbull Barber Shop.",
          "",
          `Cliente: ${reserva.cliente.nombre}`,
          `Promoción: ${turnoConfirmado.promocionTitulo}`,
          "",
          "Turnos:",
          ...lineasTurnos,
        ].join(
          "\n"
        );
      } else {
        const nombreReserva =
          turnoConfirmado
            .promocionTitulo ||
          turnoConfirmado
            .servicioNombre ||
          reserva.servicio
            ?.nombre ||
          "";

        const fecha =
          reserva.fecha
            ?.textoCompleto ||
          turnoConfirmado
            .fecha;

        mensaje = [
          "Hola, reservé un turno.",
          "",
          `Cliente: ${reserva.cliente.nombre}`,
          `Servicio: ${nombreReserva}`,
          `Día: ${fecha}`,
          `Hora: ${turnoConfirmado.horaInicio}`,
        ].join(
          "\n"
        );
      }

      const urlWhatsApp =
        `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
          mensaje
        )}`;

      window.open(
        urlWhatsApp,
        "_blank",
        "noopener,noreferrer"
      );
    };

  const volverAServicios =
    () => {
      setPasoActual(1);
      setError("");
    };

  const volverAFechaHora =
    () => {
      setPasoActual(2);
      setError("");
    };

  const volverADatos =
    () => {
      setPasoActual(3);
      setError("");
    };

  const comenzarNuevaReserva =
    () => {
      setTurnoConfirmado(
        null
      );

      setPasoActual(1);

      setError("");

      setReserva({
        servicio: null,
        promocion: null,
        barbero: null,

        fecha: null,
        hora: null,

        turnosPromocion:
          [],

        cliente: {
          nombre: "",
          telefono: "",
        },
      });
    };

  if (
    cargando
  ) {
    return (
      <main className="reserva-page">
        <ReservaHeader />

        <div className="reserva-page__content">
          <section className="reserva-page__loading">
            <h1>
              Reservar turno
            </h1>

            <p>
              Cargando servicios
              y promociones...
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (
    turnoConfirmado
  ) {
    return (
      <main className="reserva-page">
        <ReservaHeader />

        <div className="reserva-page__content">
          <section className="reserva-page__success">
            <div className="reserva-page__success-icon">
              ✓
            </div>

            <h1>
              {turnoConfirmado.esPaquete
                ? "¡Turnos reservados!"
                : "¡Turno reservado!"}
            </h1>

            <p>
              Tu reserva fue
              guardada
              correctamente.
            </p>

            <div className="reserva-page__success-card">
              <div className="reserva-page__summary-grid">
                <span>
                  Cliente
                </span>

                <strong>
                  {
                    reserva.cliente
                      .nombre
                  }
                </strong>

                {turnoConfirmado.esPaquete ? (
                  <>
                    <span>
                      Código
                    </span>

                    <strong>
                      {
                        turnoConfirmado
                          .codigoReserva
                      }
                    </strong>

                    <span>
                      Promoción
                    </span>

                    <strong>
                      {
                        turnoConfirmado
                          .promocionTitulo
                      }
                    </strong>

                    <span>
                      Cantidad
                    </span>

                    <strong>
                      {
                        turnoConfirmado
                          .cantidadTurnos
                      }{" "}
                      turnos
                    </strong>

                    {turnoConfirmado.turnos.map(
                      (
                        turno,
                        indice
                      ) => (
                        <div
                          key={
                            turno.id
                          }
                        >
                          <span>
                            Corte{" "}
                            {indice +
                              1}
                          </span>

                          <strong>
                            {
                              turno.fecha
                            }
                            {" · "}
                            {
                              turno.horaInicio
                            }
                          </strong>
                        </div>
                      )
                    )}
                  </>
                ) : (
                  <>
                    <span>
                      Código
                    </span>

                    <strong>
                      {
                        turnoConfirmado
                          .codigo
                      }
                    </strong>

                    <span>
                      Servicio
                    </span>

                    <strong>
                      {turnoConfirmado
                        .promocionTitulo ||
                        turnoConfirmado
                          .servicioNombre}
                    </strong>

                    <span>
                      Fecha
                    </span>

                    <strong>
                      {reserva.fecha
                        ?.textoCompleto ||
                        turnoConfirmado
                          .fecha}
                    </strong>

                    <span>
                      Horario
                    </span>

                    <strong>
                      {
                        turnoConfirmado
                          .horaInicio
                      }
                    </strong>
                  </>
                )}
              </div>
            </div>

            <div className="reserva-page__success-actions">
              <button
                type="button"
                className="btn reserva-page__whatsapp-button"
                onClick={
                  compartirPorWhatsApp
                }
              >
                <FaWhatsapp
                  className="reserva-page__whatsapp-icon"
                  aria-hidden="true"
                />

                <span>
                  Compartir por
                  WhatsApp
                </span>
              </button>

              <button
                type="button"
                className="btn reserva-page__secondary-button"
                onClick={
                  comenzarNuevaReserva
                }
              >
                Reservar otro
                turno
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="reserva-page">
      <ReservaHeader />

      <div className="reserva-page__content">
        <ReservaStepper
          pasoActual={
            pasoActual
          }
          esPaquetePromocion={
            esPaquetePromocion
          }
        />

        {error && (
          <div
            role="alert"
            className="reserva-page__error"
          >
            {error}
          </div>
        )}

        {pasoActual ===
          1 && (
          <PasoServicio
            servicios={
              servicios
            }
            promociones={
              promociones
            }
            servicioSeleccionado={
              reserva.servicio
            }
            promocionSeleccionada={
              reserva.promocion
            }
            cargandoBarbero={
              cargandoBarbero
            }
            onSeleccionarServicio={
              seleccionarServicio
            }
            onSeleccionarPromocion={
              seleccionarPromocion
            }
          />
        )}

        {pasoActual ===
          2 &&
          !esPaquetePromocion && (
            <PasoFechaHora
              reserva={
                reserva
              }
              onSeleccionarFechaHora={
                seleccionarFechaHora
              }
              onVolver={
                volverAServicios
              }
            />
          )}

        {pasoActual ===
          2 &&
          esPaquetePromocion && (
            <PasoFechasPromocion
              reserva={
                reserva
              }
              onContinuar={
                seleccionarTurnosPromocion
              }
              onVolver={
                volverAServicios
              }
            />
          )}

        {pasoActual ===
          3 && (
          <PasoDatos
            reserva={
              reserva
            }
            onContinuar={
              guardarDatosCliente
            }
            onVolver={
              volverAFechaHora
            }
          />
        )}

        {pasoActual ===
          4 && (
          <PasoConfirmacion
            reserva={
              reserva
            }
            confirmando={
              confirmandoTurno
            }
            onConfirmar={
              confirmarTurno
            }
            onVolver={
              volverADatos
            }
          />
        )}
      </div>
    </main>
  );
}

export default ReservaPage;