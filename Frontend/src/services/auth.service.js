
import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  const body = response.data;
  const data = body?.data ?? body;

  const accessToken = data?.accessToken;
  const user = data?.user ?? data?.loggedInUser;

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }

  if (user && typeof user === "object") {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  return body;
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
  }
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
