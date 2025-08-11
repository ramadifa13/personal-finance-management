import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useFinance, Goal } from '../contexts/FinanceContext';
import { 
  Plus, 
  Target, 
  Calendar, 
  DollarSign, 
  Trash2,
  Edit3,
  CheckCircle,
  Wallet,
  AlertTriangle,
  ArrowUpCircle,
  ArrowDownCircle,
  Info
} from 'lucide-react';
import { toast } from "sonner";

export const Goals: React.FC = () => {
  const { 
    goals, 
    addGoal, 
    updateGoal, 
    deleteGoal, 
    getBalance 
  } = useFinance();
  
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [updateAmount, setUpdateAmount] = useState('');
  const [actionType, setActionType] = useState<'add' | 'subtract'>('add');
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    description: '',
  });

  const availableBalance = getBalance();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.targetAmount || !formData.deadline) {
      toast.error('Field title, target amount, dan deadline harus diisi!');
      return;
    }

    const initialAmount = parseFloat(formData.currentAmount) || 0;
    
    // Check if user wants to allocate initial amount but doesn't have enough balance
    if (initialAmount > 0 && initialAmount > availableBalance) {
      toast.error(`Saldo tersedia hanya ${formatCurrency(availableBalance)}. Tidak dapat mengalokasikan ${formatCurrency(initialAmount)}.`);
      return;
    }

    addGoal({
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: initialAmount,
      deadline: formData.deadline,
      description: formData.description,
    });

    if (initialAmount > 0) {
      toast.success(`Goal berhasil dibuat dengan alokasi awal ${formatCurrency(initialAmount)}!`);
    } else {
      toast.success('Goal berhasil dibuat!');
    }

    setFormData({
      title: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      description: '',
    });
    setShowForm(false);
  };

  const handleUpdateAmount = (goalId: string) => {
    const currentGoal = goals.find(g => g.id === goalId);
    if (!currentGoal) return;

    const amount = parseFloat(updateAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error('Jumlah harus berupa angka positif!');
      return;
    }

    if (actionType === 'add') {
      if (amount > availableBalance) {
        toast.error(`Saldo tersedia hanya ${formatCurrency(availableBalance)}!`);
        return;
      }
      updateGoal(goalId, currentGoal.currentAmount + amount);
      toast.success(`Berhasil menambahkan ${formatCurrency(amount)} ke ${currentGoal.title}!`);
    } else {
      if (amount > currentGoal.currentAmount) {
        toast.error(`Jumlah yang ditarik tidak boleh melebihi saldo goal ${formatCurrency(currentGoal.currentAmount)}!`);
        return;
      }
      updateGoal(goalId, currentGoal.currentAmount - amount);
      toast.success(`Berhasil menarik ${formatCurrency(amount)} dari ${currentGoal.title}!`);
    }

    setEditingGoal(null);
    setUpdateAmount('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const targetDate = new Date(deadline);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Goals Keuangan</h2>
          <p className="text-muted-foreground">Tetapkan dan pantau target keuangan Anda</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Goal
        </Button>
      </div>

      {/* Available Balance Info */}
      <Card className={`${availableBalance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${availableBalance >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
              <Wallet className={`w-5 h-5 ${availableBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo Tersedia untuk Goals</p>
              <p className={`text-lg font-medium ${availableBalance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                {formatCurrency(availableBalance)}
              </p>
            </div>
          </div>
          {availableBalance < 0 && (
            <Badge variant="destructive" className="flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Defisit</span>
            </Badge>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Tambah Goal Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Goal</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="contoh: Beli Mobil"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Jumlah</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="targetAmount"
                      type="number"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                      className="pl-10"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentAmount">Alokasi Awal (Opsional)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="currentAmount"
                      type="number"
                      value={formData.currentAmount}
                      onChange={(e) => setFormData({...formData, currentAmount: e.target.value})}
                      className="pl-10"
                      placeholder="0"
                      min="0"
                      max={Math.max(0, availableBalance)}
                      step="0.01"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maksimal: {formatCurrency(Math.max(0, availableBalance))}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Target Tanggal</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi (Opsional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tuliskan detail tentang goal ini"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit">Simpan Goal</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {goals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Belum ada goal keuangan</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Buat Goal Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysRemaining = getDaysRemaining(goal.deadline);
            
            return (
              <Card key={goal.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {progress >= 100 && (
                    <Badge variant="default" className="bg-green-500 w-fit">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Tercapai
                    </Badge>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatCurrency(goal.currentAmount)}</span>
                      <span>{formatCurrency(goal.targetAmount)}</span>
                    </div>
                  </div>

                  {editingGoal === goal.id ? (
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={actionType === 'add' ? 'default' : 'outline'}
                          onClick={() => setActionType('add')}
                          className="flex-1"
                        >
                          <ArrowUpCircle className="w-4 h-4 mr-1" />
                          Tambah
                        </Button>
                        <Button
                          size="sm"
                          variant={actionType === 'subtract' ? 'default' : 'outline'}
                          onClick={() => setActionType('subtract')}
                          className="flex-1"
                        >
                          <ArrowDownCircle className="w-4 h-4 mr-1" />
                          Tarik
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>
                          {actionType === 'add' ? 'Jumlah yang ditambahkan' : 'Jumlah yang ditarik'}
                        </Label>
                        <Input
                          type="number"
                          value={updateAmount}
                          onChange={(e) => setUpdateAmount(e.target.value)}
                          placeholder="0"
                          min="0"
                          max={actionType === 'add' ? Math.max(0, availableBalance) : goal.currentAmount}
                          step="0.01"
                        />
                        <p className="text-xs text-muted-foreground">
                          Maksimal: {actionType === 'add' 
                            ? formatCurrency(Math.max(0, availableBalance))
                            : formatCurrency(goal.currentAmount)
                          }
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateAmount(goal.id)}
                          disabled={!updateAmount || parseFloat(updateAmount) <= 0}
                          className="flex-1"
                        >
                          {actionType === 'add' ? 'Tambahkan' : 'Tarik Dana'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setEditingGoal(null)}
                          className="flex-1"
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingGoal(goal.id);
                            setActionType('add');
                            setUpdateAmount('');
                          }}
                          disabled={availableBalance <= 0}
                          className="flex-1"
                        >
                          <ArrowUpCircle className="w-4 h-4 mr-1" />
                          Tambah Dana
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingGoal(goal.id);
                            setActionType('subtract');
                            setUpdateAmount('');
                          }}
                          disabled={goal.currentAmount <= 0}
                          className="flex-1"
                        >
                          <ArrowDownCircle className="w-4 h-4 mr-1" />
                          Tarik Dana
                        </Button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Target Tanggal:</span>
                          <span>{formatDate(goal.deadline)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Sisa Hari:</span>
                          <Badge variant={daysRemaining > 30 ? "secondary" : daysRemaining > 7 ? "default" : "destructive"}>
                            {daysRemaining > 0 ? `${daysRemaining} hari` : 'Terlambat'}
                          </Badge>
                        </div>
                        {goal.description && (
                          <div className="pt-2 border-t">
                            <p className="text-muted-foreground text-xs">{goal.description}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};