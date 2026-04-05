import api from "./api";

export async function getAdminRecords() {
  const { data } = await api.get("/admin/records");
  return data;
}

export async function updateInquiryStatus(recordId, status) {
  const { data } = await api.patch(`/admin/records/${recordId}/status`, { status });
  return data;
}
