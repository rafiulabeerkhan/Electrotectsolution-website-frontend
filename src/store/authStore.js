import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY;

const extractUserFromToken = (token) => {
  try {
    if (!token) throw new Error("Empty token");
    const decoded = jwtDecode(token);
    return {
      id: decoded.id,
      userId: decoded.userId,
      name: decoded.name,
      role: decoded.role?.toLowerCase(),
      isProfileComplete: decoded.isProfileComplete,
      mode: decoded.mode,
    };
  } catch (error) {
    console.error("Invalid JWT token:", error);
    return null;
  }
};

const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
const initialUser = storedAccessToken
  ? extractUserFromToken(storedAccessToken)
  : null;

export const useAuthStore = create((set) => ({
  authUser: initialUser,
  isLoggedIn: Boolean(initialUser),
  accessToken: storedAccessToken,

  setAccessToken: (accessToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    const user = extractUserFromToken(accessToken);
    set({ accessToken, authUser: user, isLoggedIn: Boolean(user) });
  },

  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    set({ authUser: null, isLoggedIn: false, accessToken: null });
  },
}));