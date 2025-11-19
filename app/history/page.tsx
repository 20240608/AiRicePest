'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { API_ENDPOINTS, fetchWithAuth } from "@/lib/api-config";

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
  const recordsPerPage = 10;

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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('history.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('history.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <Button variant="outline" onClick={() => router.push('/home')}>
              {t('common.back')}
            </Button>
          </div>
        </div>

        <Card className="p-6">
          {/* 搜索栏 */}
          <div className="mb-6 flex gap-4">
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
            <Button onClick={fetchHistory}>{t('history.refresh')}</Button>
          </div>

          {/* 表格 */}
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">{t('common.loading')}</div>
          ) : paginatedRecords.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">{t('history.noRecords')}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('history.date')}</TableHead>
                    <TableHead>{t('history.image')}</TableHead>
                    <TableHead>{t('history.result')}</TableHead>
                    <TableHead>{t('history.confidence')}</TableHead>
                    <TableHead className="text-right">{t('history.action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{record.date}</TableCell>
                      <TableCell>
                        <img
                          src={record.imageUrl}
                          alt="thumbnail"
                          className="w-16 h-16 rounded-md object-cover border"
                        />
                      </TableCell>
                      <TableCell>{record.diseaseName}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${record.confidence >= 90 ? 'text-green-600' : record.confidence >= 75 ? 'text-yellow-600' : 'text-orange-600'}`}>
                          {record.confidence}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/result/${record.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {t('home.viewDetail')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 分页控制 */}
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t('history.showing')} {startIndex + 1}-{Math.min(startIndex + recordsPerPage, filteredRecords.length)} {t('history.of')} {filteredRecords.length} {t('history.records')}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t('history.prevPage')}
                  </Button>
                  <div className="flex items-center px-3 text-sm">
                    {t('history.page')} {currentPage} {t('history.totalPages')} {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {t('history.nextPage')}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
