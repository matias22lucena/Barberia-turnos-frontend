import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { iniciarSesionAdmin } from "../services/auth.service.js";

import "./AdminLoginPage.css";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const manejarSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError(
        "Ingresá el email y la contraseña."
      );
      return;
    }

    try {
      setCargando(true);

      const respuesta =
        await iniciarSesionAdmin({
          email,
          password,
        });

      const token = respuesta?.data?.token;
      const administrador =
        respuesta?.data?.administrador;

      if (!token) {
        throw new Error(
          "El servidor no devolvió un token."
        );
      }

      sessionStorage.setItem(
        "adminToken",
        token
      );

      sessionStorage.setItem(
        "adminUsuario",
        JSON.stringify(administrador)
      );

      navigate("/admin");
    } catch (error) {
      const mensaje =
        error.response?.data?.message ||
        error.message ||
        "No se pudo iniciar sesión.";

      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <img
            src="/logo-barberia.png"
            alt="Pitbull Barber Shop"
            className="admin-login-logo"
          />

          <span>Pitbull Barber Shop</span>
        </div>

        <div className="admin-login-heading">
          <p className="admin-login-eyebrow">
            Administración
          </p>

          <h1>Panel del propietario</h1>

          <p>
            Ingresá tus credenciales para
            administrar la barbería.
          </p>
        </div>

        <form
          className="admin-login-form"
          onSubmit={manejarSubmit}
        >
          <div className="admin-login-field">
            <label htmlFor="admin-email">
              Email
            </label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@barberia.com"
              autoComplete="email"
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">
              Contraseña
            </label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Ingresá tu contraseña"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={cargando}
          >
            {cargando
              ? "Ingresando..."
              : "Iniciar sesión"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLoginPage;