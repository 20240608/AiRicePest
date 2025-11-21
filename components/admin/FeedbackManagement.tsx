'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, Clock } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/api-config';

interface Feedback {
  id: string;
  userId: string | null;
  username: string;
  content: string;
  imageUrls: string[];
  status: 'new' | 'in_review' | 'resolved';
  createdAt: string;
  updatedAt?: string;
}

export function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.adminFeedbacks, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const mapped: Feedback[] = (data.data || []).map((item: any) => ({
            id: item.id,
            userId: item.userId || null,
            username: item.username,
            content: item.text,
            imageUrls: item.imageUrls || [],
            status: item.status,
            createdAt: item.timestamp || '-',
            updatedAt: item.updatedAt || '-',
          }));
          setFeedbacks(mapped);
        } else {
          setFeedbacks([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
      // 使用模拟数据
      setFeedbacks([
        {
          id: '1',
          userId: 'user001',
          username: 'user001',
          content: '识别结果不准确，建议改进算法',
          imageUrls: [],
          status: 'new',
          createdAt: '2024-03-15 10:30:00',
          updatedAt: '2024-03-15 10:30:00',
        },
        {
          id: '2',
          userId: 'user002',
          username: 'user002',
          content: '界面很好用，但是加载速度有点慢',
          imageUrls: ['https://example.com/screenshot.jpg'],
          status: 'resolved',
          createdAt: '2024-03-14 15:20:00',
          updatedAt: '2024-03-15 09:00:00',
        },
        {
          id: '3',
          userId: 'user003',
          username: 'user003',
          content: '希望能添加批量识别功能',
          imageUrls: [],
          status: 'in_review',
          createdAt: '2024-03-13 14:10:00',
          updatedAt: '2024-03-14 09:10:00',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = async (id: string, status: 'in_review' | 'resolved') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.adminFeedbackStatus(id), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const respData = await response.json();
      if (response.ok && respData.success) {
        alert(`反馈已标记为${status === 'resolved' ? '已解决' : '处理中'}`);
        setIsDialogOpen(false);
        fetchFeedbacks();
      } else {
        throw new Error('更新失败');
      }
    } catch (error) {
      alert('更新失败，请稍后重试');
    }
  };

  const getStatusBadge = (status: Feedback['status']) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline">待处理</Badge>;
      case 'in_review':
        return <Badge variant="secondary">处理中</Badge>;
      case 'resolved':
        return <Badge variant="default">已解决</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center">加载中...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>用户反馈列表</CardTitle>
          <CardDescription>查看和管理用户提交的反馈</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户</TableHead>
                <TableHead>反馈内容</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>提交时间</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacks.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell className="font-medium">{feedback.username}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {feedback.content}
                  </TableCell>
                  <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                  <TableCell>{feedback.createdAt}</TableCell>
                  <TableCell>{feedback.updatedAt || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(feedback)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>反馈详情</DialogTitle>
            <DialogDescription>
              查看反馈的完整信息并进行处理
            </DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium">用户信息</h4>
                <div className="rounded-lg border p-3">
                  <p className="text-sm">
                    <span className="font-medium">用户ID:</span> {selectedFeedback.userId}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">用户名:</span> {selectedFeedback.username}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium">反馈内容</h4>
                <div className="rounded-lg border p-3">
                  <p className="text-sm">{selectedFeedback.content}</p>
                </div>
              </div>

              {selectedFeedback.imageUrls.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium">附件图片</h4>
                  <div className="rounded-lg border p-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      {selectedFeedback.imageUrls.map((url) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={url}
                            alt="反馈截图"
                            className="max-h-80 w-full rounded-md object-contain"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="mb-2 text-sm font-medium">时间信息</h4>
                <div className="rounded-lg border p-3">
                  <p className="text-sm">
                    <span className="font-medium">提交时间:</span> {selectedFeedback.createdAt}
                  </p>
                  {selectedFeedback.updatedAt && (
                    <p className="text-sm">
                      <span className="font-medium">更新时间:</span> {selectedFeedback.updatedAt}
                    </p>
                  )}
                  <div className="mt-2">
                    <span className="font-medium">状态: </span>
                    {getStatusBadge(selectedFeedback.status)}
                  </div>
                </div>
              </div>

              {selectedFeedback.status !== 'resolved' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdateStatus(selectedFeedback.id, 'in_review')}
                    className="flex-1"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    标记为处理中
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(selectedFeedback.id, 'resolved')}
                    className="flex-1"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    标记为已解决
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
