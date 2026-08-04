import "./PasoConfirmacion.css";

function PasoConfirmacion({
  reserva,
  onVolver,
  onConfirmar,
  confirmando,
}) {
  const precioFormateado = Number(
    reserva.servicio?.precio || 0
  ).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  const nombreBarbero = reserva.barbero?.apellido
    ? `${reserva.barbero.nombre} ${reserva.barbero.apellido}`
    : reserva.barbero?.nombre;

  return (
    <section className="paso-confirmacion">
      <header className="paso-confirmacion__header">
        <h1 className="paso-confirmacion__title">
          Revisá tu turno
        </h1>

        <p className="paso-confirmacion__description">
          Verificá que todos los datos sean correctos antes de confirmar.
        </p>
      </header>

      <div className="paso-confirmacion__card">
        <div className="paso-confirmacion__section">
          <div className="paso-confirmacion__row">
            <span>Servicio</span>
            <strong>{reserva.servicio?.nombre}</strong>
          </div>

          <div className="paso-confirmacion__row">
            <span>Profesional</span>
            <strong>{nombreBarbero}</strong>
          </div>

          <div className="paso-confirmacion__row">
            <span>Día</span>
            <strong>{reserva.fecha?.textoCompleto}</strong>
          </div>

          <div className="paso-confirmacion__row">
            <span>Horario</span>
            <strong>{reserva.hora}</strong>
          </div>

          <div className="paso-confirmacion__row">
            <span>Duración</span>
            <strong>
              {reserva.servicio?.duracionMinutos} minutos
            </strong>
          </div>

          <div className="paso-confirmacion__row">
            <span>Precio</span>
            <strong>{precioFormateado}</strong>
          </div>
        </div>

        <div className="paso-confirmacion__divider" />

        <div className="paso-confirmacion__section">
          <div className="paso-confirmacion__row">
            <span>A nombre de</span>
            <strong>{reserva.cliente.nombre}</strong>
          </div>

          <div className="paso-confirmacion__row">
            <span>Teléfono</span>
            <strong>{reserva.cliente.telefono}</strong>
          </div>

          {reserva.cliente.observacion && (
            <div className="paso-confirmacion__row paso-confirmacion__row--observation">
              <span>Observación</span>
              <strong>{reserva.cliente.observacion}</strong>
            </div>
          )}
        </div>
      </div>

      <div className="paso-confirmacion__actions">
        <button
          type="button"
          className="paso-confirmacion__confirm-button"
          onClick={onConfirmar}
          disabled={confirmando}
        >
          {confirmando
            ? "Confirmando turno..."
            : "Confirmar turno"}
        </button>

        <button
          type="button"
          className="paso-confirmacion__back-button"
          onClick={onVolver}
          disabled={confirmando}
        >
          <span aria-hidden="true">←</span>
          Atrás
        </button>
      </div>
    </section>
  );
}

export default PasoConfirmacion;