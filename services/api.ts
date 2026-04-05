import axios from "axios";

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 120000, // 120 segundos para el "cold start" de Render
    headers: {
        "Content-Type": "application/json",
    },
});