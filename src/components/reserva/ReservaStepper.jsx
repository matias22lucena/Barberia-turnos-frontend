import "./ReservaStepper.css";

const pasos = [
  "Servicio",
  "Fecha y hora",
  "Confirmación",
];

function ReservaStepper({
  pasoActual,
}) {
  const nombrePasoActual =
    pasos[pasoActual - 1];

  const progreso =
    (pasoActual /
      pasos.length) *
    100;

  return (
    <nav
      className="reserva-stepper"
      aria-label="Progreso de la reserva"
    >
      <ol className="reserva-stepper__list">
        {pasos.map(
          (nombre, indice) => {
            const numeroPaso =
              indice + 1;

            const estaActivo =
              numeroPaso ===
              pasoActual;

            const estaCompletado =
              numeroPaso <
              pasoActual;

            const clases = [
              "reserva-stepper__item",

              estaActivo
                ? "reserva-stepper__item--active"
                : "",

              estaCompletado
                ? "reserva-stepper__item--completed"
                : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <li
                key={nombre}
                className={clases}
                aria-current={
                  estaActivo
                    ? "step"
                    : undefined
                }
              >
                <span className="reserva-stepper__number">
                  {estaCompletado
                    ? "✓"
                    : numeroPaso}
                </span>

                <span>
                  {nombre}
                </span>
              </li>
            );
          }
        )}
      </ol>

      <div className="reserva-stepper__mobile">
        <div className="reserva-stepper__mobile-info">
          <div>
            <span className="reserva-stepper__mobile-count">
              Paso {pasoActual} de{" "}
              {pasos.length}
            </span>

            <strong className="reserva-stepper__mobile-title">
              {nombrePasoActual}
            </strong>
          </div>

          <span className="reserva-stepper__mobile-percentage">
            {Math.round(
              progreso
            )}
            %
          </span>
        </div>

        <div
          className="reserva-stepper__progress"
          role="progressbar"
          aria-valuemin="1"
          aria-valuemax={
            pasos.length
          }
          aria-valuenow={
            pasoActual
          }
        >
          <div
            className="reserva-stepper__progress-bar"
            style={{
              width:
                `${progreso}%`,
            }}
          />
        </div>
      </div>
    </nav>
  );
}

export default ReservaStepper;