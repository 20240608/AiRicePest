'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, CheckCircle2, ImagePlus, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api-config";

export default function FeedbackPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      alert('最多只能上传3张图片');
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...urls]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert(t('feedback.inputRequired'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('text', content);
      const userId = localStorage.getItem('userId');
      if (userId) {
        formData.append('userId', userId);
      }
      images.forEach(img => formData.append('images', img));

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.feedback}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          router.push('/home');
        }, 2000);
      } else {
        throw new Error('提交失败');
      }
    } catch (error) {
      alert(t('feedback.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center max-w-md">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t('feedback.success')}</h2>
          <p className="text-muted-foreground">{t('feedback.successMessage')}</p>
          <Button className="mt-6" onClick={() => router.push('/home')}>
            {t('result.backToHome')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* 头部 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{t('feedback.title')}</h1>
              <p className="text-muted-foreground mt-1">{t('feedback.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        <Card className="p-6">
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertDescription>
              {t('feedback.alert')}
            </AlertDescription>
          </Alert>

          {/* 反馈内容 */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="content" className="text-base font-semibold">
                {t('feedback.content')} <span className="text-destructive">*</span>
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                {t('feedback.contentPlaceholder')}
              </p>
              <Textarea
                id="content"
                placeholder={t('feedback.contentPlaceholder')}
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, 200))}
                className="min-h-[150px] resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {content.length} / 200
              </p>
            </div>

            {/* 图片上传 */}
            <div>
              <Label className="text-base font-semibold">{t('feedback.images')}</Label>
              <p className="text-sm text-muted-foreground mb-3">
                {t('feedback.imagesHint')}
              </p>
              
              <div className="flex flex-wrap gap-4">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url}
                      alt={`preview-${idx}`}
                      className="w-32 h-32 object-cover rounded-lg border-2 border-dashed"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {images.length < 3 && (
                  <label className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-all">
                    <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">{t('feedback.clickUpload')}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* 联系方式（可选） */}
            <div>
              <Label htmlFor="contact" className="text-base font-semibold">
                {t('feedback.contact')}
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                {t('feedback.contactHint')}
              </p>
              <Input
                id="contact"
                placeholder={t('feedback.contactPlaceholder')}
                className="max-w-md"
              />
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="mt-8 flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t('feedback.uploading')}
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {t('common.submit')}
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* 底部提示 */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {t('feedback.privacy')}
        </p>
      </div>
    </div>
  );
}
