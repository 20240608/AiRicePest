'use client';

import { BookOpen, MessageSquare, Search, User, LogOut, Plus, History } from "lucide-react"
import { useRouter } from "next/navigation"
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

// 定义 Props 类型，接收父组件传来的函数
interface AppSidebarProps {
  onOpenKnowledgeBase: () => void;
}

export function AppSidebar({ onOpenKnowledgeBase }: AppSidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    router.push('/sign-in');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>功能导航</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              
              {/* 新建对话 */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/home')}>
                  <Plus />
                  <span>开启新对话</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 打开知识库按钮 */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onOpenKnowledgeBase}>
                  <BookOpen className="text-blue-500" />
                  <span>打开知识库</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 搜索历史 */}
              <SidebarMenuItem>
                <div className="px-2 py-1">
                  <Input 
                    placeholder="搜索历史记录..." 
                    className="h-8 text-sm"
                  />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 历史记录列表 */}
        <SidebarGroup>
          <SidebarGroupLabel>历史记录</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/history')}>
                  <History />
                  <span>查看全部历史</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
              <span>个人中心</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-red-500 hover:text-red-600">
              <LogOut />
              <span>退出登录</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}