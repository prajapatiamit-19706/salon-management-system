import { api } from "./axios.api.js"

export const fetchCustomersApi = async (token) => {
    const res = await api.get("/admin/customers", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data;
}