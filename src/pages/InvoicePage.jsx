import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // correct import

const InvoicePage = () => {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [companyName, setCompanyName] = useState("");

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

    // ===== HEADER =====
    doc.setFontSize(22);
    doc.setTextColor("#1e3a8a");
    doc.text("Akila Suppliers", 20, 20);
    doc.setFontSize(14);
    doc.setTextColor("#0f172a");
    doc.text("Invoice", 20, 28);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 20, 20, {
      align: "right",
    });

    // ===== CUSTOMER INFO =====
    doc.setFillColor("#dbeafe");
    doc.roundedRect(20, 35, 170, 40, 3, 3, "F");
    doc.setFontSize(12);
    doc.setTextColor("#0f172a");
    doc.text(`Customer: ${customer?.name}`, 25, 45);
    if (companyName) doc.text(`Company: ${companyName}`, 25, 66);

    // ===== DESCRIPTION =====
    doc.setFontSize(10);
    doc.setTextColor("#475569");
    doc.text(
      "We are more than 5 years safety items supplier providing gloves, boots, aprons, masks, rubber, cotton, cello tape and many more.",
      20,
      78
    );
    doc.text("Follow us on Facebook: Akila Suppliers", 20, 85);

    // ===== TABLE =====
    const tableData = invoiceItems.map((item) => [item.name, item.price]);
    autoTable(doc, {
      startY: 95,
      head: [["Item", "Price (LKR)"]],
      body: tableData,
      styles: { fontSize: 12 },
      headStyles: { fillColor: "#1e3a8a", textColor: "#ffffff" },
      alternateRowStyles: { fillColor: "#f1f5f9" },
      columnStyles: { 1: { halign: "right" } },
    });

    // ===== SYSTEM GENERATED NOTICE =====
    const finalY = doc.lastAutoTable.finalY || 110;
    doc.setFontSize(10);
    doc.setTextColor("#ff0000");
  
    // ===== FOOTER =====
    const footerHeight = 20;
    doc.setFillColor("#1e3a8a");
    doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, "F");
    doc.setFontSize(10);
    doc.setTextColor("#ffffff");
    doc.text("Contact: 0767399304", 20, pageHeight - 7);
    doc.text(
      "Follow us on Facebook: Akila Suppliers",
      pageWidth - 20,
      pageHeight - 7,
      { align: "right" }
    );

    // ===== SAVE PDF =====
    const today = new Date();
    const dateString = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    doc.save(`invoice_${dateString}To_${customer.name}_Akila_Suppliers.pdf`);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-xl rounded-xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Generate Invoice / Quotation
      </h2>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-semibold">
          Company Name (Optional for Quotation)
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

export default InvoicePage;
