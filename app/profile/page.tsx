'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Camera, Mail, User as UserIcon, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";

interface UserProfile {
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
  recognitionCount: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          username: data.username,
          email: data.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      // 使用模拟数据
      const mockProfile = {
        username: localStorage.getItem('username') || '用户',
        email: 'user@example.com',
        avatar: '',
        createdAt: '2024-01-01',
        recognitionCount: 15,
      };
      setProfile(mockProfile);
      setFormData({
        username: mockProfile.username,
        email: mockProfile.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleSave = async () => {
    // 验证密码
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('两次输入的新密码不一致');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          ...(formData.newPassword && {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }),
      });

      if (response.ok) {
        localStorage.setItem('username', formData.username);
        setSaveSuccess(true);
        setIsEditing(false);
        fetchProfile();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      alert('保存失败，请检查输入信息');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchProfile();
      }
    } catch (error) {
      console.error('头像上传失败', error);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
              <p className="text-muted-foreground mt-1">{t('profile.subtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                {t('profile.edit')}
              </Button>
            )}
          </div>
        </div>

        {saveSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              ✓ {t('profile.saveSuccess')}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* 左侧：头像和统计 */}
          <Card className="p-6 md:col-span-1">
            <div className="text-center">
              <div className="relative inline-block group">
                <Avatar className="w-32 h-32 mx-auto">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-3xl">
                    {profile.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>
              
              <h2 className="mt-4 text-xl font-semibold">{profile.username}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              
              <Separator className="my-4" />
              
              <div className="space-y-3 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('profile.registeredAt')}</span>
                  <span className="font-medium">{profile.createdAt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('profile.recognitionCount')}</span>
                  <span className="font-medium text-primary">{profile.recognitionCount} {t('profile.times')}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* 右侧：表单 */}
          <Card className="p-6 md:col-span-2">
            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('profile.basicInfo')}</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">
                      <UserIcon className="inline h-4 w-4 mr-1" />
                      {t('profile.username')}
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">
                      <Mail className="inline h-4 w-4 mr-1" />
                      {t('profile.email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* 修改密码 */}
              {isEditing && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    <Lock className="inline h-5 w-5 mr-1" />
                    {t('profile.changePassword')}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder={t('profile.currentPasswordPlaceholder')}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder={t('profile.newPasswordPlaceholder')}
                        value={formData.newPassword}
                        onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">{t('profile.confirmPassword')}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder={t('profile.confirmPasswordPlaceholder')}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              {isEditing && (
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }}
                    disabled={isSaving}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        {t('profile.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t('common.save')}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
