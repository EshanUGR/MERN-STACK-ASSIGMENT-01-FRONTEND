import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ===== IMPORT YOUR LOGO HERE =====
// Make sure 'logo.png' is in the same folder as this file.
// If it is in an 'assets' folder, use: import logo from './assets/logo.png';
import logo from "../images/logo.png"

const QuotationPage = () => {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [companyName, setCompanyName] = useState("");

  // Default Expiry (e.g., 7 days from now)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

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
    setInvoiceItems([...invoiceItems, { itemId: "", name: "", price: "" }]);
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
      newItems[index].price = selectedItem?.price || "";
    } else if (type === "price") {
      newItems[index].price = value;
    }
    setInvoiceItems(newItems);
  };

  const generatePDF = () => {
    if (!selectedCustomer) return alert("Select a customer!");
    if (invoiceItems.length === 0) return alert("Add at least one item!");

    const customer = customers.find((c) => c._id === selectedCustomer);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ===== GENERATE QUOTE ID =====
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const quoteID = `QU-${randomNum}`;

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
    // Using the imported 'logo' variable
    try {
      // (Image, Format, X, Y, Width, Height)
      // Adjust width (25) and height (25) to match your logo shape
      doc.addImage(logo, "PNG", 14, 20, 25, 25);
    } catch (err) {
      console.error("Logo load error:", err);
      // Fallback text if logo fails to load
      doc.setFontSize(10);
      doc.setTextColor(themeColor);
      doc.text("AKILA", 14, 30);
    }

    // Sender Details (Left, below logo area)
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

    // ===== 2. QUOTATION DETAILS (Top Right) =====
    const rightMargin = 196;
    doc.setFontSize(28);
    doc.setTextColor(themeColor);
    doc.setFont("helvetica", "bold");
    doc.text("QUOTATION", rightMargin, 30, { align: "right" });

    // Quote Meta Data
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

    // Expiry
    doc.setFont("helvetica", "bold");
    doc.text("Expiry Date:", labelX, metaStartY + 6);
    doc.setFont("helvetica", "normal");
    doc.text(expiryDate.toLocaleDateString("en-GB"), valueX, metaStartY + 6, {
      align: "right",
    });

    // Quote Number
    doc.setFont("helvetica", "bold");
    doc.text("Quotation No:", labelX, metaStartY + 12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(redText);
    doc.text(quoteID, valueX, metaStartY + 12, { align: "right" });

    // ===== 3. CUSTOMER BOX =====
    doc.setFillColor(accentColor);
    doc.roundedRect(14, 76, 100, 24, 2, 2, "F");

    doc.setFontSize(10);
    doc.setTextColor(themeColor);
    doc.setFont("helvetica", "bold");
    doc.text("Quotation For:", 18, 83);

    doc.setFontSize(10);
    doc.setTextColor("#000000");
    doc.setFont("helvetica", "normal");
    doc.text(customer?.name || "Customer Name", 18, 89);
    if (companyName) {
      doc.text(companyName, 18, 95);
    }

    // ===== 4. ATTRACTIVE TABLE =====
    // Note: Showing only Description and Unit Price as requested
    const tableBody = invoiceItems.map((item) => {
      const price = parseFloat(item.price) || 0;
      return [
        item.name,
        price.toLocaleString("en-LK", { minimumFractionDigits: 2 }),
      ];
    });

    autoTable(doc, {
      startY: 110,
      head: [["Description", "Unit Price (LKR)"]],
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
      alternateRowStyles: {
        fillColor: "#f8f9fa",
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "right", cellWidth: 50, fontStyle: "bold" },
      },
    });

    // ===== 5. FOOTER CONTENT =====
    const finalY = doc.lastAutoTable.finalY + 15;

    // A. System Generated Warning
    doc.setFontSize(9);
    doc.setTextColor(redText);
    doc.setFont("helvetica", "italic");
    doc.text("This is a system generated quotation.", 14, finalY);

    // B. Bold Product List
    doc.setTextColor("#374151");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    const descText =
      "We are a trusted supplier for over 5 years, providing Safety Gloves (Cotton, Rubber, Disposable), Safety Boots, Gumboots, Helmets, Goggles, Aprons, Face Masks, Disposable Caps, Ear Muffs, Raincoats, Safety Harnesses, Rubber Bands, Cello Tape,Surgicle gloves and many more safety items.";

    const splitDesc = doc.splitTextToSize(descText, 180);
    doc.text(splitDesc, 14, finalY + 6);

    // C. Closing Message
    const textHeight = doc.getTextDimensions(splitDesc).h;
    const closingY = finalY + 6 + textHeight + 8;

    doc.setTextColor(themeColor);
    doc.setFont("helvetica", "bold");
    doc.text("Looking forward to hearing from you.", 14, closingY);

    // ===== 6. FINAL FOOTER BAR =====
    const footerHeight = 15;
    const footerY = pageHeight - footerHeight;

    doc.setFillColor(themeColor);
    doc.rect(0, footerY, pageWidth, footerHeight, "F");

    doc.setTextColor("#ffffff");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");

    const footerText = "Akila Suppliers  |  071 700 90 59";
    const textWidth = doc.getTextWidth(footerText);
    const textX = (pageWidth - textWidth) / 2;

    doc.text(footerText, textX, footerY + 10);

    // ===== SAVE PDF =====
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const safeCustomerName = customer.name.replace(/[^a-zA-Z0-9 ]/g, "").trim();

    doc.save(`Quotation_${quoteID}_${formattedDate}_${safeCustomerName}.pdf`);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-xl rounded-xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Generate Quotation
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

          <input
            type="number"
            placeholder="Price"
            value={item.price}
            onChange={(e) => handleItemChange(index, "price", e.target.value)}
            className="w-32 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => removeItem(index)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="flex gap-4 mt-4">
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
          Generate PDF
        </button>
      </div>
    </div>
  );
};

export default QuotationPage;
