import { api } from "./axios.api"

// fetch all service using react query
export const fetchServices = async () => {
    try {
        const res = await api.get("/services")
        return res.data;
    } catch (error) {
        console.log("error occur during fetching services", error);
        throw error; // re-throw so useQuery can catch it
    }
}

// create services
export const createServiceApi = async (data) => {
    const res = await api.post("/services", data);
    return res.data;
};

// delete service
export const deleteServiceApi = async (id) => {
    const res = await api.delete(`/services/${id}`);
    return res.data;
};


// update service
export const updateServiceApi = async ({ id, data }) => {
    console.log("API called with id:", id);
    const res = await api.put(`/services/${id}`, data)
    return res.data;
}


// fetch staff
export const fetchStaff = async () => {
    try {
        const res = await api.get("/staffs")
        return res.data;
    } catch (error) {
        console.log("error occur during fetching staff", error);
        throw error; // re-throw
    }
}

// fetch each staff detail
export const fetchIndividualStaff = async (id) => {
    if (!id) {
        throw new Error("Staff ID is required");
    }
    console.log("API called with id:", id);
    const res = await api.get(`/staffs/${id}`);
    return res.data;
};