import AsyncStorage from "@react-native-async-storage/async-storage";

/* ─── CONFIG ─── */
// For development: Use your machine's IP address on the network
// To find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
// Example: "http://192.168.0.135:5000/api" for network or "http://localhost:5000/api" for web
export const BASE_URL = "http://10.10.50.45:5000/api";

const TOKEN_KEY = "foodsaver_token";
const USER_KEY = "foodsaver_user";

/* ─── STORAGE HELPERS ─── */
export const saveToken = (token) => AsyncStorage.setItem(TOKEN_KEY, token);
export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);
export const removeToken = () => AsyncStorage.removeItem(TOKEN_KEY);

export const saveUser = (user) => AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
export const getUser = async () => {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};
export const removeUser = () => AsyncStorage.removeItem(USER_KEY);

export const clearSession = async () => {
  await removeToken();
  await removeUser();
};

/* ─── CORE REQUEST ─── */
async function request(path, options = {}) {
  const token = await getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || data.message || "Something went wrong");
  }

  return data;
}

/* ─── AUTH API ─── */
export async function register(payload) {
  return request("/auth/register", { method: "POST", body: payload });
}

export async function login(email, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  await saveToken(data.token);
  if (data.user) await saveUser(data.user);
  return data;
}

export async function getSession() {
  const token = await getToken();
  const user = await getUser();
  if (!token || !user) return null;
  return { token, user };
}

/* ─── USER ─── */
export async function getProfile() {
  return request("/auth/me", { method: "GET" });
}

export async function updateProfile(updates) {
  return request("/auth/me", { method: "PUT", body: updates });
}

/* ─── DONATIONS ─── */
export async function postDonation(payload) {
  if (payload.imageUri) {
    const token = await getToken();
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (key === "imageUri" && value) {
        formData.append("image", {
          uri: value,
          name: "photo.jpg",
          type: "image/jpeg",
        });
      } else if (key === "location" && value && typeof value === "object") {
        // Serialize location object properly
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const res = await fetch(`${BASE_URL}/food`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || data.message || "Failed to post donation");
    return data;
  } else {
    return request("/food", { method: "POST", body: payload });
  }
}

export async function cancelDonation(id) {
  return request(`/food/${id}`, { method: "DELETE" });
}

export async function getDonorActiveDonations() {
  return request("/food/donor", { method: "GET" });
}

export async function getDonorDonationHistory() {
  return request("/food/donor/history", { method: "GET" });
}

/* ─── REQUESTS ─── */
export async function getNgoRequests() {
  return request("/requests", { method: "GET" });
}

export async function requestFood(payload) {
  return request("/requests", { method: "POST", body: payload });
}

/* ─── DASHBOARD ─── */
export async function getDonorDashboard() {
  return request("/dashboard/donor", { method: "GET" });
}

export async function getNgoDashboard() {
  return request("/dashboard/ngo", { method: "GET" });
}

export async function getAdminDashboard() {
  return request("/dashboard/admin", { method: "GET" });
}

/* ─── ADMIN ─── */
export async function getNGOs() {
  return request("/admin/users", { method: "GET" });
}

export async function verifyNGO(id) {
  return request(`/admin/verify/${id}`, { method: "PUT" });
}

export async function blockNGO(id) {
  return request(`/admin/block/${id}`, { method: "PUT" });
}

export async function getComplaints() {
  return request("/complaints", { method: "GET" });
}

export async function resolveComplaint(id) {
  return request(`/complaints/resolve/${id}`, { method: "PUT" });
}

/* ─── EXTRA ─── */
export async function getNearbyFood() {
  return request("/food/nearby", { method: "GET" });
}

export default function Dummy() {
  return null;
}