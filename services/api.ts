import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import axios from "axios";
import { authService } from "./authService";

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 120000, // 120 segundos para el "cold start" de Render
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor global para manejar tokens caducados (401) o problemas de ruteo/gateway (404/503)
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const url = error.config?.url;
        const isAuthRequest = url?.includes('/api/auth/login') || url?.includes('/api/auth/register');

        if ((status === 401 || (status === 404 && url?.includes('/api/'))) && !originalRequest._retry && !isAuthRequest) {
            
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = useAuthStore.getState().refreshToken;

            if (refreshToken) {
                try {
                    console.log("Intentando refrescar token...");
                    const data = await authService.refresh(refreshToken);
                    const { accessToken, refreshToken: newRefreshToken } = data;

                    await useAuthStore.getState().setTokens(accessToken, newRefreshToken);
                    
                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                    processQueue(null, accessToken);
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    console.error("No se pudo refrescar el token. Cerrando sesión...");
                    const logout = useAuthStore.getState().logout;
                    await logout();
                    try { router.replace('/'); } catch(e) {}
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                console.error("No hay refresh token disponible. Cerrando sesión...");
                const logout = useAuthStore.getState().logout;
                await logout();
                try { router.replace('/'); } catch(e) {}
                // IMPORTANTE: Retornar el error original para que el front lo maneje
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);