'use client';

import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { KnowledgeBase } from "./knowledge-base"
import { AIChat } from "./ai-chat"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  // 核心状态：控制知识库显示，默认显示 (true)
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(true)
  const { t } = useLanguage()

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* 1. 左侧边栏：传入回调函数，用于重新打开知识库 */}
        <AppSidebar onOpenKnowledgeBase={() => setShowKnowledgeBase(true)} />
        
        <main className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between h-14 border-b px-4 shrink-0 gap-2">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="font-semibold">{t('home.title')}</span>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </header>

          <div className="flex-1 flex flex-col overflow-hidden relative">
            
            {/* 2. 知识库区域：添加过渡动画 */}
            <div 
              className={cn(
                "transition-all duration-500 ease-in-out overflow-hidden border-b bg-muted/30",
                showKnowledgeBase ? "max-h-[40vh] opacity-100" : "max-h-0 opacity-0 border-none"
              )}
            >
               <KnowledgeBase />
            </div>
            
            {/* 3. AI 对话区域：传入回调，开始对话时关闭知识库 */}
            <AIChat onChatStart={() => setShowKnowledgeBase(false)} />
            
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}