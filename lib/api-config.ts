// API 配置
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// API 端点
export const API_ENDPOINTS = {
  // 认证
  login: `${API_BASE_URL}/api/login`,
  register: `${API_BASE_URL}/api/register`,
  
  // 用户
  profile: `${API_BASE_URL}/api/profile`,
  
  // 识别
  recognize: `${API_BASE_URL}/api/recognize`,
  recognitions: (id: string) => `${API_BASE_URL}/api/recognitions/${id}`,
  
  // 历史记录
  history: `${API_BASE_URL}/api/history`,
  
  // 知识库
  knowledge: `${API_BASE_URL}/api/knowledge`,
  
  // 反馈
  feedback: `${API_BASE_URL}/api/feedback`,
  
  // 管理员
  adminStats: `${API_BASE_URL}/api/admin/stats`,
  adminUsers: `${API_BASE_URL}/api/admin/users`,
  adminUser: (id: string) => `${API_BASE_URL}/api/admin/users/${id}`,
  adminFeedbacks: `${API_BASE_URL}/api/admin/feedbacks`,
  adminFeedbackStatus: (id: string) => `${API_BASE_URL}/api/admin/feedbacks/${id}/status`,
};

// 通用请求配置
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // 如果不是 FormData，添加 Content-Type
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
};
