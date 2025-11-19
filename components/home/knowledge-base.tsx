import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

export function KnowledgeBase() {
  // 实际项目中这里应该 useEffect 获取后端数据
  const items = [1, 2, 3, 4, 5] 

  return (
    <div className="w-full bg-muted/30 border-b p-6 flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-4xl">
        <h2 className="text-lg font-semibold text-primary">常见病虫害知识库</h2>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
          <RefreshCcw className="w-3 h-3 mr-1" /> 换一批
        </Button>
      </div>

      <Carousel className="w-full max-w-4xl">
        <CarouselContent>
          {items.map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex flex-col aspect-[4/3] p-4 items-center justify-center gap-2">
                    <div className="w-full h-24 bg-gray-200 rounded-md" /> {/* 占位图片 */}
                    <span className="text-sm font-medium">病害名称 {index + 1}</span>
                    <p className="text-xs text-gray-500 line-clamp-2">这里是病害的简短描述...</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}