function PasoDia({ reserva, onVolver }) {
  return (
    <section>
      <h1>Elegí el día</h1>

      <p>
        Servicio seleccionado:{" "}
        <strong>{reserva.servicio?.nombre}</strong>
      </p>

      <p>
        Profesional asignado:{" "}
        <strong>{reserva.barbero?.nombre}</strong>
      </p>

      <div
        style={{
          marginTop: "32px",
          padding: "24px",
          border: "1px solid #3d3733",
          borderRadius: "10px",
          backgroundColor: "#1c1917",
        }}
      >
        <p>
          En el siguiente paso vamos a generar las fechas disponibles.
        </p>
      </div>

      <button
        type="button"
        onClick={onVolver}
        style={{
          marginTop: "24px",
          padding: "10px 18px",
          cursor: "pointer",
        }}
      >
        ← Atrás
      </button>
    </section>
  );
}

export default PasoDia;