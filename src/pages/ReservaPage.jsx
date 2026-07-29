import { useEffect, useState } from "react";

import { obtenerServicios } from "../services/servicios.service.js";
import { obtenerBarberosPorServicio } from "../services/barberos.service.js";

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
  const [error, setError] = useState("");

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
      setError("No se pudo obtener el profesional disponible.");
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

  const confirmarTurno = () => {
    console.log("Reserva lista para enviar:", reserva);

    alert("La reserva está lista para guardarse.");
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
          onConfirmar={confirmarTurno}
          onVolver={volverADatos}
        />
      )}
    </main>
  );
}

export default ReservaPage;