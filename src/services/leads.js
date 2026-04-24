import api from "./api";

export async function autoFetchCustomers(payload) {
  const res = await api.post(
    "/api/supplier-leads/auto-fetch/google-places/customers",
    payload,
  );
  return res.data;
}

export async function getDistrictCustomers(district, page = 1, limit = 1000) {
  const res = await api.get("/api/supplier-leads", {
    params: {
      leadType: "customer",
      district,
      page,
      limit,
    },
  });
  return res.data;
}

export async function markMessageSent(id, note = "") {
  const res = await api.patch(
    "/api/supplier-leads/" + id + "/mark-message-sent",
    {
      note,
    },
  );
  return res.data;
}

export async function markCalled(id, note = "", closed = false) {
  const res = await api.patch("/api/supplier-leads/" + id + "/mark-called", {
    note,
    closed,
  });
  return res.data;
}

export async function getDistrictSummary() {
  const res = await api.get("/api/supplier-leads/district-summary/all");
  return res.data;
}
