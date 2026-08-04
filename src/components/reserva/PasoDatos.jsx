import { useState } from "react";

import "./PasoDatos.css";

function PasoDatos({
  reserva,
  onContinuar,
  onVolver,
}) {
  const [formulario, setFormulario] = useState({
    nombre: reserva.cliente.nombre || "",
    telefono: reserva.cliente.telefono || "",
    observacion: reserva.cliente.observacion || "",
  });

  const [errores, setErrores] = useState({});

  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormulario((formularioAnterior) => ({
      ...formularioAnterior,
      [name]: value,
    }));

    setErrores((erroresAnteriores) => ({
      ...erroresAnteriores,
      [name]: "",
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    } else if (formulario.nombre.trim().length < 3) {
      nuevosErrores.nombre =
        "El nombre debe tener al menos 3 caracteres.";
    }

    const telefonoLimpio = formulario.telefono.replace(/\D/g, "");

    if (!telefonoLimpio) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    } else if (telefonoLimpio.length < 8) {
      nuevosErrores.telefono =
        "Ingresá un número de teléfono válido.";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (event) => {
    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    onContinuar({
      nombre: formulario.nombre.trim(),
      telefono: formulario.telefono.trim(),
      observacion: formulario.observacion.trim(),
    });
  };

  return (
    <section className="paso-datos">
      <header className="paso-datos__header">
        <h1 className="paso-datos__title">
          Tus datos
        </h1>

        <p className="paso-datos__description">
          Completá tus datos para continuar con la reserva.
        </p>
      </header>

      <form
        className="paso-datos__form"
        onSubmit={manejarEnvio}
        noValidate
      >
        <div className="paso-datos__field">
          <label
            htmlFor="nombre"
            className="paso-datos__label"
          >
            Nombre y apellido
          </label>

          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formulario.nombre}
            onChange={manejarCambio}
            placeholder="Ejemplo: Carlos Gómez"
            autoComplete="name"
            className={[
              "paso-datos__input",
              errores.nombre
                ? "paso-datos__input--error"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-invalid={Boolean(errores.nombre)}
            aria-describedby={
              errores.nombre ? "nombre-error" : undefined
            }
          />

          {errores.nombre && (
            <p
              id="nombre-error"
              className="paso-datos__error"
            >
              {errores.nombre}
            </p>
          )}
        </div>

        <div className="paso-datos__field">
          <label
            htmlFor="telefono"
            className="paso-datos__label"
          >
            Teléfono / WhatsApp
          </label>

          <input
            id="telefono"
            name="telefono"
            type="tel"
            value={formulario.telefono}
            onChange={manejarCambio}
            placeholder="Ejemplo: 3815555555"
            autoComplete="tel"
            inputMode="tel"
            className={[
              "paso-datos__input",
              errores.telefono
                ? "paso-datos__input--error"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-invalid={Boolean(errores.telefono)}
            aria-describedby={
              errores.telefono ? "telefono-error" : undefined
            }
          />

          {errores.telefono && (
            <p
              id="telefono-error"
              className="paso-datos__error"
            >
              {errores.telefono}
            </p>
          )}
        </div>

        <div className="paso-datos__field">
          <label
            htmlFor="observacion"
            className="paso-datos__label"
          >
            Observación
            <span className="paso-datos__optional">
              Opcional
            </span>
          </label>

          <textarea
            id="observacion"
            name="observacion"
            value={formulario.observacion}
            onChange={manejarCambio}
            placeholder="Información adicional para el barbero"
            rows="4"
            maxLength="500"
            className="paso-datos__textarea"
          />

          <span className="paso-datos__counter">
            {formulario.observacion.length}/500
          </span>
        </div>

        <button
          type="submit"
          className="paso-datos__continue-button"
        >
          Continuar
        </button>
      </form>

      <div className="paso-datos__actions">
        <button
          type="button"
          className="paso-datos__back-button"
          onClick={onVolver}
        >
          <span aria-hidden="true">←</span>
          Atrás
        </button>
      </div>
    </section>
  );
}

export default PasoDatos;