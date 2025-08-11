import React, { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../contexts/AuthContext';
import { Shield, ArrowRight, User, Eye, EyeOff } from 'lucide-react';

export const PinLogin: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const { login, user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length !== 6) {
      setError('PIN harus terdiri dari 6 digit angka');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    const success = login(pin);
    if (!success) {
      setError('PIN salah. Silakan coba lagi.');
      setPin('');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      // Focus back to input after error
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <Card className={`w-full max-w-md relative backdrop-blur-sm bg-white/90 border-0 shadow-2xl transition-all duration-300 ${
        isShaking ? 'animate-shake' : 'animate-scale-in'
      }`}>
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Selamat Datang Kembali
            </h2>
            <p className="text-gray-700 font-medium">Halo, {user?.name}</p>
            <p className="text-gray-500 text-sm mt-1">
              {getCurrentTime()} • Masukkan PIN untuk melanjutkan
            </p>
          </div>

          {/* PIN Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-gray-700">PIN (6 digit)</Label>
              <div className="relative">
                <Input
                  ref={inputRef}
                  id="pin"
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="Masukkan PIN Anda"
                  maxLength={6}
                  className="h-14 text-center text-xl font-semibold tracking-widest bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-all duration-200 rounded-xl pr-12"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPin(!showPin)}
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
              
              {/* PIN Progress Indicator */}
              <div className="flex justify-center space-x-2 mt-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      i < pin.length 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-110 shadow-sm' 
                        : 'bg-gray-200 border border-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center animate-slide-up">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit"
              disabled={pin.length !== 6}
              className={`w-full h-12 rounded-xl font-semibold transition-all duration-200 ${
                pin.length === 6
                  ? 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {pin.length === 6 ? (
                <div className="flex items-center justify-center space-x-2">
                  <span>Masuk</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              ) : (
                `Masukkan ${6 - pin.length} digit lagi`
              )}
            </Button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              PIN akan otomatis tersembunyi untuk keamanan
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};