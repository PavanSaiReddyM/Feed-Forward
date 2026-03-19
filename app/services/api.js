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