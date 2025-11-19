'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { API_ENDPOINTS, fetchWithAuth } from "@/lib/api-config";

interface DiseaseResult {
  id: string;
  diseaseName: string;
  confidence: number;
  description: string;
  cause: string;
  solution: {
    title: string;
    steps: string[];
  };
  imageUrl: string;
}

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
  const id = params.id as string;
  
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.recognitions(id));
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error('Failed to fetch result');
      }
    } catch (error) {
      console.error('Error fetching result:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) return;
    
    setSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          resultId: id,
          content: feedbackText,
        }),
      });
      
      if (response.ok) {
        alert('感谢您的反馈！');
        setFeedbackOpen(false);
        setFeedbackText("");
      }
    } catch (error) {
      alert('反馈提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('result.notFound')}</h2>
          <Button onClick={() => router.push('/history')}>{t('result.backToHistory')}</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {/* 头部导航 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{t('result.title')}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 左侧：上传的图片 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('result.uploadedImage')}</h2>
            <img
              src={result.imageUrl}
              alt="uploaded"
              className="w-full rounded-lg border shadow-sm"
            />
          </Card>

          {/* 右侧：识别结果 */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-primary">{result.diseaseName}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={result.confidence >= 90 ? "default" : result.confidence >= 75 ? "secondary" : "outline"}>
                    {t('result.confidence')}：{result.confidence}%
                  </Badge>
                  {result.confidence >= 85 && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="font-semibold mb-2">{t('result.description')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.description}
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="font-semibold mb-2">{t('result.cause')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.cause}
              </p>
            </div>
          </Card>
        </div>

        {/* 防治方案 */}
        <Card className="mt-6 p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-700">{result.solution.title}</h2>
          <ol className="space-y-3">
            {result.solution.steps.map((step, idx) => (
              <li key={idx} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-semibold text-xs">
                  {idx + 1}
                </span>
                <span className="flex-1">{step}</span>
              </li>
            ))}
          </ol>
        </Card>

        {/* 操作按钮 */}
        <div className="mt-6 flex gap-4">
          <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                {t('result.feedback')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('result.feedback')}</DialogTitle>
                <DialogDescription>
                  {t('feedback.alert')}
                </DialogDescription>
              </DialogHeader>
              <Textarea
                placeholder={t('feedback.contentPlaceholder')}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value.slice(0, 200))}
                className="min-h-[120px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setFeedbackOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleFeedbackSubmit} disabled={submitting || !feedbackText.trim()}>
                  {submitting ? t('feedback.uploading') : t('common.submit')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button onClick={() => router.push('/home')} className="flex-1">
            {t('result.backToHome')}
          </Button>
        </div>
      </div>
    </div>
  );
}
