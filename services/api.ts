import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 120000, // 120 segundos para el "cold start" de Render
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor global para manejar tokens caducados (401)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Token caducado o inválido (401). Cerrando sesión automáticamente...");
            const logout = useAuthStore.getState().logout;
            await logout();
            try { router.replace('/'); } catch(e) {}
        }
        return Promise.reject(error);
    }
);