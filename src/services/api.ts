import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 配置 API 基础地址
const API_BASE_URL = 'http://118.31.127.182:5000/api';

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 自动添加 JWT Token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('获取 token 失败:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一处理响应和错误
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        await AsyncStorage.removeItem('jwt_token');
      }

      return Promise.reject({
        success: false,
        message: data.message || '请求失败',
        status,
      });
    } else if (error.request) {
      return Promise.reject({
        success: false,
        message: '网络错误，请检查网络连接',
      });
    } else {
      return Promise.reject({
        success: false,
        message: error.message || '未知错误',
      });
    }
  }
);

// API 接口定义

/**
 * 用户认证 API
 */
export const authAPI = {
  // 登录
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),

  // 登出
  logout: () => api.post('/auth/logout'),
};

/**
 * 员工管理 API
 */
export const employeeAPI = {
  // 获取员工列表
  getList: (params?: { page?: number; page_size?: number; name?: string }) =>
    api.get('/employees', { params }),

  // 根据 ID 获取员工详情
  getById: (id: number) => api.get(`/employees/${id}`),

  // 创建员工
  create: (data: { name: string; age: number; email: string }) =>
    api.post('/employees', data),

  // 更新员工
  update: (id: number, data: { name: string; age: number; email: string }) =>
    api.put(`/employees/${id}`, data),

  // 删除员工
  delete: (id: number) => api.delete(`/employees/${id}`),
};

/**
 * 分类管理 API
 */
export const categoryAPI = {
  // 获取分类列表
  getList: () => api.get('/categories'),

  // 根据 ID 获取分类详情
  getById: (id: number) => api.get(`/categories/${id}`),

  // 创建分类
  create: (data: { name: string }) => api.post('/categories', data),

  // 更新分类
  update: (id: number, data: { name: string }) =>
    api.put(`/categories/${id}`, data),

  // 删除分类
  delete: (id: number) => api.delete(`/categories/${id}`),

  // 获取分类下的设备
  getDevices: (id: number) => api.get(`/categories/${id}/devices`),
};

/**
 * 设备管理 API
 */
export const deviceAPI = {
  // 获取设备列表
  getList: (params?: { page?: number; page_size?: number; category_id?: number; name?: string }) =>
    api.get('/devices', { params }),

  // 根据 ID 获取设备详情
  getById: (id: number) => api.get(`/devices/${id}`),

  // 创建设备
  create: (data: { name: string; model: string; category_id: number }) =>
    api.post('/devices', data),

  // 更新设备
  update: (
    id: number,
    data: { name: string; model: string; category_id: number }
  ) => api.put(`/devices/${id}`, data),

  // 删除设备
  delete: (id: number) => api.delete(`/devices/${id}`),
};

/**
 * 仪表盘 API
 */
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
