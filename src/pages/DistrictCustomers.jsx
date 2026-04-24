import { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  autoFetchCustomers,
  getDistrictSummary,
  getDistrictCustomers,
  markCalled,
  markMessageSent,
} from "../services/leads";
import { FiSearch, FiRefreshCw, FiCheckCircle } from "react-icons/fi";

const DISTRICTS = [
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Mullaitivu",
  "Vavuniya",
  "Colombo",
  "Gampaha",
  "Kandy",
  "Galle",
  "Matara",
  "Badulla",
  "Mahiyanganaya"
];

function normalizeCustomers(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.leads)) return payload.leads;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  return [];
}

function getLeadId(lead) {
  return lead?._id || lead?.id || lead?.leadId;
}

export default function DistrictCustomers() {
  const [selectedDistrict, setSelectedDistrict] = useState("Jaffna");
  const [customers, setCustomers] = useState([]);
  const [districtSummary, setDistrictSummary] = useState([]);
  const [isFetchingSources, setIsFetchingSources] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [busyLeadId, setBusyLeadId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [noteMap, setNoteMap] = useState({});

  useEffect(() => {
    loadSummary();
  }, []);

  const hasRows = useMemo(() => customers.length > 0, [customers]);

  const loadDistrictCustomers = async (district) => {
    try {
      setIsLoadingList(true);
      const data = await getDistrictCustomers(district);
      setCustomers(normalizeCustomers(data));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load customers");
    } finally {
      setIsLoadingList(false);
    }
  };

  const loadSummary = async () => {
    try {
      setIsLoadingSummary(true);
      const data = await getDistrictSummary();
      setDistrictSummary(normalizeCustomers(data));
    } catch {
      setDistrictSummary([]);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleFetchCustomers = async () => {
    const payload = {
      district: selectedDistrict,
      productTypes: ["safety gloves", "industrial gloves", "rubber bands"],
      customerNeeds: [
        "block supplier",
        "concrete product supplier",
        "metal crusher supplier",
        "construction material supplier",
        "hardware store",
      ],
      maxResults: 500,
      includeRawResults: true,
    };

    try {
      setIsFetchingSources(true);
      await autoFetchCustomers(payload);
      toast.success("Customer lead fetch completed");
      await loadDistrictCustomers(selectedDistrict);
      await loadSummary();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Auto-fetch failed");
    } finally {
      setIsFetchingSources(false);
    }
  };

  const handleMessageSent = async (leadId) => {
    if (!leadId) return;

    try {
      setBusyLeadId(leadId + "-message");
      await markMessageSent(leadId, noteMap[leadId] || "");
      toast.success("Marked as message sent");
      setNoteMap((prev) => ({ ...prev, [leadId]: "" }));
      await loadDistrictCustomers(selectedDistrict);
      await loadSummary();
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || "Update failed";
      console.error("Message Sent Error:", error?.response?.data || error);
      toast.error(errorMsg);
    } finally {
      setBusyLeadId("");
    }
  };

  const handleCalled = async (leadId) => {
    if (!leadId) return;

    try {
      setBusyLeadId(leadId + "-called");
      await markCalled(leadId, noteMap[leadId] || "", false);
      toast.success("Marked as called");
      setNoteMap((prev) => ({ ...prev, [leadId]: "" }));
      await loadDistrictCustomers(selectedDistrict);
      await loadSummary();
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || "Update failed";
      console.error("Called Error:", error?.response?.data || error);
      toast.error(errorMsg);
    } finally {
      setBusyLeadId("");
    }
  };

  const handleMarkSuccess = async (leadId) => {
    if (!leadId) return;

    try {
      setBusyLeadId(leadId + "-success");
      const note = noteMap[leadId] || "";

      const lead = customers.find((c) => getLeadId(c) === leadId);
      if (lead && !lead.messageSent) {
        await markMessageSent(leadId, note);
      }

      await markCalled(leadId, note, false);

      toast.success("Contact success marked");
      setNoteMap((prev) => ({ ...prev, [leadId]: "" }));
      await loadDistrictCustomers(selectedDistrict);
      await loadSummary();
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || "Update failed";
      console.error("Mark Success Error:", error?.response?.data || error);
      toast.error(errorMsg);
    } finally {
      setBusyLeadId("");
    }
  };

  const filteredCustomers = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return customers.filter((lead) => {
      const name = (lead?.businessName || lead?.name || "").toLowerCase();
      const phone = (lead?.phone || "").toLowerCase();
      const whatsapp = (lead?.whatsappNumber || "").toLowerCase();
      const messageSent = Boolean(lead?.messageSent);
      const called = Boolean(lead?.called);
      const isSuccess = messageSent && called;

      const matchesSearch =
        !query ||
        name.includes(query) ||
        phone.includes(query) ||
        whatsapp.includes(query);

      if (!matchesSearch) return false;
      if (statusFilter === "all") return true;
      if (statusFilter === "success") return isSuccess;
      if (statusFilter === "messaged") return messageSent && !called;
      if (statusFilter === "called") return called;
      if (statusFilter === "pending") return !messageSent && !called;

      return true;
    });
  }, [customers, searchText, statusFilter]);

  const stats = useMemo(() => {
    const total = customers.length;
    const messaged = customers.filter((c) => c?.messageSent).length;
    const called = customers.filter((c) => c?.called).length;
    const success = customers.filter((c) => c?.messageSent && c?.called).length;
    const pending = total - success;

    return { total, messaged, called, success, pending };
  }, [customers]);

  const summaryRow = useMemo(
    () =>
      districtSummary.find((row) => {
        const name = row?.district || row?._id || row?.name || "";
        return String(name).toLowerCase() === selectedDistrict.toLowerCase();
      }) || null,
    [districtSummary, selectedDistrict],
  );

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <ToastContainer theme="dark" position="top-right" />

      <div className="mx-auto max-w-7xl">
        {/* Control Section */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur mb-6">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
              Customer Contact Success
            </p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              District Sales Outreach Tracker
            </h1>
          </div>

          <div className="grid gap-3 md:grid-cols-3 mb-4">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-cyan-300 focus:outline-none"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-cyan-300 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="success">Contact Success</option>
              <option value="messaged">Message Sent Only</option>
              <option value="called">Called Only</option>
              <option value="pending">Pending</option>
            </select>

            <button
              onClick={() => loadDistrictCustomers(selectedDistrict)}
              disabled={isLoadingList}
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-70 inline-flex items-center justify-center gap-2"
            >
              <FiRefreshCw size={14} />
              {isLoadingList ? "Loading..." : "Load Table"}
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 flex-1">
              <FiSearch className="text-slate-300" size={16} />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by business, phone, or WhatsApp"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <button
              onClick={handleFetchCustomers}
              disabled={isFetchingSources}
              className="rounded-xl bg-cyan-400 px-6 py-2.5 text-sm font-bold text-slate-900 hover:bg-cyan-300 disabled:opacity-70 whitespace-nowrap"
            >
              {isFetchingSources ? "Fetching..." : "Fetch Customers"}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="mt-5 grid gap-3 sm:grid-cols-5">
            <div className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                Total
              </p>
              <p className="mt-1 text-2xl font-extrabold text-cyan-200">
                {stats.total}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                Messaged
              </p>
              <p className="mt-1 text-2xl font-extrabold text-amber-200">
                {stats.messaged}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                Called
              </p>
              <p className="mt-1 text-2xl font-extrabold text-sky-200">
                {stats.called}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                Success
              </p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-200">
                {stats.success}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                Pending
              </p>
              <p className="mt-1 text-2xl font-extrabold text-rose-200">
                {stats.pending}
              </p>
            </div>
          </div>
        </section>

        {/* Customers Table */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Customer List</h2>
            <p className="text-sm text-slate-300">
              Showing {filteredCustomers.length} of {customers.length}
            </p>
          </div>

          {!hasRows ? (
            <p className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-6 text-center text-slate-300">
              No customer leads loaded. Select a district and click Load Table.
            </p>
          ) : filteredCustomers.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-6 text-center text-slate-300">
              No results match your search or filter.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-900/90 text-slate-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Business</th>
                    <th className="px-4 py-3 font-semibold">Phone</th>
                    <th className="px-4 py-3 font-semibold">WhatsApp</th>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-center">Msg</th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Call
                    </th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Attempts
                    </th>
                    <th className="px-4 py-3 font-semibold">Note</th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-slate-950/40">
                  {filteredCustomers.map((lead) => {
                    const leadId = getLeadId(lead);
                    const businessName =
                      lead?.businessName || lead?.name || "-";
                    const phone = lead?.phone || "-";
                    const whatsapp = lead?.whatsappNumber || "-";
                    const product = lead?.productType || "-";
                    const messageSent = Boolean(lead?.messageSent);
                    const called = Boolean(lead?.called);
                    const isSuccess = messageSent && called;
                    const outreachStatus = lead?.outreachStatus || "pending";
                    const attempts = lead?.contactAttempts || 0;

                    return (
                      <tr
                        key={leadId}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-cyan-100">
                          {businessName}
                        </td>
                        <td className="px-4 py-3 text-slate-300 text-xs">
                          {phone}
                        </td>
                        <td className="px-4 py-3 text-slate-300 text-xs">
                          {whatsapp}
                        </td>
                        <td className="px-4 py-3 text-slate-300 text-xs">
                          {product}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              outreachStatus === "called"
                                ? "bg-emerald-400/20 text-emerald-200"
                                : outreachStatus === "messaged"
                                  ? "bg-amber-400/20 text-amber-200"
                                  : outreachStatus === "closed"
                                    ? "bg-blue-400/20 text-blue-200"
                                    : "bg-slate-400/20 text-slate-200"
                            }`}
                          >
                            {outreachStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {messageSent ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-400/20 text-emerald-200">
                              <FiCheckCircle size={14} />
                            </span>
                          ) : (
                            <span className="text-slate-400">○</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {called ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-400/20 text-emerald-200">
                              <FiCheckCircle size={14} />
                            </span>
                          ) : (
                            <span className="text-slate-400">○</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-300 font-semibold">
                          {attempts}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={noteMap[leadId] || ""}
                            onChange={(e) =>
                              setNoteMap((prev) => ({
                                ...prev,
                                [leadId]: e.target.value,
                              }))
                            }
                            placeholder="Add note..."
                            className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-2 py-1 text-xs text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            {!messageSent && (
                              <button
                                onClick={() => handleMessageSent(leadId)}
                                disabled={busyLeadId === leadId + "-message"}
                                className="rounded px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-300/40 hover:bg-amber-500/30 disabled:opacity-60"
                              >
                                {busyLeadId === leadId + "-message"
                                  ? "..."
                                  : "Msg"}
                              </button>
                            )}
                            {!called && (
                              <button
                                onClick={() => handleCalled(leadId)}
                                disabled={busyLeadId === leadId + "-called"}
                                className="rounded px-2.5 py-1 text-xs font-bold bg-sky-500/20 text-sky-200 border border-sky-300/40 hover:bg-sky-500/30 disabled:opacity-60"
                              >
                                {busyLeadId === leadId + "-called"
                                  ? "..."
                                  : "Call"}
                              </button>
                            )}
                            {!isSuccess && (
                              <button
                                onClick={() => handleMarkSuccess(leadId)}
                                disabled={busyLeadId === leadId + "-success"}
                                className="rounded px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-300/40 hover:bg-emerald-500/30 disabled:opacity-60"
                              >
                                {busyLeadId === leadId + "-success"
                                  ? "..."
                                  : "Success"}
                              </button>
                            )}
                            {isSuccess && (
                              <span className="rounded px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-200 text-center">
                                ✓ Done
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
