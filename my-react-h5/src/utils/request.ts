// utils/request.ts
import axios, { AxiosError, type AxiosRequestConfig } from "axios";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
});

// 是否正在刷新的标记
let isRefreshing = false;
// 存放等待的请求
let requests: ((token: string) => void)[] = [];

// 请求拦截器
request.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
request.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // 如果是 401，说明 accessToken 过期
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("No refresh token");

          // 调用刷新接口
          const resp = await axios.post("/refresh", { refreshToken });
          const newAccessToken = resp.data.data.accessToken;

          // 更新本地存储
          localStorage.setItem("accessToken", newAccessToken);

          // 执行队列里的请求
          requests.forEach((cb) => cb(newAccessToken));
          requests = [];

          return request(originalRequest);
        } catch (err) {
          // 刷新失败，跳转登录
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else {
        // 如果正在刷新，把请求挂起
        return new Promise((resolve) => {
          requests.push((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(request(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default request;
