import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// 您的 LoginCard 组件
export function LoginCard() {
  return (
    // 使用 className 设置卡片的宽度限制，使其居中且不占满屏幕
    <Card className="w-full max-w-md mx-auto"> 
      
      {/* 头部：标题和描述 */}
      <CardHeader>
        <CardTitle>欢迎回来!</CardTitle>
        <CardDescription>
          请登录以继续加入我们的水稻种植者社区。
        </CardDescription>
      </CardHeader>
      
      {/* 内容：表单字段 */}
      <CardContent>
        <form className="space-y-5">
            
            {/* 用户名/Email 区域 */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="username">用户名/Email</Label>
                    <a href="/register" className="text-sm text-blue-500 hover:underline">
                        注册
                    </a>
                </div>
                <Input id="username" placeholder="请输入用户名或Email" />
            </div>

            {/* 密码区域 */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="password">密码</Label>
                    <a href="#" className="text-sm text-blue-500 hover:underline">
                        忘记密码?
                    </a>
                </div>
                <Input id="password" type="password" placeholder="请输入密码" />
            </div>
        </form>
      </CardContent>
      
      {/* 底部：操作按钮 */}
      <CardFooter className="flex flex-col gap-3">
        {/* 登录按钮：使用默认填充样式 */}
        <Button className="w-full">登录</Button>
        {/* 管理员登录：使用描边/次要样式 */}
        <Button variant="outline" className="w-full">管理员登录</Button>
      </CardFooter>
    </Card>
  );
}