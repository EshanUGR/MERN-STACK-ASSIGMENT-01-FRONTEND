import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SelectivePostOfficeReport = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [manualAddresses, setManualAddresses] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/orders", {
        withCredentials: true,
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setOrders(data.filter((o) => o.status?.toLowerCase() === "pending"));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const downloadPDF = () => {
    try {
      if (selectedOrderIds.length === 0) {
        alert("Please select at least one order first!");
        return;
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // --- 1. HEADER (Akila Suppliers) ---
      doc.setFontSize(22);
      doc.setTextColor(20, 83, 136);
      doc.setFont(undefined, "bold");
      doc.text("AKILA SUPPLIERS", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.setFont(undefined, "normal");
      doc.text("SALES MANAGEMENT SYSTEM ", 14, 27);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Report Date: ${new Date().toLocaleDateString()}`,
        pageWidth - 14,
        27,
        { align: "right" }
      );

      doc.setDrawColor(20, 83, 136);
      doc.setLineWidth(0.5);
      doc.line(14, 32, pageWidth - 14, 32);

      // --- 2. DATA PREPARATION ---
      const selectedData = orders.filter((o) =>
        selectedOrderIds.includes(o._id)
      );

      const tableColumn = [
        "No",
        "Date",
        "Customer Name",
        "Delivery Address",
        "Amount",
      ];

      const tableRows = selectedData.map((order, index) => [
        index + 1,
        order.orderDate
          ? new Date(order.orderDate).toLocaleDateString()
          : "N/A",
        order.customer?.name || "N/A",
        manualAddresses[order._id] || "Not Specified",
        `Rs. ${Number(order.finalAmount || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}`,
      ]);

      // --- 3. TABLE GENERATION (STRICT WIDTHS) ---
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: "striped",
        headStyles: {
          fillColor: [20, 83, 136],
          textColor: 255,
          fontSize: 10,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [240, 245, 250] },
        styles: {
          fontSize: 9,
          cellPadding: 4,
          halign: "left",
          overflow: "linebreak", // Forces text to wrap inside the cell
        },
        columnStyles: {
          0: { cellWidth: 12, halign: "center" }, // No column
          1: { cellWidth: 25 }, // Date column
          2: { cellWidth: 45 }, // Customer Name
          3: { cellWidth: "auto" }, // Address (takes rest of space)
          4: { cellWidth: 35, halign: "right", fontStyle: "bold" }, // Amount
        },
      });

      // --- 4. BRANDED FOOTER ---
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFont(undefined, "italic");
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        "This is a system-generated report by Akila Suppliers Sales System.",
        pageWidth / 2,
        finalY,
        { align: "center" }
      );
      doc.text(
        "",
        pageWidth / 2,
        finalY + 5,
        { align: "center" }
      );

      // Bottom Branded Footer Bar
      doc.setFillColor(20, 83, 136);
      doc.rect(0, pageHeight - 15, pageWidth, 15, "F");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, "bold");
      doc.text(
        "AKILA SUPPLIERS - SALES MANAGEMENT SYSTEM",
        pageWidth / 2,
        pageHeight - 6,
        { align: "center" }
      );

      doc.save(`Akila_Post_Report_${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF Error:", err);
      alert("Failed to generate report.");
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg mt-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-blue-100 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-black text-blue-900 tracking-tight">
            Akila Suppliers
          </h2>
          <p className="text-blue-500 font-medium italic">
            Post Office Inquiry Portal
          </p>
        </div>
        <button
          onClick={downloadPDF}
          className={`px-10 py-4 rounded-full font-bold text-white shadow-xl transition-all duration-300 ${
            selectedOrderIds.length > 0
              ? "bg-blue-600 hover:bg-blue-800 active:scale-95"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          📄 Generate Official PDF ({selectedOrderIds.length})
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-blue-50 text-blue-900 text-xs uppercase font-black">
            <tr>
              <th className="p-4 w-12 text-center">Select</th>
              <th className="p-4">Customer Details</th>
              <th className="p-4">Delivery Address (Manual Input)</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {orders.map((o) => (
              <tr key={o._id} className="hover:bg-blue-50/50 transition-colors">
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    className="w-6 h-6 rounded border-gray-300 text-blue-600 cursor-pointer"
                    checked={selectedOrderIds.includes(o._id)}
                    onChange={() => {
                      const id = o._id;
                      setSelectedOrderIds((prev) =>
                        prev.includes(id)
                          ? prev.filter((i) => i !== id)
                          : [...prev, id]
                      );
                    }}
                  />
                </td>
                <td className="p-4">
                  <div className="font-bold text-gray-800">
                    {o.customer?.name || "N/A"}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    Order ID: {o._id}
                  </div>
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="Type address..."
                    value={manualAddresses[o._id] || ""}
                    onChange={(e) =>
                      setManualAddresses({
                        ...manualAddresses,
                        [o._id]: e.target.value,
                      })
                    }
                  />
                </td>
                <td className="p-4 text-right">
                  <div className="text-blue-700 font-black">
                    Rs.{Number(o.finalAmount).toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SelectivePostOfficeReport;
