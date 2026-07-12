import { api } from "../lib/api";
export const TOKEN_KEY = "access_token";

export const authService = {
    async login(email: string, password: string) {
        const res = await api.post('/auth/login', { email, password });
        return res.data; // { accessToken, message }
    },

    async register(email: string, password: string, passwordTwo: string, fullName: string, identityCard: string, phone: string, roles: string) {
        const res = await api.post('/auth/register', { email, password, passwordTwo, fullName, identityCard, phone, roles });
        return res.data;
    },

    saveToken(token: string) {
        localStorage.setItem(TOKEN_KEY, token); // TOKEN_KEY is now a real variable in scope
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    isLoggedIn() {
        return !!this.getToken();
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
    },
}
