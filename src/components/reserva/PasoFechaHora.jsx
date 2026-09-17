import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  obtenerHorariosPorBarbero,
} from "../../services/horarios.service.js";

import {
  obtenerDisponibilidad,
} from "../../services/disponibilidad.service.js";

import "./PasoFechaHora.css";

const NOMBRES_MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DIAS_SEMANA = [
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
  "Dom",
];

const formatearFechaISO = (
  fecha
) => {
  const anio =
    fecha.getFullYear();

  const mes =
    String(
      fecha.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const dia =
    String(
      fecha.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${anio}-${mes}-${dia}`;
};

const obtenerDiaSemanaBaseDatos = (
  fecha
) => {
  const diaJavaScript =
    fecha.getDay();

  return diaJavaScript === 0
    ? 7
    : diaJavaScript;
};

const crearFechaReserva = (
  fecha
) => {
  const fechaISO =
    formatearFechaISO(
      fecha
    );

  const textoCompleto =
    new Intl.DateTimeFormat(
      "es-AR",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(
      fecha
    );

  return {
    fechaISO,
    textoCompleto,

    numeroDia:
      fecha.getDate(),

    diaSemanaBaseDatos:
      obtenerDiaSemanaBaseDatos(
        fecha
      ),
  };
};

const normalizarFecha = (
  fecha
) => {
  return new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate()
  );
};

function PasoFechaHora({
  reserva,
  onSeleccionarFechaHora,
  onVolver,
}) {
  const hoy =
    useMemo(
      () =>
        normalizarFecha(
          new Date()
        ),
      []
    );

  const [
    mesVisible,
    setMesVisible,
  ] = useState(
    new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      1
    )
  );

  const [
    horariosLaborales,
    setHorariosLaborales,
  ] = useState([]);

  const [
    fechaSeleccionada,
    setFechaSeleccionada,
  ] = useState(
    reserva.fecha ||
      null
  );

  const [
    horaSeleccionada,
    setHoraSeleccionada,
  ] = useState(
    reserva.hora ||
      null
  );

  const [
    horariosDisponibles,
    setHorariosDisponibles,
  ] = useState([]);

  const [
    cargandoCalendario,
    setCargandoCalendario,
  ] = useState(true);

  const [
    cargandoDisponibilidad,
    setCargandoDisponibilidad,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /*
   * Cargar los días
   * laborales del barbero.
   */
  useEffect(() => {
    const cargarHorarios =
      async () => {
        const barberoId =
          reserva.barbero?.id;

        if (
          !barberoId
        ) {
          setError(
            "No se encontró el profesional asignado."
          );

          setCargandoCalendario(
            false
          );

          return;
        }

        try {
          setCargandoCalendario(
            true
          );

          setError("");

          const horarios =
            await obtenerHorariosPorBarbero(
              barberoId
            );

          setHorariosLaborales(
            horarios ||
              []
          );
        } catch (error) {
          console.error(
            error
          );

          setError(
            "No se pudieron cargar los días de atención."
          );
        } finally {
          setCargandoCalendario(
            false
          );
        }
      };

    cargarHorarios();
  }, [
    reserva.barbero?.id,
  ]);

  /*
   * Días de la semana
   * en los que trabaja
   * el barbero.
   */
  const diasLaborales =
    useMemo(() => {
      return new Set(
        horariosLaborales.map(
          (
            horario
          ) =>
            Number(
              horario.diaSemana
            )
        )
      );
    }, [
      horariosLaborales,
    ]);

  /*
   * Construcción del
   * calendario mensual.
   */
  const diasCalendario =
    useMemo(() => {
      const anio =
        mesVisible.getFullYear();

      const mes =
        mesVisible.getMonth();

      const primerDiaMes =
        new Date(
          anio,
          mes,
          1
        );

      const ultimoDiaMes =
        new Date(
          anio,
          mes + 1,
          0
        );

      /*
       * Domingo = 0
       * lo mandamos al final.
       */
      const espaciosIniciales =
        primerDiaMes.getDay() ===
        0
          ? 6
          : primerDiaMes.getDay() -
            1;

      const dias = [];

      for (
        let i = 0;
        i <
        espaciosIniciales;
        i += 1
      ) {
        dias.push(
          null
        );
      }

      for (
        let numeroDia = 1;
        numeroDia <=
        ultimoDiaMes.getDate();
        numeroDia += 1
      ) {
        const fecha =
          new Date(
            anio,
            mes,
            numeroDia
          );

        const fechaNormalizada =
          normalizarFecha(
            fecha
          );

        const diaSemana =
          obtenerDiaSemanaBaseDatos(
            fecha
          );

        const esPasado =
          fechaNormalizada <
          hoy;

        const esLaboral =
          diasLaborales.has(
            diaSemana
          );

        dias.push({
          fecha,

          fechaISO:
            formatearFechaISO(
              fecha
            ),

          numeroDia,

          esPasado,

          esLaboral,

          habilitado:
            !esPasado &&
            esLaboral,
        });
      }

      return dias;
    }, [
      mesVisible,
      hoy,
      diasLaborales,
    ]);

  /*
   * Seleccionar un día
   * y consultar los horarios.
   */
  const seleccionarFecha =
    async (
      dia
    ) => {
      if (
        !dia?.habilitado
      ) {
        return;
      }

      const nuevaFecha =
        crearFechaReserva(
          dia.fecha
        );

      setFechaSeleccionada(
        nuevaFecha
      );

      setHoraSeleccionada(
        null
      );

      setHorariosDisponibles(
        []
      );

      setError("");

      try {
        setCargandoDisponibilidad(
          true
        );

        /*
         * IMPORTANTE:
         * también mandamos
         * promocionId.
         *
         * De esta manera el
         * backend puede usar
         * la duración propia
         * de la promoción.
         */
        const disponibilidad =
          await obtenerDisponibilidad(
            {
              barberoId:
                reserva
                  .barbero
                  .id,

              servicioId:
                reserva
                  .servicio
                  .id,

              promocionId:
                reserva
                  .promocion
                  ?.id ||
                null,

              fecha:
                nuevaFecha
                  .fechaISO,
            }
          );

        setHorariosDisponibles(
          disponibilidad
            ?.horarios ||
            []
        );
      } catch (error) {
        console.error(
          error
        );

        const mensaje =
          error.response?.data
            ?.message ||
          "No se pudieron consultar los horarios disponibles.";

        setError(
          mensaje
        );
      } finally {
        setCargandoDisponibilidad(
          false
        );
      }
    };

  /*
   * Si volvemos desde
   * "Tus datos" a este paso,
   * volvemos a consultar
   * la disponibilidad.
   */
  useEffect(() => {
    const cargarSeleccionPrevia =
      async () => {
        if (
          !reserva.fecha
            ?.fechaISO ||
          !reserva.barbero
            ?.id ||
          !reserva.servicio
            ?.id
        ) {
          return;
        }

        try {
          setCargandoDisponibilidad(
            true
          );

          /*
           * También enviamos
           * promocionId acá.
           */
          const disponibilidad =
            await obtenerDisponibilidad(
              {
                barberoId:
                  reserva
                    .barbero
                    .id,

                servicioId:
                  reserva
                    .servicio
                    .id,

                promocionId:
                  reserva
                    .promocion
                    ?.id ||
                  null,

                fecha:
                  reserva
                    .fecha
                    .fechaISO,
              }
            );

          setHorariosDisponibles(
            disponibilidad
              ?.horarios ||
              []
          );
        } catch (error) {
          console.error(
            error
          );
        } finally {
          setCargandoDisponibilidad(
            false
          );
        }
      };

    cargarSeleccionPrevia();
  }, [
    reserva.barbero?.id,
    reserva.servicio?.id,
    reserva.promocion?.id,
    reserva.fecha?.fechaISO,
  ]);

  const seleccionarHora = (
    hora
  ) => {
    setHoraSeleccionada(
      hora
    );
  };

  const continuar =
    () => {
      if (
        !fechaSeleccionada ||
        !horaSeleccionada
      ) {
        return;
      }

      onSeleccionarFechaHora(
        {
          fecha:
            fechaSeleccionada,

          hora:
            horaSeleccionada,
        }
      );
    };

  const mesAnterior =
    () => {
      const mesAnteriorFecha =
        new Date(
          mesVisible.getFullYear(),
          mesVisible.getMonth() -
            1,
          1
        );

      const inicioMesActual =
        new Date(
          hoy.getFullYear(),
          hoy.getMonth(),
          1
        );

      if (
        mesAnteriorFecha <
        inicioMesActual
      ) {
        return;
      }

      setMesVisible(
        mesAnteriorFecha
      );
    };

  const mesSiguiente =
    () => {
      setMesVisible(
        new Date(
          mesVisible.getFullYear(),
          mesVisible.getMonth() +
            1,
          1
        )
      );
    };

  const puedeRetrocederMes =
    !(
      mesVisible.getFullYear() ===
        hoy.getFullYear() &&
      mesVisible.getMonth() ===
        hoy.getMonth()
    );

  if (
    cargandoCalendario
  ) {
    return (
      <section className="paso-fecha-hora">
        <header className="paso-fecha-hora__header">
          <h1>
            Elegí fecha y hora
          </h1>

          <p>
            Cargando calendario...
          </p>
        </header>

        <div className="paso-fecha-hora__loading">
          <div
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          />

          <span>
            Consultando días
            de atención...
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="paso-fecha-hora">
      <header className="paso-fecha-hora__header">
        <h1>
          Elegí fecha y hora
        </h1>

        <p>
          Seleccioná cuándo
          querés reservar{" "}
          <strong>
            {reserva
              .promocion
              ?.titulo ||
              reserva
                .servicio
                ?.nombre}
          </strong>
          .
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="paso-fecha-hora__error"
        >
          {error}
        </div>
      )}

      <div className="paso-fecha-hora__layout">
        {/* CALENDARIO */}

        <div className="paso-fecha-hora__calendar-card">
          <div className="paso-fecha-hora__calendar-header">
            <button
              type="button"
              onClick={
                mesAnterior
              }
              disabled={
                !puedeRetrocederMes
              }
              aria-label="Mes anterior"
            >
              ‹
            </button>

            <h2>
              {
                NOMBRES_MESES[
                  mesVisible.getMonth()
                ]
              }{" "}
              {
                mesVisible.getFullYear()
              }
            </h2>

            <button
              type="button"
              onClick={
                mesSiguiente
              }
              aria-label="Mes siguiente"
            >
              ›
            </button>
          </div>

          <div className="paso-fecha-hora__weekdays">
            {DIAS_SEMANA.map(
              (
                dia
              ) => (
                <span
                  key={
                    dia
                  }
                >
                  {dia}
                </span>
              )
            )}
          </div>

          <div className="paso-fecha-hora__calendar-grid">
            {diasCalendario.map(
              (
                dia,
                indice
              ) => {
                if (
                  !dia
                ) {
                  return (
                    <div
                      key={`vacio-${indice}`}
                      className="paso-fecha-hora__calendar-empty"
                    />
                  );
                }

                const seleccionado =
                  fechaSeleccionada
                    ?.fechaISO ===
                  dia.fechaISO;

                const clases =
                  [
                    "paso-fecha-hora__day",

                    seleccionado
                      ? "paso-fecha-hora__day--selected"
                      : "",

                    dia.esPasado
                      ? "paso-fecha-hora__day--past"
                      : "",

                    !dia.esLaboral
                      ? "paso-fecha-hora__day--closed"
                      : "",
                  ]
                    .filter(
                      Boolean
                    )
                    .join(
                      " "
                    );

                return (
                  <button
                    key={
                      dia.fechaISO
                    }
                    type="button"
                    className={
                      clases
                    }
                    disabled={
                      !dia.habilitado
                    }
                    onClick={() =>
                      seleccionarFecha(
                        dia
                      )
                    }
                    aria-pressed={
                      seleccionado
                    }
                  >
                    {
                      dia.numeroDia
                    }
                  </button>
                );
              }
            )}
          </div>

          <div className="paso-fecha-hora__legend">
            <span>
              <i className="paso-fecha-hora__legend-dot paso-fecha-hora__legend-dot--available" />

              Disponible
            </span>

            <span>
              <i className="paso-fecha-hora__legend-dot paso-fecha-hora__legend-dot--selected" />

              Seleccionado
            </span>
          </div>
        </div>

        {/* HORARIOS */}

        <div className="paso-fecha-hora__hours-card">
          <div className="paso-fecha-hora__hours-header">
            <span>
              HORARIOS
            </span>

            <h2>
              {fechaSeleccionada
                ? fechaSeleccionada.textoCompleto
                : "Seleccioná un día"}
            </h2>
          </div>

          {!fechaSeleccionada && (
            <div className="paso-fecha-hora__hours-placeholder">
              <div className="paso-fecha-hora__hours-placeholder-icon">
                ◷
              </div>

              <strong>
                Elegí una fecha
              </strong>

              <p>
                Los horarios
                disponibles
                aparecerán acá.
              </p>
            </div>
          )}

          {fechaSeleccionada &&
            cargandoDisponibilidad && (
              <div className="paso-fecha-hora__hours-placeholder">
                <div
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />

                <p>
                  Consultando
                  disponibilidad...
                </p>
              </div>
            )}

          {fechaSeleccionada &&
            !cargandoDisponibilidad &&
            horariosDisponibles.length ===
              0 && (
              <div className="paso-fecha-hora__hours-placeholder">
                <div className="paso-fecha-hora__hours-placeholder-icon">
                  !
                </div>

                <strong>
                  No hay horarios
                  disponibles
                </strong>

                <p>
                  Elegí otra
                  fecha del
                  calendario.
                </p>
              </div>
            )}

          {fechaSeleccionada &&
            !cargandoDisponibilidad &&
            horariosDisponibles.length >
              0 && (
              <div className="paso-fecha-hora__hours-grid">
                {horariosDisponibles.map(
                  (
                    hora
                  ) => {
                    const seleccionado =
                      horaSeleccionada ===
                      hora;

                    return (
                      <button
                        key={
                          hora
                        }
                        type="button"
                        className={[
                          "paso-fecha-hora__hour",

                          seleccionado
                            ? "paso-fecha-hora__hour--selected"
                            : "",
                        ]
                          .filter(
                            Boolean
                          )
                          .join(
                            " "
                          )}
                        onClick={() =>
                          seleccionarHora(
                            hora
                          )
                        }
                      >
                        {
                          hora
                        }
                      </button>
                    );
                  }
                )}
              </div>
            )}
        </div>
      </div>

      {/* RESUMEN */}

      {fechaSeleccionada &&
        horaSeleccionada && (
          <div className="paso-fecha-hora__summary">
            <div>
              <span>
                {reserva
                  .promocion
                  ? "Promoción"
                  : "Servicio"}
              </span>

              <strong>
                {reserva
                  .promocion
                  ?.titulo ||
                  reserva
                    .servicio
                    ?.nombre}
              </strong>
            </div>

            <div>
              <span>
                Fecha
              </span>

              <strong>
                {
                  fechaSeleccionada.textoCompleto
                }
              </strong>
            </div>

            <div>
              <span>
                Hora
              </span>

              <strong>
                {
                  horaSeleccionada
                }
              </strong>
            </div>
          </div>
        )}

      <div className="paso-fecha-hora__actions">
        <button
          type="button"
          className="paso-fecha-hora__back"
          onClick={
            onVolver
          }
        >
          ← Atrás
        </button>

        <button
          type="button"
          className="paso-fecha-hora__continue"
          disabled={
            !fechaSeleccionada ||
            !horaSeleccionada
          }
          onClick={
            continuar
          }
        >
          Continuar
        </button>
      </div>
    </section>
  );
}

export default PasoFechaHora;