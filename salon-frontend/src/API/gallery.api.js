import { api } from "./axios.api";

// Fetch all gallery items
export const fetchGalleryApi = async () => {
  const res = await api.get("/gallery");
  return res.data;
};

// Add gallery item (file upload via FormData)
export const addGalleryItemApi = async ({ file, title }) => {
  const formData = new FormData();
  formData.append("media", file);
  if (title) formData.append("title", title);

  const res = await api.post("/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Delete gallery item by ID
export const deleteGalleryItemApi = async (id) => {
  const res = await api.delete(`/gallery/${id}`);
  return res.data;
};
