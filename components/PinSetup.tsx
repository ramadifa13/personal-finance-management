import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../contexts/AuthContext';
import { Shield, User, Mail, Sparkles, Lock, ArrowRight } from 'lucide-react';

export const PinSetup: React.FC = () => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const { setPin: savePin } = useAuth();

  const handleNext = () => {
    setError('');
    if (!name || !email) {
      setError('Nama dan email harus diisi');
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      setError('PIN harus terdiri dari 6 digit angka');
      return;
    }

    if (pin !== confirmPin) {
      setError('PIN konfirmasi tidak cocok');
      return;
    }

    savePin(pin, name, email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      
      <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/90 border-0 shadow-2xl animate-scale-in">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                {step === 1 ? (
                  <User className="w-10 h-10 text-white" />
                ) : (
                  <Shield className="w-10 h-10 text-white" />
                )}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-yellow-700" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 1 ? 'Selamat Datang!' : 'Keamanan PIN'}
            </h2>
            <p className="text-gray-600">
              {step === 1 
                ? 'Mari mulai perjalanan finansial Anda'
                : 'Buat PIN 6 digit untuk keamanan akun'
              }
            </p>
            
            {/* Progress indicator */}
            <div className="flex items-center justify-center space-x-2 mt-6">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                step >= 1 ? 'bg-blue-500' : 'bg-gray-200'
              }`}></div>
              <div className={`w-8 h-1 rounded-full transition-all duration-300 ${
                step >= 2 ? 'bg-blue-500' : 'bg-gray-200'
              }`}></div>
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                step >= 2 ? 'bg-blue-500' : 'bg-gray-200'
              }`}></div>
            </div>
          </div>

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6 animate-slide-up">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-400 transition-all duration-200"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-400 transition-all duration-200"
                    placeholder="Masukkan email"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-slide-up">
                  {error}
                </div>
              )}

              <Button 
                onClick={handleNext}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <span>Lanjutkan</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>
          )}

          {/* Step 2: PIN Setup */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-gray-700 font-medium">PIN (6 digit)</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="pin"
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="pl-12 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-400 transition-all duration-200 text-center text-lg tracking-widest"
                    placeholder="••••••"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">PIN akan digunakan untuk masuk ke aplikasi</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPin" className="text-gray-700 font-medium">Konfirmasi PIN</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPin"
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="pl-12 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-400 transition-all duration-200 text-center text-lg tracking-widest"
                    placeholder="••••••"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-slide-up">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Buat Akun
                </Button>
                
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  Kembali
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
};