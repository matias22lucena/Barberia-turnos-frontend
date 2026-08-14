import { useEffect, useState } from "react";

import { obtenerServicios } from "../services/servicios.service.js";
import { obtenerBarberosPorServicio } from "../services/barberos.service.js";
import { crearTurno } from "../services/turnos.service.js";

import ReservaHeader from "../components/reserva/ReservaHeader.jsx";
import ReservaStepper from "../components/reserva/ReservaStepper.jsx";
import PasoServicio from "../components/reserva/PasoServicio.jsx";
import PasoDia from "../components/reserva/PasoDia.jsx";
import PasoHora from "../components/reserva/PasoHora.jsx";
import PasoDatos from "../components/reserva/PasoDatos.jsx";
import PasoConfirmacion from "../components/reserva/PasoConfirmacion.jsx";

import "./ReservaPage.css";

function ReservaPage() {
  const [pasoActual, setPasoActual] = useState(1);

  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoBarbero, setCargandoBarbero] = useState(false);
  const [confirmandoTurno, setConfirmandoTurno] = useState(false);

  const [error, setError] = useState("");
  const [turnoConfirmado, setTurnoConfirmado] = useState(null);

  const [reserva, setReserva] = useState({
    servicio: null,
    barbero: null,
    fecha: null,
    hora: null,
    cliente: {
      nombre: "",
      telefono: "",
      observacion: "",
    },
  });

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        setCargando(true);
        setError("");

        const serviciosObtenidos = await obtenerServicios();

        setServicios(serviciosObtenidos);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los servicios.");
      } finally {
        setCargando(false);
      }
    };

    cargarServicios();
  }, []);

  const seleccionarServicio = async (servicio) => {
    try {
      setCargandoBarbero(true);
      setError("");

      const barberos = await obtenerBarberosPorServicio(servicio.id);

      if (barberos.length === 0) {
        setError(
          "No hay ningún profesional disponible para este servicio."
        );
        return;
      }

      setReserva((reservaAnterior) => ({
        ...reservaAnterior,
        servicio,
        barbero: barberos[0],
        fecha: null,
        hora: null,
        cliente: {
          nombre: "",
          telefono: "",
          observacion: "",
        },
      }));

      setPasoActual(2);
    } catch (error) {
      console.error(error);

      const mensaje =
        error.response?.data?.message ||
        "No se pudo obtener el profesional disponible.";

      setError(mensaje);
    } finally {
      setCargandoBarbero(false);
    }
  };

  const seleccionarFecha = (fecha) => {
    setReserva((reservaAnterior) => ({
      ...reservaAnterior,
      fecha,
      hora: null,
    }));

    setPasoActual(3);
    setError("");
  };

  const seleccionarHora = (hora) => {
    setReserva((reservaAnterior) => ({
      ...reservaAnterior,
      hora,
    }));

    setPasoActual(4);
    setError("");
  };

  const guardarDatosCliente = (cliente) => {
    setReserva((reservaAnterior) => ({
      ...reservaAnterior,
      cliente,
    }));

    setPasoActual(5);
    setError("");
  };

  const confirmarTurno = async () => {
    if (
      !reserva.barbero?.id ||
      !reserva.servicio?.id ||
      !reserva.fecha?.fechaISO ||
      !reserva.hora
    ) {
      setError("Faltan datos para confirmar el turno.");
      return;
    }

    try {
      setConfirmandoTurno(true);
      setError("");

      const turnoCreado = await crearTurno({
        barberoId: reserva.barbero.id,
        servicioId: reserva.servicio.id,
        fecha: reserva.fecha.fechaISO,
        hora: reserva.hora,
        cliente: reserva.cliente,
      });

      setTurnoConfirmado(turnoCreado);
    } catch (error) {
      console.error(error);

      const mensaje =
        error.response?.data?.message ||
        "No se pudo confirmar el turno.";

      setError(mensaje);
    } finally {
      setConfirmandoTurno(false);
    }
  };

  const volverAServicios = () => {
    setPasoActual(1);
    setError("");
  };

  const volverADias = () => {
    setPasoActual(2);
    setError("");
  };

  const volverAHorarios = () => {
    setPasoActual(3);
    setError("");
  };

  const volverADatos = () => {
    setPasoActual(4);
    setError("");
  };

  const comenzarNuevaReserva = () => {
    setTurnoConfirmado(null);
    setPasoActual(1);
    setError("");

    setReserva({
      servicio: null,
      barbero: null,
      fecha: null,
      hora: null,
      cliente: {
        nombre: "",
        telefono: "",
        observacion: "",
      },
    });
  };

  if (cargando) {
    return (
      <main className="reserva-page">
        <ReservaHeader />

        <div className="reserva-page__content">
          <section className="reserva-page__loading">
            <h1>Reservar turno</h1>
            <p>Cargando servicios...</p>
          </section>
        </div>
      </main>
    );
  }

  if (turnoConfirmado) {
    return (
      <main className="reserva-page">
        <ReservaHeader />

        <div className="reserva-page__content">
          <section className="reserva-page__success">
            <div className="reserva-page__success-icon">✓</div>

            <h1>¡Turno reservado!</h1>

            <p>Tu reserva fue guardada correctamente.</p>

            <div className="reserva-page__success-card">
              <div className="reserva-page__summary-grid">
                <span>Código</span>
                <strong>{turnoConfirmado.codigo}</strong>

                <span>Servicio</span>
                <strong>{turnoConfirmado.servicioNombre}</strong>

                <span>Profesional</span>
                <strong>{turnoConfirmado.barberoNombre}</strong>

                <span>Fecha</span>
                <strong>{turnoConfirmado.fecha}</strong>

                <span>Horario</span>
                <strong>{turnoConfirmado.horaInicio}</strong>

                <span>Estado</span>
                <strong>{turnoConfirmado.estado}</strong>
              </div>
            </div>

            <button
              type="button"
              className="btn reserva-page__primary-button"
              onClick={comenzarNuevaReserva}
            >
              Reservar otro turno
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="reserva-page">
      <ReservaHeader />

      <div className="reserva-page__content">
        <ReservaStepper pasoActual={pasoActual} />

        {error && (
          <div role="alert" className="reserva-page__error">
            {error}
          </div>
        )}

        {pasoActual === 1 && (
          <PasoServicio
            servicios={servicios}
            servicioSeleccionado={reserva.servicio}
            cargandoBarbero={cargandoBarbero}
            onSeleccionarServicio={seleccionarServicio}
          />
        )}

        {pasoActual === 2 && (
          <PasoDia
            reserva={reserva}
            onSeleccionarFecha={seleccionarFecha}
            onVolver={volverAServicios}
          />
        )}

        {pasoActual === 3 && (
          <PasoHora
            reserva={reserva}
            onSeleccionarHora={seleccionarHora}
            onVolver={volverADias}
          />
        )}

        {pasoActual === 4 && (
          <PasoDatos
            reserva={reserva}
            onContinuar={guardarDatosCliente}
            onVolver={volverAHorarios}
          />
        )}

        {pasoActual === 5 && (
          <PasoConfirmacion
            reserva={reserva}
            confirmando={confirmandoTurno}
            onConfirmar={confirmarTurno}
            onVolver={volverADatos}
          />
        )}
      </div>
    </main>
  );
}

export default ReservaPage;