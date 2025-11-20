'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Activity, MessageSquare, TrendingUp } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api-config';

interface DashboardStats {
  userCount: number;
  recognitionCount: number;
  feedbackCount: number;
  activeUsers: number;
  recognitionsPerDay: Array<{ date: string; count: number }>;
  feedbackTypes: Array<{ name: string; value: number }>;
  monthlyData: Array<{ month: string; recognitions: number }>;
}

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'];

export function DashboardPanel() {
  const [stats, setStats] = useState<DashboardStats>({
    userCount: 0,
    recognitionCount: 0,
    feedbackCount: 0,
    activeUsers: 0,
    recognitionsPerDay: [],
    feedbackTypes: [],
    monthlyData: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats({
            userCount: data.userCount || 0,
            recognitionCount: data.recognitionCount || 0,
            feedbackCount: data.feedbackCount || 0,
            activeUsers: data.activeUsers || 0,
            recognitionsPerDay: data.recognitionsPerDay || [],
            feedbackTypes: data.feedbackTypes || [],
            monthlyData: data.monthlyData || [],
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activityRate = stats.userCount > 0 
    ? ((stats.activeUsers / stats.userCount) * 100).toFixed(1)
    : '0.0';

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
            <div className="text-2xl font-bold">{stats.userCount}</div>
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
            <div className="text-2xl font-bold">{stats.recognitionCount}</div>
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
            <div className="text-2xl font-bold">{stats.feedbackCount}</div>
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
            <div className="text-2xl font-bold">{activityRate}%</div>
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
            <CardTitle>每日识别趋势</CardTitle>
            <CardDescription>最近7天的识别次数统计</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recognitionsPerDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.recognitionsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="识别次数" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                暂无数据
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>反馈类型分布</CardTitle>
            <CardDescription>用户反馈的分类统计</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.feedbackTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.feedbackTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.feedbackTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                暂无数据
              </div>
            )}
          </CardContent>
        </Card>

        {/* 月度趋势 */}
        {stats.monthlyData && stats.monthlyData.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>月度识别趋势</CardTitle>
              <CardDescription>最近6个月的识别次数统计</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="recognitions" fill="#10b981" name="识别次数" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
