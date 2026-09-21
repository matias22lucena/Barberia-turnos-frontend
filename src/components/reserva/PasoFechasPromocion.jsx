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

import "./PasoFechasPromocion.css";

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

const normalizarFecha = (
  fecha
) => {
  return new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate()
  );
};

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

const crearFechaDesdeISO = (
  fechaISO
) => {
  if (!fechaISO) {
    return null;
  }

  const [
    anio,
    mes,
    dia,
  ] = fechaISO
    .split("-")
    .map(Number);

  return new Date(
    anio,
    mes - 1,
    dia
  );
};

function PasoFechasPromocion({
  reserva,
  onContinuar,
  onVolver,
}) {
  const cantidad =
    Number(
      reserva.promocion
        ?.cantidadServicios ||
        1
    );

  const hoy =
    useMemo(
      () =>
        normalizarFecha(
          new Date()
        ),
      []
    );

  const turnosIniciales =
    useMemo(() => {
      return Array.from(
        {
          length:
            cantidad,
        },
        (
          _,
          indice
        ) => {
          const anterior =
            reserva
              .turnosPromocion
              ?.[indice];

          return {
            fecha:
              anterior?.fecha ||
              null,

            hora:
              anterior?.hora ||
              null,
          };
        }
      );
    }, [
      cantidad,
      reserva.turnosPromocion,
    ]);

  const primerTurnoPendiente =
    useMemo(() => {
      const indice =
        turnosIniciales.findIndex(
          (
            turno
          ) =>
            !turno.fecha ||
            !turno.hora
        );

      return indice === -1
        ? 0
        : indice;
    }, [
      turnosIniciales,
    ]);

  const [
    turnos,
    setTurnos,
  ] = useState(
    turnosIniciales
  );

  const [
    turnoActivo,
    setTurnoActivo,
  ] = useState(
    primerTurnoPendiente
  );

  const [
    modoRevision,
    setModoRevision,
  ] = useState(
    turnosIniciales.every(
      (
        turno
      ) =>
        turno.fecha
          ?.fechaISO &&
        turno.hora
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
    turnosIniciales[
      primerTurnoPendiente
    ]?.fecha ||
      null
  );

  const [
    horaSeleccionada,
    setHoraSeleccionada,
  ] = useState(
    turnosIniciales[
      primerTurnoPendiente
    ]?.hora ||
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

  const [
    mesVisible,
    setMesVisible,
  ] = useState(() => {
    const fechaGuardada =
      turnosIniciales[
        primerTurnoPendiente
      ]?.fecha?.fechaISO;

    const fechaInicial =
      fechaGuardada
        ? crearFechaDesdeISO(
            fechaGuardada
          )
        : hoy;

    return new Date(
      fechaInicial.getFullYear(),
      fechaInicial.getMonth(),
      1
    );
  });

  useEffect(() => {
    const cargarHorarios =
      async () => {
        const barberoId =
          reserva.barbero
            ?.id;

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
        } catch (
          error
        ) {
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
    reserva.barbero
      ?.id,
  ]);

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

        const fechaISO =
          formatearFechaISO(
            fecha
          );

        const usadoPorOtroTurno =
          turnos.some(
            (
              turno,
              indice
            ) =>
              indice !==
                turnoActivo &&
              turno.fecha
                ?.fechaISO ===
                fechaISO
          );

        dias.push({
          fecha,
          fechaISO,
          numeroDia,
          esPasado,
          esLaboral,
          usadoPorOtroTurno,

          habilitado:
            !esPasado &&
            esLaboral &&
            !usadoPorOtroTurno,
        });
      }

      return dias;
    }, [
      mesVisible,
      hoy,
      diasLaborales,
      turnos,
      turnoActivo,
    ]);

  const consultarDisponibilidad =
    async (
      fechaReserva
    ) => {
      if (
        !fechaReserva
          ?.fechaISO
      ) {
        setHorariosDisponibles(
          []
        );

        return;
      }

      try {
        setCargandoDisponibilidad(
          true
        );

        setError("");

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
                  .id,

              fecha:
                fechaReserva
                  .fechaISO,
            }
          );

        setHorariosDisponibles(
          disponibilidad
            ?.horarios ||
            []
        );
      } catch (
        error
      ) {
        console.error(
          error
        );

        setHorariosDisponibles(
          []
        );

        setError(
          error.response
            ?.data
            ?.message ||
            "No se pudieron consultar los horarios disponibles."
        );
      } finally {
        setCargandoDisponibilidad(
          false
        );
      }
    };

  useEffect(() => {
    if (
      fechaSeleccionada
        ?.fechaISO &&
      !modoRevision
    ) {
      consultarDisponibilidad(
        fechaSeleccionada
      );
    }
  }, []);

  const seleccionarFecha =
    async (
      dia
    ) => {
      if (
        !dia
          ?.habilitado
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

      await consultarDisponibilidad(
        nuevaFecha
      );
    };

  const activarTurno =
    async (
      indice,
      listaTurnos =
        turnos
    ) => {
      const turno =
        listaTurnos[
          indice
        ];

      setModoRevision(
        false
      );

      setTurnoActivo(
        indice
      );

      setError("");

      setFechaSeleccionada(
        turno?.fecha ||
          null
      );

      setHoraSeleccionada(
        turno?.hora ||
          null
      );

      setHorariosDisponibles(
        []
      );

      if (
        turno?.fecha
          ?.fechaISO
      ) {
        const fecha =
          crearFechaDesdeISO(
            turno.fecha
              .fechaISO
          );

        setMesVisible(
          new Date(
            fecha.getFullYear(),
            fecha.getMonth(),
            1
          )
        );

        await consultarDisponibilidad(
          turno.fecha
        );
      }
    };

  const seleccionarHora = (
    hora
  ) => {
    if (
      !fechaSeleccionada
    ) {
      return;
    }

    setHoraSeleccionada(
      hora
    );

    setError("");

    const nuevosTurnos =
      turnos.map(
        (
          turno,
          indice
        ) =>
          indice ===
          turnoActivo
            ? {
                fecha:
                  fechaSeleccionada,

                hora,
              }
            : turno
      );

    setTurnos(
      nuevosTurnos
    );

    const todosListos =
      nuevosTurnos.every(
        (
          turno
        ) =>
          turno.fecha
            ?.fechaISO &&
          turno.hora
      );

    if (
      todosListos
    ) {
      setTimeout(
        () => {
          setModoRevision(
            true
          );

          setFechaSeleccionada(
            null
          );

          setHoraSeleccionada(
            null
          );

          setHorariosDisponibles(
            []
          );
        },
        120
      );

      return;
    }

    const siguientePendiente =
      nuevosTurnos.findIndex(
        (
          turno,
          indice
        ) =>
          indice >
            turnoActivo &&
          (
            !turno.fecha ||
            !turno.hora
          )
      );

    if (
      siguientePendiente !==
      -1
    ) {
      setTimeout(
        () => {
          activarTurno(
            siguientePendiente,
            nuevosTurnos
          );
        },
        120
      );

      return;
    }

    const pendienteAnterior =
      nuevosTurnos.findIndex(
        (
          turno
        ) =>
          !turno.fecha ||
          !turno.hora
      );

    if (
      pendienteAnterior !==
      -1
    ) {
      setTimeout(
        () => {
          activarTurno(
            pendienteAnterior,
            nuevosTurnos
          );
        },
        120
      );
    }
  };

  const mesAnterior =
    () => {
      const nuevaFecha =
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
        nuevaFecha <
        inicioMesActual
      ) {
        return;
      }

      setMesVisible(
        nuevaFecha
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

  const todosCompletos =
    turnos.every(
      (
        turno
      ) =>
        turno.fecha
          ?.fechaISO &&
        turno.hora
    );

  const continuar =
    () => {
      if (
        !todosCompletos
      ) {
        setError(
          `Debés completar los ${cantidad} cortes antes de continuar.`
        );

        return;
      }

      const fechas =
        turnos.map(
          (
            turno
          ) =>
            turno.fecha
              .fechaISO
        );

      if (
        new Set(
          fechas
        ).size !==
        fechas.length
      ) {
        setError(
          "Cada corte debe reservarse en un día diferente."
        );

        return;
      }

      onContinuar(
        turnos.map(
          (
            turno
          ) => ({
            fecha:
              turno.fecha,

            hora:
              turno.hora,
          })
        )
      );
    };

  if (
    cargandoCalendario
  ) {
    return (
      <section className="paso-fechas-promo">
        <header className="paso-fechas-promo__header">
          <h1>
            Elegí tus turnos
          </h1>

          <p>
            Cargando calendario...
          </p>
        </header>

        <div className="paso-fechas-promo__loading">
          <div
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          />

          <span>
            Consultando días de atención...
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="paso-fechas-promo">
      <header className="paso-fechas-promo__header">
        <span className="paso-fechas-promo__eyebrow">
          PROMO MENSUAL
        </span>

        <h1>
          {modoRevision
            ? "Revisá tus turnos"
            : `Elegí tus ${cantidad} turnos`}
        </h1>

        <p>
          {modoRevision
            ? "Ya seleccionaste todos los turnos. Revisalos antes de continuar."
            : (
              <>
                Seleccioná el día
                y horario de cada
                visita para{" "}
                <strong>
                  {
                    reserva
                      .promocion
                      ?.titulo
                  }
                </strong>
                .
              </>
            )}
        </p>
      </header>

      {/* SELECTOR SUPERIOR */}

      <div className="paso-fechas-promo__selector">
        {turnos.map(
          (
            turno,
            indice
          ) => {
            const completo =
              Boolean(
                turno.fecha &&
                turno.hora
              );

            const activo =
              !modoRevision &&
              indice ===
                turnoActivo;

            return (
              <button
                key={
                  indice
                }
                type="button"
                className={[
                  "paso-fechas-promo__selector-item",

                  activo
                    ? "paso-fechas-promo__selector-item--active"
                    : "",

                  completo
                    ? "paso-fechas-promo__selector-item--completed"
                    : "",
                ]
                  .filter(
                    Boolean
                  )
                  .join(
                    " "
                  )}
                onClick={() =>
                  activarTurno(
                    indice
                  )
                }
              >
                <span>
                  {completo
                    ? "✓"
                    : indice +
                      1}
                </span>

                <div className="paso-fechas-promo__selector-text">
                  <strong>
                    Corte{" "}
                    {indice +
                      1}
                  </strong>

                  {completo && (
                    <small>
                      Editar
                    </small>
                  )}
                </div>
              </button>
            );
          }
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="paso-fechas-promo__error"
        >
          {error}
        </div>
      )}

      {!modoRevision && (
        <div className="paso-fechas-promo__layout">
          {/* CALENDARIO */}

          <div className="paso-fechas-promo__calendar-card">
            <div className="paso-fechas-promo__calendar-header">
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

            <div className="paso-fechas-promo__weekdays">
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

            <div className="paso-fechas-promo__calendar-grid">
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
                        className="paso-fechas-promo__calendar-empty"
                      />
                    );
                  }

                  const seleccionado =
                    fechaSeleccionada
                      ?.fechaISO ===
                    dia.fechaISO;

                  const clases = [
                    "paso-fechas-promo__day",

                    seleccionado
                      ? "paso-fechas-promo__day--selected"
                      : "",

                    dia.esPasado
                      ? "paso-fechas-promo__day--past"
                      : "",

                    !dia.esLaboral
                      ? "paso-fechas-promo__day--closed"
                      : "",

                    dia.usadoPorOtroTurno
                      ? "paso-fechas-promo__day--used"
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
                        !dia.habilitado &&
                        !seleccionado
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

            <div className="paso-fechas-promo__legend">
              <span>
                <i className="paso-fechas-promo__legend-dot paso-fechas-promo__legend-dot--available" />
                Disponible
              </span>

              <span>
                <i className="paso-fechas-promo__legend-dot paso-fechas-promo__legend-dot--selected" />
                Seleccionado
              </span>

              <span>
                <i className="paso-fechas-promo__legend-dot paso-fechas-promo__legend-dot--used" />
                Otro corte
              </span>
            </div>
          </div>

          {/* HORARIOS */}

          <div className="paso-fechas-promo__hours-card">
            <div className="paso-fechas-promo__hours-header">
              <span>
                HORARIOS · CORTE{" "}
                {turnoActivo +
                  1}
              </span>

              <h2>
                {fechaSeleccionada
                  ? fechaSeleccionada
                      .textoCompleto
                  : "Seleccioná un día"}
              </h2>
            </div>

            {!fechaSeleccionada && (
              <div className="paso-fechas-promo__hours-placeholder">
                <div className="paso-fechas-promo__hours-placeholder-icon">
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
                <div className="paso-fechas-promo__hours-placeholder">
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
                <div className="paso-fechas-promo__hours-placeholder">
                  <div className="paso-fechas-promo__hours-placeholder-icon">
                    !
                  </div>

                  <strong>
                    No hay horarios
                    disponibles
                  </strong>

                  <p>
                    Elegí otra fecha
                    del calendario.
                  </p>
                </div>
              )}

            {fechaSeleccionada &&
              !cargandoDisponibilidad &&
              horariosDisponibles.length >
                0 && (
                <div className="paso-fechas-promo__hours-grid">
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
                            "paso-fechas-promo__hour",

                            seleccionado
                              ? "paso-fechas-promo__hour--selected"
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
      )}

      {/* REVISIÓN / RESUMEN */}

      <section
        className={[
          "paso-fechas-promo__summary",

          modoRevision
            ? "paso-fechas-promo__summary--review"
            : "",
        ]
          .filter(
            Boolean
          )
          .join(
            " "
          )}
      >
        <div className="paso-fechas-promo__summary-header">
          <div>
            <span>
              {modoRevision
                ? "TODO LISTO"
                : "TU PROMOCIÓN"}
            </span>

            <h2>
              Turnos seleccionados
            </h2>
          </div>

          <strong>
            {
              turnos.filter(
                (
                  turno
                ) =>
                  turno.fecha &&
                  turno.hora
              ).length
            }
            {" / "}
            {cantidad}
          </strong>
        </div>

        <div className="paso-fechas-promo__summary-list">
          {turnos.map(
            (
              turno,
              indice
            ) => {
              const completo =
                Boolean(
                  turno.fecha &&
                    turno.hora
                );

              return (
                <button
                  key={
                    indice
                  }
                  type="button"
                  className={[
                    "paso-fechas-promo__summary-row",

                    completo
                      ? "paso-fechas-promo__summary-row--completed"
                      : "",
                  ]
                    .filter(
                      Boolean
                    )
                    .join(
                      " "
                    )}
                  onClick={() =>
                    activarTurno(
                      indice
                    )
                  }
                >
                  <span className="paso-fechas-promo__summary-number">
                    {completo
                      ? "✓"
                      : indice +
                        1}
                  </span>

                  <div>
                    <strong>
                      Corte{" "}
                      {indice +
                        1}
                    </strong>

                    <span>
                      {completo
                        ? `${turno.fecha.textoCompleto} · ${turno.hora} hs`
                        : "Pendiente de seleccionar"}
                    </span>
                  </div>

                  <span className="paso-fechas-promo__summary-edit">
                    {completo
                      ? "Editar"
                      : "Elegir"}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </section>

      <div className="paso-fechas-promo__actions">
        <button
          type="button"
          className="paso-fechas-promo__back"
          onClick={
            onVolver
          }
        >
          ← Atrás
        </button>

        <button
          type="button"
          className="paso-fechas-promo__continue"
          disabled={
            !todosCompletos
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

export default PasoFechasPromocion;