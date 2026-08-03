import { useEffect, useState } from "react";

import { obtenerServicios } from "../services/servicios.service.js";
import { obtenerBarberosPorServicio } from "../services/barberos.service.js";
import { crearTurno } from "../services/turnos.service.js";

import ReservaStepper from "../components/reserva/ReservaStepper.jsx";
import PasoServicio from "../components/reserva/PasoServicio.jsx";
import PasoDia from "../components/reserva/PasoDia.jsx";
import PasoHora from "../components/reserva/PasoHora.jsx";
import PasoDatos from "../components/reserva/PasoDatos.jsx";
import PasoConfirmacion from "../components/reserva/PasoConfirmacion.jsx";

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
      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        <h1>Reservar turno</h1>
        <p>Cargando servicios...</p>
      </main>
    );
  }

  if (turnoConfirmado) {
    return (
      <main
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        <section
          style={{
            padding: "32px",
            border: "1px solid #3d3733",
            borderRadius: "12px",
            backgroundColor: "#1c1917",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 20px",
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              backgroundColor: "#3a2a10",
              color: "#f0b23e",
              fontSize: "32px",
            }}
          >
            ✓
          </div>

          <h1>¡Turno reservado!</h1>

          <p>
            Tu reserva fue guardada correctamente.
          </p>

          <div
            style={{
              marginTop: "28px",
              padding: "24px",
              border: "1px solid #3d3733",
              borderRadius: "10px",
              backgroundColor: "#151311",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "16px",
              }}
            >
              <span style={{ color: "#aaa" }}>Código</span>
              <strong>{turnoConfirmado.codigo}</strong>

              <span style={{ color: "#aaa" }}>Servicio</span>
              <strong>{turnoConfirmado.servicioNombre}</strong>

              <span style={{ color: "#aaa" }}>Profesional</span>
              <strong>{turnoConfirmado.barberoNombre}</strong>

              <span style={{ color: "#aaa" }}>Fecha</span>
              <strong>{turnoConfirmado.fecha}</strong>

              <span style={{ color: "#aaa" }}>Horario</span>
              <strong>{turnoConfirmado.horaInicio}</strong>

              <span style={{ color: "#aaa" }}>Estado</span>
              <strong>{turnoConfirmado.estado}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={comenzarNuevaReserva}
            style={{
              width: "100%",
              marginTop: "24px",
              padding: "14px 18px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#f0b23e",
              color: "#111",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            Reservar otro turno
          </button>
        </section>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <ReservaStepper pasoActual={pasoActual} />

      {error && (
        <div
          role="alert"
          style={{
            padding: "14px",
            marginBottom: "24px",
            border: "1px solid #b94a48",
            borderRadius: "8px",
            backgroundColor: "#351a1a",
          }}
        >
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
    </main>
  );
}

export default ReservaPage;