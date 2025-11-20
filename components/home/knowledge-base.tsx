'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { RefreshCcw, ExternalLink } from "lucide-react"
import { DiseaseCard } from "@/components/shared/DiseaseCard"
import { API_ENDPOINTS, fetchWithAuth } from "@/lib/api-config"
import { useLanguage } from "@/components/language-provider"

interface DiseaseInfo {
  id: string;
  name: string;
  category: string;
  type: string;
  aliases: string[];
  keyFeatures: string;
  imageUrls: string[];
}

export function KnowledgeBase() {
  const router = useRouter();
  const { t } = useLanguage();
  const [diseases, setDiseases] = useState<DiseaseInfo[]>([]);
  const [displayDiseases, setDisplayDiseases] = useState<DiseaseInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.knowledge);
      if (response.ok) {
        const data = await response.json();
        setDiseases(data || []);
        // 随机显示6条
        setDisplayDiseases(getRandomDiseases(data || [], 6));
      }
    } catch (error) {
      console.error('Failed to fetch knowledge base:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomDiseases = (arr: DiseaseInfo[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleRefresh = () => {
    setDisplayDiseases(getRandomDiseases(diseases, 6));
  };

  const handleViewAll = () => {
    router.push('/knowledge');
  };

  const handleDiseaseClick = (id: string) => {
    router.push(`/knowledge/${id}`);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-muted/30 border-b p-6 flex flex-col items-center gap-4">
        <div className="w-full max-w-5xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-muted/30 border-b p-6 flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-5xl">
        <h2 className="text-lg font-semibold text-primary">{t('knowledge.title')}</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={handleRefresh}
          >
            <RefreshCcw className="w-3 h-3 mr-1" /> {t('knowledge.refresh') || '换一批'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={handleViewAll}
          >
            <ExternalLink className="w-3 h-3 mr-1" /> {t('knowledge.viewAll') || '查看全部'}
          </Button>
        </div>
      </div>

      {displayDiseases.length === 0 ? (
        <div className="w-full max-w-5xl text-center py-8 text-muted-foreground">
          {t('knowledge.noResults')}
        </div>
      ) : (
        <Carousel className="w-full max-w-5xl">
          <CarouselContent>
            {displayDiseases.map((disease) => (
              <CarouselItem key={disease.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <DiseaseCard
                    id={disease.id}
                    name={disease.name}
                    category={disease.category}
                    type={disease.type}
                    aliases={disease.aliases}
                    keyFeatures={disease.keyFeatures}
                    imageUrl={disease.imageUrls?.[0]}
                    onClick={() => handleDiseaseClick(disease.id)}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  )
}