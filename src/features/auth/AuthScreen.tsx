import React, { useState } from 'react';
import { User } from '@/shared/types';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'signup';

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('모든 필드를 채워주세요.');
      return;
    }
    
    // NOTE: This is a mock authentication system for demonstration purposes.
    // In a real application, you would make an API call to a secure backend.
    
    if (mode === 'signup') {
      // Check if user already exists
      if (localStorage.getItem(`user_${email}`)) {
        setError('이 이메일로 가입된 계정이 이미 존재합니다. 로그인해주세요.');
        return;
      }
      // Create new user
      const newUser = { email, password }; // In a real app, hash the password!
      localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
      localStorage.setItem(`diary_${email}`, '[]');
      onLogin({ email });

    } else { // login mode
      const storedUserJSON = localStorage.getItem(`user_${email}`);
      if (!storedUserJSON) {
        setError('이 이메일로 가입된 계정을 찾을 수 없습니다. 회원가입을 진행해주세요.');
        return;
      }
      
      const storedUser = JSON.parse(storedUserJSON);

      // In a real app, you would verify the password against a hash.
      if (storedUser.password !== password) {
          setError('비밀번호가 올바르지 않습니다.');
          return;
      }
      
      onLogin({ email });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-violet-50">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800">TIMEMACHINE AI</h1>
            <p className="mt-3 text-slate-600 text-lg">
                {mode === 'login' ? '다시 오신 것을 환영합니다! 로그인해주세요.' : '계정을 만들어 시작하세요.'}
            </p>
        </div>

        <div className="bg-white p-10 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">이메일 주소</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password"className="block text-sm font-medium text-slate-700">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                {mode === 'login' ? '로그인' : '회원가입'}
              </button>
            </div>
          </form>

           <p className="mt-8 text-center text-sm text-slate-600">
            {mode === 'login' ? "계정이 없으신가요?" : '이미 계정이 있으신가요?'}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="font-medium text-violet-600 hover:text-violet-500 ml-1">
              {mode === 'login' ? '가입하기' : '로그인하기'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
