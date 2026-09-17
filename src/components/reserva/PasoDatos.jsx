import {
  useState,
} from "react";

import "./PasoDatos.css";

function PasoDatos({
  reserva,
  onContinuar,
  onVolver,
}) {
  const [
    formulario,
    setFormulario,
  ] = useState({
    nombre:
      reserva.cliente?.nombre ||
      "",

    telefono:
      reserva.cliente
        ?.telefono || "",
  });

  const [
    errores,
    setErrores,
  ] = useState({});

  const manejarCambio = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormulario(
      (
        formularioAnterior
      ) => ({
        ...formularioAnterior,
        [name]: value,
      })
    );

    setErrores(
      (
        erroresAnteriores
      ) => ({
        ...erroresAnteriores,
        [name]: "",
      })
    );
  };

  const validarFormulario =
    () => {
      const nuevosErrores =
        {};

      const nombre =
        formulario.nombre.trim();

      const telefonoLimpio =
        formulario.telefono.replace(
          /\D/g,
          ""
        );

      if (!nombre) {
        nuevosErrores.nombre =
          "El nombre es obligatorio.";
      } else if (
        nombre.length < 3
      ) {
        nuevosErrores.nombre =
          "El nombre debe tener al menos 3 caracteres.";
      }

      if (!telefonoLimpio) {
        nuevosErrores.telefono =
          "El número de celular es obligatorio.";
      } else if (
        telefonoLimpio.length <
        8
      ) {
        nuevosErrores.telefono =
          "Ingresá un número de celular válido.";
      } else if (
        telefonoLimpio.length >
        15
      ) {
        nuevosErrores.telefono =
          "El número de celular es demasiado largo.";
      }

      setErrores(
        nuevosErrores
      );

      return (
        Object.keys(
          nuevosErrores
        ).length === 0
      );
    };

  const manejarEnvio = (
    event
  ) => {
    event.preventDefault();

    if (
      !validarFormulario()
    ) {
      return;
    }

    onContinuar({
      nombre:
        formulario.nombre.trim(),

      telefono:
        formulario.telefono.replace(
          /\D/g,
          ""
        ),
    });
  };

  return (
    <section className="paso-datos">
      <header className="paso-datos__header">
        <h1 className="paso-datos__title">
          Tus datos
        </h1>

        <p className="paso-datos__description">
          Ingresá tu nombre y
          número de celular para
          completar la reserva.
        </p>
      </header>

      <form
        className="paso-datos__form"
        onSubmit={
          manejarEnvio
        }
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
            value={
              formulario.nombre
            }
            onChange={
              manejarCambio
            }
            placeholder="Ej: Carlos Gómez"
            autoComplete="name"
            className={[
              "paso-datos__input",

              errores.nombre
                ? "paso-datos__input--error"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-invalid={Boolean(
              errores.nombre
            )}
          />

          {errores.nombre && (
            <p className="paso-datos__error">
              {
                errores.nombre
              }
            </p>
          )}
        </div>

        <div className="paso-datos__field">
          <label
            htmlFor="telefono"
            className="paso-datos__label"
          >
            Celular / WhatsApp
          </label>

          <input
            id="telefono"
            name="telefono"
            type="tel"
            value={
              formulario.telefono
            }
            onChange={
              manejarCambio
            }
            placeholder="Ej: 3815555555"
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
            aria-invalid={Boolean(
              errores.telefono
            )}
          />

          {errores.telefono && (
            <p className="paso-datos__error">
              {
                errores.telefono
              }
            </p>
          )}

          <p className="paso-datos__help">
            Usaremos este número
            únicamente para
            identificar tu reserva
            y contactarte por tu
            turno.
          </p>
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
          <span
            aria-hidden="true"
          >
            ←
          </span>

          Atrás
        </button>
      </div>
    </section>
  );
}

export default PasoDatos;