// src/components/auth/Signup.tsx - Professional Design
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Eye, 
  EyeOff, 
  UserPlus, 
  Shield, 
  Sparkles, 
  Lock,
  User,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';

interface SignupProps {
  onToggleLogin: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onToggleLogin }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signup(formData);
    
    if (!result.success) {
      setError(result.error || 'Signup failed');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Signup Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600"></div>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <div className="relative">
                <UserPlus className="w-10 h-10 text-white" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Join AgenticAccounting
            </h1>
            <p className="text-gray-600 font-medium">
              Create your professional financial dashboard
            </p>
          </div>

          {/* Features Preview */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-bold text-green-900">What you'll get</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span>Personal financial dashboard</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span>Advanced analytics & charts</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span>AI-powered insights</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span>Secure CSV data storage</span>
              </div>
            </div>
          </div>

          {/* Signup Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                    placeholder="Choose a unique username"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Username must be at least 3 characters long
                </p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${strengthColors[passwordStrength - 1] || 'bg-gray-300'}`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {strengthLabels[passwordStrength - 1] || 'Too Short'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-1 flex items-center gap-1">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-red-600 font-medium">Passwords don't match</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onToggleLogin}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>

          {/* Security Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Secure Signup</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>Data Protected</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>Professional</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional branding */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm font-medium">
            AgenticAccounting • Professional Edition
          </p>
        </div>
      </div>
    </div>
  );
};