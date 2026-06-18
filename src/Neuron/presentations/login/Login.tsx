import { useAuth } from '@/Neuron/hooks/use-auth';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

interface LoginErrors {
  email?: string;
  password?: string;
}

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return undefined;
}

interface ILogin {}

export const Login: React.FC<ILogin> = () => {
  const { login, isAuthenticated, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  if (isAuthenticated)
    return (
      <Navigate
        to='/dashboard'
        replace
      />
    );

  const clearFieldError = (field: keyof LoginErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (touched.email) clearFieldError('email');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (touched.password) clearFieldError('password');
  };

  const handleBlur = (field: keyof LoginErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = field === 'email' ? email : password;
    const validator = field === 'email' ? validateEmail : validatePassword;
    const error = validator(value);
    if (error) setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const onLoginComplete = (result: string) => {
    if (result === 'success') {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const newErrors: LoginErrors = {
      ...(emailError ? { email: emailError } : {}),
      ...(passwordError ? { password: passwordError } : {}),
    };
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    if (emailError || passwordError) return;
    const mapToRequest = {
      email,
      password,
    };
    login(mapToRequest, onLoginComplete);
  };

  const inputBase =
    'w-full rounded-xl bg-slate-800/60 border pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:bg-slate-800/90 focus:ring-1 focus:outline-none transition-all shadow-inner';
  const inputNormal = `${inputBase} border-slate-700/60 focus:border-blue-500 focus:ring-blue-500`;
  const inputError = `${inputBase} border-red-500/70 focus:border-red-500 focus:ring-red-500`;

  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-[#0B0F19] text-slate-200 font-sans selection:bg-blue-500/30 p-6 relative overflow-hidden'>
      <div className='absolute top-0 right-[20%] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none' />
      <div className='absolute bottom-0 left-[10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none' />

      <div className='w-full max-w-[420px] relative z-10'>
        <div className='mb-10 text-center'>
          <h2 className='flex items-center justify-center gap-3 text-4xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg'>
            Nuron
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 ring-2 ring-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.4)]'>
              <Zap size={24} />
            </div>
            <span className='text-blue-500'>Browse</span>
          </h2>
          <p className='text-slate-400'>Automate intelligently. Sign in to your cluster.</p>
        </div>

        <div className='rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl'>
          <form
            onSubmit={handleSubmit}
            noValidate
            className='space-y-6'
          >
            <div className='space-y-5'>
              {/* Email */}
              <div className='space-y-2'>
                <label
                  className='text-sm font-medium text-slate-300 ml-1'
                  htmlFor='email'
                >
                  Email <span className='text-red-400'>*</span>
                </label>
                <div className='relative group'>
                  <div
                    className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors ${errors.email ? 'text-red-400' : 'text-slate-500 group-focus-within:text-blue-400'}`}
                  >
                    <Mail size={18} />
                  </div>
                  <input
                    id='email'
                    type='email'
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => handleBlur('email')}
                    className={errors.email ? inputError : inputNormal}
                    placeholder='you@company.com'
                    autoComplete='email'
                  />
                </div>
                {errors.email && <p className='text-xs text-red-400 ml-1'>{errors.email}</p>}
              </div>

              {/* Password */}
              <div className='space-y-2'>
                <div className='flex items-center justify-between ml-1'>
                  <label
                    className='text-sm font-medium text-slate-300'
                    htmlFor='password'
                  >
                    Password <span className='text-red-400'>*</span>
                  </label>
                  <a
                    href='#'
                    className='text-xs font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors'
                  >
                    Forgot password?
                  </a>
                </div>
                <div className='relative group'>
                  <div
                    className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors ${errors.password ? 'text-red-400' : 'text-slate-500 group-focus-within:text-blue-400'}`}
                  >
                    <Lock size={18} />
                  </div>
                  <input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => handleBlur('password')}
                    className={`${errors.password ? inputError : inputNormal} pr-11`}
                    placeholder='••••••••'
                    autoComplete='current-password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-300 transition-colors'
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className='text-xs text-red-400 ml-1'>{errors.password}</p>}
              </div>
            </div>
            <button
              type='submit'
              disabled={isLoggingIn}
              className='group relative flex w-full justify-center items-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(37,99,235,0.39)] hover:bg-blue-500 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0B0F19] transition-all overflow-hidden disabled:opacity-60 disabled:pointer-events-none'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform' />
              <span className='relative'>{isLoggingIn ? 'Signing in…' : 'Login'}</span>
              {!isLoggingIn && (
                <ArrowRight
                  size={18}
                  className='relative group-hover:translate-x-1 transition-transform'
                />
              )}
            </button>
          </form>
        </div>
        <style>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    </div>
  );
};
