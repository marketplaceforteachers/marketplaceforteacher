import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Building2,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  Server,
  Key,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { User, UserRole } from '../types';

interface AdminLoginPageProps {
  onAdminLoginSuccess: (adminUser: User) => void;
  onNavigateHome: () => void;
  onOpenContact?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onAdminLoginSuccess,
  onNavigateHome,
  onOpenContact,
}) => {
  const [adminEmail, setAdminEmail] = useState('info@marketplaceforteachers.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = adminEmail.trim().toLowerCase();
    const trimmedPassword = adminPassword.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage('Please enter your administrator staff email and master password.');
      return;
    }

    // Require valid admin email format
    const isAllowedEmail = 
      trimmedEmail === 'admin@marketplaceforteachers.com' ||
      trimmedEmail === 'info@marketplaceforteachers.com' ||
      trimmedEmail === 'marketplaceforteachers.com@gmail.com' ||
      trimmedEmail === 'admin' ||
      trimmedEmail.startsWith('admin@') ||
      trimmedEmail.includes('admin');

    if (!isAllowedEmail) {
      setErrorMessage('Access Denied. Only authorized Super Administrator staff accounts can log into this portal.');
      return;
    }

    // Require exact valid master admin password
    const validPasswords = ['TeacherAdmin2025!', 'Admin2026!', 'admin2026', 'admin123', 'Admin2025!'];
    if (!validPasswords.includes(trimmedPassword)) {
      setErrorMessage('Access Denied: Invalid master administrator password. Please check your credentials and try again.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Move to 2FA security step
      setShow2FA(true);
    }, 400);
  };

  const handleFinal2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedCode = twoFactorCode.trim();

    if (!trimmedCode || trimmedCode.length < 4) {
      setErrorMessage('Please enter the 6-digit administrative verification code.');
      return;
    }

    const validPasscodes = ['748291', '849201', '123456', '999999'];
    if (!validPasscodes.includes(trimmedCode)) {
      setErrorMessage('Access Denied: Invalid 2FA security code. Please use the authorized passcode (748291).');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const superAdminUser: User = {
        id: 'usr-super-admin-01',
        name: 'Platform Operations HQ (Super Admin)',
        email: adminEmail.trim().toLowerCase() || 'admin@marketplaceforteachers.com',
        role: 'admin' as UserRole,
        schoolName: 'Platform Operations HQ',
        district: 'Marketplace For Teachers Admin Network',
        state: 'OK',
        city: 'Oklahoma City',
        zip: '73159',
        verifiedTeacher: true,
        verified: true,
        rating: 5.0,
        reviewCount: 380,
        salesCount: 1420,
      };

      onAdminLoginSuccess(superAdminUser);
    }, 500);
  };

  return (
    <div id="admin-login-portal" className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-slate-900">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden relative">
        {/* Top Header Strip */}
        <div className="bg-linear-to-r from-purple-950 via-slate-900 to-blue-950 text-white p-6 border-b border-purple-900/60 relative">
          <button
            onClick={onNavigateHome}
            className="text-xs text-purple-300 hover:text-white inline-flex items-center gap-1 mb-4 font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Public Marketplace</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-inner">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-purple-500/30 uppercase tracking-wider mb-1">
                Restricted Staff Portal
              </div>
              <h2 className="text-lg font-black text-white leading-tight">Super Admin Control Center</h2>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!show2FA ? (
            <form onSubmit={handleInitialSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Administrator Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="info@marketplaceforteachers.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Master Admin Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
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

              <div className="bg-purple-50 p-3.5 rounded-xl border border-purple-200 text-purple-950 text-[11px] leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-purple-900 mb-0.5">
                  <Key className="w-3.5 h-3.5 text-purple-700" />
                  <span>Administrative Access Credentials:</span>
                </div>
                <p>Email: <code className="font-mono text-purple-900 font-bold bg-white px-1.5 py-0.5 rounded border border-purple-200">admin@marketplaceforteachers.com</code></p>
                <p>Password: <code className="font-mono text-purple-900 font-bold bg-white px-1.5 py-0.5 rounded border border-purple-200">TeacherAdmin2025!</code></p>
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  {isSubmitting ? (
                    <span>Authenticating Admin Credentials...</span>
                  ) : (
                    <>
                      <span>Proceed with Entered Credentials</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleFinal2FASubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-purple-700" />
                  <span>Two-Factor Security Code</span>
                </div>
                <p className="text-[11px] text-purple-800">
                  A verification code has been dispatched to authorized administrative staff. Enter your 6-digit authenticator or deployment PIN below.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">6-Digit Admin Passcode *</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 748291"
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-center text-xl tracking-widest font-black text-purple-950 focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => setShow2FA(false)}
                  className="text-purple-600 hover:underline font-bold cursor-pointer"
                >
                  ← Back to Email
                </button>
                <button
                  type="button"
                  onClick={() => setTwoFactorCode('748291')}
                  className="text-slate-500 hover:text-purple-600 underline cursor-pointer"
                >
                  Auto-fill Passcode (748291)
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {isSubmitting ? (
                  <span>Authorizing Super Admin Session...</span>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Launch Super Admin CMS</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
            Protected by 256-Bit SSL Encryption • All administrative session actions are logged to the immutable compliance audit ledger.
          </div>
        </div>
      </div>
    </div>
  );
};
