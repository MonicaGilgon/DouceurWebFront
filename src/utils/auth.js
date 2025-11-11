import axios from "axios";

// Instancia de axios sin interceptores para refrescar el token
const refreshApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json"
  }
});

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    const response = await refreshApi.post("/token/refresh/", { refresh: refreshToken });
    const newAccessToken = response.data.access;
    localStorage.setItem("access_token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/sign-in";
    throw error;
  }
};
