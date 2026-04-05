import api from "./api";

export async function getProperties() {
  const { data } = await api.get("/properties/");
  return data;
}

export async function getPropertyById(propertyId) {
  const { data } = await api.get(`/properties/${propertyId}`);
  return data;
}

export async function createProperty(formData) {
  const { data } = await api.post("/properties/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function deleteProperty(propertyId) {
  const { data } = await api.delete(`/properties/${propertyId}`);
  return data;
}
