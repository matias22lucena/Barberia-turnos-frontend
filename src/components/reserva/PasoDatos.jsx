import { useState } from "react";

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
    <section>
      <h1>Tus datos</h1>

      <p>
        Completá tus datos para continuar con la reserva.
      </p>

      <form
        onSubmit={manejarEnvio}
        style={{
          display: "grid",
          gap: "18px",
          marginTop: "28px",
        }}
      >
        <div>
          <label
            htmlFor="nombre"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
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
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: errores.nombre
                ? "1px solid #b94a48"
                : "1px solid #3d3733",
              backgroundColor: "#151311",
              color: "#f5f5f5",
            }}
          />

          {errores.nombre && (
            <p
              style={{
                color: "#ff8f8f",
                marginTop: "6px",
              }}
            >
              {errores.nombre}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="telefono"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
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
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: errores.telefono
                ? "1px solid #b94a48"
                : "1px solid #3d3733",
              backgroundColor: "#151311",
              color: "#f5f5f5",
            }}
          />

          {errores.telefono && (
            <p
              style={{
                color: "#ff8f8f",
                marginTop: "6px",
              }}
            >
              {errores.telefono}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="observacion"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Observación
          </label>

          <textarea
            id="observacion"
            name="observacion"
            value={formulario.observacion}
            onChange={manejarCambio}
            placeholder="Información adicional para el barbero"
            rows="4"
            style={{
              width: "100%",
              padding: "12px",
              resize: "vertical",
              borderRadius: "8px",
              border: "1px solid #3d3733",
              backgroundColor: "#151311",
              color: "#f5f5f5",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "13px 18px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#f0b23e",
            color: "#111",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Continuar
        </button>
      </form>

      <button
        type="button"
        onClick={onVolver}
        style={{
          marginTop: "22px",
          padding: "10px 18px",
          cursor: "pointer",
        }}
      >
        ← Atrás
      </button>
    </section>
  );
}

export default PasoDatos;