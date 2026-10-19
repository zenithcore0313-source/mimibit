import React, { useState } from 'react';
import { 
  X, Sparkles, Mail, Lock, User, ArrowRight, Check, 
  ShieldCheck, Heart, Crown, Ticket, Smartphone, AlertCircle, Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { signupUser, loginUser, loginWithSocial } from '../../services/api';
import { executeKakaoLogin, executeGoogleLogin } from '../../services/socialAuth';

export function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [tab, setTab] = useState('login'); // 'login', 'signup'
  const [selectedRole, setSelectedRole] = useState('supporter'); // 'creator', 'supporter'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Social Login handler (Kakao & Google OAuth)
  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      let socialData;
      if (provider === 'kakao') {
        socialData = await executeKakaoLogin({ role: selectedRole });
      } else {
        socialData = await executeGoogleLogin({ role: selectedRole });
      }

      const res = await loginWithSocial(socialData);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      onLoginSuccess(res.user);
      onClose();
    } catch (err) {
      console.error('[Social Login Error]:', err);
      setErrorMessage(err.message || '소셜 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // Real Email & Password Auth Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      if (tab === 'signup') {
        const userName = name.trim() || (selectedRole === 'creator' ? '신규 크리에이터' : '새싹 서포터');
        const userHandle = handle.trim() || (selectedRole === 'creator' ? `creator_${Date.now().toString().slice(-4)}` : `fan_${Date.now().toString().slice(-4)}`);

        const res = await signupUser({
          email: email.trim(),
          password: password.trim(),
          name: userName,
          handle: userHandle,
          role: selectedRole
        });

        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}

        onLoginSuccess(res.user, { isNewUser: true });
        onClose();
      } else {
        const res = await loginUser({
          email: email.trim(),
          password: password.trim()
        });

        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}

        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setErrorMessage(err.message || '인증 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in custom-scrollbar overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-md border-2 border-[#FCD5DC] shadow-2xl overflow-hidden relative my-8">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#5E5054] flex items-center justify-center transition-colors z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 text-center">
          <img src="/logo.png" alt="MIMIBIT" className="h-9 w-auto mx-auto object-contain mb-3" />
          <h2 className="text-xl sm:text-2xl font-heading font-black text-[#140E10]">
            {tab === 'login' ? '미미빗에 오신 것을 환영해요!' : '3초 만에 미미빗 시작하기'}
          </h2>
          <p className="text-xs text-[#5E5054] mt-1 font-medium">
            작은 창작자와 팬을 잇는 마이크로 팬덤 게이미피케이션 플랫폼
          </p>

          {/* Role Info: Default Supporter -> Creator upon profile creation */}
          <div className="mt-4 px-3 py-2 bg-[#FFF5F6] rounded-2xl border border-[#FCD5DC] flex items-center justify-center gap-2 text-xs font-bold text-[#E4092B]">
            <Sparkles className="w-4 h-4 shrink-0 text-[#E4092B]" />
            <span>가입 시 기본 후원자 등급 → 프로필 생성 시 크리에이터 자동 승급</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 pt-0 space-y-4">

          {/* Social Logins */}
          <div className="space-y-2.5">
            {/* Kakao 1-Sec Login */}
            <button
              type="button"
              onClick={() => handleSocialLogin('kakao')}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#FEE500] hover:bg-[#FADA0A] text-[#3C1E1E] font-black text-xs transition-transform active:scale-98 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4 fill-[#3C1E1E]" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.708 4.8 4.27 6.054-.187.7-.677 2.534-.775 2.923-.122.485.178.479.375.348.155-.103 2.463-1.673 3.456-2.35.547.08 1.107.125 1.674.125 4.97 0 9-3.185 9-7.115S16.97 3 12 3z"/>
              </svg>
              <span>카카오로 1초 시작하기</span>
            </button>

            {/* Google Login */}
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-[#140E10] font-black text-xs border border-slate-300 transition-transform active:scale-98 flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.15C3.29 21.36 7.37 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.28C.46 8.21 0 10.05 0 12s.46 3.79 1.28 5.42l4-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.64 1.28 6.58l4 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google 계정으로 계속하기</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#FCD5DC]"></div>
            </div>
            <div className="relative flex justify-center text-[10px] text-[#8C7A80] font-bold">
              <span className="bg-white px-3">또는 이메일로 {tab === 'login' ? '로그인' : '가입'}</span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {tab === 'signup' && (
              <>
                <div>
                  <label className="font-bold text-[#140E10] block mb-1">
                    {selectedRole === 'creator' ? '창작자 활동명' : '닉네임'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={selectedRole === 'creator' ? '루나 (Luna Rabbit)' : '새싹서포터'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9FA] border border-[#FCD5DC] font-bold text-[#140E10] focus:outline-none focus:border-[#E4092B]"
                  />
                </div>

                {selectedRole === 'creator' && (
                  <div>
                    <label className="font-bold text-[#140E10] block mb-1">
                      고유 영문 핸들 (mimibit.me/@) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="my_handle"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9FA] border border-[#FCD5DC] font-mono font-bold text-[#140E10] focus:outline-none focus:border-[#E4092B]"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="font-bold text-[#140E10] block mb-1">
                {tab === 'login' ? '이메일 또는 아이디 *' : '이메일 주소 *'}
              </label>
              <input
                type={tab === 'login' ? 'text' : 'email'}
                required
                placeholder={tab === 'login' ? '이메일 또는 아이디 (예: Qwer1821)' : 'user@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9FA] border border-[#FCD5DC] font-medium text-[#140E10] focus:outline-none focus:border-[#E4092B]"
              />
            </div>

            <div>
              <label className="font-bold text-[#140E10] block mb-1">비밀번호 *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9FA] border border-[#FCD5DC] font-mono text-[#140E10] focus:outline-none focus:border-[#E4092B]"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-pop-primary w-full py-3.5 rounded-xl text-xs font-black transition-transform active:scale-98 cursor-pointer mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {isLoading 
                  ? '처리 중...' 
                  : tab === 'login' ? '이메일로 로그인' : '무료 회원가입 완료'}
              </span>
            </button>
          </form>

          {/* Tab Switcher */}
          <div className="pt-2 text-center text-xs font-medium text-[#5E5054]">
            {tab === 'login' ? (
              <span>
                아직 미미빗 계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={() => setTab('signup')}
                  className="font-black text-[#E4092B] hover:underline cursor-pointer"
                >
                  회원가입하기
                </button>
              </span>
            ) : (
              <span>
                이미 계정이 있으신가요?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="font-black text-[#E4092B] hover:underline cursor-pointer"
                >
                  로그인하기
                </button>
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
