import React, { useState } from 'react';
import { User } from '@/shared/types';
import {
  login as requestLogin,
  signUp as requestSignUp,
  extractProfileFromToken,
  checkLoginIdAvailability,
  fetchMe,
} from '@/shared/services/authService';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'signup';

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loginId, setLoginId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loginIdCheckMessage, setLoginIdCheckMessage] = useState('');
  const [isCheckingLoginId, setIsCheckingLoginId] = useState(false);
  const [loginIdAvailable, setLoginIdAvailable] = useState<boolean | null>(null);
  const [loginIdError, setLoginIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoginIdCheckMessage('');
    setLoginIdError('');
    setPasswordError('');

    const isSignUp = mode === 'signup';
    if (!loginId || !password || (isSignUp && (!name || !email || !confirmPassword))) {
      setError('아이디, 이름, 이메일, 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const ensuredAvailable = await ensureLoginIdAvailable();
        if (!ensuredAvailable) {
          setIsLoading(false);
          return;
        }

        await requestSignUp({
          username: name,
          email,
          loginId,
          password,
        });
      }

      const authResult = await requestLogin({ loginId, password });
      let latestProfile = null;
      try {
        latestProfile = await fetchMe(authResult.access_token, authResult.token_type);
      } catch (err) {
        console.warn('Failed to refresh profile from /api/me', err);
      }
      const tokenProfile = extractProfileFromToken(authResult.access_token);

      const profileName = tokenProfile.name || name || undefined;
      const profileUsername =
        latestProfile?.username ||
        tokenProfile.username ||
        tokenProfile.name ||
        name ||
        undefined;
      const profileEmail = latestProfile?.email || tokenProfile.email || email || undefined;
      const profileLoginId = latestProfile?.loginId || tokenProfile.loginId || loginId;

      const user: User = {
        id: latestProfile?.id,
        loginId: profileLoginId,
        accessToken: authResult.access_token,
        tokenType: authResult.token_type || 'Bearer',
        name: profileName,
        username: profileUsername,
        email: profileEmail,
      };
      onLogin(user);
    } catch (err) {
      const getFriendlyError = (): string => {
        const fallback =
          mode === 'login'
            ? '아이디 또는 비밀번호를 확인해주세요.'
            : '처리 중 오류가 발생했습니다. 다시 시도해주세요.';

        if (err instanceof Error) {
          const msg = err.message || '';
          if (/network/i.test(msg) || /fetch/i.test(msg)) {
            return '서버에 연결할 수 없습니다. 네트워크를 확인하고 다시 시도해주세요.';
          }
          if (mode === 'login') {
            return '아이디 또는 비밀번호를 확인해주세요.';
          }
          return msg;
        }
        return fallback;
      };

      setError(getFriendlyError());
    } finally {
      setIsLoading(false);
    }
  };

  const ensureLoginIdAvailable = async () => {
    if (!loginId.trim()) {
      setLoginIdError('아이디를 입력해주세요.');
      return false;
    }
    try {
      setIsCheckingLoginId(true);
      const resp = await checkLoginIdAvailability(loginId.trim());
      setLoginIdAvailable(resp.available);
      setLoginIdCheckMessage(
        resp.available ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.',
      );
      if (!resp.available) {
        setLoginIdError('이미 사용 중인 아이디입니다.');
      }
      return resp.available;
    } catch (err) {
      setLoginIdError('아이디 확인 중 문제가 발생했습니다. 다시 시도해주세요.');
      return false;
    } finally {
      setIsCheckingLoginId(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-violet-50">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">TIMEMACHINE AI</h1>
          <p className="mt-2 text-slate-600 text-base">
            {mode === 'login' ? '로그인하고 바로 시작하세요.' : '필수 정보만 간단히 입력하면 가입이 완료됩니다.'}
          </p>
        </div>

        <div className="bg-white p-10 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">이름</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required={mode === 'signup'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="loginId" className="block text-sm font-medium text-slate-700">로그인 ID</label>
              <div className="mt-1 flex gap-2">
                <input
                  id="loginId"
                  name="loginId"
                  type="text"
                  autoComplete="username"
                  required
                  value={loginId}
                  onChange={(e) => {
                    setLoginId(e.target.value);
                    setLoginIdAvailable(null);
                    setLoginIdCheckMessage('');
                    setLoginIdError('');
                  }}
                  className="block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                />
                {mode === 'signup' && (
                  <button
                    type="button"
                    onClick={ensureLoginIdAvailable}
                    disabled={isCheckingLoginId || !loginId.trim()}
                    className="px-4 py-2 rounded-md border border-violet-500 text-violet-600 font-semibold hover:bg-violet-50 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
                  >
                    {isCheckingLoginId ? '확인 중...' : '중복확인'}
                  </button>
                )}
              </div>
              {mode === 'signup' && (loginIdError || loginIdCheckMessage) && (
                <p
                  className={`mt-1 text-sm ${
                    loginIdAvailable && !loginIdError ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {loginIdError || loginIdCheckMessage}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700"> 비밀번호 </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError('');
                  }}
                  onBlur={() => {
                    if (confirmPassword && password !== confirmPassword) {
                      setPasswordError('비밀번호가 일치하지 않습니다.');
                    }
                  }}
                  className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                />
                {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">이메일</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required={mode === 'signup'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                />
              </div>
            )}
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입 후 시작하기'}
              </button>
            </div>
          </form>

           <p className="mt-8 text-center text-sm text-slate-600">
            {mode === 'login' ? "계정이 없으신가요?" : '이미 계정이 있으신가요?'}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
            setConfirmPassword('');
            setLoginIdAvailable(null);
            setLoginIdCheckMessage('');
            setPassword('');
            setEmail('');
            setName('');
            setLoginId('');
            setLoginIdError('');
            setPasswordError('');
          }}
              className="font-medium text-violet-600 hover:text-violet-500 ml-1"
            >
              {mode === 'login' ? '가입하기' : '로그인하기'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
