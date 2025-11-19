// API 接口路由文件

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// 认证相关
export const AUTH_API = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
};

// 图片识别
export const RECOGNITION_API = {
  RECOGNIZE: `${API_BASE_URL}/recognize`,
  HISTORY: `${API_BASE_URL}/history`,
  RESULT: (id: string) => `${API_BASE_URL}/result/${id}`,
};

// 病害知识库
export const DISEASE_API = {
  LIST: `${API_BASE_URL}/diseases`,
  DETAIL: (id: string) => `${API_BASE_URL}/diseases/${id}`,
};

// 用户相关
export const USER_API = {
  PROFILE: `${API_BASE_URL}/user/profile`,
  AVATAR: `${API_BASE_URL}/user/avatar`,
};

// 反馈
export const FEEDBACK_API = {
  SUBMIT: `${API_BASE_URL}/feedback`,
};

// 管理员
export const ADMIN_API = {
  STATS: `${API_BASE_URL}/admin/stats`,
  ADMINS: `${API_BASE_URL}/admin/admins`,
  USERS: `${API_BASE_URL}/admin/users`,
  FEEDBACKS: `${API_BASE_URL}/admin/feedbacks`,
};
