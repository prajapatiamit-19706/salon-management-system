import { useState } from "react";

// ─── Demo data (remove when wiring real props) ───────────────
const mockAppointment = {
  id: "INV-2024-0042",
  service: "Women's Haircut & Styling",
  staff: "Rahul Sharma",
  date: "2026-03-18",
  time: "11:00 AM",
  duration: "60 min",
  price: 299,          // always a number
  tax: 0,              // set 0 if no tax
  salon: "Serenity Wellness Studio",
  salonAddress: "12, MG Road, Bengaluru - 560001",
  salonPhone: "+91 98765 43210",
  customerName: "Arjun Mehta",
};

// ─── Helper: safely parse price ──────────────────────────────
function parsePrice(val) {
  const n = parseFloat(String(val).replace(/[^\d.]/g, ""));
  return isNaN(n) ? 0 : n;
}

export const InvoiceButton = ({ appointment, user }) => {
  const [status, setStatus] = useState("idle"); // idle | loading | done

  const handleDownload = async () => {
    setStatus("loading");

    // Load jsPDF from CDN
    await new Promise((resolve, reject) => {
      if (window.jspdf) return resolve();
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });

    const rawPrice = appointment.price ?? appointment.serviceId?.priceFrom ?? mockAppointment.price;
    const price = parsePrice(rawPrice);
    const tax = parsePrice(appointment.tax ?? mockAppointment.tax);
    const total = price + tax;

    const appointmentId = String(appointment._id ? `INV-${String(appointment._id).substring(String(appointment._id).length - 6).toUpperCase()}` : mockAppointment.id);
    const customerName = String(user?.name || appointment.customerName || mockAppointment.customerName || "Customer");
    const salonName = String(mockAppointment.salon || "");
    const salonAddress = String(mockAppointment.salonAddress || "");
    const salonPhone = String(mockAppointment.salonPhone || "");
    const serviceName = String(appointment.serviceId?.name || mockAppointment.service || "Service");
    const staffName = String(appointment.staffId?.name || mockAppointment.staff || "Staff");
    const duration = String(appointment.serviceId?.duration ? `${appointment.serviceId.duration} min` : mockAppointment.duration || "N/A");

    // Format date and time
    const bookingDate = String(appointment.date
      ? new Date(appointment.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : mockAppointment.date || "");

    let bookingTime = String(mockAppointment.time || "");
    if (appointment.startTime !== undefined && appointment.startTime !== null) {
      const h = Math.floor(appointment.startTime / 60);
      const m = appointment.startTime % 60;
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      bookingTime = String(`${h12}:${m === 0 ? "00" : m} ${ampm}`);
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();

    // ── Theme palette ──────────────────────────────────────
    const navy = [11, 53, 88];
    const navySoft = [31, 78, 121];
    const bgSoft = [220, 239, 245];
    const bgPanel = [207, 230, 238];
    const border = [191, 214, 223];
    const bodyTxt = [53, 94, 114];
    const mutedTxt = [107, 138, 153];
    const white = [255, 255, 255];

    // ── Page background ────────────────────────────────────
    doc.setFillColor(...bgSoft);
    doc.rect(0, 0, W, H, "F");

    // ── Navy header ────────────────────────────────────────
    doc.setFillColor(...navy);
    doc.rect(0, 0, W, 92, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...white);
    doc.text(salonName, 40, 38);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...bgSoft);
    doc.text(salonAddress, 40, 56);
    doc.text(salonPhone, 40, 70);

    // Badge top-right
    doc.setFillColor(...bgSoft);
    doc.roundedRect(W - 158, 18, 128, 56, 8, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...navy);
    doc.text("INVOICE", W - 94, 44, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...bodyTxt);
    doc.text(appointmentId, W - 94, 58, { align: "center" });
    doc.text(bookingDate, W - 94, 70, { align: "center" });

    // ── White card ─────────────────────────────────────────
    doc.setFillColor(...white);
    doc.roundedRect(28, 108, W - 56, H - 134, 10, 10, "F");

    // Billed To
    const sy = 132;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...mutedTxt);
    doc.text("BILLED TO", 48, sy);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...navy);
    doc.text(customerName, 48, sy + 16);

    // Transaction Info
    const isCompleted = appointment.status === "completed" || appointment._status === "completed";
    const paymentMethod = appointment.bill?.paymentMode || "Online";
    const paymentStatus = appointment.bill?.paymentStatus === "paid" ? "Paid" : (isCompleted ? "Paid" : "Pending");
    const txnId = appointment.bill?.billNumber || `TXN-${appointmentId.split("-").pop()}`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...mutedTxt);
    doc.text("TRANSACTION", 48, sy + 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...bodyTxt);
    doc.text(`${txnId} • ${paymentMethod} • ${paymentStatus}`, 48, sy + 54);

    // Date right
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...mutedTxt);
    doc.text("DATE", W - 48, sy, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...navy);
    doc.text(
      `${bookingDate}${bookingTime ? "  ·  " + bookingTime : ""}`,
      W - 48, sy + 16, { align: "right" }
    );

    doc.setDrawColor(...border);
    doc.setLineWidth(0.75);
    doc.line(48, sy + 68, W - 48, sy + 68);

    // Table header
    const th = sy + 82;
    doc.setFillColor(...bgPanel);
    doc.roundedRect(38, th, W - 76, 26, 6, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...navy);
    doc.text("SERVICE", 54, th + 16);
    doc.text("STAFF", 230, th + 16);
    doc.text("DURATION", 348, th + 16);
    doc.text("AMOUNT", W - 54, th + 16, { align: "right" });

    // Table row
    const rY = th + 26;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...navy);
    doc.text(serviceName, 54, rY + 22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...bodyTxt);
    doc.text(staffName, 230, rY + 22);
    doc.text(duration, 348, rY + 22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...navySoft);
    doc.text(`Rs. ${price.toLocaleString()}`, W - 54, rY + 22, { align: "right" });

    doc.setDrawColor(...border);
    doc.setLineWidth(0.5);
    doc.line(38, rY + 44, W - 38, rY + 44);

    // Totals box
    const tY = rY + 64;
    doc.setFillColor(...bgPanel);
    doc.roundedRect(W - 228, tY, 190, tax > 0 ? 104 : 76, 8, 8, "F");
    const lx = W - 208, rx = W - 48;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...bodyTxt);
    doc.text("Subtotal", lx, tY + 26);
    doc.text(`Rs. ${price.toLocaleString()}`, rx, tY + 26, { align: "right" });

    let dividerY = tY + 38;
    if (tax > 0) {
      doc.text("GST (18%)", lx, tY + 46);
      doc.text(`Rs. ${tax.toLocaleString()}`, rx, tY + 46, { align: "right" });
      dividerY = tY + 58;
    }

    doc.setDrawColor(...border);
    doc.setLineWidth(0.75);
    doc.line(lx, dividerY, rx, dividerY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...navy);
    doc.text("Total", lx, dividerY + 20);
    doc.text(`Rs. ${total.toLocaleString()}`, rx, dividerY + 20, { align: "right" });

    // Thank-you
    const nY = tY + (tax > 0 ? 126 : 100);

    doc.setFillColor(...bgSoft);
    doc.roundedRect(38, nY, W - 76, 50, 8, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...navy);
    doc.text(isCompleted ? "Thank you for your visit!" : "Appointment Confirmed", W / 2, nY + 18, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...bodyTxt);
    doc.text(isCompleted ? "We hope you enjoyed your experience. See you again soon." : "We look forward to seeing you at your scheduled time.", W / 2, nY + 34, { align: "center" });

    // Footer
    doc.setFillColor(...navy);
    doc.rect(0, H - 34, W, 34, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...bgSoft);
    doc.text(
      `Generated on ${new Date().toLocaleString("en-IN")}  •  ${salonName}`,
      W / 2, H - 12, { align: "center" }
    );

    doc.save(`Invoice-${appointmentId}.pdf`);
    setStatus("done");
    setTimeout(() => setStatus("idle"), 2500);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={status !== "idle"}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-300 shadow-[0_4px_12px_rgba(11,53,88,0.18)]
        ${status === "done"
          ? "bg-green-600 text-white"
          : status === "loading"
            ? "bg-primary-soft text-white opacity-75 cursor-wait"
            : "bg-primary text-white cursor-pointer"
        }`}
    >
      {status === "done" && (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {status === "loading" && (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {status === "idle" && (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
        </svg>
      )}

      {status === "done" ? "Downloaded!" :
        status === "loading" ? "Generating…" :
          " Download "}
    </button>
  );
}