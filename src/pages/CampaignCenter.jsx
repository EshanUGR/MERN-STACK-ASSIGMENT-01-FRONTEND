import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiMail,
  FiCheckCircle,
  FiPlusSquare,
  FiPieChart,
  FiTarget,
  FiHome,
  FiPhone,
  FiMapPin,
  FiSearch,
  FiTrash2,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const CampaignCenter = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); // Controls the view between Leads and Form
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ province: "", district: "" });

  // Full Management Control: Registration State
  const [regForm, setRegForm] = useState({
    name: "",
    contactNo: "",
    email: "",
    province: "",
    district: "",
    city: "",
    businessType: "Shop",
  });

  const districtsByProvince = {
    Western: ["Colombo", "Gampaha", "Kalutara"],
    Central: ["Kandy", "Matale", "Nuwara Eliya"],
    Southern: ["Galle", "Matara", "Hambantota"],
    North_Western: ["Kurunegala", "Puttalam"],
    Sabaragamuwa: ["Ratnapura", "Kegalle"],
    Eastern: ["Trincomalee", "Batticaloa", "Ampara"],
    Northern: ["Jaffna", "Kilinochchi", "Mannar"],
    Uva: ["Badulla", "Moneragala"],
    North_Central: ["Anuradhapura", "Polonnaruwa"],
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // API Call to fetch all leads
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:7000/api/campaign", {
        withCredentials: true,
      });
      setLeads(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Database connection failed.");
    } finally {
      setLoading(false);
    }
  };

  // API Call to register new lead
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:7000/api/campaign/register", regForm, {
        withCredentials: true,
      });
      toast.success("Lead Registered Successfully!");
      setRegForm({
        name: "",
        contactNo: "",
        email: "",
        province: "",
        district: "",
        city: "",
        businessType: "Shop",
      });
      fetchLeads();
      setActiveTab("dashboard"); // Switch back to leads view after saving
    } catch (err) {
      toast.error("Registration failed.");
    }
  };

  // API Call to send marketing email
  const handleSendEmail = async (lead) => {
    try {
      await axios.post(
        "http://localhost:7000/api/campaign/send-invite",
        { email: lead.email, name: lead.name, id: lead._id },
        { withCredentials: true },
      );
      toast.success(`Invite sent to ${lead.name}`);
      fetchLeads();
    } catch {
      toast.error("Email failed to send.");
    }
  };

  // API Call to delete lead
  const handleDeleteLead = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await axios.delete(`http://localhost:7000/api/campaign/${id}`, {
          withCredentials: true,
        });
        toast.success("Lead deleted.");
        fetchLeads();
      } catch {
        toast.error("Delete failed.");
      }
    }
  };

  // Frontend filtering logic
  const filteredLeads = leads.filter((l) => {
    const matchesProvince =
      filter.province === "" || l.province === filter.province;
    const matchesDistrict =
      filter.district === "" || l.district === filter.district;
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.contactNo.includes(searchTerm);
    return matchesProvince && matchesDistrict && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ToastContainer position="top-right" />

      {/* --- FIXED SIDEBAR (Ensures it shows up) --- */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#1a237e] text-white transition-all duration-300 z-[100] ${isSidebarOpen ? "w-72" : "w-20"}`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <FiTarget className="text-2xl text-blue-400" />
            {isSidebarOpen && (
              <span className="font-bold text-xl uppercase tracking-tighter">
                Akila Ads
              </span>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-white/10 rounded"
          >
            {isSidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="p-4 mt-6 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === "dashboard" ? "bg-blue-600" : "hover:bg-white/5 text-blue-200"}`}
          >
            <FiPieChart size={22} />{" "}
            {isSidebarOpen && <span>Lead Dashboard</span>}
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === "register" ? "bg-blue-600" : "hover:bg-white/5 text-blue-200"}`}
          >
            <FiPlusSquare size={22} /> {isSidebarOpen && <span>New Entry</span>}
          </button>
          <div className="pt-10 border-t border-white/10 mt-10">
            <Link
              to="/"
              className="flex items-center gap-4 p-4 text-blue-400 hover:text-white"
            >
              <FiHome size={22} /> {isSidebarOpen && <span>Back to Home</span>}
            </Link>
          </div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div
        className={`transition-all duration-300 ${isSidebarOpen ? "ml-72" : "ml-20"}`}
      >
        <header className="bg-white h-20 flex items-center justify-between px-10 border-b shadow-sm sticky top-0 z-40">
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">
            {activeTab}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-900">Ravindu Eshan</p>
              <p className="text-xs text-slate-500 uppercase">
                Campaign Manager
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              RE
            </div>
          </div>
        </header>

        <main className="p-10">
          {activeTab === "register" ? (
            /* REGISTRATION FORM VIEW */
            <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-8 text-slate-800 border-b pb-4">
                Register New Lead
              </h3>
              <form
                onSubmit={handleRegister}
                className="grid grid-cols-2 gap-6"
              >
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Business/Customer Name"
                    required
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none"
                    value={regForm.name}
                    onChange={(e) =>
                      setRegForm({ ...regForm, name: e.target.value })
                    }
                  />
                </div>
                <input
                  type="text"
                  placeholder="Contact No"
                  required
                  className="p-4 bg-slate-50 rounded-2xl"
                  value={regForm.contactNo}
                  onChange={(e) =>
                    setRegForm({ ...regForm, contactNo: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="p-4 bg-slate-50 rounded-2xl"
                  value={regForm.email}
                  onChange={(e) =>
                    setRegForm({ ...regForm, email: e.target.value })
                  }
                />
                <select
                  required
                  className="p-4 bg-slate-50 rounded-2xl"
                  value={regForm.province}
                  onChange={(e) =>
                    setRegForm({
                      ...regForm,
                      province: e.target.value,
                      district: "",
                    })
                  }
                >
                  <option value="">Select Province</option>
                  {Object.keys(districtsByProvince).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <select
                  required
                  className="p-4 bg-slate-50 rounded-2xl"
                  disabled={!regForm.province}
                  value={regForm.district}
                  onChange={(e) =>
                    setRegForm({ ...regForm, district: e.target.value })
                  }
                >
                  <option value="">Select District</option>
                  {regForm.province &&
                    districtsByProvince[regForm.province].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
                <input
                  type="text"
                  placeholder="City"
                  required
                  className="p-4 bg-slate-50 rounded-2xl"
                  value={regForm.city}
                  onChange={(e) =>
                    setRegForm({ ...regForm, city: e.target.value })
                  }
                />
                <select
                  className="p-4 bg-slate-50 rounded-2xl font-bold text-blue-600"
                  value={regForm.businessType}
                  onChange={(e) =>
                    setRegForm({ ...regForm, businessType: e.target.value })
                  }
                >
                  <option value="Shop">Retail Shop</option>
                  <option value="Concrete Work">Concrete Work</option>
                  <option value="Other">Other</option>
                </select>
                <button
                  type="submit"
                  className="col-span-2 py-4 bg-blue-700 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-800 transition-all"
                >
                  SAVE LEAD TO DATABASE
                </button>
              </form>
            </div>
          ) : (
            /* DASHBOARD VIEW */
            <div className="max-w-7xl mx-auto">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name or phone..."
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    className="bg-white rounded-2xl px-6 py-4 shadow-sm outline-none font-bold"
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        province: e.target.value,
                        district: "",
                      })
                    }
                  >
                    <option value="">All Provinces</option>
                    {Object.keys(districtsByProvince).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <select
                    className="bg-white rounded-2xl px-6 py-4 shadow-sm outline-none font-bold"
                    disabled={!filter.province}
                    onChange={(e) =>
                      setFilter({ ...filter, district: e.target.value })
                    }
                  >
                    <option value="">All Districts</option>
                    {filter.province &&
                      districtsByProvince[filter.province].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Grid of Leads */}
              {loading ? (
                <div className="text-center py-20 font-black text-slate-300 animate-pulse">
                  SYNCHRONIZING...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredLeads.map((lead) => (
                    <div
                      key={lead._id}
                      className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all relative group border border-slate-100"
                    >
                      <button
                        onClick={() => handleDeleteLead(lead._id)}
                        className="absolute top-6 right-6 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-125"
                      >
                        <FiTrash2 size={20} />
                      </button>

                      <div className="flex justify-between items-start mb-6">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-tighter">
                          {lead.businessType}
                        </span>
                        {!lead.detailsSent ? (
                          <button
                            onClick={() => handleSendEmail(lead)}
                            className="p-4 bg-blue-700 text-white rounded-2xl shadow-xl hover:bg-blue-800 transition-all"
                          >
                            <FiMail size={22} />
                          </button>
                        ) : (
                          <FiCheckCircle className="text-green-500" size={32} />
                        )}
                      </div>

                      <h4 className="text-xl font-black text-slate-800 leading-tight">
                        {lead.name}
                      </h4>
                      <div className="flex items-center gap-2 text-slate-400 text-sm mt-2 font-medium">
                        <FiMapPin size={14} className="text-blue-500" />
                        <span>
                          {lead.city}, {lead.district}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-50">
                        <span className="text-slate-800 font-black text-lg">
                          <FiPhone className="inline mr-1 text-blue-600" />{" "}
                          {lead.contactNo}
                        </span>
                        <span
                          className={`text-[10px] font-black ${lead.detailsSent ? "text-green-500" : "text-amber-500"}`}
                        >
                          {lead.detailsSent ? "INVITED" : "PENDING"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CampaignCenter;
