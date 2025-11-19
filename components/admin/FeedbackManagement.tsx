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
import { Eye, CheckCircle, XCircle } from 'lucide-react';

interface Feedback {
  id: string;
  userId: string;
  username: string;
  content: string;
  imageUrl?: string;
  status: 'pending' | 'processed' | 'rejected';
  createdAt: string;
  processedAt?: string;
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
      const response = await fetch('/api/admin/feedbacks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
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
          status: 'pending',
          createdAt: '2024-03-15 10:30:00',
        },
        {
          id: '2',
          userId: 'user002',
          username: 'user002',
          content: '界面很好用，但是加载速度有点慢',
          imageUrl: 'https://example.com/screenshot.jpg',
          status: 'processed',
          createdAt: '2024-03-14 15:20:00',
          processedAt: '2024-03-15 09:00:00',
        },
        {
          id: '3',
          userId: 'user003',
          username: 'user003',
          content: '希望能添加批量识别功能',
          status: 'pending',
          createdAt: '2024-03-13 14:10:00',
        },
        {
          id: '4',
          userId: 'user004',
          username: 'user004',
          content: '无法上传图片，一直提示错误',
          imageUrl: 'https://example.com/error.jpg',
          status: 'rejected',
          createdAt: '2024-03-12 11:05:00',
          processedAt: '2024-03-13 10:00:00',
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

  const handleUpdateStatus = async (id: string, status: 'processed' | 'rejected') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/feedbacks/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        alert(`反馈已标记为${status === 'processed' ? '已处理' : '已拒绝'}`);
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
      case 'pending':
        return <Badge variant="outline">待处理</Badge>;
      case 'processed':
        return <Badge variant="default">已处理</Badge>;
      case 'rejected':
        return <Badge variant="destructive">已拒绝</Badge>;
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
                <TableHead>处理时间</TableHead>
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
                  <TableCell>{feedback.processedAt || '-'}</TableCell>
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

              {selectedFeedback.imageUrl && (
                <div>
                  <h4 className="mb-2 text-sm font-medium">附件图片</h4>
                  <div className="rounded-lg border p-3">
                    <img
                      src={selectedFeedback.imageUrl}
                      alt="反馈截图"
                      className="max-h-96 w-full object-contain"
                    />
                    <a
                      href={selectedFeedback.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      查看原图
                    </a>
                  </div>
                </div>
              )}

              <div>
                <h4 className="mb-2 text-sm font-medium">时间信息</h4>
                <div className="rounded-lg border p-3">
                  <p className="text-sm">
                    <span className="font-medium">提交时间:</span> {selectedFeedback.createdAt}
                  </p>
                  {selectedFeedback.processedAt && (
                    <p className="text-sm">
                      <span className="font-medium">处理时间:</span> {selectedFeedback.processedAt}
                    </p>
                  )}
                  <div className="mt-2">
                    <span className="font-medium">状态: </span>
                    {getStatusBadge(selectedFeedback.status)}
                  </div>
                </div>
              </div>

              {selectedFeedback.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdateStatus(selectedFeedback.id, 'processed')}
                    className="flex-1"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    标记为已处理
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(selectedFeedback.id, 'rejected')}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    标记为已拒绝
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
