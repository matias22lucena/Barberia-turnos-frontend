function PasoHora({ reserva, onVolver }) {
  return (
    <section>
      <h1>Horarios disponibles</h1>

      <p>
        Servicio: <strong>{reserva.servicio?.nombre}</strong>
      </p>

      <p>
        Día: <strong>{reserva.fecha?.textoCompleto}</strong>
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
        <p>
          En el próximo paso vamos a generar los horarios disponibles
          para esta fecha.
        </p>
      </div>

      <button
        type="button"
        onClick={onVolver}
        style={{
          marginTop: "28px",
          padding: "10px 18px",
          cursor: "pointer",
        }}
      >
        ← Atrás
      </button>
    </section>
  );
}

export default PasoHora;