import { useEffect, useMemo, useState } from "react";

import { obtenerHorariosPorBarbero } from "../../services/horarios.service.js";

import "./HomeHorarios.css";

const DIAS_SEMANA = [
  { numero: 1, nombre: "Lunes" },
  { numero: 2, nombre: "Martes" },
  { numero: 3, nombre: "Miércoles" },
  { numero: 4, nombre: "Jueves" },
  { numero: 5, nombre: "Viernes" },
  { numero: 6, nombre: "Sábado" },
  { numero: 7, nombre: "Domingo" },
];

function HomeHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        setCargando(true);
        setError("");

        /*
         * Actualmente hay un solo barbero.
         * Por eso consultamos directamente el barbero con id 1.
         */
        const horariosObtenidos =
          await obtenerHorariosPorBarbero(1);

        setHorarios(horariosObtenidos);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los horarios de atención.");
      } finally {
        setCargando(false);
      }
    };

    cargarHorarios();
  }, []);

  const horariosPorDia = useMemo(() => {
    return DIAS_SEMANA.map((dia) => {
      const franjasDelDia = horarios
        .filter(
          (horario) =>
            Number(horario.diaSemana) === dia.numero
        )
        .sort((a, b) =>
          a.horaInicio.localeCompare(b.horaInicio)
        );

      return {
        ...dia,
        franjas: franjasDelDia,
      };
    });
  }, [horarios]);

  const formatearHora = (hora) => {
    if (!hora) {
      return "";
    }

    return hora.slice(0, 5);
  };

  return (
    <section
      id="horarios"
      className="home-horarios"
    >
      <div className="home-horarios__container">
        <header className="home-horarios__header">
          <span className="home-horarios__eyebrow">
            Horarios de atención
          </span>

          <h2 className="home-horarios__title">
            Cuándo podés venir
          </h2>

          <p className="home-horarios__description">
            Consultá nuestros días y horarios disponibles antes de
            reservar tu turno.
          </p>
        </header>

        {cargando && (
          <div className="home-horarios__loading">
            <div
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            />

            <span>Cargando horarios...</span>
          </div>
        )}

        {error && (
          <div
            className="home-horarios__error"
            role="alert"
          >
            {error}
          </div>
        )}

        {!cargando && !error && (
          <div className="home-horarios__card">
            {horariosPorDia.map((dia) => {
              const estaCerrado = dia.franjas.length === 0;

              return (
                <div
                  key={dia.numero}
                  className={[
                    "home-horarios__row",
                    estaCerrado
                      ? "home-horarios__row--closed"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="home-horarios__day">
                    {dia.nombre}
                  </span>

                  {estaCerrado ? (
                    <strong className="home-horarios__closed">
                      Cerrado
                    </strong>
                  ) : (
                    <div className="home-horarios__ranges">
                      {dia.franjas.map((franja) => (
                        <span
                          key={`${dia.numero}-${franja.id}`}
                          className="home-horarios__range"
                        >
                          {formatearHora(franja.horaInicio)}
                          <span aria-hidden="true">–</span>
                          {formatearHora(franja.horaFin)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="home-horarios__note">
          Los horarios disponibles para reservar pueden variar según
          los turnos ya ocupados.
        </p>
      </div>
    </section>
  );
}

export default HomeHorarios;