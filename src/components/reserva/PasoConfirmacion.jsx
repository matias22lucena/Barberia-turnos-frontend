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
    <section>
      <h1>Revisá tu turno</h1>

      <p>
        Verificá que todos los datos sean correctos antes de confirmar.
      </p>

      <div
        style={{
          marginTop: "28px",
          padding: "24px",
          border: "1px solid #3d3733",
          borderRadius: "10px",
          backgroundColor: "#1c1917",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "16px",
          }}
        >
          <span style={{ color: "#aaa" }}>Servicio</span>
          <strong>{reserva.servicio?.nombre}</strong>

          <span style={{ color: "#aaa" }}>Profesional</span>
          <strong>{nombreBarbero}</strong>

          <span style={{ color: "#aaa" }}>Día</span>
          <strong>{reserva.fecha?.textoCompleto}</strong>

          <span style={{ color: "#aaa" }}>Horario</span>
          <strong>{reserva.hora}</strong>

          <span style={{ color: "#aaa" }}>Duración</span>
          <strong>
            {reserva.servicio?.duracionMinutos} minutos
          </strong>

          <span style={{ color: "#aaa" }}>Precio</span>
          <strong>{precioFormateado}</strong>
        </div>

        <hr
          style={{
            margin: "24px 0",
            border: 0,
            borderTop: "1px solid #3d3733",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "16px",
          }}
        >
          <span style={{ color: "#aaa" }}>A nombre de</span>
          <strong>{reserva.cliente.nombre}</strong>

          <span style={{ color: "#aaa" }}>Teléfono</span>
          <strong>{reserva.cliente.telefono}</strong>

          {reserva.cliente.observacion && (
            <>
              <span style={{ color: "#aaa" }}>Observación</span>

              <strong
                style={{
                  maxWidth: "400px",
                  textAlign: "right",
                  overflowWrap: "anywhere",
                }}
              >
                {reserva.cliente.observacion}
              </strong>
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onConfirmar}
        disabled={confirmando}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "14px 18px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#f0b23e",
          color: "#111",
          cursor: confirmando ? "wait" : "pointer",
          fontWeight: 700,
          fontSize: "16px",
          opacity: confirmando ? 0.7 : 1,
        }}
      >
        {confirmando
          ? "Confirmando turno..."
          : "Confirmar turno"}
      </button>

      <button
        type="button"
        onClick={onVolver}
        disabled={confirmando}
        style={{
          marginTop: "20px",
          padding: "10px 18px",
          cursor: confirmando ? "not-allowed" : "pointer",
          opacity: confirmando ? 0.6 : 1,
        }}
      >
        ← Atrás
      </button>
    </section>
  );
}

export default PasoConfirmacion;