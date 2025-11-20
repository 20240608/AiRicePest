'use client';

import { BookOpen, MessageSquare, Search, User, LogOut, Plus, History, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"
import { API_ENDPOINTS, fetchWithAuth } from "@/lib/api-config"
import { Button } from "@/components/ui/button"

// 定义 Props 类型，接收父组件传来的函数
interface AppSidebarProps {
  onOpenKnowledgeBase?: () => void;
}

interface HistoryRecord {
  id: string;
  date: string;
  diseaseName: string;
  confidence: number;
}

export function AppSidebar({ onOpenKnowledgeBase }: AppSidebarProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [recentHistory, setRecentHistory] = useState<HistoryRecord[]>([])

  useEffect(() => {
    fetchRecentHistory()
  }, [])

  const fetchRecentHistory = async () => {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.history + '?limit=5')
      if (response.ok) {
        const data = await response.json()
        setRecentHistory(data.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching recent history:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    router.push('/sign-in');
  };

  const handleKnowledgeBase = () => {
    // 如果提供了回调函数（在主页），调用它来展开知识库
    if (onOpenKnowledgeBase) {
      onOpenKnowledgeBase();
    } else {
      // 否则导航到知识库页面
      router.push('/knowledge');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${month}-${day}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('sidebar.navigation') || '功能导航'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              
              {/* 新建对话 */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/home')}>
                  <Plus />
                  <span>{t('home.newChat')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 打开知识库按钮 - 智能切换 */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleKnowledgeBase}>
                  <BookOpen className="text-blue-500" />
                  <span>{t('sidebar.openKnowledge') || '打开知识库'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 搜索历史 */}
              <SidebarMenuItem>
                <div className="px-2 py-1">
                  <Input 
                    placeholder={t('home.searchHistory')}
                    className="h-8 text-sm"
                  />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 历史记录列表 */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>{t('common.history')}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-xs"
              onClick={() => router.push('/history')}
            >
              {t('history.viewAll') || '查看全部'}
            </Button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentHistory.length > 0 ? (
                recentHistory.map((record) => (
                  <SidebarMenuItem key={record.id}>
                    <SidebarMenuButton 
                      onClick={() => router.push(`/result/${record.id}`)}
                      className="flex items-start justify-between"
                    >
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm truncate">{record.diseaseName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(record.date)} • {record.confidence}%
                          </span>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem>
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    {t('history.noRecords') || '暂无历史记录'}
                  </div>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
      </SidebarContent>
      
      {/* 底部 Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push("/profile")}>
              <User />
              <span>{t('common.profile')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-red-500 hover:text-red-600">
              <LogOut />
              <span>{t('common.logout')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}