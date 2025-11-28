'use client';

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ImagePlus, Loader2, Bot, User as UserIcon } from "lucide-react"
import { API_ENDPOINTS, fetchWithAuth } from "@/lib/api-config"
import { useLanguage } from "@/components/language-provider"

interface AIChatProps {
  onChatStart: () => void;
}

interface DiagnosisContent {
  name: string;
  diseaseKey?: string;
  reason: string;
  suggestion: string;
  confidence?: number;
  id?: string;
}

interface Message {
  role: 'ai' | 'user';
  isSystem?: boolean;
  content: string | DiagnosisContent;
}

export function AIChat({ onChatStart }: AIChatProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t, language } = useLanguage()
  const welcomeText = t('home.welcome')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', isSystem: true, content: welcomeText }
  ])

  useEffect(() => {
    setMessages(prev => prev.map(msg => {
      if (msg.role === 'ai' && msg.isSystem) {
        return { ...msg, content: welcomeText }
      }
      return msg
    }))
  }, [welcomeText])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setMessages(prev => [...prev, { role: 'user', content: imageUrl }])
    
    setIsLoading(true)
    
    try {
      // 调用后端 API
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetchWithAuth(API_ENDPOINTS.recognize, {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || '识别失败');
      }

      const result = payload.data || {};
      const suggestionText = result.suggestion || (result.solutionSteps?.join?.('\n')) || t('home.suggestionFallback');
      const reasonText = result.reason || result.description || t('home.reasonFallback');

      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: {
          name: result.diseaseName || t('disease.Unknown'),
          diseaseKey: result.diseaseKey,
          reason: reasonText,
          suggestion: suggestionText,
          confidence: result.confidence || 0,
          id: result.id,
        }
      }]);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : t('common.error');
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `${t('home.recognitionFailed')}${message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleViewDetail = (result: DiagnosisContent) => {
    if (result.id) {
      router.push(`/result/${result.id}`);
    }
  };

  const handleNewChat = () => {
    setMessages([
      { role: 'ai', isSystem: true, content: welcomeText }
    ]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 监听来自 Sidebar 的新建对话事件
  useEffect(() => {
    const handler = () => handleNewChat();
    if (typeof window !== 'undefined') {
      window.addEventListener('new-chat-event', handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('new-chat-event', handler);
      }
    };
  }, []);

  return (
    <div 
      className="flex-1 flex flex-col min-h-0 bg-background"
      onClick={() => onChatStart()} 
    >
      {/* 消息列表区域 */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                {msg.role === 'ai' ? <Bot size={18} /> : <UserIcon size={18} />}
              </div>
              
              <div className={`space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-md`}>
                {msg.role === 'user' ? (
                  <img src={msg.content as string} alt="upload" className="w-48 rounded-lg border shadow-sm" />
                ) : (
                  typeof msg.content === 'string' ? (
                     <div className="bg-muted p-3 rounded-lg text-sm">{msg.content}</div>
                  ) : (
                    <Card className="p-4 w-full border-primary/20 bg-primary/5">
                       <h3 className="font-bold text-lg text-primary">
                         {msg.content.diseaseKey ? t(`disease.${msg.content.diseaseKey}`) : msg.content.name}
                       </h3>
                       {msg.content.confidence !== undefined && (
                         <p className="text-xs text-muted-foreground mt-1">
                           {t('result.confidence')} {msg.content.confidence}%
                         </p>
                       )}
                       <div className="mt-3 text-sm space-y-2">
                         <p><strong className="text-orange-600">{t('result.cause')}：</strong>{msg.content.reason}</p>
                         <p><strong className="text-green-600">{t('result.solutions')}：</strong>{msg.content.suggestion}</p>
                       </div>
                       <div className="mt-4 flex gap-2">
                         <Button 
                           size="sm" 
                           variant="outline"
                           onClick={() => handleViewDetail(msg.content as DiagnosisContent)}
                         >
                           {t('home.viewDetail')}
                         </Button>
                         <Button 
                           size="sm" 
                           variant="ghost"
                           onClick={() => router.push('/feedback')}
                         >
                           {t('home.provideFeedback')}
                         </Button>
                       </div>
                    </Card>
                  )
                )}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex gap-3">
               <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center"><Bot size={18}/></div>
               <div className="flex items-center text-sm text-muted-foreground">
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('home.aiAnalyzing')}
               </div>
             </div>
          )}
        </div>
      </ScrollArea>

      {/* 底部输入区域 */}
      <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            onChange={handleUpload}
          />
          <Button 
            variant="outline" 
            className="flex-1 h-14 text-base shadow-sm hover:border-primary hover:text-primary transition-all border-dashed border-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <ImagePlus className="mr-2 w-5 h-5" />
            {isLoading ? t('home.analyzing') : t('home.upload')}
          </Button>
          <Button
            variant="ghost"
            className="h-14 px-4"
            onClick={handleNewChat}
            disabled={isLoading}
          >
            {t('home.newChat')}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2 w-full absolute bottom-1 left-0">
            {t('home.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  )
}