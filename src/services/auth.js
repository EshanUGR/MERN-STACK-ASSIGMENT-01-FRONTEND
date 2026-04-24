import api from "./api";

export async function login(email, password) {
  const res = await api.post("/api/auth/signin", { email, password });
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
}
