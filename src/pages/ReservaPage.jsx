import {
  useEffect,
  useState,
} from "react";

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
} from "../services/turnos.service.js";

import ReservaHeader from "../components/reserva/ReservaHeader.jsx";
import ReservaStepper from "../components/reserva/ReservaStepper.jsx";
import PasoServicio from "../components/reserva/PasoServicio.jsx";
import PasoFechaHora from "../components/reserva/PasoFechaHora.jsx";
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
  });

  useEffect(() => {
    const cargarOpciones =
      async () => {
        try {
          setCargando(true);
          setError("");

          const [
            serviciosObtenidos,
            promocionesObtenidas,
          ] = await Promise.all([
            obtenerServicios(),
            obtenerPromociones(),
          ]);

          setServicios(
            serviciosObtenidos ||
              []
          );

          /*
           * Para reservar una promo
           * necesitamos que tenga un
           * servicio relacionado.
           *
           * Las demás pueden seguir
           * apareciendo en la Home.
           */
          setPromociones(
            (
              promocionesObtenidas ||
              []
            ).filter(
              (promocion) =>
                promocion.servicioId
            )
          );
        } catch (error) {
          console.error(error);

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
    async (servicio) => {
      try {
        setCargandoBarbero(true);
        setError("");

        const barberos =
          await obtenerBarberosPorServicio(
            servicio.id
          );

        if (
          barberos.length === 0
        ) {
          setError(
            "No hay ningún profesional disponible para este servicio."
          );

          return;
        }

        setReserva({
          servicio,
          promocion: null,
          barbero: barberos[0],
          fecha: null,
          hora: null,
        });

        setPasoActual(2);
      } catch (error) {
        console.error(error);

        const mensaje =
          error.response?.data
            ?.message ||
          "No se pudo obtener el profesional disponible.";

        setError(mensaje);
      } finally {
        setCargandoBarbero(false);
      }
    };

  const seleccionarPromocion =
    async (promocion) => {
      try {
        setCargandoBarbero(true);
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
            (servicio) =>
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
          barberos.length === 0
        ) {
          setError(
            "No hay ningún profesional disponible para esta promoción."
          );

          return;
        }

        setReserva({
          servicio:
            servicioRelacionado,

          promocion,

          barbero:
            barberos[0],

          fecha: null,
          hora: null,
        });

        setPasoActual(2);
      } catch (error) {
        console.error(error);

        const mensaje =
          error.response?.data
            ?.message ||
          "No se pudo preparar la promoción seleccionada.";

        setError(mensaje);
      } finally {
        setCargandoBarbero(false);
      }
    };

  const seleccionarFechaHora = ({
    fecha,
    hora,
  }) => {
    setReserva(
      (
        reservaAnterior
      ) => ({
        ...reservaAnterior,
        fecha,
        hora,
      })
    );

    setPasoActual(3);
    setError("");
  };

  const confirmarTurno =
    async () => {
      if (
        !reserva.barbero?.id ||
        !reserva.servicio?.id ||
        !reserva.fecha
          ?.fechaISO ||
        !reserva.hora
      ) {
        setError(
          "Faltan datos para confirmar el turno."
        );

        return;
      }

      try {
        setConfirmandoTurno(
          true
        );

        setError("");

        const turnoCreado =
          await crearTurno({
            barberoId:
              reserva.barbero
                .id,

            servicioId:
              reserva.servicio
                .id,

            promocionId:
              reserva.promocion
                ?.id || null,

            fecha:
              reserva.fecha
                .fechaISO,

            hora:
              reserva.hora,
          });

        setTurnoConfirmado(
          turnoCreado
        );
      } catch (error) {
        console.error(error);

        const mensaje =
          error.response?.data
            ?.message ||
          "No se pudo confirmar el turno.";

        setError(mensaje);
      } finally {
        setConfirmandoTurno(
          false
        );
      }
    };

  const compartirPorWhatsApp =
    () => {
      if (!turnoConfirmado) {
        return;
      }

      const numeroWhatsApp =
        import.meta.env
          .VITE_WHATSAPP_NUMBER;

      if (!numeroWhatsApp) {
        window.alert(
          "No está configurado el número de WhatsApp de la barbería."
        );

        return;
      }

      const nombreReserva =
        turnoConfirmado
          .promocionTitulo ||
        reserva.promocion
          ?.titulo ||
        turnoConfirmado
          .servicioNombre ||
        reserva.servicio
          ?.nombre ||
        "";

      const etiqueta =
        reserva.promocion ||
        turnoConfirmado
          .promocionId
          ? "Promoción"
          : "Servicio";

      const fecha =
        reserva.fecha
          ?.textoCompleto ||
        turnoConfirmado
          .fecha ||
        "";

      const hora =
        turnoConfirmado
          .horaInicio ||
        reserva.hora ||
        "";

      const mensaje = [
        "Hola, reservé un turno.",
        "",
        `${etiqueta}: ${nombreReserva}`,
        `Día: ${fecha}`,
        `Hora: ${hora}`,
      ].join("\n");

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

  const comenzarNuevaReserva =
    () => {
      setTurnoConfirmado(null);

      setPasoActual(1);

      setError("");

      setReserva({
        servicio: null,
        promocion: null,
        barbero: null,
        fecha: null,
        hora: null,
      });
    };

  if (cargando) {
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

  if (turnoConfirmado) {
    const nombreReserva =
      turnoConfirmado
        .promocionTitulo ||
      reserva.promocion
        ?.titulo ||
      turnoConfirmado
        .servicioNombre ||
      reserva.servicio?.nombre;

    const etiquetaReserva =
      turnoConfirmado
        .promocionId ||
      reserva.promocion
        ? "Promoción"
        : "Servicio";

    return (
      <main className="reserva-page">
        <ReservaHeader />

        <div className="reserva-page__content">
          <section className="reserva-page__success">
            <div className="reserva-page__success-icon">
              ✓
            </div>

            <h1>
              ¡Turno reservado!
            </h1>

            <p>
              Tu reserva fue
              guardada
              correctamente.
            </p>

            <div className="reserva-page__success-card">
              <div className="reserva-page__summary-grid">
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
                  {
                    etiquetaReserva
                  }
                </span>

                <strong>
                  {
                    nombreReserva
                  }
                </strong>

                <span>
                  Profesional
                </span>

                <strong>
                  {
                    turnoConfirmado
                      .barberoNombre
                  }
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

                <span>
                  Duración
                </span>

                <strong>
                  {
                    turnoConfirmado
                      .duracionMinutos
                  }{" "}
                  minutos
                </strong>

                <span>
                  Estado
                </span>

                <strong>
                  {
                    turnoConfirmado
                      .estado
                  }
                </strong>
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
                Compartir por
                WhatsApp
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
        />

        {error && (
          <div
            role="alert"
            className="reserva-page__error"
          >
            {error}
          </div>
        )}

        {pasoActual === 1 && (
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

        {pasoActual === 2 && (
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

        {pasoActual === 3 && (
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
              volverAFechaHora
            }
          />
        )}
      </div>
    </main>
  );
}

export default ReservaPage;