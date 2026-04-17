import { useState } from "react";
import { IndianRupee, Download } from "lucide-react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { getBillApi } from "../../API/bill.api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import { payments as allPayments } from "../data/mockData";

export const Payments = () => {
  const [filter, setFilter] = useState("all");

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };


  const {
    data: allPayments = [],
    isPending,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["payments"],
    queryFn: getBillApi,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes   
  })


  const filtered = filter === "all" ? allPayments : allPayments.filter((p) => p.status === filter);

  const totalRevenue = allPayments.filter((p) => p.status === "paid").reduce((acc, p) => acc + p.amount, 0);
  const pendingAmount = allPayments.filter((p) => p.status === "pending").reduce((acc, p) => acc + p.amount, 0);
  const refundedAmount = allPayments.filter((p) => p.status === "refunded").reduce((acc, p) => acc + p.amount, 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyRevenue = allPayments
    .filter((p) => p.status === "paid" && new Date(p.date).getMonth() === currentMonth && new Date(p.date).getFullYear() === currentYear)
    .reduce((acc, p) => acc + p.amount, 0);

  const yearlyRevenue = allPayments
    .filter((p) => p.status === "paid" && new Date(p.date).getFullYear() === currentYear)
    .reduce((acc, p) => acc + p.amount, 0);

  const filterTabs = [
    { label: "All", value: "all", count: allPayments.length },
    { label: "Completed", value: "completed", count: allPayments.filter((p) => p.status === "paid").length },
    { label: "Pending", value: "pending", count: allPayments.filter((p) => p.status === "pending").length },
    { label: "Refunded", value: "refunded", count: allPayments.filter((p) => p.status === "refunded").length },
  ];

  const handleExport = () => {
    if (!filtered || filtered.length === 0) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Payments Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Filter: ${filter.toUpperCase()} | Date: ${formatDate(new Date())}`, 14, 22);

    doc.text(`Total Revenue: Rs. ${totalRevenue.toLocaleString()}`, 14, 28);
    doc.text(`Monthly Revenue: Rs. ${monthlyRevenue.toLocaleString()}`, 70, 28);
    doc.text(`Yearly Revenue: Rs. ${yearlyRevenue.toLocaleString()}`, 130, 28);

    const tableColumn = ["Customer", "Service", "Amount", "Method", "Status", "Date"];
    const tableRows = [];

    filtered.forEach(row => {
      const rowData = [
        row.customer || "-",
        row.service || "-",
        `Rs. ${row.amount || 0}`,
        row.method || "-",
        row.status || "-",
        formatDate(row.date)
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 34,
      theme: 'grid',
      headStyles: { fillColor: [11, 53, 88] }
    });

    doc.save(`payments_report_${filter}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const columns = [
    {
      header: "Customer",
      key: "customer",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-text-invert text-[10px] font-bold">
            {row.customer.charAt(0)}
          </div>
          <span className="text-[12px] font-medium text-text-heading">{row.customer}</span>
        </div>
      ),
    },
    {
      header: "Service",
      key: "service",
      render: (row) => <span className="text-[12px] text-text-body">{row.service}</span>,
    },
    {
      header: "Amount",
      key: "amount",
      render: (row) => (
        <div className="flex items-center gap-1">
          <IndianRupee size={12} className="text-text-body" />
          <span className="text-[12px] font-semibold text-text-heading">{row.amount.toLocaleString()}</span>
        </div>
      ),
    },
    {
      header: "Method",
      key: "method",
      render: (row) => (
        <span className={`text-[11px] px-2.5 py-1 rounded-lg font-medium
          ${row.method === "UPI" ? "bg-bg-panel text-primary" : row.method === "Card" ? "bg-bg-soft text-primary-soft" : "bg-emerald-50 text-emerald-600"}
        `}>
          {row.method}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Date",
      key: "date",
      render: (row) => <span className="text-[12px] text-text-body">{formatDate(row.date)}</span>,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-heading tracking-tight">Payments</h1>
          <p className="text-[13px] text-text-body mt-0.5">Track all payment transactions</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-main border border-border-soft text-[13px] font-medium text-text-body hover:bg-bg-soft transition-colors shadow-soft"
        >
          <Download size={15} />
          Export Report
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="emerald" />
        <SummaryCard label="Pending Amount" value={`₹${pendingAmount.toLocaleString()}`} color="primary" />
        <SummaryCard label="Total Refunded" value={`₹${refundedAmount.toLocaleString()}`} color="red" />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search by customer or service…"
        filterTabs={filterTabs}
        activeFilter={filter}
        onFilterChange={setFilter}
        pageSize={10}
      />
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => {
  const colorMap = {
    emerald: "bg-emerald-50 border-emerald-200/60 text-emerald-700",
    primary: "bg-bg-panel border-border-soft text-primary",
    red: "bg-red-50 border-red-200/60 text-red-700",
  };

  return (
    <div className={`rounded-2xl border p-4 ${colorMap[color]}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-lg font-bold mt-1">{value}</p>
    </div>
  );
};
