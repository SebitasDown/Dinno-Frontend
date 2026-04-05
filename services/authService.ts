import { api } from "./api";

export const authService = {
    login : async (email: string, password: string) => {
        const response = await api.post("/api/auth/login", { identifier: email, password });
        return response.data;
    },

    register : async (username: string, email: string, password: string) => {
        const response = await api.post("/api/auth/register", {username, email, password});
        return response.data;
    }
};
