import { api } from "./axios.api.js";


export const fetchUserDashboard = async (token) => {
    const res = await api.get("/dashboard/user", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data;
}

export const fetchAllAppointmentsApi = async (token) => {
    const res = await api.get("/admin/appointments", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data;
}

export const fetchAdminDashboardApi = async (token) => {
    const res = await api.get("/admin/dashboard", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data;
}

export const updateProfileApi = async (token, data) => {
    const res = await api.put("/dashboard/user", data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data;
}