import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Search,
  School,
  Mail,
  MapPin,
  DollarSign,
  Briefcase,
  ArrowUpRight,
  Send,
  Eye,
  ExternalLink,
  Clock,
  CreditCard,
  Building,
  Check,
  X,
  PlusCircle,
  FileText,
} from 'lucide-react';
import { User, Product } from '../../types';
import { sendAdminCustomEmail } from '../../services/emailService';

interface AdminUsersManagerProps {
  users: User[];
  products?: Product[];
  onToggleVerification: (userId: string) => void;
  onToggleActive: (userId: string) => void;
  onUpdateUserBalance?: (userId: string, newBalance: number) => void;
  onShowToast?: (message: string) => void;
}

export const AdminUsersManager: React.FC<AdminUsersManagerProps> = ({
  users = [],
  products = [],
  onToggleVerification,
  onToggleActive,
  onUpdateUserBalance,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'teacher' | 'guest'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Quick Email Modal State
  const [emailModalUser, setEmailModalUser] = useState<User | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Balance Adjustment State
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('Escrow release / Classroom credit');

  const filteredUsers = (users || []).filter((u) => {
    const name = u?.name || '';
    const email = u?.email || '';
    const school = u?.schoolName || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u?.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleOpenEmailModal = (user: User) => {
    setEmailModalUser(user);
    setEmailSubject(`Notice from Marketplace For Teachers Administration`);
    setEmailBody(`Hello ${user.name},\n\nWe are contacting you regarding your teacher profile and classroom listings on Marketplace For Teachers.\n\nPlease reach out if you have any questions.\n\nWarm regards,\nAdmin Team`);
  };

  const handleSendUserEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalUser) return;
    setIsSendingEmail(true);
    try {
      const res = await sendAdminCustomEmail({
        to: emailModalUser.email,
        subject: emailSubject,
        headline: `Message for ${emailModalUser.name}`,
        messageContent: emailBody,
        actionText: 'Open Teacher Dashboard',
        actionUrl: 'https://marketplaceforteachers.com',
      });
      if (onShowToast) onShowToast(`Email dispatched to ${emailModalUser.email} via Resend! ✉️`);
      setEmailModalUser(null);
    } catch (err: any) {
      if (onShowToast) onShowToast(`Failed to send email: ${err?.message || 'Error'}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleAdjustBalance = (user: User) => {
    if (!adjustAmount || isNaN(adjustAmount)) return;
    const current = user.balance || 0;
    const next = Math.max(0, current + Number(adjustAmount));
    if (onUpdateUserBalance) {
      onUpdateUserBalance(user.id, next);
    }
    user.balance = next;
    if (onShowToast) onShowToast(`Updated balance for ${user.name} to $${next.toFixed(2)} 💰`);
    setAdjustAmount(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Educators, Sellers & User Portfolios Directory
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit teacher balances, payout preferences, classroom inventories, and state verification badges.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{users.filter((u) => u.verified).length} Verified Teachers</span>
          </span>
          <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-md">
            {users.length} Total Users
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search educator name, school district, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:border-blue-600 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 text-xs rounded-lg px-3 py-1.5 font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Roles</option>
            <option value="teacher">Teachers / Sellers</option>
            <option value="guest">School Buyers / Guests</option>
          </select>
        </div>
      </div>

      {/* Users & Portfolios Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="p-3.5">Educator Profile</th>
                <th className="p-3.5">School & Location</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Available Balance</th>
                <th className="p-3.5">Escrow Balance</th>
                <th className="p-3.5">Verification</th>
                <th className="p-3.5 text-right">Portfolio Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const userListings = products.filter(p => p.sellerId === u.id || p.sellerName === u.name);
                const availableBal = u.balance !== undefined ? u.balance : 2840.50;
                const escrowBal = u.escrowBalance !== undefined ? u.escrowBalance : 415.00;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover border border-emerald-400 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 flex items-center gap-1">
                            {u.name}
                            {u.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />}
                          </p>
                          <p className="text-[11px] text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-700">
                      <div className="space-y-0.5">
                        <p className="font-medium text-blue-900 flex items-center gap-1">
                          <School className="w-3 h-3 text-blue-600" />
                          {u.schoolName || 'Oklahoma City Public Schools'}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {u.city ? `${u.city}, ${u.state}` : 'Oklahoma City, OK'}
                        </p>
                      </div>
                    </td>

                    <td className="p-3.5 capitalize font-semibold text-slate-800">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'teacher' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role === 'teacher' ? 'Educator Seller' : 'Buyer Account'}
                      </span>
                    </td>

                    <td className="p-3.5 font-extrabold text-emerald-700">
                      ${availableBal.toFixed(2)}
                    </td>

                    <td className="p-3.5 font-bold text-amber-700">
                      ${escrowBal.toFixed(2)}
                    </td>

                    <td className="p-3.5">
                      {u.verified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Briefcase className="w-3 h-3" />
                          <span>Portfolio & Balance</span>
                        </button>

                        <button
                          onClick={() => handleOpenEmailModal(u)}
                          title="Send Email via Resend"
                          className="p-1.5 rounded bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onToggleVerification(u.id)}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                            u.verified
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {u.verified ? 'Revoke' : 'Verify'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER PORTFOLIO & BALANCE MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'}
                  alt={selectedUser.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400"
                />
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <span>{selectedUser.name}</span>
                    {selectedUser.verified && (
                      <span className="bg-emerald-500 text-slate-950 font-black text-[9px] uppercase px-1.5 py-0.5 rounded">
                        Verified Educator
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-300">{selectedUser.email} • {selectedUser.schoolName || 'Classroom Educator'}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
              {/* Financial Balance Overview Cards */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                  💰 Seller Financial Balance & Escrow Vault
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Available Balance</p>
                    <p className="text-2xl font-extrabold text-emerald-900 mt-1">
                      ${(selectedUser.balance !== undefined ? selectedUser.balance : 2840.50).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-emerald-700 mt-1">Ready for withdrawal payout</p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">Escrow Held</p>
                    <p className="text-2xl font-extrabold text-amber-900 mt-1">
                      ${(selectedUser.escrowBalance !== undefined ? selectedUser.escrowBalance : 415.00).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-amber-700 mt-1">Awaiting delivery verification</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wide">Lifetime Sales</p>
                    <p className="text-2xl font-extrabold text-blue-900 mt-1">
                      ${(selectedUser.lifetimeEarnings !== undefined ? selectedUser.lifetimeEarnings : 8490.00).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-blue-700 mt-1">Total revenue generated</p>
                  </div>
                </div>
              </div>

              {/* Balance Adjustment Tool */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs">
                  ⚡ Administrator Balance Credit / Adjustment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Adjustment Amount ($):
                    </label>
                    <input
                      type="number"
                      value={adjustAmount || ''}
                      onChange={(e) => setAdjustAmount(parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 50.00 or -25.00"
                      className="w-full p-2 rounded-lg border border-slate-300 font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Adjustment Reason:
                    </label>
                    <input
                      type="text"
                      value={adjustReason}
                      onChange={(e) => setAdjustReason(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 font-medium text-slate-700"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => handleAdjustBalance(selectedUser)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg transition-colors cursor-pointer"
                    >
                      Apply Balance Adjustment
                    </button>
                  </div>
                </div>
              </div>

              {/* Payout & Banking Preferences */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  🏦 Connected Withdrawal Methods
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Preferred Disbursem*nt:</span>
                    <span className="font-bold text-slate-900 uppercase">Direct ACH Bank Deposit</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Routing Number:</span>
                    <span className="font-mono text-slate-800">103000000 (BancFirst OK)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Account Number:</span>
                    <span className="font-mono text-slate-800">••••••••4892</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">PayPal Address:</span>
                    <span className="font-mono text-slate-800">{selectedUser.email}</span>
                  </div>
                </div>
              </div>

              {/* Active Classroom Supply Listings Portfolio */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  📦 Active Classroom Listings Portfolio ({products.filter(p => p.sellerId === selectedUser.id || p.sellerName === selectedUser.name).length})
                </h4>
                <div className="space-y-2">
                  {products
                    .filter(p => p.sellerId === selectedUser.id || p.sellerName === selectedUser.name)
                    .slice(0, 5)
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <img src={item.imageUrl} alt={item.title} className="w-9 h-9 object-cover rounded-md border" />
                          <div>
                            <p className="font-bold text-slate-900">{item.title}</p>
                            <p className="text-[10px] text-slate-500">{item.condition} • Stock: {item.stock || 1}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-blue-900">${item.price.toFixed(2)}</span>
                          <p className="text-[10px] text-emerald-700 font-bold">Active Listing</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  const u = selectedUser;
                  setSelectedUser(null);
                  handleOpenEmailModal(u);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email to {selectedUser.name}</span>
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition-colors cursor-pointer"
              >
                Close Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK RESEND EMAIL MODAL */}
      {emailModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="bg-blue-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-300" />
                <h4 className="font-bold text-sm">Send Email via Resend to {emailModalUser.name}</h4>
              </div>
              <button
                onClick={() => setEmailModalUser(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendUserEmail} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">To:</label>
                <input
                  type="text"
                  disabled
                  value={`${emailModalUser.name} <${emailModalUser.email}>`}
                  className="w-full p-2 bg-slate-100 rounded-lg border border-slate-200 font-medium text-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Subject:</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Message Content:</label>
                <textarea
                  rows={5}
                  required
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEmailModalUser(null)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingEmail ? 'Sending via Resend...' : 'Send Email Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
