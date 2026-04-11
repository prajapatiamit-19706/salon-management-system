import { api } from "./axios.api";

export const getAllStaffApi = async () => {
    const res = await api.get("/admin/staffs");
    return res.data;
}

// create new staff
export const createStaffApi = async (data) => {
    const res = await api.post("/admin/staffs", data);
    return res.data;
}

// remove staff api
export const removeStaffApi = async (id) => {
    const res = await api.delete(`/admin/staffs/${id}`);
    return res.data;
}

// update staff api
export const updateStaffApi = async ({ id, data }) => {
    const res = await api.put(`/admin/staffs/${id}`, data);
    return res.data;
}