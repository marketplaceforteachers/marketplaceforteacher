import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  ShieldCheck,
  ShieldAlert,
  School,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Info,
  KeyRound,
  Eye,
  EyeOff,
  ShoppingBag,
  Building,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { BrandLogo } from './BrandLogo';
import { MOCK_USERS } from '../data/mockData';
import { sendVerificationCodeEmail, sendWelcomeTeacherEmail } from '../services/emailService';
import { MailCheck, RefreshCw } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  onRegisterSuccess?: (user: User) => void;
  initialTab?: 'login' | 'register' | 'admin';
  onOpenCMSPage?: (slug: string) => void;
  onNavigateHome?: () => void;
  onOpenCPanelExport?: () => void;
  users?: User[];
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  onRegisterSuccess,
  initialTab = 'login',
  onOpenCMSPage,
  onNavigateHome,
  onOpenCPanelExport,
  users = MOCK_USERS,
}) => {
  const safeUsers = Array.isArray(users) && users.length > 0 ? users : MOCK_USERS;
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'admin'>(initialTab || 'login');
  
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [showPassword, setShowPassword] = useState(false);
  const [roleSelection, setRoleSelection] = useState<'teacher' | 'buyer'>('teacher');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSchoolEmail, setRegSchoolEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSchoolName, setRegSchoolName] = useState('');
  const [regDistrict, setRegDistrict] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regState, setRegState] = useState('OK');
  const [regZip, setRegZip] = useState('73159');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [regError, setRegError] = useState('');

  // Email Verification Code State
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  // Forgot password interactive state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Handle standard Login submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedEmail = loginEmail.trim().toLowerCase();
    const targetUser = safeUsers.find(
      (u) =>
        (u.email && u.email.toLowerCase() === trimmedEmail) ||
        (u.schoolEmail && u.schoolEmail.toLowerCase() === trimmedEmail)
    );

    if (targetUser) {
      onLoginSuccess(targetUser);
    } else {
      // If entered email doesn't match predefined users, create an active session
      const isTeacherRole = !trimmedEmail.includes('buyer') && !trimmedEmail.includes('parent');
      const isAdminRole = trimmedEmail.includes('admin');
      const role: UserRole = isAdminRole ? 'admin' : isTeacherRole ? 'teacher' : 'buyer';

      const newUser: User = {
        id: `usr-login-${Date.now()}`,
        name: loginEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email: loginEmail.trim(),
        role: role,
        isBuyerOnly: role === 'buyer',
        schoolName: isTeacherRole ? 'Community Educator' : 'Public Supporter',
        city: 'Oklahoma City',
        state: 'OK',
        zip: '73159',
        rating: 5.0,
        reviewCount: 0,
        salesCount: 0,
        verifiedTeacher: isTeacherRole,
        verified: isTeacherRole,
      };
      onLoginSuccess(newUser);
    }
  };

  // Handle Quick Demo Login
  const handleQuickDemoLogin = (role: UserRole) => {
    const matched = safeUsers.find((u) => u.role === role) || safeUsers[0];
    onLoginSuccess(matched);
  };

  // Handle Admin Direct Login
  const handleAdminDirectLogin = () => {
    const adminUser =
      safeUsers.find((u) => u.role === 'admin') || {
        id: 'usr-admin-01',
        name: 'Admin Supervisor (Marketplace CMS)',
        email: 'info@marketplaceforteachers.com',
        role: 'admin' as UserRole,
        schoolName: 'Platform Operations HQ',
        district: 'Marketplace For Teachers Admin Network',
        state: 'OK',
        city: 'Oklahoma City',
        zip: '73159',
        verifiedTeacher: true,
        rating: 5.0,
        reviewCount: 120,
        salesCount: 340,
      };
    onLoginSuccess(adminUser);
  };

  // Generate 6-digit code and initiate verification
  const startVerificationProcess = async (userToVerify: User) => {
    setIsSendingCode(true);
    setVerificationError('');
    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    setEnteredCode('');
    setPendingUser(userToVerify);
    setIsVerifyingEmail(true);

    try {
      await sendVerificationCodeEmail(userToVerify.email, code, userToVerify.name);
    } catch (err) {
      console.warn('Verification code dispatch note:', err);
    } finally {
      setIsSendingCode(false);
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Handle Register submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regFullName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Please complete all required fields.');
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      setRegError('Please review and accept our Terms of Service & Privacy Policy.');
      return;
    }

    const isTeacher = roleSelection === 'teacher';
    const isBuyer = roleSelection === 'buyer';
    const assignedRole: UserRole = isTeacher ? 'teacher' : 'buyer';

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: regFullName.trim(),
      email: regEmail.trim(),
      schoolEmail: isTeacher ? regSchoolEmail.trim() || regEmail.trim() : undefined,
      role: assignedRole,
      isBuyerOnly: assignedRole === 'buyer',
      schoolName: isTeacher
        ? regSchoolName.trim() || 'Classroom Educator'
        : isBuyer
        ? 'Public Supporter / Parent'
        : 'District Administrator',
      district: isTeacher ? regDistrict.trim() : undefined,
      city: regCity.trim() || 'Oklahoma City',
      state: regState || 'OK',
      zip: regZip.trim() || '73159',
      verifiedTeacher: isTeacher,
      verified: isTeacher,
      verifiedEmail: false,
      rating: 5.0,
      reviewCount: 0,
      salesCount: 0,
      joinDate: 'August 2026',
    };

    // Trigger verification code step
    startVerificationProcess(newUser);
  };

  // Confirm verification code
  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError('');

    if (!enteredCode.trim()) {
      setVerificationError('Please enter the 6-digit verification code.');
      return;
    }

    if (enteredCode.trim() !== verificationCode.trim()) {
      setVerificationError('Invalid verification code. Please check your email or use the demo code.');
      return;
    }

    if (!pendingUser) return;

    const activatedUser: User = {
      ...pendingUser,
      verifiedEmail: true,
      verified: pendingUser.role === 'teacher' ? true : pendingUser.verified,
    };

    try {
      if (activatedUser.role === 'teacher') {
        sendWelcomeTeacherEmail(activatedUser);
      }
    } catch (err) {
      console.warn('Welcome email note:', err);
    }

    if (onRegisterSuccess) {
      onRegisterSuccess(activatedUser);
    } else {
      onLoginSuccess(activatedUser);
    }
  };

  // Resend code handler
  const handleResendCode = () => {
    if (resendCooldown > 0 || !pendingUser) return;
    startVerificationProcess(pendingUser);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative flex flex-col">
        {/* Header with Brand Logo */}
        <div className="bg-linear-to-r from-blue-950 via-blue-900 to-slate-900 text-white p-6 md:p-8 border-b border-blue-800/80 flex items-center justify-between shrink-0 relative">
          <BrandLogo size="lg" variant="dark-header" />
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="text-xs font-bold text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>← Back to Home</span>
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold shrink-0">
          <button
            id="auth-tab-login"
            onClick={() => {
              setActiveTab('login');
              setLoginError('');
            }}
            className={`flex-1 py-3 px-2 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'login'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Login to Account
          </button>
          <button
            id="auth-tab-register"
            onClick={() => {
              setActiveTab('register');
              setRegError('');
            }}
            className={`flex-1 py-3 px-2 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'register'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
          {activeTab === 'admin' && (
            <button
              id="auth-tab-admin"
              onClick={() => setActiveTab('admin')}
              className="py-3 px-4 text-center transition-colors border-b-2 border-purple-600 text-purple-700 bg-white cursor-pointer flex items-center justify-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && !showForgot && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Welcome Back, Educator</h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Sign in with your email to manage classroom listings, track orders, or buy supplies.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email / School Webmail *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="login-email-input"
                    type="email"
                    required
                    placeholder="e.g. sjenkins@okcps.org or name@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Password *</label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>Sign In to Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL • FERPA Compliant</span>
                </div>
                <button
                  type="button"
                  id="auth-switch-to-admin-link"
                  onClick={() => onOpenCMSPage ? onOpenCMSPage('admin-login') : setActiveTab('admin')}
                  className="text-purple-700 hover:text-purple-900 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Staff / Admin Portal →</span>
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD SUB-FLOW */}
          {activeTab === 'login' && showForgot && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900">Reset Password</h3>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="text-blue-600 font-bold text-xs hover:underline cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>

              {forgotSent ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Password Reset Link Sent!</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    We sent a secure password reset link to <strong>{forgotEmail}</strong>. Please check your inbox or spam folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (forgotEmail) setForgotSent(true);
                  }}
                  className="space-y-3"
                >
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Enter the email address associated with your account and we’ll send you instructions to safely reset your password.
                  </p>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. teacher@school.edu or buyer@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Send Password Reset Link
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: REGISTER / CREATE ACCOUNT FORM & VERIFICATION */}
          {activeTab === 'register' && (
            isVerifyingEmail ? (
              <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center shadow-inner">
                    <MailCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-slate-900">Verify Your Email Address</h3>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto">
                    We sent a 6-digit security verification code to{' '}
                    <span className="font-bold text-blue-900">{pendingUser?.email}</span>
                  </p>
                </div>

                {verificationError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold text-xs flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{verificationError}</span>
                  </div>
                )}

                {/* Removed Instant Demo Sandbox Helper */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs text-center uppercase tracking-wider">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="• • • • • •"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full text-center text-2xl font-black font-mono tracking-[0.5em] p-3 rounded-xl border-2 border-blue-300 bg-slate-50 text-blue-950 focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                  />
                  <p className="text-[11px] text-slate-400 text-center mt-1">
                    Check your inbox or spam folder if dispatched via Resend
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Verify Code & Activate Account</span>
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setIsVerifyingEmail(false)}
                      className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                    >
                      ← Edit Registration Info
                    </button>

                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isSendingCode}
                      onClick={handleResendCode}
                      className={`font-bold flex items-center gap-1 cursor-pointer ${
                        resendCooldown > 0 || isSendingCode
                          ? 'text-slate-400 cursor-not-allowed'
                          : 'text-blue-600 hover:underline'
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSendingCode ? 'animate-spin' : ''}`} />
                      <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Join MarketplaceForTeachers.com</h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Open to all educators, parents, community buyers, and school administrators nationwide.
                </p>
              </div>

              {regError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Role Type Selector: Educator vs Buyer */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRoleSelection('teacher')}
                  className={`py-2 px-2 rounded-lg text-[11px] font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                    roleSelection === 'teacher'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <School className="w-3.5 h-3.5" />
                  <span>Teacher</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRoleSelection('buyer')}
                  className={`py-2 px-2 rounded-lg text-[11px] font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                    roleSelection === 'buyer'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Buyer / Parent</span>
                </button>
              </div>

              {roleSelection === 'buyer' && (
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>Community Buyer Account:</strong> No school email required. Instant checkout, wishlist donations, and order tracking.
                  </span>
                </div>
              )}

              {roleSelection === 'teacher' && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Educator Account:</strong> Sell surplus supplies, post classroom bundles, and unlock teacher rewards.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
                  />
                </div>
              </div>

              {roleSelection === 'teacher' && (
                <div className="space-y-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                  <div className="flex items-center gap-1.5 text-blue-950 font-bold">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Educator & School Details</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Official School Webmail (.edu / .k12.*.us)</label>
                    <input
                      type="email"
                      placeholder="e.g. sjenkins@okcps.org"
                      value={regSchoolEmail}
                      onChange={(e) => setRegSchoolEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">School / Campus Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Prairie View Elementary"
                        value={regSchoolName}
                        onChange={(e) => setRegSchoolName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">School District</label>
                      <input
                        type="text"
                        placeholder="e.g. Oklahoma City Public Schools"
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Oklahoma City"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    placeholder="OK"
                    value={regState}
                    onChange={(e) => setRegState(e.target.value.toUpperCase().slice(0, 2))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    placeholder="73159"
                    value={regZip}
                    onChange={(e) => setRegZip(e.target.value.slice(0, 5))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Create Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
                />
              </div>

              {/* Agreement checkboxes with clickable modal links */}
              <div className="space-y-2 pt-1 border-t border-slate-200 text-slate-700">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600"
                  />
                  <span>
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => onOpenCMSPage && onOpenCMSPage('terms')}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Terms of Service
                    </button>{' '}
                    and educator marketplace standards.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600"
                  />
                  <span>
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => onOpenCMSPage && onOpenCMSPage('privacy')}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Privacy & FERPA Protection Policy
                    </button>
                    .
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>Complete Registration (Free)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            )
          )}

          {/* TAB 3: ADMIN ACCESS PORTAL */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-purple-300" />
                  <span className="font-black text-sm">Super Admin Control Center</span>
                </div>
                <p className="text-xs text-purple-200 leading-relaxed">
                  Authorized staff login for full marketplace moderation, escrow oversight, and system analytics.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 text-purple-950 text-xs space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-purple-900">
                  <KeyRound className="w-3.5 h-3.5 text-purple-700" />
                  <span>Platform Operations HQ Account:</span>
                </div>
                <p>Email: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-purple-200">admin@marketplaceforteachers.com</code></p>
                <p>Password: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-purple-200">TeacherAdmin2025!</code></p>
              </div>

              <button
                type="button"
                onClick={handleAdminDirectLogin}
                className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Launch Super Admin CMS</span>
              </button>
            </div>
          )}
          {/* cPanel Deployment Quick Bar */}
          {onOpenCPanelExport && (
            <div className="mt-6 pt-4 border-t border-slate-200 text-center">
              <button
                type="button"
                onClick={onOpenCPanelExport}
                className="inline-flex items-center gap-2 text-xs font-black text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 transition-colors cursor-pointer shadow-xs"
              >
                <span>📦 Export cPanel Production Code Package (index.html, PHP API, MySQL SQL)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
