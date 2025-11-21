'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/lib/api-config';

interface Admin {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin',
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.adminAdmins, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const mapped = (data.data || []).map((item: any) => ({
            id: item.id,
            username: item.username,
            email: item.email,
            role: item.role,
            createdAt: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '-',
          }));
          setAdmins(mapped);
        } else {
          setAdmins([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      // 使用模拟数据
      setAdmins([
        {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          role: 'super_admin',
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          username: 'manager',
          email: 'manager@example.com',
          role: 'admin',
          createdAt: '2024-02-20',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const url = editingAdmin 
        ? API_ENDPOINTS.adminAdmin(editingAdmin.id)
        : API_ENDPOINTS.adminAdmins;
      
      const method = editingAdmin ? 'PUT' : 'POST';
      const payload: Record<string, string> = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const respData = await response.json();
      if (response.ok && respData.success) {
        toast({
          title: editingAdmin ? '更新成功' : '添加成功',
          description: `管理员 ${formData.username} 已${editingAdmin ? '更新' : '添加'}`,
        });
        setIsDialogOpen(false);
        resetForm();
        fetchAdmins();
      } else {
        throw new Error('操作失败');
      }
    } catch (error) {
      toast({
        title: '操作失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个管理员吗？')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.adminAdmin(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const respData = await response.json();
      if (response.ok && respData.success) {
        toast({
          title: '删除成功',
          description: '管理员已删除',
        });
        fetchAdmins();
      } else {
        throw new Error('删除失败');
      }
    } catch (error) {
      toast({
        title: '删除失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: '',
      role: admin.role,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingAdmin(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'admin',
    });
  };

  if (loading) {
    return <div className="text-center">加载中...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>管理员列表</CardTitle>
            <CardDescription>管理系统管理员账户</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                添加管理员
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAdmin ? '编辑管理员' : '添加管理员'}
                </DialogTitle>
                <DialogDescription>
                  填写管理员信息
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">用户名</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">
                      密码 {editingAdmin && '(留空则不修改)'}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingAdmin}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">角色</Label>
                    <select
                      id="role"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="admin">管理员</option>
                      <option value="super_admin">超级管理员</option>
                    </select>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    取消
                  </Button>
                  <Button type="submit">
                    {editingAdmin ? '更新' : '添加'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.username}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs">
                    {admin.role === 'super_admin' ? '超级管理员' : '管理员'}
                  </span>
                </TableCell>
                <TableCell>{admin.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(admin)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(admin.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
