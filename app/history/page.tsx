'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { API_ENDPOINTS, fetchWithAuth } from "@/lib/api-config";
import { HistoryCard } from "@/components/shared/HistoryCard";

interface HistoryRecord {
  id: string;
  date: string;
  imageUrl: string;
  diseaseName: string;
  confidence: number;
}

export default function HistoryPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const recordsPerPage = 12; // 每页显示12张卡片（3列 x 4行）

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.history);
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        console.error('Failed to fetch history');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 过滤搜索结果
  const filteredRecords = records.filter(record =>
    record.diseaseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.date.includes(searchTerm)
  );

  // 分页
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页头 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/home')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('history.title') || '识别历史'}</h1>
              <p className="text-muted-foreground mt-1">{t('history.subtitle') || '查看您的所有识别记录'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        {/* 搜索栏 */}
        <Card className="p-4 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('history.searchPlaceholder') || '搜索病害名称或日期...'}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Button onClick={fetchHistory}>{t('history.refresh') || '刷新'}</Button>
          </div>
        </Card>

        {/* 卡片网格 */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">{t('common.loading') || '加载中...'}</div>
        ) : paginatedRecords.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium mb-2">{t('history.noRecords') || '暂无历史记录'}</p>
              <p className="text-sm">
                {searchTerm 
                  ? '没有找到匹配的记录，请尝试其他搜索词' 
                  : '开始识别病虫害，记录将显示在这里'}
              </p>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedRecords.map((record) => (
                <HistoryCard
                  key={record.id}
                  id={record.id}
                  diseaseName={record.diseaseName}
                  confidence={record.confidence}
                  date={record.date}
                  imageUrl={record.imageUrl}
                  onClick={() => router.push(`/result/${record.id}`)}
                />
              ))}
            </div>

            {/* 分页控制 */}
            {totalPages > 1 && (
              <Card className="mt-6 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t('history.showing') || '显示'} {startIndex + 1}-{Math.min(startIndex + recordsPerPage, filteredRecords.length)} {t('history.of') || '共'} {filteredRecords.length} {t('history.records') || '条记录'}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      {t('history.prevPage') || '上一页'}
                    </Button>
                    <div className="flex items-center px-3 text-sm font-medium">
                      {t('history.page') || '第'} {currentPage} / {totalPages} {t('history.totalPages') || '页'}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      {t('history.nextPage') || '下一页'}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
