'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/lib/api-config";

interface DiseaseCardProps {
  id: string;
  name: string;
  category: string;
  type: string;
  aliases?: string[];
  keyFeatures: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

export function DiseaseCard({
  id,
  name,
  category,
  type,
  aliases,
  keyFeatures,
  imageUrl,
  onClick,
  className = "",
}: DiseaseCardProps) {
  const getImageUrl = (url?: string) => {
    if (!url) return `${API_BASE_URL}/images/placeholder.png`;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/images/')) {
      return `${API_BASE_URL}${url}`;
    }
    if (!url.startsWith('/')) {
      return `${API_BASE_URL}/images/${url}`;
    }
    return `${API_BASE_URL}${url}`;
  };

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={getImageUrl(imageUrl)}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `${API_BASE_URL}/images/placeholder.png`;
          }}
        />
        <Badge
          variant="secondary"
          className="absolute top-2 right-2"
        >
          {type}
        </Badge>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
        </div>
        {aliases && aliases.length > 0 && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
            {aliases.join('、')}
          </p>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {keyFeatures}
        </p>
        <Badge variant="outline" className="text-xs">
          {category}
        </Badge>
      </div>
    </Card>
  );
}
