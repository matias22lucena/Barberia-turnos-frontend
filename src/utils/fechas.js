const nombresDias = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

const nombresDiasCortos = [
  "DOM",
  "LUN",
  "MAR",
  "MIÉ",
  "JUE",
  "VIE",
  "SÁB",
];

const nombresMesesCortos = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

export const convertirDiaJavaScriptADiaBaseDatos = (diaJavaScript) => {
  // JavaScript:
  // 0 domingo, 1 lunes, ..., 6 sábado.

  // Base de datos:
  // 1 lunes, 2 martes, ..., 7 domingo.
  return diaJavaScript === 0 ? 7 : diaJavaScript;
};

export const formatearFechaISO = (fecha) => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
};

export const formatearFechaCompleta = (fecha) => {
  const nombreDia = nombresDias[fecha.getDay()];
  const numeroDia = fecha.getDate();
  const mes = nombresMesesCortos[fecha.getMonth()];

  return `${nombreDia}, ${numeroDia} de ${mes}`;
};

export const generarProximasFechas = (cantidadDias = 14) => {
  const fechas = [];
  const hoy = new Date();

  hoy.setHours(0, 0, 0, 0);

  for (let indice = 0; indice < cantidadDias; indice += 1) {
    const fecha = new Date(hoy);

    fecha.setDate(hoy.getDate() + indice);

    fechas.push({
      fechaObjeto: fecha,
      fechaISO: formatearFechaISO(fecha),
      diaSemanaBaseDatos: convertirDiaJavaScriptADiaBaseDatos(
        fecha.getDay()
      ),
      nombreDiaCorto: nombresDiasCortos[fecha.getDay()],
      numeroDia: fecha.getDate(),
      mesCorto: nombresMesesCortos[fecha.getMonth()],
      textoCompleto: formatearFechaCompleta(fecha),
    });
  }

  return fechas;
};