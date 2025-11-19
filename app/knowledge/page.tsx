'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, BookOpen } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { API_ENDPOINTS, fetchWithAuth } from "@/lib/api-config";

interface DiseaseInfo {
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

export default function KnowledgePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [diseases, setDiseases] = useState<DiseaseInfo[]>([]);
  const [filteredDiseases, setFilteredDiseases] = useState<DiseaseInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(t('knowledge.all'));
  const [isLoading, setIsLoading] = useState(true);

  const categories = [t('knowledge.all'), t('knowledge.fungal'), t('knowledge.bacterial'), t('knowledge.pest')];

  useEffect(() => {
    fetchDiseases();
  }, []);

  useEffect(() => {
    filterDiseases();
  }, [searchTerm, selectedCategory, diseases]);

  const fetchDiseases = async () => {
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.knowledge);
      if (response.ok) {
        const data = await response.json();
        setDiseases(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch knowledge base:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDiseases = () => {
    let filtered = diseases;

    const allText = t('knowledge.all');
    if (selectedCategory !== allText) {
      filtered = filtered.filter(d => {
        const catMap: Record<string, string> = {
          [t('knowledge.fungal')]: '病害类',
          [t('knowledge.bacterial')]: '病害类',
          [t('knowledge.pest')]: '虫害类',
        };
        return d.category === catMap[selectedCategory] || d.category.includes(selectedCategory);
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.keyFeatures.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.aliases.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredDiseases(filtered);
  };

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
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-primary" />
                {t('knowledge.title')}
              </h1>
              <p className="text-muted-foreground mt-1">{t('knowledge.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        {/* 搜索和筛选 */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('knowledge.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* 病害网格 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        ) : filteredDiseases.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">{t('knowledge.noResults')}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDiseases.map((disease) => (
              <Card
                key={disease.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => router.push(`/knowledge/${disease.id}`)}
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={disease.imageUrls?.[0] || '/placeholder.png'}
                    alt={disease.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge
                    variant="secondary"
                    className="absolute top-2 right-2"
                  >
                    {disease.type}
                  </Badge>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {disease.name}
                    </h3>
                  </div>
                  {disease.aliases && disease.aliases.length > 0 && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {disease.aliases.join('、')}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {disease.keyFeatures}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {disease.category}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
