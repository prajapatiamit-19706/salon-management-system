import { api } from "./axios.api";

// Upload a single image
export const uploadImageApi = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Upload a single video
export const uploadVideoApi = async (file) => {
  const formData = new FormData();
  formData.append("video", file);

  const res = await api.post("/upload/video", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Delete media by public_id
export const deleteMediaApi = async (publicId) => {
  const res = await api.delete(`/upload/${encodeURIComponent(publicId)}`);
  return res.data;
};
