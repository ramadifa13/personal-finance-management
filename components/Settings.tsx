import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useFinance } from '../contexts/FinanceContext';
import { 
  User, 
  Shield, 
  Download, 
  Upload, 
  Trash2,
  Eye,
  EyeOff,
  UserPlus
} from 'lucide-react';
import { toast } from "sonner";

export const Settings: React.FC = () => {
  const { user, logout, deleteUser } = useAuth();
  const { transactions, goals } = useFinance();
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [pinData, setPinData] = useState({
    currentPin: '',
    newPin: '',
    confirmNewPin: '',
  });


  const handlePinChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pinData.currentPin !== user?.pin) {
      toast.error('PIN saat ini salah!');
      return;
    }

    if (pinData.newPin.length !== 6 || !/^\d+$/.test(pinData.newPin)) {
      toast.error('PIN baru harus terdiri dari 6 digit angka!');
      return;
    }

    if (pinData.newPin !== pinData.confirmNewPin) {
      toast.error('PIN baru dan konfirmasi tidak cocok!');
      return;
    }

    // Update PIN in localStorage
    if (user) {
      const updatedUser = { ...user, pin: pinData.newPin };
      localStorage.setItem('financeUser', JSON.stringify(updatedUser));
      toast.success('PIN berhasil diubah!');
      setPinData({ currentPin: '', newPin: '', confirmNewPin: '' });
    }
  };

  const exportData = () => {
    const data = {
      user,
      transactions,
      goals,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data berhasil diekspor!');
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        if (data.transactions) {
          localStorage.setItem('financeTransactions', JSON.stringify(data.transactions));
        }
        if (data.goals) {
          localStorage.setItem('financeGoals', JSON.stringify(data.goals));
        }

        toast.success('Data berhasil diimpor! Silakan refresh halaman.');
        
      } catch (error) {
        toast.error('File tidak valid atau rusak!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const clearAllData = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan!')) {
      localStorage.removeItem('financeTransactions');
      localStorage.removeItem('financeGoals');
      toast.success('Semua data berhasil dihapus! Silakan refresh halaman.');
    }
  };

  const createNewAccount = () => {
    if (confirm('Apakah Anda yakin ingin membuat akun baru? Semua data dan akun saat ini akan dihapus secara permanen!')) {
      deleteUser();
      toast.success('Akun lama berhasil dihapus! Silakan buat akun baru.');
    }
  };

  const getDataStats = () => {
    const totalTransactions = transactions.length;
    const totalGoals = goals.length;
    const dataSize = ((JSON.stringify(transactions).length + JSON.stringify(goals).length) / 1024).toFixed(2);
    
    return { totalTransactions, totalGoals, dataSize };
  };

  const stats = getDataStats();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2>Pengaturan</h2>
        <p className="text-muted-foreground">Kelola akun dan preferensi aplikasi Anda</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profil Pengguna</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input value={user?.name || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Untuk mengubah informasi profil, silakan buat akun baru.
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Keamanan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePinChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPin">PIN Saat Ini</Label>
              <div className="relative">
                <Input
                  id="currentPin"
                  type={showCurrentPin ? "text" : "password"}
                  value={pinData.currentPin}
                  onChange={(e) => setPinData({...pinData, currentPin: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                  placeholder="Masukkan PIN saat ini"
                  maxLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowCurrentPin(!showCurrentPin)}
                >
                  {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPin">PIN Baru</Label>
                <div className="relative">
                  <Input
                    id="newPin"
                    type={showNewPin ? "text" : "password"}
                    value={pinData.newPin}
                    onChange={(e) => setPinData({...pinData, newPin: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                    placeholder="6 digit PIN baru"
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowNewPin(!showNewPin)}
                  >
                    {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmNewPin">Konfirmasi PIN Baru</Label>
                <Input
                  id="confirmNewPin"
                  type="password"
                  value={pinData.confirmNewPin}
                  onChange={(e) => setPinData({...pinData, confirmNewPin: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                  placeholder="Ulangi PIN baru"
                  maxLength={6}
                />
              </div>
            </div>

            <Button type="submit" disabled={!pinData.currentPin || !pinData.newPin || !pinData.confirmNewPin}>
              Ubah PIN
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{stats.totalTransactions}</p>
              <p className="text-sm text-muted-foreground">Transaksi</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats.totalGoals}</p>
              <p className="text-sm text-muted-foreground">Goals</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{stats.dataSize}KB</p>
              <p className="text-sm text-muted-foreground">Ukuran Data</p>
            </div>
          </div>

          {/* Data Actions */}
          <div className="flex flex-wrap gap-4">
            <Button onClick={exportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Ekspor Data
            </Button>

            <div>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                style={{ display: 'none' }}
                id="file-import"
              />
              <Button asChild variant="outline">
                <label htmlFor="file-import" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Impor Data
                </label>
              </Button>
            </div>

            <Button onClick={clearAllData} variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus Semua Data
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>💡 <strong>Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Ekspor data secara berkala untuk backup</li>
              <li>File backup berformat JSON dan dapat diimpor kembali</li>
              <li>Penghapusan data tidak dapat dibatalkan</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Zona Berbahaya</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h4 className="font-medium text-blue-900">Buat Akun Baru</h4>
              <p className="text-sm text-blue-700 mb-3">
                Hapus akun saat ini dan buat akun baru dengan nama, email, dan PIN yang berbeda
              </p>
              <Button onClick={createNewAccount} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                <UserPlus className="w-4 h-4 mr-2" />
                Buat Akun Baru
              </Button>
            </div>

            <div className="p-4 border border-destructive rounded-lg bg-destructive/5">
              <h4 className="font-medium">Keluar dari Akun</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Anda akan diminta memasukkan PIN kembali untuk masuk
              </p>
              <Button onClick={logout} variant="destructive">
                Keluar Akun
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};