'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Image as ImageIcon, Info, Microscope, Sprout, Shield } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { API_BASE_URL } from "@/lib/api-config";

interface DiseaseDetail {
  id: string;
  name: string;
  category: string;
  type: string;
  aliases: string[];
  keyFeatures: string;
  affectedParts: string[];
  imageUrls: string[];
  pathogen: string;
  conditions: string;
  lifeCycle: string;
  transmission: string;
  controls: {
    agricultural: string[];
    physical: string[];
    biological: string[];
    chemical: string[];
  };
}

export default function KnowledgeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
  const [disease, setDisease] = useState<DiseaseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchDiseaseDetail(params.id as string);
    }
  }, [params.id]);

  const fetchDiseaseDetail = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/knowledge/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDisease(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch disease detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (url: string) => {
    // 如果已经是完整URL，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // 如果以 /images/ 开头，使用后端服务
    if (url.startsWith('/images/')) {
      return `${API_BASE_URL}${url}`;
    }
    // 如果只是文件名，假定在 /images/ 目录下
    if (!url.startsWith('/')) {
      return `${API_BASE_URL}/images/${url}`;
    }
    return `${API_BASE_URL}${url}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!disease) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">{t('knowledge.notFound')}</p>
            <Button onClick={() => router.back()} className="mt-4">
              {t('common.back')}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        {/* 标题部分 */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <h1 className="text-3xl font-bold">{disease.name}</h1>
                <Badge variant="outline">{disease.type}</Badge>
                <Badge>{disease.category}</Badge>
              </div>
              {disease.aliases && disease.aliases.length > 0 && (
                <p className="text-muted-foreground mb-4">
                  <span className="font-medium">{t('knowledge.aliases')}：</span>
                  {disease.aliases.join('、')}
                </p>
              )}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">{t('knowledge.keyFeatures')}</h3>
                    <p className="text-sm">{disease.keyFeatures}</p>
                  </div>
                </div>
              </div>
              {disease.affectedParts && disease.affectedParts.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">{t('knowledge.affectedParts')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {disease.affectedParts.map((part, index) => (
                      <Badge key={index} variant="secondary">{part}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* 图片展示 */}
        {disease.imageUrls && disease.imageUrls.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t('knowledge.images')}</h2>
            </div>
            <div className="space-y-4">
              {/* 主图 */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={getImageUrl(disease.imageUrls[selectedImage])}
                  alt={`${disease.name} - ${selectedImage + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.png';
                  }}
                />
              </div>
              {/* 缩略图 */}
              {disease.imageUrls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {disease.imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        selectedImage === index
                          ? 'border-primary'
                          : 'border-transparent hover:border-muted-foreground'
                      }`}
                    >
                      <img
                        src={getImageUrl(url)}
                        alt={`${disease.name} - thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.png';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* 详细信息标签页 */}
        <Card className="p-6">
          <Tabs defaultValue="pathogen" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pathogen">
                <Microscope className="h-4 w-4 mr-2" />
                {t('knowledge.pathogenInfo')}
              </TabsTrigger>
              <TabsTrigger value="occurrence">
                <Sprout className="h-4 w-4 mr-2" />
                {t('knowledge.occurrenceInfo')}
              </TabsTrigger>
              <TabsTrigger value="control">
                <Shield className="h-4 w-4 mr-2" />
                {t('knowledge.controlMeasures')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pathogen" className="space-y-4 mt-4">
              {disease.pathogen && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    {t('knowledge.pathogen')}
                  </h3>
                  <p className="text-muted-foreground pl-4">{disease.pathogen}</p>
                </div>
              )}
              {disease.transmission && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    {t('knowledge.transmission')}
                  </h3>
                  <p className="text-muted-foreground pl-4">{disease.transmission}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="occurrence" className="space-y-4 mt-4">
              {disease.conditions && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    {t('knowledge.conditions')}
                  </h3>
                  <p className="text-muted-foreground pl-4">{disease.conditions}</p>
                </div>
              )}
              {disease.lifeCycle && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    {t('knowledge.lifeCycle')}
                  </h3>
                  <p className="text-muted-foreground pl-4">{disease.lifeCycle}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="control" className="space-y-4 mt-4">
              {disease.controls.agricultural && disease.controls.agricultural.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    {t('knowledge.agriculturalControl')}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    {disease.controls.agricultural.map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {disease.controls.physical && disease.controls.physical.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    {t('knowledge.physicalControl')}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    {disease.controls.physical.map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {disease.controls.biological && disease.controls.biological.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    {t('knowledge.biologicalControl')}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    {disease.controls.biological.map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {disease.controls.chemical && disease.controls.chemical.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                    {t('knowledge.chemicalControl')}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    {disease.controls.chemical.map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
