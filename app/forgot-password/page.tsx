'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 这里应该调用重置密码的 API
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 API 调用
      setSubmitted(true);
    } catch (err) {
      setError('发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>重置密码</CardTitle>
          <CardDescription>
            {submitted 
              ? '我们已发送重置链接到您的邮箱'
              : '输入您的邮箱地址，我们将发送重置密码的链接'
            }
          </CardDescription>
        </CardHeader>
        
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入您的邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '发送中...' : '发送重置链接'}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <a href="/sign-in" className="text-primary hover:underline">
                  返回登录
                </a>
              </div>
            </CardFooter>
          </form>
        ) : (
          <>
            <CardContent>
              <Alert>
                <AlertDescription>
                  如果该邮箱已注册，您将收到一封包含重置密码链接的邮件。请检查您的收件箱。
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <a href="/sign-in">返回登录</a>
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </main>
  );
}
