const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API request failed");
  return data;
}

// --- Users ---
export function loginUser(phone, name) {
  return request("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ phone, name }),
  });
}

// --- Lands ---
export function fetchLands(userId) {
  return request(`/api/lands/${userId}`);
}

export function createLand(landData) {
  return request("/api/lands", {
    method: "POST",
    body: JSON.stringify(landData),
  });
}

export function updateLand(landId, updates) {
  return request(`/api/lands/${landId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export function appendHistory(landId, year, crop) {
  return request(`/api/lands/${landId}/history`, {
    method: "PUT",
    body: JSON.stringify({ year, crop }),
  });
}

export function deleteLand(landId) {
  return request(`/api/lands/${landId}`, { method: "DELETE" });
}
