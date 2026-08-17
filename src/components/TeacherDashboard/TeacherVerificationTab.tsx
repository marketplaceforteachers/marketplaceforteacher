import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Mail,
  FileCheck,
  Building2,
  Award,
  UploadCloud,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { User } from '../../types';

interface TeacherVerificationTabProps {
  currentUser: User;
  onUpdateVerification?: (status: boolean) => void;
}

export const TeacherVerificationTab: React.FC<TeacherVerificationTabProps> = ({
  currentUser,
  onUpdateVerification,
}) => {
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'id_upload' | 'district'>('email');
  const [schoolEmail, setSchoolEmail] = useState('sjenkins@mooreschools.com');
  const [districtId, setDistrictId] = useState('MPS-OK-94281');
  const [stateLicenseNumber, setStateLicenseNumber] = useState('OK-NBCT-883910');
  const [idFileUploaded, setIdFileUploaded] = useState<string | null>('Faculty_Staff_ID_WestmooreHS.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setVerificationSuccess(true);
      onUpdateVerification?.(true);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Verification Trust Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-500/40 text-amber-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Teacher Verification Hub ⭐⭐⭐⭐⭐
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Get Your Verified Educator Badge
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Verified teachers receive 3x more buyer inquiries, higher trust ranking in search results, zero-fee voucher bonuses, and eligibility to create classroom wishlists and fundraisers.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs pt-2 text-blue-200">
            <span className="flex items-center gap-1 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Instant .edu / .k12.us email validation
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-300" /> State Licensure Sync
            </span>
          </div>
        </div>
      </div>

      {verificationSuccess || currentUser.verifiedTeacher ? (
        <div className="bg-emerald-50 border-2 border-emerald-500/40 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                Verified Faculty Account Active
              </span>
              <h3 className="text-lg font-black text-slate-900">
                You hold a 100% Verified Master Educator Credential
              </h3>
              <p className="text-xs text-slate-600">
                Associated with: <strong>{currentUser.schoolName || 'Moore Public Schools (Westmoore HS)'}</strong>
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 bg-white rounded-xl border border-emerald-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Verification Type</span>
              <span className="font-extrabold text-slate-800">District ID & State License</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-emerald-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Badge Status</span>
              <span className="font-extrabold text-emerald-700">Gold Shield on all Listings</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-emerald-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Renewal Date</span>
              <span className="font-extrabold text-slate-800">August 2027 (Annual)</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Verification Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-black text-slate-900">Select Verification Method</h3>
          <p className="text-xs text-slate-500">Choose how you'd like our educator compliance team to verify your faculty standing</p>
        </div>

        {/* Method Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => setVerificationMethod('email')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              verificationMethod === 'email'
                ? 'border-blue-900 bg-blue-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Mail className="w-5 h-5 text-blue-900 mb-2" />
            <h4 className="font-extrabold text-xs text-slate-900">School Email (.k12 / .edu)</h4>
            <p className="text-[11px] text-slate-500 mt-1">Instant confirmation link sent to district email</p>
          </div>

          <div
            onClick={() => setVerificationMethod('id_upload')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              verificationMethod === 'id_upload'
                ? 'border-blue-900 bg-blue-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <FileCheck className="w-5 h-5 text-emerald-600 mb-2" />
            <h4 className="font-extrabold text-xs text-slate-900">Faculty ID Card Upload</h4>
            <p className="text-[11px] text-slate-500 mt-1">Upload a photo of your school staff badge</p>
          </div>

          <div
            onClick={() => setVerificationMethod('district')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              verificationMethod === 'district'
                ? 'border-blue-900 bg-blue-50/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Building2 className="w-5 h-5 text-purple-600 mb-2" />
            <h4 className="font-extrabold text-xs text-slate-900">District State License</h4>
            <p className="text-[11px] text-slate-500 mt-1">Verify via state board of education roster</p>
          </div>
        </div>

        {/* Dynamic Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {verificationMethod === 'email' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official District / School Email</label>
              <input
                type="email"
                value={schoolEmail}
                onChange={(e) => setSchoolEmail(e.target.value)}
                placeholder="teacher@district.k12.state.us or professor@university.edu"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">
                We accept all US public school district domains, charter networks, and accredited private schools.
              </p>
            </div>
          )}

          {verificationMethod === 'id_upload' && (
            <div className="space-y-2">
              <label className="block font-bold text-slate-700">Upload School Staff ID Photo</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <p className="font-bold text-slate-800">Drag & drop your faculty badge (.jpg, .png, .pdf)</p>
                <p className="text-slate-400 text-[10px]">Must show your name and school name clearly</p>
              </div>
              {idFileUploaded && (
                <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg text-[11px] font-semibold border border-emerald-200 flex items-center justify-between">
                  <span>Attached: {idFileUploaded}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              )}
            </div>
          )}

          {verificationMethod === 'district' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">State Educator License #</label>
                <input
                  type="text"
                  value={stateLicenseNumber}
                  onChange={(e) => setStateLicenseNumber(e.target.value)}
                  placeholder="e.g. TX-TEA-992019"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">School District Identifier</label>
                <input
                  type="text"
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  placeholder="e.g. Moore Public Schools #2"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                  required
                />
              </div>
            </div>
          )}

          <div className="p-3 bg-blue-50 text-blue-900 rounded-xl text-[11px] font-medium border border-blue-100 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <span>
              Your teacher badge will immediately appear on all your listings and school directory faculty profile.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-black text-xs shadow-md transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Verifying Educator Credentials...' : 'Submit Credentials for Instant Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};
