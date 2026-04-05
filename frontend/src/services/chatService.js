import api from "./api";

export async function submitInquiry(message) {
  const { data } = await api.post("/triage", { message });
  return data;
}

export async function getUserRecords() {
  const { data } = await api.get("/user/records");
  return data;
}
