'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye } from "lucide-react";
import { API_BASE_URL } from "@/lib/api-config";

interface HistoryCardProps {
  id: string;
  diseaseName: string;
  confidence: number;
  date: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

export function HistoryCard({
  id,
  diseaseName,
  confidence,
  date,
  imageUrl,
  onClick,
  className = "",
}: HistoryCardProps) {
  const getImageUrl = (url?: string) => {
    if (!url) return '/placeholder.png';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/static/')) {
      return `${API_BASE_URL}${url}`;
    }
    if (!url.startsWith('/')) {
      return `${API_BASE_URL}/static/uploads/${url}`;
    }
    return `${API_BASE_URL}${url}`;
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (conf >= 75) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}年${month}月${day}日`;
    } catch {
      return dateStr;
    }
  };

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={getImageUrl(imageUrl)}
          alt={diseaseName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <div className="flex items-center gap-2 text-white">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">查看详情</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1 flex-1">
            {diseaseName}
          </h3>
          <Badge
            className={`ml-2 font-semibold ${getConfidenceColor(confidence)}`}
            variant="outline"
          >
            {confidence}%
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1.5" />
          {formatDate(date)}
        </div>
      </div>
    </Card>
  );
}

