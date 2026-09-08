import "./PasoConfirmacion.css";

function PasoConfirmacion({
  reserva,
  onVolver,
  onConfirmar,
  confirmando,
}) {
  const esPromocion =
    Boolean(
      reserva.promocion
    );

  const nombreReserva =
    reserva.promocion
      ?.titulo ||
    reserva.servicio
      ?.nombre ||
    "";

  const precioReserva =
    reserva.promocion
      ?.precio ??
    reserva.servicio
      ?.precio ??
    0;

  const duracionReserva =
    reserva.promocion
      ?.duracionMinutos ??
    reserva.servicio
      ?.duracionMinutos ??
    0;

  const precioFormateado =
    Number(
      precioReserva
    ).toLocaleString(
      "es-AR",
      {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits:
          0,
        maximumFractionDigits:
          0,
      }
    );

  const nombreBarbero =
    reserva.barbero?.apellido
      ? `${reserva.barbero.nombre} ${reserva.barbero.apellido}`
      : reserva.barbero
          ?.nombre;

  return (
    <section className="paso-confirmacion">
      <header className="paso-confirmacion__header">
        <h1 className="paso-confirmacion__title">
          Revisá tu turno
        </h1>

        <p className="paso-confirmacion__description">
          Verificá que los
          datos sean correctos
          antes de confirmar.
        </p>
      </header>

      <div className="paso-confirmacion__card">
        <div className="paso-confirmacion__section">
          <div className="paso-confirmacion__row">
            <span>
              {esPromocion
                ? "Promoción"
                : "Servicio"}
            </span>

            <strong>
              {
                nombreReserva
              }
            </strong>
          </div>

          {esPromocion && (
            <div className="paso-confirmacion__row">
              <span>
                Servicio base
              </span>

              <strong>
                {
                  reserva
                    .servicio
                    ?.nombre
                }
              </strong>
            </div>
          )}

          <div className="paso-confirmacion__row">
            <span>
              Profesional
            </span>

            <strong>
              {nombreBarbero}
            </strong>
          </div>

          <div className="paso-confirmacion__row">
            <span>
              Día
            </span>

            <strong>
              {
                reserva.fecha
                  ?.textoCompleto
              }
            </strong>
          </div>

          <div className="paso-confirmacion__row">
            <span>
              Horario
            </span>

            <strong>
              {reserva.hora}
            </strong>
          </div>

          <div className="paso-confirmacion__row">
            <span>
              Duración
            </span>

            <strong>
              {
                duracionReserva
              }{" "}
              minutos
            </strong>
          </div>

          <div className="paso-confirmacion__row">
            <span>
              Precio
            </span>

            <strong>
              {
                precioFormateado
              }
            </strong>
          </div>
        </div>
      </div>

      <div className="paso-confirmacion__actions">
        <button
          type="button"
          className="paso-confirmacion__confirm-button"
          onClick={
            onConfirmar
          }
          disabled={
            confirmando
          }
        >
          {confirmando
            ? "Confirmando turno..."
            : "Confirmar turno"}
        </button>

        <button
          type="button"
          className="paso-confirmacion__back-button"
          onClick={onVolver}
          disabled={
            confirmando
          }
        >
          <span
            aria-hidden="true"
          >
            ←
          </span>

          Atrás
        </button>
      </div>
    </section>
  );
}

export default PasoConfirmacion;