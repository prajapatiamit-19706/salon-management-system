import { useContext, useState } from "react";
import { Eye, XCircle, CheckCircle2, CalendarCheck } from "lucide-react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Modal, ConfirmDialog } from "../components/Modal";
import { appointments as allAppointments, minutesToTime } from "../data/mockData";
import toast from "react-hot-toast";
import { fetchAllAppointmentsApi } from "../../API/dashboard.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelAppointmentAdminApi, completeAppointmentAdminApi } from "../../API/appointment.api";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export const Appointments = () => {
  const [filter, setFilter] = useState("all");
  const [viewItem, setViewItem] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const token = localStorage.getItem("token");

  const queryClient = useQueryClient();

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => fetchAllAppointmentsApi(token),
    staleTime: 5 * 60 * 1000, // cache for 5 minutes   
  })

  const cancelMutation = useMutation({
    mutationFn: ({ id, token }) => cancelAppointmentAdminApi(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      toast.success("Appointment cancelled successfully");

    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete appointment");
    },
  })

  const completeMutation = useMutation({
    mutationFn: ({ id, token }) => completeAppointmentAdminApi(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      toast.success("Appointment marked completed ");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update service");
    },
  })

  const appointments = data?.appointments || [];

  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  const appts = Array.isArray(appointments) ? appointments : (appointments?.data ?? []);

  const filterTabs = [
    { label: "All", value: "all", count: appts.length },
    { label: "Booked", value: "booked", count: appts.filter((a) => a.status === "booked").length },
    { label: "Completed", value: "completed", count: appts.filter((a) => a.status === "completed").length },
    { label: "Cancelled", value: "cancelled", count: appts.filter((a) => a.status === "cancelled").length },
  ];


  const handleCancel = (apt) => {
    console.log("appointment id", apt._id);
    cancelMutation.mutate({ id: apt._id, token });
  };

  const handleComplete = (apt) => {
    completeMutation.mutate({ id: apt._id, token });
  };

  if (isPending) return <LoadingSpinner />
  if (isError)
    return (
      <div className="p-4">
        <p>Error: {error.message}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );


  const columns = [
    {
      header: "Customer",
      key: "customer",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-bg-panel flex items-center justify-center text-[11px] font-bold text-primary">
            {row.userId.name.charAt(0)}
          </div>
          <div>
            <p className="text-[12px] font-semibold text-text-heading">{row.userId.name}</p>
            <p className="text-[10px] text-text-muted">{row.userId.phone}</p>
          </div>
        </div>
      ),
      accessor: (row) => row.userId.name,
    },
    {
      header: "Service",
      key: "service",
      render: (row) => (
        <div>
          <p className="text-[12px] font-medium text-text-heading">{row.serviceId.name}</p>
          <p className="text-[10px] text-text-muted capitalize">{row.serviceId.category}</p>
        </div>
      ),
      accessor: (row) => row.serviceId.name,
    },
    {
      header: "Staff",
      key: "staff",
      render: (row) => <span className="text-[12px] text-text-body">{row.staffId.name}</span>,
      accessor: (row) => row.staffId.name,
    },
    {
      header: "Date",
      key: "date",
      render: (row) => <span className="text-[12px] text-text-heading font-medium">{formatDate(row.date)}</span>,
    },
    {
      header: "Time",
      key: "time",
      render: (row) => (
        <span className="text-[12px] text-text-body">
          {minutesToTime(row.startTime)} - {minutesToTime(row.endTime)}
        </span>
      ),
    },
    {
      header: "Price",
      key: "price",
      render: (row) => <span className="text-[12px] font-semibold text-text-heading">₹{row.price}</span>,
    },
    {
      header: "Status",
      key: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-heading tracking-tight">Appointments</h1>
          <p className="text-[13px] text-text-body mt-0.5">Manage and track all salon bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarCheck size={18} className="text-primary" />
          <span className="text-[13px] font-medium text-text-body">
            {appts?.filter((a) => a.status === "booked").length || 0} upcoming
          </span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search by customer, service, or staff…"
        filterTabs={filterTabs}
        activeFilter={filter}
        onFilterChange={setFilter}
        renderActions={(row) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewItem(row)}
              className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted hover:text-primary transition-colors"
              title="View details"
            >
              <Eye size={15} />
            </button>
            {row.status === "booked" && (
              <>
                <button
                  onClick={() =>
                    setConfirmAction({
                      item: row,
                      action: "complete",
                      title: "Mark as Completed",
                      message: `Mark appointment for ${row.userId.name} (${row.serviceId.name}) as completed?`,
                    })
                  }
                  className="p-1.5 rounded-lg hover:bg-emerald-50 text-text-muted hover:text-emerald-600 transition-colors"
                  title="Mark completed"
                >
                  <CheckCircle2 size={15} />
                </button>
                <button
                  onClick={() =>
                    setConfirmAction({
                      item: row,
                      action: "cancel",
                      title: "Cancel Appointment",
                      message: `Are you sure you want to cancel the appointment for ${row.userId.name}?`,
                    })
                  }
                  className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors"
                  title="Cancel appointment"
                >
                  <XCircle size={15} />
                </button>
              </>
            )}
          </div>
        )}
      />

      {/* ── View Details Modal ──────────────── */}
      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="Appointment Details" size="md">
        {viewItem && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <InfoBlock label="Customer" value={viewItem.userId.name} />
              <InfoBlock label="Email" value={viewItem.userId.email} />
              <InfoBlock label="Phone" value={viewItem.userId.phone} />
              <InfoBlock label="Service" value={viewItem.serviceId.name} />
              <InfoBlock label="Category" value={viewItem.serviceId.category} />
              <InfoBlock label="Staff" value={viewItem.staffId.name} />
              <InfoBlock label="Date" value={viewItem.date} />
              <InfoBlock label="Time" value={`${minutesToTime(viewItem.startTime)} - ${minutesToTime(viewItem.endTime)}`} />
              <InfoBlock label="Price" value={`₹${viewItem.price}`} />
              <div>
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mb-1">Status</p>
                <StatusBadge status={viewItem.status} />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Confirm Dialog ──────────────────── */}
      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction?.action === "cancel") handleCancel(confirmAction.item);
          if (confirmAction?.action === "complete") handleComplete(confirmAction.item);
        }}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmText={confirmAction?.action === "cancel" ? "Cancel Appointment" : "Mark Completed"}
        variant={confirmAction?.action === "cancel" ? "danger" : "success"}
      />
    </div>
  );
};

const InfoBlock = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mb-1">{label}</p>
    <p className="text-[13px] text-text-heading font-medium capitalize">{value}</p>
  </div>
);
