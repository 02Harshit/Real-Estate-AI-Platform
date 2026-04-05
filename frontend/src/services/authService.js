import api from "./api";

export async function registerUser(payload) {
  const { data } = await api.post("/register", payload);
  return data;
}

export async function loginUser({ phoneNumber, password }) {
  const formData = new URLSearchParams();
  formData.append("username", phoneNumber);
  formData.append("password", password);

  const { data } = await api.post("/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return data;
}
