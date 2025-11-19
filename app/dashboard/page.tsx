'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, FileText, MessageSquare, Settings } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    // 检查是否登录
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    
    if (!token) {
      router.push('/sign-in');
      return;
    }

    setUsername(storedUsername || '用户');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    router.push('/sign-in');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold">水稻病虫害识别系统</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">欢迎，{username}</span>
            <Button variant="outline" onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">仪表板</h2>
          <p className="text-muted-foreground">欢迎回来！这是您的个人仪表板</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">识别次数</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                本月累计识别次数
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">识别记录</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                历史识别记录
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">反馈数量</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                提交的反馈数量
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">账户设置</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full mt-2">
                管理账户
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>快速识别</CardTitle>
              <CardDescription>上传水稻图片进行病虫害识别</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">开始识别</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>最近识别</CardTitle>
              <CardDescription>查看您最近的识别记录</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">暂无识别记录</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
