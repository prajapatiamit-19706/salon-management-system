import { api } from "./axios.api";

export const createBillApi = async (data, token) => {
    const response = await api.post("/bill", data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const getBillApi = async () => {
    const res = await api.get("/bill/payments");
    return res.data.bill;
}