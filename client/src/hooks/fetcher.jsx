import axios from "axios"

const instance = axios.create({
    baseURL: "https://api.xolt.uz/api/"
})


instance.interceptors.request.use((config) => {
    const lang = localStorage.getItem("language") || "en";
    const url = String(config.url || "").replace(/^\/+/, "");
    config.url = `/${lang}/v1/${url}`;
    return config;
});
export default instance