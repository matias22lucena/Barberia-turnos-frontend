function PasoServicio({
  servicios,
  servicioSeleccionado,
  cargandoBarbero,
  onSeleccionarServicio,
}) {
  return (
    <section>
      <h1>¿Qué servicio querés?</h1>

      <p>Seleccioná una opción para continuar con la reserva.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        {servicios.map((servicio) => {
          const seleccionado =
            servicioSeleccionado?.id === servicio.id;

          return (
            <button
              key={servicio.id}
              type="button"
              disabled={cargandoBarbero}
              onClick={() => onSeleccionarServicio(servicio)}
              style={{
                textAlign: "left",
                padding: "20px",
                borderRadius: "10px",
                border: seleccionado
                  ? "2px solid #f0b23e"
                  : "1px solid #3d3733",
                backgroundColor: seleccionado
                  ? "#2b2114"
                  : "#1c1917",
                color: "#f5f5f5",
                cursor: cargandoBarbero ? "wait" : "pointer",
                opacity: cargandoBarbero ? 0.7 : 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <h2 style={{ margin: 0 }}>
                  {servicio.nombre}
                </h2>

                <strong style={{ color: "#f0b23e" }}>
                  {Number(servicio.precio).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </strong>
              </div>

              <p>{servicio.descripcion}</p>

              <small>
                Duración: {servicio.duracionMinutos} minutos
              </small>
            </button>
          );
        })}
      </div>

      {cargandoBarbero && (
        <p style={{ marginTop: "20px" }}>
          Verificando profesional disponible...
        </p>
      )}
    </section>
  );
}

export default PasoServicio;