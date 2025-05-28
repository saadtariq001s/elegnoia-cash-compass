// src/components/auth/AuthWrapper.tsx
import React, { useState } from 'react';
import { Login } from './Login';
import { Signup } from './Signup';

export const AuthWrapper: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <>
      {isLoginMode ? (
        <Login onToggleSignup={toggleMode} />
      ) : (
        <Signup onToggleLogin={toggleMode} />
      )}
    </>
  );
};