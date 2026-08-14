import api from "../api/api.js";

export const iniciarSesionAdmin = async ({
  email,
  password,
}) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};