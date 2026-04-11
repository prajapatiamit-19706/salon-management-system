import { UserCircle, Mail, Phone, Calendar, CalendarCheck } from "lucide-react";
import { DataTable } from "../components/DataTable";
// import { customers } from "../data/mockData";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomersApi } from "../../API/customer.api.js"
import { LoadingSpinner } from "../../components/LoadingSpinner";

export const Customers = () => {

  const token = localStorage.getItem("token");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const {
    data,
    isPending,
    error,
    refetch
  } = useQuery({
    queryKey: ["customers"],
    queryFn: () => fetchCustomersApi(token),
    staleTime: 5 * 60 * 1000,
  })

  const customers = data?.customers || [];

  console.log("customers", customers);


  if (isPending) return <LoadingSpinner />
  if (error)
    return (
      <div className="p-4">
        <p>Error: {error.message}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );


  const columns = [
    {
      header: "Customer",
      key: "name",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-text-invert text-[11px] font-bold shadow-sm">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="text-[12px] font-semibold text-text-heading">{row.name}</p>
            <p className="text-[10px] text-text-muted capitalize">{row.gender}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      key: "email",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Mail size={12} className="text-text-muted" />
          <span className="text-[12px] text-text-body">{row.email}</span>
        </div>
      ),
    },
    {
      header: "Phone",
      key: "phone",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Phone size={12} className="text-text-muted" />
          <span className="text-[12px] text-text-body">{row.phone}</span>
        </div>
      ),
    },
    {
      header: "Total Appointments",
      key: "totalAppointments",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <CalendarCheck size={12} className="text-primary" />
          <span className="text-[12px] font-semibold text-text-heading">{row.totalAppointments}</span>
        </div>
      ),
    },
    {
      header: "Last Visit",
      key: "lastVisit",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-text-muted" />
          <span className="text-[12px] text-text-body">{row.lastVisit ? formatDate(row.lastVisit) : "—"}</span>
        </div>
      ),
    },
    {
      header: "Joined",
      key: "createdAt",
      render: (row) => (
        <span className="text-[11px] text-text-muted">{formatDate(row.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-heading tracking-tight">Customers</h1>
          <p className="text-[13px] text-text-body mt-0.5">View and manage all registered users</p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-bg-panel border border-border-soft">
          <UserCircle size={16} className="text-primary" />
          <span className="text-[13px] font-semibold text-primary">{customers.length} Total</span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        searchPlaceholder="Search by name, email, or phone…"
        pageSize={10}
      />
    </div>
  );
};
