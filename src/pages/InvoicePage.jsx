import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ===== IMPORT YOUR LOGO HERE =====
// Ensure 'logo.png' is in the same folder or update the path
import logo from "../images/logo.png";

const InvoicePage = () => {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  // Renamed to 'invoiceItems' for clarity
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [companyName, setCompanyName] = useState("");

  // Default Due Date (e.g., same day or +30 days)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30); // 30 Days due

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCustomers = await axios.get(
          "http://localhost:7000/api/customers",
          { withCredentials: true }
        );
        const resItems = await axios.get("http://localhost:7000/api/items", {
          withCredentials: true,
        });
        setCustomers(resCustomers.data);
        setItems(resItems.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const addItem = () => {
    // Default quantity is 1
    setInvoiceItems([
      ...invoiceItems,
      { itemId: "", name: "", price: 0, quantity: 1 },
    ]);
  };

  const removeItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, type, value) => {
    const newItems = [...invoiceItems];
    if (type === "itemId") {
      const selectedItem = items.find((i) => i._id === value);
      newItems[index].itemId = value;
      newItems[index].name = selectedItem?.name || "";
      newItems[index].price = selectedItem?.price || 0;
    } else if (type === "price") {
      newItems[index].price = parseFloat(value) || 0;
    } else if (type === "quantity") {
      newItems[index].quantity = parseFloat(value) || 0;
    }
    setInvoiceItems(newItems);
  };

  // Calculate Grand Total for the UI and PDF
  const calculateTotal = () => {
    return invoiceItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const generatePDF = () => {
    if (!selectedCustomer) return alert("Select a customer!");
    if (invoiceItems.length === 0) return alert("Add at least one item!");

    const customer = customers.find((c) => c._id === selectedCustomer);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ===== GENERATE INVOICE ID =====
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const invoiceID = `INV-${randomNum}`;

    // ===== THEME COLORS =====
    const themeColor = "#1a237e"; // Deep Royal Blue
    const accentColor = "#f3f4f6"; // Light Gray/Blue for boxes
    const grayText = "#4b5563";
    const redText = "#dc2626";

    // ===== 1. HEADER LOGO & INFO =====
    doc.setDrawColor(themeColor);
    doc.setLineWidth(1.5);
    doc.line(14, 15, pageWidth - 14, 15);

    // --- LOGO IMAGE ---
    try {
      doc.addImage(logo, "PNG", 14, 20, 25, 25);
    } catch (err) {
      console.error("Logo load error:", err);
      doc.setFontSize(10);
      doc.setTextColor(themeColor);
      doc.text("AKILA", 14, 30);
    }

    // Sender Details
    doc.setFontSize(16);
    doc.setTextColor(themeColor);
    doc.setFont("helvetica", "bold");
    doc.text("AKILA SUPPLIERS", 14, 53);

    doc.setFontSize(10);
    doc.setTextColor(grayText);
    doc.setFont("helvetica", "normal");
    doc.text("No. 75/1, Niripola", 14, 59);
    doc.text("Hanwella, Sri Lanka", 14, 64);
    doc.text("Contact No: +94 71 700 90 59", 14, 69);

    // ===== 2. INVOICE DETAILS (Top Right) =====
    const rightMargin = 196;
    doc.setFontSize(28);
    doc.setTextColor(themeColor);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", rightMargin, 30, { align: "right" }); // Changed title to INVOICE

    // Invoice Meta Data
    doc.setFontSize(10);
    doc.setTextColor(grayText);
    doc.setFont("helvetica", "bold");

    const metaStartY = 45;
    const labelX = 135;
    const valueX = 196;

    // Date
    doc.text("Date:", labelX, metaStartY);
    doc.setFont("helvetica", "normal");
    const today = new Date();
    doc.text(today.toLocaleDateString("en-GB"), valueX, metaStartY, {
      align: "right",
    });

    // Invoice Number
    doc.setFont("helvetica", "bold");
    doc.text("Invoice No:", labelX, metaStartY + 6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(redText);
    doc.text(invoiceID, valueX, metaStartY + 6, { align: "right" });

    // ===== 3. CUSTOMER BOX =====
    doc.setFillColor(accentColor);
    doc.roundedRect(14, 76, 100, 24, 2, 2, "F");

    doc.setFontSize(10);
    doc.setTextColor(themeColor);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice To:", 18, 83); // Changed text to "Invoice To"

    doc.setFontSize(10);
    doc.setTextColor("#000000");
    doc.setFont("helvetica", "normal");
    doc.text(customer?.name || "Customer Name", 18, 89);
    if (companyName) {
      doc.text(companyName, 18, 95);
    }

    // ===== 4. INVOICE TABLE (With Qty & Total) =====
    const tableBody = invoiceItems.map((item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseFloat(item.quantity) || 0;
      const total = price * qty;
      return [
        item.name,
        price.toLocaleString("en-LK", { minimumFractionDigits: 2 }),
        qty.toString(),
        total.toLocaleString("en-LK", { minimumFractionDigits: 2 }),
      ];
    });

    autoTable(doc, {
      startY: 110,
      head: [["Description", "Unit Price", "Qty", "Total (LKR)"]],
      body: tableBody,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 5,
        textColor: "#333333",
        lineColor: "#e0e0e0",
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: themeColor,
        textColor: "#ffffff",
        fontStyle: "bold",
        halign: "left",
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "right", cellWidth: 35 },
        2: { halign: "center", cellWidth: 20 },
        3: { halign: "right", cellWidth: 40, fontStyle: "bold" },
      },
      alternateRowStyles: {
        fillColor: "#f8f9fa",
      },
    });

    // ===== 5. GRAND TOTAL SECTION =====
    const finalY = doc.lastAutoTable.finalY + 10;
    const grandTotal = calculateTotal();

    doc.setFontSize(12);
    doc.setTextColor(themeColor);
    doc.setFont("helvetica", "bold");
    doc.text("Grand Total:", 140, finalY);

    doc.setFontSize(14);
    doc.setTextColor(redText);
    doc.text(
      `LKR ${grandTotal.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`,
      196,
      finalY,
      { align: "right" }
    );

    // Double underline for total
    doc.setLineWidth(0.5);
    doc.setDrawColor(redText);
    const textWidth = doc.getTextWidth(
      `LKR ${grandTotal.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`
    );
    doc.line(196 - textWidth, finalY + 2, 196, finalY + 2);
    doc.line(196 - textWidth, finalY + 4, 196, finalY + 4);

    // ===== 6. FOOTER CONTENT =====
    const footerContentY = finalY + 30;

    // A. System Warning
    doc.setFontSize(9);
    doc.setTextColor(redText);
    doc.setFont("helvetica", "italic");
    doc.text("This is a system generated invoice.", 14, footerContentY);

    // B. Product List
    doc.setTextColor("#374151");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    const descText =
      "We are a trusted supplier for over 5 years, providing Safety Gloves (Cotton, Rubber, Disposable), Safety Boots, Gumboots, Helmets, Goggles, Aprons, Face Masks, Disposable Caps, Ear Muffs, Raincoats, Safety Harnesses, Rubber Bands, Cello Tape,Surgicle gloves and many more safety items.";
    const splitDesc = doc.splitTextToSize(descText, 180);
    doc.text(splitDesc, 14, footerContentY + 6);

    // C. Closing
    doc.setTextColor(themeColor);
    doc.setFont("helvetica", "bold");
    doc.text("Thank you for your business!", 14, footerContentY + 16);

    // ===== 7. FINAL FOOTER BAR =====
    const footerHeight = 15;
    const footerY = pageHeight - footerHeight;

    doc.setFillColor(themeColor);
    doc.rect(0, footerY, pageWidth, footerHeight, "F");

    doc.setTextColor("#ffffff");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");

    const footerText = "Akila Suppliers  |  071 700 90 59";
    const footerTextX = (pageWidth - doc.getTextWidth(footerText)) / 2;
    doc.text(footerText, footerTextX, footerY + 10);

    // ===== SAVE PDF =====
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const safeCustomerName = customer.name.replace(/[^a-zA-Z0-9 ]/g, "").trim();

    doc.save(`Invoice_${invoiceID}_${formattedDate}_${safeCustomerName}.pdf`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-xl rounded-xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Generate Invoice
      </h2>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-semibold">
          Company Name (Optional)
        </label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter company name"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-semibold">
          Select Customer
        </label>
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {invoiceItems.map((item, index) => (
        <div key={index} className="flex gap-3 mb-3 items-center">
          {/* Item Selector */}
          <select
            value={item.itemId}
            onChange={(e) => handleItemChange(index, "itemId", e.target.value)}
            className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Item</option>
            {items.map((i) => (
              <option key={i._id} value={i._id}>
                {i.name}
              </option>
            ))}
          </select>

          {/* Price Input */}
          <input
            type="number"
            placeholder="Price"
            value={item.price}
            onChange={(e) => handleItemChange(index, "price", e.target.value)}
            className="w-24 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Quantity Input (Restored for Invoice) */}
          <input
            type="number"
            placeholder="Qty"
            value={item.quantity}
            onChange={(e) =>
              handleItemChange(index, "quantity", e.target.value)
            }
            className="w-20 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
          />

          {/* Row Total Display */}
          <div className="w-32 p-3 bg-gray-100 rounded-lg text-right font-semibold text-gray-700">
            {(item.price * item.quantity).toFixed(2)}
          </div>

          <button
            onClick={() => removeItem(index)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={addItem}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            + Add Item
          </button>
          <button
            onClick={generatePDF}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Generate Invoice PDF
          </button>
        </div>

        {/* Grand Total Display on Screen */}
        <div className="text-xl font-bold text-gray-800">
          Grand Total:{" "}
          <span className="text-blue-600">
            LKR {calculateTotal().toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
