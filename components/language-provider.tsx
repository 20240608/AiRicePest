'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻译字典
const translations = {
  zh: {
    // 通用
    'common.home': '主页',
    'common.history': '历史记录',
    'common.knowledge': '知识库',
    'common.profile': '个人中心',
    'common.feedback': '反馈',
    'common.logout': '退出登录',
    'common.login': '登录',
    'common.register': '注册',
    'common.submit': '提交',
    'common.cancel': '取消',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.search': '搜索',
    'common.back': '返回',
    'common.loading': '加载中...',
    'common.success': '成功',
    'common.error': '错误',
    
    // 主页
    'home.title': '智能病虫害识别系统',
    'home.upload': '点击上传图片进行识别 (支持 JPG/PNG)',
    'home.analyzing': '正在诊断中...',
    'home.welcome': '您好！我是水稻病虫害AI识别助手。请上传一张植物叶片照片，我会为您诊断病害。',
    'home.newChat': '开启新对话',
    'home.openKnowledge': '打开知识库',
    'home.searchHistory': '搜索历史记录...',
    'home.viewDetail': '查看详情',
    'home.provideFeedback': '提供反馈',
    'home.aiAnalyzing': 'AI 正在分析图像特征，请稍候...',
    'home.disclaimer': 'AI 识别结果仅供参考，建议结合专业农技人员意见。',
    
    // 历史记录
    'history.title': '识别历史',
    'history.subtitle': '查看所有病虫害识别记录',
    'history.date': '日期',
    'history.image': '图片',
    'history.result': '识别结果',
    'history.confidence': '置信度',
    'history.action': '操作',
    'history.refresh': '刷新',
    'history.noRecords': '暂无识别记录',
    'history.showing': '显示',
    'history.of': '条，共',
    'history.records': '条',
    'history.page': '第',
    'history.totalPages': '页',
    'history.prevPage': '上一页',
    'history.nextPage': '下一页',
    
    // 结果详情
    'result.title': '识别结果详情',
    'result.recognizedAt': '识别时间',
    'result.uploadedImage': '上传的图片',
    'result.confidence': '置信度',
    'result.description': '病害描述',
    'result.cause': '发病原因',
    'result.symptoms': '主要症状',
    'result.solutions': '防治方案',
    'result.feedback': '提供反馈',
    'result.notFound': '未找到识别结果',
    'result.backToHistory': '返回历史记录',
    'result.backToHome': '返回主页',
    
    // 反馈
    'feedback.title': '意见反馈',
    'feedback.inputRequired': '请输入反馈内容',
    'feedback.error': '提交失败，请稍后重试',
    'feedback.subtitle': '告诉我们您的想法，帮助我们改进',
    'feedback.content': '反馈内容',
    'feedback.contentPlaceholder': '请描述您的问题、建议或意见（最多200字）',
    'feedback.contentRequired': '请输入反馈内容',
    'feedback.images': '截图或照片（可选）',
    'feedback.imagesHint': '如有相关截图或照片，可以上传帮助我们更好地理解（最多3张）',
    'feedback.contact': '联系方式（可选）',
    'feedback.contactPlaceholder': 'your.email@example.com 或 手机号',
    'feedback.contactHint': '留下您的邮箱或手机号，以便我们回复您',
    'feedback.uploading': '提交中...',
    'feedback.success': '提交成功！',
    'feedback.successMessage': '感谢您的宝贵反馈，我们会认真处理',
    'feedback.privacy': '我们承诺保护您的隐私，您的反馈仅用于改进产品和服务',
    'feedback.alert': '您的反馈对我们非常重要！请详细描述您遇到的问题或建议，我们会尽快回复您。',
    'feedback.clickUpload': '点击上传',
    
    // 个人中心
    'profile.title': '个人中心',
    'profile.subtitle': '管理您的账户信息',
    'profile.edit': '编辑资料',
    'profile.basicInfo': '基本信息',
    'profile.username': '用户名',
    'profile.email': '邮箱地址',
    'profile.changePassword': '修改密码（可选）',
    'profile.currentPassword': '当前密码',
    'profile.currentPasswordPlaceholder': '请输入当前密码',
    'profile.newPassword': '新密码',
    'profile.newPasswordPlaceholder': '请输入新密码（至少6位）',
    'profile.confirmPassword': '确认新密码',
    'profile.confirmPasswordPlaceholder': '再次输入新密码',
    'profile.registeredAt': '注册时间',
    'profile.recognitionCount': '识别次数',
    'profile.times': '次',
    'profile.saving': '保存中...',
    'profile.saveSuccess': '个人信息保存成功！',
    
    // 知识库
    'knowledge.title': '病虫害知识库',
    'knowledge.subtitle': '了解常见水稻病虫害及防治方法',
    'knowledge.searchPlaceholder': '搜索病害名称或描述...',
    'knowledge.all': '全部',
    'knowledge.fungal': '真菌病害',
    'knowledge.bacterial': '细菌病害',
    'knowledge.pest': '虫害',
    'knowledge.high': '高危',
    'knowledge.medium': '中危',
    'knowledge.low': '低危',
    'knowledge.noResults': '未找到相关病虫害信息',
    
    // 登录
    'login.title': '欢迎回来',
    'login.subtitle': '登录您的账户',
    'login.username': '用户名',
    'login.password': '密码',
    'login.remember': '记住我',
    'login.forgot': '忘记密码？',
    'login.submit': '登录',
    'login.noAccount': '还没有账户？',
    'login.register': '立即注册',
    'login.adminQuick': '管理员快速登录',
    'login.error': '登录失败，请检查用户名和密码',
    
    // 注册
    'register.title': '创建账户',
    'register.subtitle': '开始使用AI病虫害识别',
    'register.confirmPassword': '确认密码',
    'register.hasAccount': '已有账户？',
    'register.login': '立即登录',
    'register.passwordMismatch': '两次输入的密码不一致',
    'register.passwordTooShort': '密码长度至少6位',
    'register.error': '注册失败，请重试',
    
    // 管理后台
    'admin.dashboard': '数据面板',
    'admin.users': '用户管理',
    'admin.admins': '管理员管理',
    'admin.feedbacks': '反馈管理',
    'admin.stats': '统计数据',
    'admin.totalUsers': '总用户数',
    'admin.totalRecognitions': '总识别次数',
    'admin.totalFeedbacks': '总反馈数',
    'admin.activeUsers': '活跃用户',
    
    // 主题
    'theme.light': '浅色主题',
    'theme.dark': '深色主题',
    'theme.blue': '蓝色主题',
    'theme.green': '绿色主题',
    'theme.switch': '切换主题',
    
    // 语言
    'language.switch': '切换语言',
    'language.chinese': '简体中文',
    'language.english': 'English',
  },
  en: {
    // Common
    'common.home': 'Home',
    'common.history': 'History',
    'common.knowledge': 'Knowledge',
    'common.profile': 'Profile',
    'common.feedback': 'Feedback',
    'common.logout': 'Logout',
    'common.login': 'Login',
    'common.register': 'Register',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.back': 'Back',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    
    // Home
    'home.title': 'AI Rice Disease Recognition System',
    'home.upload': 'Click to upload image (JPG/PNG)',
    'home.analyzing': 'Analyzing...',
    'home.welcome': 'Hello! I am an AI assistant for rice disease recognition. Please upload a photo of plant leaves for diagnosis.',
    'home.newChat': 'New Chat',
    'home.openKnowledge': 'Open Knowledge Base',
    'home.searchHistory': 'Search history...',
    'home.viewDetail': 'View Details',
    'home.provideFeedback': 'Provide Feedback',
    'home.aiAnalyzing': 'AI is analyzing image features, please wait...',
    'home.disclaimer': 'AI recognition results are for reference only. Consult professional agronomists.',
    
    // History
    'history.title': 'Recognition History',
    'history.subtitle': 'View all disease recognition records',
    'history.date': 'Date',
    'history.image': 'Image',
    'history.result': 'Result',
    'history.confidence': 'Confidence',
    'history.action': 'Action',
    'history.refresh': 'Refresh',
    'history.noRecords': 'No records found',
    'history.showing': 'Showing',
    'history.of': 'of',
    'history.records': 'records',
    'history.page': 'Page',
    'history.totalPages': 'of',
    'history.prevPage': 'Previous',
    'history.nextPage': 'Next',
    
    // Result
    'result.title': 'Recognition Result Details',
    'result.recognizedAt': 'Recognized at',
    'result.uploadedImage': 'Uploaded Image',
    'result.confidence': 'Confidence',
    'result.description': 'Disease Description',
    'result.cause': 'Disease Cause',
    'result.symptoms': 'Main Symptoms',
    'result.solutions': 'Treatment Solutions',
    'result.feedback': 'Provide Feedback',
    'result.notFound': 'Result not found',
    'result.backToHistory': 'Back to History',
    'result.backToHome': 'Back to Home',
    
    // Feedback
    'feedback.title': 'Feedback',
    'feedback.inputRequired': 'Please enter feedback content',
    'feedback.error': 'Submission failed, please try again later',
    'feedback.subtitle': 'Tell us your thoughts to help us improve',
    'feedback.content': 'Feedback Content',
    'feedback.contentPlaceholder': 'Describe your issue, suggestion or opinion (max 200 characters)',
    'feedback.contentRequired': 'Please enter feedback content',
    'feedback.images': 'Screenshots or Photos (Optional)',
    'feedback.imagesHint': 'Upload screenshots or photos to help us understand better (max 3)',
    'feedback.contact': 'Contact Info (Optional)',
    'feedback.contactPlaceholder': 'your.email@example.com or phone number',
    'feedback.contactHint': 'Leave your email or phone for us to reply',
    'feedback.uploading': 'Submitting...',
    'feedback.success': 'Submitted Successfully!',
    'feedback.successMessage': 'Thank you for your valuable feedback. We will process it carefully.',
    'feedback.privacy': 'We protect your privacy. Your feedback is only used to improve our product and service.',
    'feedback.alert': 'Your feedback is important to us! Please describe your issue or suggestion in detail.',
    'feedback.clickUpload': 'Click to upload',
    
    // Profile
    'profile.title': 'Profile',
    'profile.subtitle': 'Manage your account information',
    'profile.edit': 'Edit Profile',
    'profile.basicInfo': 'Basic Information',
    'profile.username': 'Username',
    'profile.email': 'Email Address',
    'profile.changePassword': 'Change Password (Optional)',
    'profile.currentPassword': 'Current Password',
    'profile.currentPasswordPlaceholder': 'Enter current password',
    'profile.newPassword': 'New Password',
    'profile.newPasswordPlaceholder': 'Enter new password (min 6 characters)',
    'profile.confirmPassword': 'Confirm Password',
    'profile.confirmPasswordPlaceholder': 'Re-enter new password',
    'profile.registeredAt': 'Registered at',
    'profile.recognitionCount': 'Recognition Count',
    'profile.times': 'times',
    'profile.saving': 'Saving...',
    'profile.saveSuccess': 'Profile saved successfully!',
    
    // Knowledge
    'knowledge.title': 'Disease Knowledge Base',
    'knowledge.subtitle': 'Learn about common rice diseases and treatments',
    'knowledge.searchPlaceholder': 'Search disease name or description...',
    'knowledge.all': 'All',
    'knowledge.fungal': 'Fungal Diseases',
    'knowledge.bacterial': 'Bacterial Diseases',
    'knowledge.pest': 'Pests',
    'knowledge.high': 'High Risk',
    'knowledge.medium': 'Medium Risk',
    'knowledge.low': 'Low Risk',
    'knowledge.noResults': 'No disease information found',
    
    // Login
    'login.title': 'Welcome Back',
    'login.subtitle': 'Login to your account',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.remember': 'Remember me',
    'login.forgot': 'Forgot password?',
    'login.submit': 'Login',
    'login.noAccount': "Don't have an account?",
    'login.register': 'Register now',
    'login.adminQuick': 'Admin Quick Login',
    'login.error': 'Login failed. Please check your username and password',
    
    // Register
    'register.title': 'Create Account',
    'register.subtitle': 'Start using AI disease recognition',
    'register.confirmPassword': 'Confirm Password',
    'register.hasAccount': 'Already have an account?',
    'register.login': 'Login now',
    'register.passwordMismatch': 'Passwords do not match',
    'register.passwordTooShort': 'Password must be at least 6 characters',
    'register.error': 'Registration failed. Please try again',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.users': 'User Management',
    'admin.admins': 'Admin Management',
    'admin.feedbacks': 'Feedback Management',
    'admin.stats': 'Statistics',
    'admin.totalUsers': 'Total Users',
    'admin.totalRecognitions': 'Total Recognitions',
    'admin.totalFeedbacks': 'Total Feedbacks',
    'admin.activeUsers': 'Active Users',
    
    // Theme
    'theme.light': 'Light Theme',
    'theme.dark': 'Dark Theme',
    'theme.blue': 'Blue Theme',
    'theme.green': 'Green Theme',
    'theme.switch': 'Switch Theme',
    
    // Language
    'language.switch': 'Switch Language',
    'language.chinese': '简体中文',
    'language.english': 'English',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const dict = translations[language] as Record<string, string>;
    return dict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
