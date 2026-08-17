import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Sparkles,
  School,
  MapPin,
  Mail,
  Phone,
  BookOpen,
  Image as ImageIcon,
} from 'lucide-react';
import { User } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateProfile: (updated: User) => void;
}

const EDUCATOR_AVATAR_PRESETS = [
  {
    id: 'preset-1',
    label: 'Elementary Teacher',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'preset-2',
    label: 'STEM & Robotics Instructor',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'preset-3',
    label: 'Literacy Specialist',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'preset-4',
    label: 'Science & Lab Educator',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'preset-5',
    label: 'Math & Technology Coach',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'preset-6',
    label: 'Arts & Music Instructor',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'preset-7',
    label: 'Middle School Educator',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'preset-8',
    label: 'School Librarian & Media',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
  },
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const [activePhotoTab, setActivePhotoTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [photoUrl, setPhotoUrl] = useState(currentUser.profilePhoto || currentUser.avatar || '');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Profile Fields
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [schoolName, setSchoolName] = useState(currentUser.schoolName || '');
  const [district, setDistrict] = useState(currentUser.district || '');
  const [city, setCity] = useState(currentUser.city || 'Oklahoma City');
  const [state, setState] = useState(currentUser.state || 'OK');
  const [zip, setZip] = useState(currentUser.zip || '73159');
  const [phone, setPhone] = useState(currentUser.phone || '(405) 555-8322');
  const [bio, setBio] = useState(
    currentUser.bio ||
      '4th Grade STEM & Literacy Educator. Passionate about circulating quality classroom resources to fellow teachers!'
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File Upload to Data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, JPEG, WebP, GIF).');
      return;
    }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPhotoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleApplyCustomUrl = () => {
    if (customUrlInput.trim()) {
      setPhotoUrl(customUrlInput.trim());
      setCustomUrlInput('');
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      schoolName: schoolName.trim(),
      district: district.trim(),
      city: city.trim(),
      state: state.trim().toUpperCase(),
      zip: zip.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      profilePhoto: photoUrl,
      avatar: photoUrl,
    };

    onUpdateProfile(updatedUser);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div
      id="user-profile-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div
        id="user-profile-modal-container"
        className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col font-sans"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
              <Camera className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Educator Profile & Profile Picture
              </h3>
              <p className="text-xs text-slate-500">
                Update your photo and school credentials across MarketplaceForTeachers.com
              </p>
            </div>
          </div>

          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* PROFILE PICTURE STUDIO SECTION */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                Profile Picture & Avatar
              </span>
              <span className="text-[11px] text-slate-500">Visible to buyers & school sellers</span>
            </div>

            {/* Current Photo Preview + Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative shrink-0 group">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-blue-600/30"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-blue-900 text-white flex items-center justify-center font-extrabold text-2xl border-4 border-white shadow-md">
                    {name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('') || 'ED'}
                  </div>
                )}

                {currentUser.verified && (
                  <span
                    className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-sm"
                    title="Verified Educator Badge"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2 w-full">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{name || 'Educator'}</h4>
                  <p className="text-xs text-slate-500">
                    {schoolName || 'Public School District'} • {city}, {state}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload From Device</span>
                  </button>

                  {photoUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="bg-white hover:bg-red-50 text-red-600 border border-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Photo Tabs: Device Drag & Drop | Educator Presets | Custom Web URL */}
            <div className="pt-3 border-t border-slate-200">
              {uploadError && (
                <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <X className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActivePhotoTab('upload')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activePhotoTab === 'upload'
                      ? 'bg-blue-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Drag & Drop Upload
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhotoTab('preset')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activePhotoTab === 'preset'
                      ? 'bg-blue-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Curated Educator Avatars
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhotoTab('url')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activePhotoTab === 'url'
                      ? 'bg-blue-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Paste Image URL
                </button>
              </div>

              {/* Tab 1: Drag & Drop */}
              {activePhotoTab === 'upload' && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-blue-600 bg-blue-50/80 scale-[1.01]'
                      : 'border-slate-300 hover:border-blue-500 bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Drop your profile picture here, or{' '}
                    <span className="text-blue-600 underline">browse files</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports JPG, PNG, WebP or GIF (Max 10MB)
                  </p>
                </div>
              )}

              {/* Tab 2: Educator Avatar Presets */}
              {activePhotoTab === 'preset' && (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500 font-medium">
                    Select a professional educator avatar matching your classroom role:
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                    {EDUCATOR_AVATAR_PRESETS.map((preset) => {
                      const isSelected = photoUrl === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setPhotoUrl(preset.url)}
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all group ${
                            isSelected
                              ? 'border-blue-600 ring-2 ring-blue-500/50 scale-105'
                              : 'border-slate-200 hover:border-blue-400'
                          }`}
                          title={preset.label}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                          />
                          {isSelected && (
                            <span className="absolute inset-0 bg-blue-900/40 flex items-center justify-center text-white">
                              <CheckCircle2 className="w-5 h-5 drop-shadow-sm" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: Paste Custom URL */}
              {activePhotoTab === 'url' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://example.com/my-teacher-photo.jpg"
                      className="flex-1 p-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors"
                    >
                      Apply URL
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Paste any direct HTTPS image link to your school staff directory photo.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* EDUCATOR INFORMATION FIELDS */}
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-blue-600" />
              School District & Personal Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name & Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins, M.Ed."
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Educator Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sjenkins@okcps.org"
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  School / Campus Name
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Prairie View Elementary"
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  School District Network
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Oklahoma City Public Schools (OKCPS)"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  City & State *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="col-span-2 p-2.5 rounded-lg border border-slate-300 font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    placeholder="State"
                    className="p-2.5 rounded-lg border border-slate-300 font-bold text-center text-slate-900 uppercase focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  School Delivery ZIP Code
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="73159"
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Helpline / Mobile Phone (for pickup coordination)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(405) 555-8322"
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Teacher Bio & Classroom Specialty
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short intro about your classroom, grade level, and passion..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Official email contact: <strong className="text-slate-800">info@marketplaceforteachers.com</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-bounce" />
                    <span>Saved Successfully!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Profile & Photo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
