import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  actualizarServicioAdmin,
  obtenerServiciosAdmin,
} from "../services/adminServicios.service.js";

import "./AdminServiciosPage.css";

function AdminServiciosPage() {
  const navigate = useNavigate();

  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [guardandoId, setGuardandoId] = useState(null);

  const cargarServicios = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await obtenerServiciosAdmin();

      setServicios(respuesta.data || []);
    } catch (error) {
      const mensaje =
        error.response?.data?.message ||
        "No se pudieron cargar los servicios.";

      setError(mensaje);

      if (error.response?.status === 401) {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminUsuario");

        navigate("/admin/login");
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  const manejarCambio = (
    servicioId,
    campo,
    valor
  ) => {
    setServicios((anteriores) =>
      anteriores.map((servicio) =>
        servicio.id === servicioId
          ? {
              ...servicio,
              [campo]: valor,
            }
          : servicio
      )
    );
  };

  const guardarServicio = async (servicio) => {
    try {
      setGuardandoId(servicio.id);
      setError("");

      const respuesta =
        await actualizarServicioAdmin({
          servicioId: servicio.id,
          nombre: servicio.nombre,
          descripcion:
            servicio.descripcion || "",
          duracionMinutos: Number(
            servicio.duracionMinutos
          ),
          precio: Number(servicio.precio),
          activo: Boolean(servicio.activo),
        });

      const actualizado = respuesta.data;

      setServicios((anteriores) =>
        anteriores.map((item) =>
          item.id === actualizado.id
            ? actualizado
            : item
        )
      );
    } catch (error) {
      const mensaje =
        error.response?.data?.message ||
        "No se pudo actualizar el servicio.";

      setError(mensaje);
    } finally {
      setGuardandoId(null);
    }
  };

  return (
    <main className="admin-servicios-page">
      <header className="admin-servicios-header">
        <button
          type="button"
          className="admin-servicios-volver"
          onClick={() => navigate("/admin")}
        >
          ← Volver al panel
        </button>

        <p className="admin-servicios-eyebrow">
          Administración
        </p>

        <h1>Servicios</h1>

        <p>
          Modificá precios, duración,
          descripción y disponibilidad.
        </p>
      </header>

      {error && (
        <div className="admin-servicios-error">
          {error}
        </div>
      )}

      {cargando ? (
        <div className="admin-servicios-estado">
          Cargando servicios...
        </div>
      ) : (
        <section className="admin-servicios-lista">
          {servicios.map((servicio) => (
            <article
              key={servicio.id}
              className="admin-servicio-card"
            >
              <div className="admin-servicio-top">
                <div>
                  <span>
                    Servicio #{servicio.id}
                  </span>

                  <h2>{servicio.nombre}</h2>
                </div>

                <label className="admin-servicio-switch">
                  <input
                    type="checkbox"
                    checked={Boolean(servicio.activo)}
                    onChange={(event) =>
                      manejarCambio(
                        servicio.id,
                        "activo",
                        event.target.checked
                      )
                    }
                  />

                  <span>
                    {servicio.activo
                      ? "Activo"
                      : "Inactivo"}
                  </span>
                </label>
              </div>

              <div className="admin-servicio-form">
                <div className="admin-servicio-campo">
                  <label>Nombre</label>

                  <input
                    type="text"
                    value={servicio.nombre}
                    onChange={(event) =>
                      manejarCambio(
                        servicio.id,
                        "nombre",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="admin-servicio-campo admin-servicio-campo--completo">
                  <label>Descripción</label>

                  <textarea
                    value={
                      servicio.descripcion || ""
                    }
                    onChange={(event) =>
                      manejarCambio(
                        servicio.id,
                        "descripcion",
                        event.target.value
                      )
                    }
                    maxLength={255}
                  />
                </div>

                <div className="admin-servicio-campo">
                  <label>
                    Duración (minutos)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      servicio.duracionMinutos
                    }
                    onChange={(event) =>
                      manejarCambio(
                        servicio.id,
                        "duracionMinutos",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="admin-servicio-campo">
                  <label>Precio</label>

                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={servicio.precio}
                    onChange={(event) =>
                      manejarCambio(
                        servicio.id,
                        "precio",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              <button
                type="button"
                className="admin-servicio-guardar"
                disabled={
                  guardandoId === servicio.id
                }
                onClick={() =>
                  guardarServicio(servicio)
                }
              >
                {guardandoId === servicio.id
                  ? "Guardando..."
                  : "Guardar cambios"}
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default AdminServiciosPage;