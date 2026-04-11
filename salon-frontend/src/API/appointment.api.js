import { api } from "./axios.api";


// book appointment 
export const bookAppointmentApi = async (data, token) => {
  const res = await api.post("/appointments/book", data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
}

// fetch slots
export const fetchAvailableSlots = async (
  serviceId,
  staffId,
  date
) => {
  const res = await api.get("/appointments/available-slots", {
    params: { serviceId, staffId, date }
  });

  return res.data.slots;
};

// cancel appointment 
export const cancelAppointmentApi = async (id, token) => {

  const res = await api.patch(
    `/appointments/cancel/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return res.data;
}


// for admin dashboard

// cancel appointment admin
export const cancelAppointmentAdminApi = async (id, token) => {
  const res = await api.patch(
    `admin/appointments/${id}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return res.data;
}

// mark completed 
export const completeAppointmentAdminApi = async (id, token) => {
  const res = await api.patch(
    `admin/appointments/${id}/complete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return res.data;
}