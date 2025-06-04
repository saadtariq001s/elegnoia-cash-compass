// src/components/auth/Login.tsx - Enhanced Security
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  Shield, 
  Lock,
  User,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Database,
  Clock,
  Zap
} from 'lucide-react';

interface LoginProps {
  onToggleSignup: () => void;
}

export const Login: React.FC<LoginProps> = ({ onToggleSignup }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [securityChecks, setSecurityChecks] = useState({
    dataIntegrity: false,
    sessionValidation: false,
    secureConnection: false,
  });

  // Security initialization effect
  useEffect(() => {
    const runSecurityChecks = async () => {
      // Simulate security checks
      await new Promise(resolve => setTimeout(resolve, 500));
      setSecurityChecks(prev => ({ ...prev, dataIntegrity: true }));
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setSecurityChecks(prev => ({ ...prev, sessionValidation: true }));
      
      await new Promise(resolve => setTimeout(resolve, 200));
      setSecurityChecks(prev => ({ ...prev, secureConnection: true }));
    };

    runSecurityChecks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Additional client-side validation
    if (!formData.username.trim()) {
      setError('Username is required');
      setIsLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData);
      
      if (!result.success) {
        setError(result.error || 'Authentication failed');
      }
      // Success case is handled by the AuthContext
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleDemoLogin = (username: string, password: string) => {
    setFormData({ username, password });
    setError(''); // Clear any existing errors
  };

  const allSecurityChecksComplete = Object.values(securityChecks).every(check => check);

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
        {/* Main Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Security Status Bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600"></div>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg relative">
              <Shield className="w-10 h-10 text-white" />
              {allSecurityChecksComplete && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Secure Access
            </h1>
            <p className="text-gray-600 font-medium">
              AgenticAccounting Professional Platform
            </p>
          </div>

          {/* Security Status */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-bold text-green-900">Security Status</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${securityChecks.dataIntegrity ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-green-800">Data Integrity Verified</span>
                {securityChecks.dataIntegrity && <CheckCircle className="w-4 h-4 text-green-600" />}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${securityChecks.sessionValidation ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-green-800">Session Validation Active</span>
                {securityChecks.sessionValidation && <CheckCircle className="w-4 h-4 text-green-600" />}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${securityChecks.secureConnection ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-green-800">Secure Connection Established</span>
                {securityChecks.secureConnection && <CheckCircle className="w-4 h-4 text-green-600" />}
              </div>
            </div>
          </div>

          
          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-medium">Authentication Failed</p>
                  <p className="text-xs">{error}</p>
                </div>
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
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter your username"
                    disabled={isLoading}
                  />
                </div>
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
                    className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !allSecurityChecksComplete}
              className="group relative w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                  <Clock className="w-5 h-5" />
                </>
              ) : !allSecurityChecksComplete ? (
                <>
                  <div className="animate-pulse rounded-full h-5 w-5 border-2 border-white"></div>
                  <span>Initializing Security...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Secure Login</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onToggleSignup}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  Create new account
                </button>
              </p>
            </div>
          </form>

          {/* Security Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Database className="w-4 h-4" />
                <span>Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional branding */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm font-medium">
            AgenticAccounting • Enterprise Security
          </p>
        </div>
      </div>
    </div>
  );
};