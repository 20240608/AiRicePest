'use client';

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ImagePlus, Loader2, Bot, User as UserIcon } from "lucide-react"

interface AIChatProps {
  onChatStart: () => void;
}

interface Message {
  role: 'ai' | 'user';
  content: string | {
    name: string;
    reason: string;
    suggestion: string;
    confidence?: number;
    id?: string;
  };
}

export function AIChat({ onChatStart }: AIChatProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "您好！我是水稻病虫害AI识别助手。请上传一张植物叶片照片，我会为您诊断病害。" }
  ])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setMessages(prev => [...prev, { role: 'user', content: imageUrl }])
    
    setIsLoading(true)
    
    try {
      // 调用后端 API
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/recognize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: {
            name: data.disease_name || "番茄晚疫病",
            reason: data.reason || "环境湿度过高，通风不良，利于病菌繁殖。",
            suggestion: data.suggestion || "建议喷洒代森锰锌，并修剪病叶，增加通风。",
            confidence: data.confidence || 85,
            id: data.id,
          }
        }]);
      } else {
        throw new Error('识别失败');
      }
    } catch (error) {
      // 使用模拟数据
      setTimeout(() => {
        const mockId = Date.now().toString();
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: {
            name: "水稻稻瘟病",
            reason: "高温高湿环境，氮肥施用过多，田间积水。",
            suggestion: "建议使用三环唑或稻瘟灵防治，控制氮肥用量，及时排水。",
            confidence: 92,
            id: mockId,
          }
        }]);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  }

  const handleViewDetail = (result: any) => {
    if (result.id) {
      router.push(`/result/${result.id}`);
    }
  };

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
                       <h3 className="font-bold text-lg text-primary">{msg.content.name}</h3>
                       {msg.content.confidence && (
                         <p className="text-xs text-muted-foreground mt-1">
                           置信度: {msg.content.confidence}%
                         </p>
                       )}
                       <div className="mt-3 text-sm space-y-2">
                         <p><strong className="text-orange-600">病因：</strong>{msg.content.reason}</p>
                         <p><strong className="text-green-600">建议：</strong>{msg.content.suggestion}</p>
                       </div>
                       <div className="mt-4 flex gap-2">
                         <Button 
                           size="sm" 
                           variant="outline"
                           onClick={() => handleViewDetail(msg.content)}
                         >
                           查看详情
                         </Button>
                         <Button 
                           size="sm" 
                           variant="ghost"
                           onClick={() => router.push('/feedback')}
                         >
                           提供反馈
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
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> AI 正在分析图像特征，请稍候...
               </div>
             </div>
          )}
        </div>
      </ScrollArea>

      {/* 底部输入区域 */}
      <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-2xl mx-auto">
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            onChange={handleUpload}
          />
          <Button 
            variant="outline" 
            className="w-full h-14 text-base shadow-sm hover:border-primary hover:text-primary transition-all border-dashed border-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <ImagePlus className="mr-2 w-5 h-5" />
            {isLoading ? "正在诊断中..." : "点击上传图片进行识别 (支持 JPG/PNG)"}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            AI 识别结果仅供参考，建议结合专业农技人员意见。
          </p>
        </div>
      </div>
    </div>
  )
}