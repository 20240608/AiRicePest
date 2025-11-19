'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Activity, MessageSquare, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalRecognitions: number;
  totalFeedback: number;
  activeUsers: number;
}

export function DashboardPanel() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRecognitions: 0,
    totalFeedback: 0,
    activeUsers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从后端获取统计数据
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // 使用模拟数据
        setStats({
          totalUsers: 1250,
          totalRecognitions: 5420,
          totalFeedback: 328,
          activeUsers: 892,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 柱状图数据 - 每月识别次数
  const monthlyData = [
    { month: '1月', recognitions: 420 },
    { month: '2月', recognitions: 380 },
    { month: '3月', recognitions: 520 },
    { month: '4月', recognitions: 450 },
    { month: '5月', recognitions: 680 },
    { month: '6月', recognitions: 590 },
  ];

  // 饼图数据 - 反馈类型分布
  const feedbackTypes = [
    { name: '功能建议', value: 45, color: '#3b82f6' },
    { name: '错误报告', value: 30, color: '#ef4444' },
    { name: '识别问题', value: 15, color: '#f59e0b' },
    { name: '其他', value: 10, color: '#10b981' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              活跃用户: {stats.activeUsers}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">识别次数</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecognitions}</div>
            <p className="text-xs text-muted-foreground">
              累计识别请求
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">反馈数量</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeedback}</div>
            <p className="text-xs text-muted-foreground">
              用户反馈总数
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              当前活跃用户占比
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 图表 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>月度识别趋势</CardTitle>
            <CardDescription>最近6个月的识别次数统计</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="recognitions" fill="#3b82f6" name="识别次数" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>反馈类型分布</CardTitle>
            <CardDescription>用户反馈的分类统计</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={feedbackTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {feedbackTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
