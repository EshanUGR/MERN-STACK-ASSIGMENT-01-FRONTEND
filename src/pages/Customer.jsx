import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiArrowDown,
  FiArrowUp,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUsers,
  FiX,
} from "react-icons/fi";

const Customer = () => {
  const token = localStorage.getItem("access_token");
  const [customers, setCustomers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showScrollControls, setShowScrollControls] = useState(false);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    NIC: "",
    address: "",
    contactNo: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollControls(window.scrollY > 220);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/customers", {
        withCredentials: true,
      });
      setCustomers(res.data);
    } catch {
      toast.error("Failed to fetch customers.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({ _id: "", name: "", NIC: "", address: "", contactNo: "" });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async () => {
    const { _id, name, NIC, address, contactNo } = formData;
    if (!_id || !name || !NIC || !address || !contactNo) {
      return toast.error("All fields are required.");
    }

    try {
      if (editingId) {
        // Update Logic
        await axios.put(
          `http://localhost:7000/api/customers/${editingId}`,
          formData,
          { withCredentials: true },
        );
        toast.success("Customer updated!");
      } else {
        await axios.post("http://localhost:7000/api/customers", formData, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        toast.success("Customer created!");
      }
      resetForm();
      fetchCustomers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed.");
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const query = searchText.trim().toLowerCase();
    if (!query) return true;
    return (
      customer._id?.toLowerCase().includes(query) ||
      customer.name?.toLowerCase().includes(query) ||
      customer.NIC?.toLowerCase().includes(query) ||
      customer.contactNo?.toLowerCase().includes(query)
    );
  });

  const openCreateForm = () => {
    setEditingId(null);
    setFormData({ _id: "", name: "", NIC: "", address: "", contactNo: "" });
    setIsFormOpen(true);
  };

  const editCustomer = (customer) => {
    setEditingId(customer._id);
    setFormData({ ...customer });
    setIsFormOpen(true);
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:7000/api/customers/${id}`, {
        withCredentials: true,
      });
      toast.success("Deleted successfully!");
      fetchCustomers();
    } catch {
      toast.error("Delete failed.");
    }
  };

  const toggleCustomerDetails = (customerId) => {
    setExpandedCustomerId((prev) => (prev === customerId ? null : customerId));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(6,182,212,0.22),transparent_40%),radial-gradient(circle_at_85%_5%,rgba(16,185,129,0.20),transparent_35%),radial-gradient(circle_at_70%_75%,rgba(56,189,248,0.16),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl">
        <ToastContainer theme="dark" />

        <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                <FiUsers size={14} />
                Customer Section
              </p>
              <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Customer Management Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                Add, edit, and manage buyer profiles with cleaner workflow and
                faster navigation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
                <p className="text-2xl font-extrabold text-cyan-200">
                  {customers.length}
                </p>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                  Total Customers
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
                <p className="text-2xl font-extrabold text-emerald-200">
                  {filteredCustomers.length}
                </p>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                  Visible Results
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
                <p className="text-2xl font-extrabold text-sky-200">24/7</p>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                  Workflow Access
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 sm:w-80">
              <FiSearch className="text-slate-300" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by ID, name, NIC, or contact"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsFormOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-400/20"
              >
                {isFormOpen ? <FiX size={16} /> : <FiPlus size={16} />}
                {isFormOpen ? "Close Form" : "Add Customer"}
              </button>
              <button
                onClick={openCreateForm}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-cyan-300"
              >
                <FiEdit3 size={16} />
                New Entry
              </button>
            </div>
          </div>
        </section>

        {isFormOpen && (
          <section className="mb-6 rounded-2xl border border-cyan-300/20 bg-slate-900/75 p-5 backdrop-blur sm:p-6">
            <h2 className="text-lg font-bold text-white sm:text-xl">
              {editingId ? "Update Customer Details" : "Create New Customer"}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Fill every field to keep your customer records complete and ready
              for order processing.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                name="_id"
                placeholder="Customer ID"
                value={formData._id}
                onChange={handleInputChange}
                className="rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none"
                disabled={editingId}
              />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none"
              />
              <input
                type="text"
                name="NIC"
                placeholder="NIC Number"
                value={formData.NIC}
                onChange={handleInputChange}
                className="rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none"
              />
              <input
                type="text"
                name="contactNo"
                placeholder="Contact Number"
                value={formData.contactNo}
                onChange={handleInputChange}
                className="rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none md:col-span-2"
              />
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleSubmit}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-cyan-300"
              >
                {editingId ? "Save Changes" : "Save Customer"}
              </button>
              <button
                onClick={resetForm}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                <FiX size={16} />
                Cancel
              </button>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-bold text-white">Customers List</h3>
            <p className="text-sm text-slate-300">
              Showing {filteredCustomers.length} of {customers.length} entries
            </p>
          </div>

          {filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-900/90 text-slate-100">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">NIC</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-slate-950/50">
                  {filteredCustomers.map((cust) => (
                    <React.Fragment key={cust._id}>
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-slate-100">
                          {cust.name}
                        </td>
                        <td className="px-4 py-3 text-slate-300">{cust.NIC}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap justify-center gap-2">
                            <button
                              onClick={() => toggleCustomerDetails(cust._id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-cyan-300/40 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-100 hover:bg-cyan-400/20"
                            >
                              {expandedCustomerId === cust._id ? (
                                <FiEyeOff size={13} />
                              ) : (
                                <FiEye size={13} />
                              )}
                              {expandedCustomerId === cust._id
                                ? "Hide Details"
                                : "View Details"}
                            </button>
                            <button
                              onClick={() => editCustomer(cust)}
                              className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400"
                            >
                              <FiEdit3 size={13} />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteCustomer(cust._id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-400"
                            >
                              <FiTrash2 size={13} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>

                      {expandedCustomerId === cust._id && (
                        <tr className="bg-slate-900/65">
                          <td colSpan={3} className="px-4 py-4">
                            <div className="grid gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-4 sm:grid-cols-2">
                              <div>
                                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                                  Customer ID
                                </p>
                                <p className="mt-1 text-sm font-semibold text-cyan-100">
                                  {cust._id}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                                  Telephone Number
                                </p>
                                <p className="mt-1 text-sm font-semibold text-cyan-100">
                                  {cust.contactNo}
                                </p>
                              </div>
                              <div className="sm:col-span-2">
                                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                                  Address
                                </p>
                                <p className="mt-1 text-sm text-slate-200">
                                  {cust.address || "Not provided"}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : customers.length > 0 ? (
            <p className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-6 text-center text-slate-300">
              No results match your search.
            </p>
          ) : (
            <p className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-6 text-center text-slate-300">
              No customers found. Start by adding your first customer record.
            </p>
          )}
        </section>

        {showScrollControls && (
          <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-2 sm:right-6">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-slate-900/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-cyan-100 shadow-lg shadow-cyan-950/40 backdrop-blur hover:bg-cyan-400/20"
              aria-label="Scroll to top"
            >
              <FiArrowUp size={14} />
              Top
            </button>
            <button
              onClick={scrollToBottom}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-slate-900/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-100 shadow-lg shadow-emerald-950/40 backdrop-blur hover:bg-emerald-400/20"
              aria-label="Scroll to bottom"
            >
              <FiArrowDown size={14} />
              Bottom
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customer;
