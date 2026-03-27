/**
 * Get all requests made by the logged-in NGO.
 * Returns an array of request objects.
 */
export async function getNgoRequests() {
    return request("/requests", { method: "GET" });
}
/**
 * Send a request for a food donation as an NGO.
 * @param {Object} payload - { foodId, ngoId }
 * Returns the created request object.
 */
export async function requestFood(payload) {
    return request("/requests", { method: "POST", body: payload });
}
/**
 * Cancel (delete) a food donation by ID.
 * @param {string} id - Food donation ID
 */
export async function cancelDonation(id) {
    return request(`/food/${id}`, { method: "DELETE" });
}
/**
 * Get the current user's profile.
 */
export async function getProfile() {
    return request("/auth/me", { method: "GET" });
}

/**
 * Update the current user's profile.
 * @param {Object} updates - { name, email, phone, location, address }
 */
export async function updateProfile(updates) {
    return request("/auth/me", { method: "PUT", body: updates });
}
/**
 * Get all delivered (and expired) donations posted by the logged-in donor.
 * Returns an array of food objects.
 */
export async function getDonorDonationHistory() {
    return request("/food/donor/history", { method: "GET" });
}
/**
 * Get all active donations posted by the logged-in donor.
 * Returns an array of food objects.
 */
export async function getDonorActiveDonations() {
    return request("/food/donor", { method: "GET" });
}
/**
 * Post a new food donation.
 * @param {Object} payload - { foodName, foodType, quantity, expiry, location, locationCoords, pickupTime, note, imageUri }
 * Returns the created food object.
 */
export async function postDonation(payload) {
    // If imageUri is present, use multipart/form-data, else JSON
    if (payload.imageUri) {
        const token = await getToken();
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
            if (key === "imageUri" && value) {
                // For React Native fetch, image must be { uri, name, type }
                formData.append("image", {
                    uri: value,
                    name: "photo.jpg",
                    type: "image/jpeg"
                });
            } else if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });
        const res = await fetch(`${BASE_URL}/food`, {
            method: "POST",
            headers: {
                "Authorization": token ? `Bearer ${token}` : undefined,
                // 'Content-Type' should NOT be set for FormData in React Native
            },
            body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || data.message || "Something went wrong");
        return data;
    } else {
        return request("/food", { method: "POST", body: payload });
    }
}
// ─── Dashboard API ─────────────────────────────────────────────────────────
export async function getDonorDashboard() {
    return request("/dashboard/donor", { method: "GET" });
}

export async function getNgoDashboard() {
    return request("/dashboard/ngo", { method: "GET" });
}

export async function getAdminDashboard() {
/**
 * Get available food donations near the logged-in NGO.
 * Returns an array of food objects.
 */
export async function getNearbyFood() {
     return request("/food/nearby", { method: "GET" });
}
    return request("/dashboard/admin", { method: "GET" });
}
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Change this to your machine's local IP when testing on a physical device ──
// For Android emulator use: http://10.0.2.2:5000
// For iOS simulator use:    http://localhost:5000
// For physical device use:  http://YOUR_COMPUTER_IP:5000
export const BASE_URL = "http://10.0.2.2:5000/api";

const TOKEN_KEY = "foodsaver_token";
const USER_KEY = "foodsaver_user";

// ─── Token helpers ────────────────────────────────────────────────────────────
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

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
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
        // Throw the server's error message so UI can display it
        throw new Error(data.msg || data.message || "Something went wrong");
    }

    return data;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * @param {{ name, email, password, role, phone }} payload
 * role must be one of: "donor" | "receiver" | "admin"
 */
export async function register(payload) {
    return request("/auth/register", { method: "POST", body: payload });
}

/**
 * Login with email + password.
 * Returns { token, role }
 * Also persists token + user to AsyncStorage automatically.
 */
export async function login(email, password) {
    const data = await request("/auth/login", {
        method: "POST",
        body: { email, password },
    });
    // data = { token, user: { _id, name, email, role, ... } }
    await saveToken(data.token);
    if (data.user) await saveUser(data.user);
    return data;
}

/**
 * Check if user is already logged in (app reopen).
 * Returns stored user object or null.
 */
export async function getSession() {
    const token = await getToken();
    const user = await getUser();
    if (!token || !user) return null;
    return { token, user };
}