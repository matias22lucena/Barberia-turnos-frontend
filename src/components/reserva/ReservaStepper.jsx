const pasos = [
  { numero: 1, nombre: "Servicio" },
  { numero: 2, nombre: "Día" },
  { numero: 3, nombre: "Hora" },
  { numero: 4, nombre: "Tus datos" },
  { numero: 5, nombre: "Confirmación" },
];

function ReservaStepper({ pasoActual }) {
  return (
    <nav aria-label="Progreso de la reserva">
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "32px",
          overflowX: "auto",
          paddingBottom: "8px",
        }}
      >
        {pasos.map((paso) => {
          const completado = paso.numero < pasoActual;
          const activo = paso.numero === pasoActual;

          return (
            <div
              key={paso.numero}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "999px",
                whiteSpace: "nowrap",
                border: activo
                  ? "2px solid #f0b23e"
                  : "1px solid #444",
                backgroundColor:
                  activo || completado ? "#3a2a10" : "#1c1c1c",
                color:
                  activo || completado ? "#f0b23e" : "#aaaaaa",
              }}
            >
              <span>
                {completado ? "✓" : paso.numero}
              </span>

              <span>{paso.nombre}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

export default ReservaStepper;