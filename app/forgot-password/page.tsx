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
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useLanguage } from "@/components/language-provider";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 这里应该调用重置密码的 API
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟 API 调用
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to send reset email:', error);
      setError('发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('forgot.title')}</CardTitle>
          <CardDescription>
            {submitted 
              ? t('forgot.descriptionSent')
              : t('forgot.description')
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
                <Label htmlFor="email">{t('forgot.emailLabel')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('forgot.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('forgot.submitting') : t('forgot.submit')}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <a href="/sign-in" className="text-primary hover:underline">
                  {t('forgot.backToLogin')}
                </a>
              </div>
            </CardFooter>
          </form>
        ) : (
          <>
            <CardContent>
              <Alert>
                <AlertDescription>
                  {t('forgot.sentMessage')}
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <a href="/sign-in">{t('forgot.returnButton')}</a>
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </main>
  );
}
