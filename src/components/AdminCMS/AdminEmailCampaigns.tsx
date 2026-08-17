import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Key,
  ShieldCheck,
  Zap,
  RefreshCw,
  Clock,
  Sparkles,
  Users,
  Copy,
  ExternalLink,
  Info,
  Check,
  FileText,
  Inbox,
  MessageSquare,
  CornerUpLeft,
  ArrowRight,
  Filter,
  Search,
  PlusCircle,
  HelpCircle,
  Building,
  Shield,
  CheckCheck,
  UserCheck,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';
import { EMAIL_TEMPLATES } from '../../data/emailTemplatesData';
import { EmailTemplate, EmailLog, User, InboundEmailMessage } from '../../types';
import {
  getResendApiKey,
  setResendApiKey,
  getResendFromEmail,
  setResendFromEmail,
  getResendReplyToEmail,
  setResendReplyToEmail,
  getEmailLogs,
  sendAdminCustomEmail,
  testResendConnection,
  getInboundMessages,
  saveInboundMessage,
  replyToInboundMessage,
  updateInboundMessageStatus,
  DEFAULT_RESEND_API_KEY,
  DEFAULT_REPLY_TO_EMAIL,
} from '../../services/emailService';

interface AdminEmailCampaignsProps {
  users?: User[];
  onShowToast?: (message: string) => void;
}

export const AdminEmailCampaigns: React.FC<AdminEmailCampaignsProps> = ({
  users = [],
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'composer' | 'inbox' | 'templates' | 'logs' | 'settings'>('composer');
  
  // Resend Settings State
  const [apiKey, setApiKey] = useState<string>(getResendApiKey());
  const [fromEmail, setFromEmail] = useState<string>(getResendFromEmail());
  const [replyToEmail, setReplyToEmail] = useState<string>(getResendReplyToEmail());
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Email Composer Custom Sender & Reply-To State
  const [composerFromEmail, setComposerFromEmail] = useState<string>(getResendFromEmail());
  const [composerReplyToEmail, setComposerReplyToEmail] = useState<string>(getResendReplyToEmail());
  const [showSenderConfig, setShowSenderConfig] = useState<boolean>(true);

  // Email Composer Content State
  const [recipientType, setRecipientType] = useState<'single' | 'teacher_list' | 'broadcast_all'>('single');
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>(users[0]?.email || 'teacher@okcps.org');
  const [customToEmail, setCustomToEmail] = useState<string>('teacher@okcps.org');
  const [customSubject, setCustomSubject] = useState<string>('Important Classroom Network Update for Educators');
  const [customHeadline, setCustomHeadline] = useState<string>('Classroom Update from Marketplace For Teachers');
  const [customBody, setCustomBody] = useState<string>(
    'Hello Teacher,\n\nWe are pleased to announce new classroom grant opportunities and zero-fee listings available for all verified school staff this semester.\n\nPlease log in to your dashboard to review your balance and manage your active classroom supply listings.\n\nWarm regards,\nThe Educator Support Team'
  );
  const [customActionText, setCustomActionText] = useState<string>('View Teacher Dashboard');
  const [customActionUrl, setCustomActionUrl] = useState<string>('https://marketplaceforteachers.com');
  const [isSending, setIsSending] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<{ success: boolean; text: string } | null>(null);

  // Inbound Messages & Reply State
  const [inboundMessages, setInboundMessages] = useState<InboundEmailMessage[]>(getInboundMessages());
  const [selectedInboundId, setSelectedInboundId] = useState<string>(inboundMessages[0]?.id || '');
  const [inboundFilter, setInboundFilter] = useState<'all' | 'unread' | 'replied' | 'po_request' | 'teacher_verification'>('all');
  const [inboundSearch, setInboundSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [inboxReplyFrom, setInboxReplyFrom] = useState<string>(getResendFromEmail());
  const [inboxReplyTo, setInboxReplyTo] = useState<string>(getResendReplyToEmail());
  const [showInboxSenderConfig, setShowInboxSenderConfig] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyFeedback, setReplyFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Templates View State
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(EMAIL_TEMPLATES[0]);
  const [templateTestEmail, setTemplateTestEmail] = useState('teacher@okcps.org');
  const [templateTestFrom, setTemplateTestFrom] = useState<string>(getResendFromEmail());
  const [templateTestReplyTo, setTemplateTestReplyTo] = useState<string>(getResendReplyToEmail());
  const [templateTestSending, setTemplateTestSending] = useState(false);

  // Logs State
  const [logs, setLogs] = useState<EmailLog[]>([]);

  useEffect(() => {
    setLogs(getEmailLogs());
    setInboundMessages(getInboundMessages());
  }, [activeSubTab, sendFeedback, replyFeedback]);

  const selectedInbound = inboundMessages.find((m) => m.id === selectedInboundId) || inboundMessages[0];

  const handleSaveApiKey = () => {
    setResendApiKey(apiKey);
    setResendFromEmail(fromEmail);
    setResendReplyToEmail(replyToEmail);
    setComposerFromEmail(fromEmail);
    setComposerReplyToEmail(replyToEmail);
    setInboxReplyFrom(fromEmail);
    setInboxReplyTo(replyToEmail);
    setTemplateTestFrom(fromEmail);
    setTemplateTestReplyTo(replyToEmail);
    if (onShowToast) onShowToast('Resend API key, Sender & Reply-To configuration saved! ✉️');
    setTestResult({ success: true, message: 'Settings saved successfully across active session and all modules.' });
  };

  const handleSaveComposerSenderAsDefault = () => {
    setResendFromEmail(composerFromEmail);
    setResendReplyToEmail(composerReplyToEmail);
    setFromEmail(composerFromEmail);
    setReplyToEmail(composerReplyToEmail);
    setInboxReplyFrom(composerFromEmail);
    setInboxReplyTo(composerReplyToEmail);
    setTemplateTestFrom(composerFromEmail);
    setTemplateTestReplyTo(composerReplyToEmail);
    if (onShowToast) onShowToast('Sender & Reply-To saved as platform-wide default! 🎯');
  };

  const handleTestConnection = async () => {
    setIsTestingKey(true);
    setTestResult(null);
    try {
      const res = await testResendConnection(
        apiKey,
        replyToEmail || 'marketplaceforteachers.com@gmail.com',
        fromEmail,
        replyToEmail
      );
      if (res.success) {
        setTestResult({
          success: true,
          message: res.message || 'Resend API Key is valid and connected! Test dispatch logged successfully.',
        });
        if (onShowToast) onShowToast('Resend API verified successfully! ⚡');
      } else {
        setTestResult({
          success: false,
          message: res.error || 'Failed to authenticate with Resend. Please check your API key.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Connection error. Check your internet connection.',
      });
    } finally {
      setIsTestingKey(false);
      setLogs(getEmailLogs());
    }
  };

  const handleSendCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendFeedback(null);

    let targetEmail = customToEmail;
    if (recipientType === 'teacher_list') {
      targetEmail = selectedUserEmail;
    } else if (recipientType === 'broadcast_all') {
      const teacherEmails = users.filter(u => u.email).map(u => u.email);
      targetEmail = teacherEmails.length > 0 ? teacherEmails.join(', ') : 'all-teachers@marketplaceforteachers.com';
    }

    try {
      const res = await sendAdminCustomEmail({
        to: targetEmail,
        subject: customSubject,
        headline: customHeadline,
        messageContent: customBody,
        actionUrl: customActionUrl,
        actionText: customActionText,
        from: composerFromEmail.trim() || fromEmail,
        replyTo: composerReplyToEmail.trim() || replyToEmail,
      });

      if (res.success) {
        setSendFeedback({
          success: true,
          text: res.message || `Email dispatched to ${targetEmail} from "${composerFromEmail}" with reply-to "${composerReplyToEmail}" via Resend! (ID: ${res.id})`,
        });
        if (onShowToast) onShowToast(`Email sent via Resend to ${targetEmail}! 🚀`);
      } else {
        setSendFeedback({
          success: false,
          text: res.error || 'Resend dispatch failed. Please verify your API key.',
        });
      }
    } catch (err: any) {
      setSendFeedback({
        success: false,
        text: err?.message || 'Error executing email dispatch.',
      });
    } finally {
      setIsSending(false);
      setLogs(getEmailLogs());
    }
  };

  // Handle in-app reply to customer/teacher
  const handleSendReply = async () => {
    if (!selectedInbound || !replyText.trim()) return;
    setIsReplying(true);
    setReplyFeedback(null);

    try {
      const res = await replyToInboundMessage(
        selectedInbound.id,
        replyText.trim(),
        {
          name: 'MFT Admin Support',
          email: inboxReplyFrom.trim() || fromEmail,
          replyTo: inboxReplyTo.trim() || replyToEmail,
        }
      );

      if (res.success) {
        setReplyFeedback({
          success: true,
          message: `Reply sent successfully to ${selectedInbound.fromEmail} from "${inboxReplyFrom}" (Reply-To: ${inboxReplyTo}) via Resend!`,
        });
        setReplyText('');
        setInboundMessages(getInboundMessages());
        if (onShowToast) onShowToast(`Reply dispatched to ${selectedInbound.fromEmail}! ✉️`);
      } else {
        setReplyFeedback({
          success: false,
          message: res.error || 'Failed to dispatch reply via Resend API.',
        });
      }
    } catch (err: any) {
      setReplyFeedback({
        success: false,
        message: err?.message || 'Error sending reply.',
      });
    } finally {
      setIsReplying(false);
      setLogs(getEmailLogs());
    }
  };

  // Add simulated inbound email
  const handleSimulateInbound = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const newMsg: InboundEmailMessage = {
      id: `inbound-sim-${Date.now()}`,
      ticketId: `TKT-2026-${randomId}`,
      fromName: 'Principal Karen Davis',
      fromEmail: `k.davis@edmondps${randomId}.k12.ok.us`,
      toEmail: 'support@marketplaceforteachers.com',
      schoolName: 'Edmond North Middle School',
      subject: `Inquiry regarding School Purchase Order & Tax Exemption (#TKT-${randomId})`,
      category: 'po_request',
      status: 'unread',
      receivedAt: 'Just now',
      content: `Hello MFT Administrators,\n\nOur school would like to submit a batch order for 8 Classroom STEM Microscopes listed by a verified seller on your platform.\n\nCould you please send over your Oklahoma vendor tax ID and let us know if you accept Net-30 purchase orders via email?\n\nSincerely,\nPrincipal Karen Davis`,
      replies: [],
    };

    saveInboundMessage(newMsg);
    setInboundMessages(getInboundMessages());
    setSelectedInboundId(newMsg.id);
    if (onShowToast) onShowToast('New simulated educator email arrived in inbox! 📬');
  };

  const filteredInbound = inboundMessages.filter((msg) => {
    if (inboundFilter === 'unread' && msg.status !== 'unread') return false;
    if (inboundFilter === 'replied' && msg.status !== 'replied') return false;
    if (inboundFilter === 'po_request' && msg.category !== 'po_request') return false;
    if (inboundFilter === 'teacher_verification' && msg.category !== 'teacher_verification') return false;
    if (inboundSearch.trim()) {
      const q = inboundSearch.toLowerCase();
      return (
        msg.fromName.toLowerCase().includes(q) ||
        msg.fromEmail.toLowerCase().includes(q) ||
        msg.subject.toLowerCase().includes(q) ||
        msg.ticketId.toLowerCase().includes(q) ||
        (msg.schoolName && msg.schoolName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const unreadCount = inboundMessages.filter((m) => m.status === 'unread').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Resend Email Dispatch, Support Inbox & Communications
              </h3>
              <p className="text-xs text-slate-500">
                Outbound transactional notifications, custom educator composer, and inbound email management.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('composer')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'composer'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✏️ Send Email
          </button>
          <button
            onClick={() => setActiveSubTab('inbox')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'inbox'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Support Inbox</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('templates')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'templates'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 Templates ({EMAIL_TEMPLATES.length})
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'logs'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📜 Delivery Logs ({logs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'settings'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚙️ Resend & Inbound Guide
          </button>
        </div>
      </div>

      {/* SUBTAB: INBOX & INBOUND REPLIES (NEW) */}
      {activeSubTab === 'inbox' && (
        <div className="space-y-4">
          {/* Top Inbound Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                Filter:
              </span>
              <button
                onClick={() => setInboundFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                  inboundFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Messages ({inboundMessages.length})
              </button>
              <button
                onClick={() => setInboundFilter('unread')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                  inboundFilter === 'unread' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Unread ({inboundMessages.filter((m) => m.status === 'unread').length})
              </button>
              <button
                onClick={() => setInboundFilter('po_request')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                  inboundFilter === 'po_request' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                District POs
              </button>
              <button
                onClick={() => setInboundFilter('teacher_verification')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                  inboundFilter === 'teacher_verification' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Teacher Verifications
              </button>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search emails, teachers, POs..."
                  value={inboundSearch}
                  onChange={(e) => setInboundSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>
              <button
                type="button"
                onClick={handleSimulateInbound}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer text-xs"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulate Inbound Email</span>
              </button>
            </div>
          </div>

          {/* Master-Detail Inbox View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Message List (4 cols) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
              {filteredInbound.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No messages match your filter.</p>
                </div>
              ) : (
                filteredInbound.map((msg) => {
                  const isSelected = selectedInbound?.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => {
                        setSelectedInboundId(msg.id);
                        if (msg.status === 'unread') {
                          updateInboundMessageStatus(msg.id, 'read');
                          setInboundMessages(getInboundMessages());
                        }
                      }}
                      className={`p-3.5 cursor-pointer transition-colors text-xs ${
                        isSelected
                          ? 'bg-blue-50/80 border-l-4 border-l-blue-600'
                          : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-bold text-slate-900 truncate">
                          {msg.fromName}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">{msg.receivedAt}</span>
                      </div>
                      <p className="font-semibold text-slate-800 line-clamp-1 mb-1">{msg.subject}</p>
                      <p className="text-slate-500 line-clamp-2 text-[11px] mb-2">{msg.content}</p>
                      
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-mono">{msg.ticketId}</span>
                        <div className="flex items-center gap-1.5">
                          {msg.category === 'po_request' && (
                            <span className="bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                              District PO
                            </span>
                          )}
                          {msg.category === 'teacher_verification' && (
                            <span className="bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
                              Verification
                            </span>
                          )}
                          {msg.status === 'unread' && (
                            <span className="bg-red-500 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                              New
                            </span>
                          )}
                          {msg.status === 'replied' && (
                            <span className="bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <CheckCheck className="w-3 h-3" /> Replied
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right: Message Detail & Resend Reply Composer (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4">
              {selectedInbound ? (
                <>
                  {/* Top Bar of Selected Message */}
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{selectedInbound.subject}</h4>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                            {selectedInbound.ticketId}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
                          <span>
                            From: <strong>{selectedInbound.fromName}</strong> &lt;{selectedInbound.fromEmail}&gt;
                          </span>
                          {selectedInbound.schoolName && (
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
                              <Building className="w-3 h-3 text-slate-400" />
                              {selectedInbound.schoolName}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400 text-[11px]">{selectedInbound.receivedAt}</span>
                      </div>
                    </div>

                    {/* Original Message Content */}
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-800 whitespace-pre-line font-sans">
                      {selectedInbound.content}
                    </div>

                    {/* Thread of Previous Replies */}
                    {selectedInbound.replies && selectedInbound.replies.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <h5 className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                          <CornerUpLeft className="w-3.5 h-3.5 text-blue-600" />
                          <span>Dispatch History ({selectedInbound.replies.length} replies sent via Resend):</span>
                        </h5>
                        {selectedInbound.replies.map((rep) => (
                          <div
                            key={rep.id}
                            className="bg-blue-50/70 border border-blue-200 p-3 rounded-lg text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-blue-900 flex items-center gap-1">
                                <Send className="w-3 h-3 text-blue-600" />
                                {rep.senderName} ({rep.senderEmail})
                              </span>
                              <span className="text-slate-500">{rep.sentAt}</span>
                            </div>
                            <p className="text-slate-800 whitespace-pre-line leading-relaxed">{rep.message}</p>
                            {rep.resendId && (
                              <p className="text-[10px] text-blue-700 font-mono">
                                Resend Dispatch ID: {rep.resendId}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reply Composer Box */}
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Reply to {selectedInbound.fromName} via Resend API:</span>
                      </label>
                      
                      {/* Preset Response Selectors & Sender toggle */}
                      <div className="flex items-center gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setShowInboxSenderConfig(!showInboxSenderConfig)}
                          className="text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer flex items-center gap-1"
                        >
                          <Settings className="w-3 h-3" />
                          <span>{showInboxSenderConfig ? 'Hide Sender/Reply-To' : 'Edit Sender & Reply-To'}</span>
                        </button>

                        <span className="text-slate-400">|</span>

                        <span className="text-slate-400">Template:</span>
                        <select
                          className="bg-slate-100 border border-slate-300 rounded px-2 py-0.5 text-slate-700 font-medium text-[11px] focus:outline-hidden"
                          onChange={(e) => {
                            if (e.target.value === 'po_accept') {
                              setReplyText(`Hello ${selectedInbound.fromName},\n\nThank you for submitting your District Purchase Order! We have verified your school entity and approved Net-30 disbursem*nt.\n\nOur W-9 form and Oklahoma vendor onboarding package are on file, and your educator materials will be prepared for delivery under our 100% Buyer Protection Guarantee.\n\nWarm regards,\nMarketplace For Teachers Support Desk`);
                            } else if (e.target.value === 'verify_approved') {
                              setReplyText(`Hello ${selectedInbound.fromName},\n\nWe have reviewed your teaching credential and approved your Verified Educator status! You now have unrestricted access to zero-fee listings, classroom wishlists, and district grant exchanges.\n\nWelcome to Marketplace For Teachers!\n\nBest regards,\nEducator Verification Team`);
                            } else if (e.target.value === 'escrow_help') {
                              setReplyText(`Hello ${selectedInbound.fromName},\n\nFor local school pickups and in-person exchanges, funds remain safely secured in protected custody until the buyer inspects the items and clicks "Confirm Receipt" in their dashboard (or provides the 4-digit pickup code).\n\nOnce confirmed, your funds disburse directly to your teacher balance with zero listing fees!\n\nBest regards,\nBuyer Protection Team`);
                            }
                          }}
                        >
                          <option value="">Select quick reply...</option>
                          <option value="po_accept">District PO Approval & W-9</option>
                          <option value="verify_approved">Teacher Verification Approved</option>
                          <option value="escrow_help">Buyer Protection & Pickup Instructions</option>
                        </select>
                      </div>
                    </div>

                    {/* Expandable Sender & Reply-To override for this reply */}
                    {showInboxSenderConfig && (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-blue-600" />
                            Customize Sender & Reply-To for this response:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setInboxReplyFrom(fromEmail);
                              setInboxReplyTo(replyToEmail);
                            }}
                            className="text-[10px] text-blue-600 hover:underline font-medium cursor-pointer"
                          >
                            Reset to Default
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                              "From" Sender Identity:
                            </label>
                            <input
                              type="text"
                              value={inboxReplyFrom}
                              onChange={(e) => setInboxReplyFrom(e.target.value)}
                              placeholder="Marketplace For Teachers Support <support@marketplaceforteachers.com>"
                              className="w-full p-2 bg-white rounded border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                              "Reply-To" Destination:
                            </label>
                            <input
                              type="email"
                              value={inboxReplyTo}
                              onChange={(e) => setInboxReplyTo(e.target.value)}
                              placeholder="marketplaceforteachers.com@gmail.com"
                              className="w-full p-2 bg-white rounded border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        {/* Quick Presets */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-400">Quick Presets:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setInboxReplyFrom('Marketplace For Teachers <onboarding@resend.dev>');
                              setInboxReplyTo('marketplaceforteachers.com@gmail.com');
                            }}
                            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded cursor-pointer"
                          >
                            Resend Dev Sandbox
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setInboxReplyFrom('Educator Support <support@marketplaceforteachers.com>');
                              setInboxReplyTo('marketplaceforteachers.com@gmail.com');
                            }}
                            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded cursor-pointer"
                          >
                            Official Support
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setInboxReplyFrom('Teacher Verification Desk <verify@marketplaceforteachers.com>');
                              setInboxReplyTo('marketplaceforteachers.com@gmail.com');
                            }}
                            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded cursor-pointer"
                          >
                            Verification Desk
                          </button>
                        </div>
                      </div>
                    )}

                    <textarea
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Type your official response to ${selectedInbound.fromEmail} here...`}
                      className="w-full p-3 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:border-blue-600 text-slate-900 leading-relaxed font-sans"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-500">
                        <span>Sender: <strong className="text-slate-700">{inboxReplyFrom}</strong> • Reply-To: <strong className="text-slate-700">{inboxReplyTo}</strong></span>
                      </div>

                      <button
                        type="button"
                        disabled={isReplying || !replyText.trim()}
                        onClick={handleSendReply}
                        className={`font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
                          replyText.trim()
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isReplying ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Dispatching via Resend...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Reply via Resend</span>
                          </>
                        )}
                      </button>
                    </div>

                    {replyFeedback && (
                      <div
                        className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                          replyFeedback.success
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                            : 'bg-red-50 border border-red-200 text-red-900'
                        }`}
                      >
                        {replyFeedback.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                        <span>{replyFeedback.message}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-slate-400 text-xs">
                  <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>Select a message from the left to view the thread and send a reply.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: COMPOSER (EXISTING SEND EMAIL) */}
      {activeSubTab === 'composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                <span>Compose Official Marketplace Email</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowSenderConfig(!showSenderConfig)}
                className="text-xs text-blue-700 hover:text-blue-900 font-bold underline flex items-center gap-1 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{showSenderConfig ? 'Hide Sender/Reply-To' : 'Edit Sender & Reply-To'}</span>
              </button>
            </div>

            {/* Editable Sender & Reply-To Routing Card */}
            {showSenderConfig && (
              <div className="bg-slate-50/90 border border-blue-200/80 rounded-xl p-3.5 space-y-3 text-xs animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900 text-xs">
                      Sender ("From") & Reply-To Routing Controls
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveComposerSenderAsDefault}
                    className="text-[11px] bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    title="Save current Sender and Reply-To as default for all future emails"
                  >
                    <Check className="w-3 h-3 text-blue-700" />
                    <span>Save as System Default</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Sender "From" Field */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>"From" Sender Name & Address:</span>
                      <span className="text-[10px] text-slate-400 font-normal">Authenticates via Resend</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={composerFromEmail}
                      onChange={(e) => setComposerFromEmail(e.target.value)}
                      placeholder="Marketplace For Teachers <onboarding@resend.dev>"
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-hidden font-medium"
                    />
                    {/* Quick Sender Presets */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setComposerFromEmail('Marketplace For Teachers <onboarding@resend.dev>')}
                        className="text-[10px] bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        Resend Dev
                      </button>
                      <button
                        type="button"
                        onClick={() => setComposerFromEmail('Marketplace For Teachers Support <support@marketplaceforteachers.com>')}
                        className="text-[10px] bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        Official Support
                      </button>
                      <button
                        type="button"
                        onClick={() => setComposerFromEmail('School Orders & Grants <orders@marketplaceforteachers.com>')}
                        className="text-[10px] bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        PO & Grants
                      </button>
                      <button
                        type="button"
                        onClick={() => setComposerFromEmail('Teacher Verification Desk <verify@marketplaceforteachers.com>')}
                        className="text-[10px] bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        Verification Desk
                      </button>
                    </div>
                  </div>

                  {/* Reply-To Field */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>"Reply-To" Destination Address:</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">Where recipient replies land</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={composerReplyToEmail}
                      onChange={(e) => setComposerReplyToEmail(e.target.value)}
                      placeholder="marketplaceforteachers.com@gmail.com"
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 text-slate-900 text-xs focus:border-blue-600 focus:outline-hidden font-medium"
                    />
                    {/* Quick Reply-To Presets */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setComposerReplyToEmail('marketplaceforteachers.com@gmail.com')}
                        className="text-[10px] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        Primary Gmail
                      </button>
                      <button
                        type="button"
                        onClick={() => setComposerReplyToEmail('support@marketplaceforteachers.com')}
                        className="text-[10px] bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        support@
                      </button>
                      <button
                        type="button"
                        onClick={() => setComposerReplyToEmail('orders@marketplaceforteachers.com')}
                        className="text-[10px] bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        orders@
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSendCustomEmail} className="space-y-3.5 text-xs">
              {/* Recipient Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Recipient Destination:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRecipientType('single')}
                    className={`p-2 rounded-lg border text-center font-bold transition-all cursor-pointer ${
                      recipientType === 'single'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Custom Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientType('teacher_list')}
                    className={`p-2 rounded-lg border text-center font-bold transition-all cursor-pointer ${
                      recipientType === 'teacher_list'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Select Educator
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipientType('broadcast_all')}
                    className={`p-2 rounded-lg border text-center font-bold transition-all cursor-pointer ${
                      recipientType === 'broadcast_all'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Broadcast All ({users.length})
                  </button>
                </div>
              </div>

              {recipientType === 'single' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">To Email Address:</label>
                  <input
                    type="email"
                    required
                    value={customToEmail}
                    onChange={(e) => setCustomToEmail(e.target.value)}
                    placeholder="educator@school.edu"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              )}

              {recipientType === 'teacher_list' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Registered Teacher:</label>
                  <select
                    value={selectedUserEmail}
                    onChange={(e) => setSelectedUserEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-hidden bg-white"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.email}>
                        {u.name} ({u.email}) - {u.schoolName || 'Educator Network'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {recipientType === 'broadcast_all' && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900 text-xs">
                  <strong>⚠️ Broadcast Notice:</strong> This message will be sent to all {users.length} registered school educators in your system.
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject Line:</label>
                <input
                  type="text"
                  required
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Banner Headline:</label>
                <input
                  type="text"
                  value={customHeadline}
                  onChange={(e) => setCustomHeadline(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Body Content:</label>
                <textarea
                  required
                  rows={5}
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Action Button Text:</label>
                  <input
                    type="text"
                    value={customActionText}
                    onChange={(e) => setCustomActionText(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Action Button URL:</label>
                  <input
                    type="text"
                    value={customActionUrl}
                    onChange={(e) => setCustomActionUrl(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={isSending}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching via Resend...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Email via Resend</span>
                    </>
                  )}
                </button>

                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>From: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-medium">{composerFromEmail}</code></span>
                  <span>•</span>
                  <span>Reply-To: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-800 font-medium">{composerReplyToEmail}</code></span>
                </div>
              </div>

              {sendFeedback && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                    sendFeedback.success
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border border-red-200 text-red-900'
                  }`}
                >
                  {sendFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong>{sendFeedback.success ? 'Dispatch Successful:' : 'Dispatch Note:'}</strong>
                    <p className="mt-0.5">{sendFeedback.text}</p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Live Rendered HTML Email Preview</span>
              </h4>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">
                Recipient View
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-100 p-3 space-y-2">
              {/* Email Client Envelope Header (From, Reply-To, To, Subject) */}
              <div className="bg-white rounded-lg p-2.5 border border-slate-200 text-[11px] text-slate-600 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">From:</span>
                  <span className="font-mono text-slate-800 font-bold text-[11px] truncate max-w-[240px]">{composerFromEmail}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">Reply-To:</span>
                  <span className="font-mono text-emerald-700 font-bold text-[11px] truncate max-w-[240px]">{composerReplyToEmail}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">To:</span>
                  <span className="font-mono text-slate-800 text-[11px] truncate max-w-[240px]">
                    {recipientType === 'single' ? customToEmail : recipientType === 'teacher_list' ? selectedUserEmail : `All Teachers (${users.length})`}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-1">
                  <span className="font-semibold text-slate-400">Subject:</span>
                  <span className="font-bold text-slate-900 text-[11px] truncate max-w-[240px]">{customSubject}</span>
                </div>
              </div>

              {/* Rendered Email Body Card */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden text-xs">
                {/* Header Banner */}
                <div className="bg-blue-900 p-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[11px]">MFT</span>
                    <span className="font-bold text-sm">Marketplace For Teachers</span>
                  </div>
                  <span className="bg-white/20 text-blue-100 text-[10px] px-2 py-0.5 rounded-full font-medium">Verified Network</span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-extrabold text-slate-900">{customHeadline || customSubject}</h3>
                  <p className="text-slate-500 text-[11px]">Official message from Marketplace For Teachers Administration</p>

                  <div className="py-2 text-slate-700 whitespace-pre-line leading-relaxed">
                    {customBody}
                  </div>

                  {customActionText && (
                    <div className="pt-2 text-center">
                      <span className="inline-block bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-xs">
                        {customActionText} →
                      </span>
                    </div>
                  )}
                </div>

                {/* Escrow Footer */}
                <div className="bg-slate-50 p-3 border-t border-slate-200 text-[11px] text-slate-600">
                  <strong className="text-slate-900">🛡️ 100% Educator Escrow Protection</strong>
                  <p className="mt-0.5 text-slate-500">Payments secured until classroom materials are delivered and confirmed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: TEMPLATES */}
      {activeSubTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            <div className="p-4 bg-slate-50 font-bold text-xs text-slate-700">
              Select Automated Trigger Template:
            </div>
            {EMAIL_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`p-3.5 cursor-pointer text-xs transition-colors ${
                  selectedTemplate.id === tmpl.id
                    ? 'bg-blue-50/80 border-l-4 border-l-blue-600'
                    : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{tmpl.name}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                    {tmpl.category}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] line-clamp-1">{tmpl.subject}</p>
                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                  <span>Trigger: <code>{tmpl.trigger}</code></span>
                  <span className="text-emerald-700 font-bold">● Active in Code</span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedTemplate.name}</h4>
                <p className="text-xs text-slate-500">Subject: <span className="font-medium text-slate-700">{selectedTemplate.subject}</span></p>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                Trigger: {selectedTemplate.trigger}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <p><strong>Preview Summary:</strong> {selectedTemplate.previewText}</p>
              <p><strong>Template Code:</strong> Configured in <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-700 font-mono">emailService.ts</code></p>
            </div>

            {/* Test Send */}
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Test Dispatch this Template via Resend:</span>
                </h5>
                <span className="text-[10px] text-slate-500">
                  From: <strong className="text-slate-700">{templateTestFrom}</strong> • Reply-To: <strong className="text-emerald-700">{templateTestReplyTo}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label className="block text-slate-600 font-semibold mb-0.5">Test Sender ("From"):</label>
                  <input
                    type="text"
                    value={templateTestFrom}
                    onChange={(e) => setTemplateTestFrom(e.target.value)}
                    placeholder="Marketplace For Teachers <onboarding@resend.dev>"
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-hidden focus:border-blue-600 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-0.5">Test Reply-To:</label>
                  <input
                    type="email"
                    value={templateTestReplyTo}
                    onChange={(e) => setTemplateTestReplyTo(e.target.value)}
                    placeholder="marketplaceforteachers.com@gmail.com"
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-hidden focus:border-blue-600 text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="email"
                  value={templateTestEmail}
                  onChange={(e) => setTemplateTestEmail(e.target.value)}
                  placeholder="test-recipient@school.edu"
                  className="flex-1 p-2.5 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-hidden focus:border-blue-600"
                />
                <button
                  type="button"
                  disabled={templateTestSending}
                  onClick={async () => {
                    setTemplateTestSending(true);
                    try {
                      const res = await sendAdminCustomEmail({
                        to: templateTestEmail,
                        subject: `[Sample Test] ${selectedTemplate.subject}`,
                        headline: selectedTemplate.name,
                        messageContent: selectedTemplate.previewText + '\n\nThis is a sample test preview of your automated trigger template sent via Resend API.',
                        from: templateTestFrom.trim() || fromEmail,
                        replyTo: templateTestReplyTo.trim() || replyToEmail,
                      });
                      if (onShowToast) onShowToast(res.message || 'Template test email dispatched! 🚀');
                    } finally {
                      setTemplateTestSending(false);
                      setLogs(getEmailLogs());
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
                >
                  {templateTestSending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Test</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: LOGS */}
      {activeSubTab === 'logs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Email Delivery Audit Trail & Resend History</span>
            <span className="text-slate-500 font-mono">{logs.length} Total Logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-bold">Recipient</th>
                  <th className="p-3 font-bold">Template / Trigger</th>
                  <th className="p-3 font-bold">Subject</th>
                  <th className="p-3 font-bold">Timestamp</th>
                  <th className="p-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No email dispatches recorded yet. Test an email in Composer or Templates!
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-semibold text-slate-900">{log.recipient}</td>
                      <td className="p-3">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                          {log.templateName}
                        </span>
                      </td>
                      <td className="p-3 max-w-xs truncate">{log.subject}</td>
                      <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap">{log.sentAt}</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 w-fit">
                          <Check className="w-3 h-3" />
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB: SETTINGS & ARCHITECTURE GUIDE */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6">
          {/* Top: Credentials Configuration Box */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                <span>Resend API Key, Sender & Reply-To Routing Configuration</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Configure your cloud API credentials, sender identity, and customer reply-to destination.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* API Key */}
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Resend API Key (starts with <code className="text-blue-700 font-mono">re_</code>):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="re_xxxxxxxxxxxxxx (Leave empty for simulated mode)"
                    className="w-full p-2.5 font-mono rounded-lg border border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <p className="text-slate-500">
                    {apiKey && apiKey.startsWith('re_') ? (
                      <>Active Key: <span className="font-mono text-emerald-800 font-bold">{apiKey.slice(0, 8)}•••••••••••••</span></>
                    ) : (
                      <span className="text-amber-700 font-bold">✨ Running in Safe Simulation Mode (No external API calls)</span>
                    )}
                  </p>
                  {apiKey && (
                    <button
                      type="button"
                      onClick={() => {
                        setApiKey('');
                        setResendApiKey('');
                        setTestResult(null);
                        if (onShowToast) onShowToast('Switched to Simulation Mode ⚡');
                      }}
                      className="text-red-600 hover:underline font-bold cursor-pointer"
                    >
                      Clear Key (Use Simulation)
                    </button>
                  )}
                </div>
              </div>

              {/* Sender Email */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Default "From" Email Address / Sender Name:
                </label>
                <input
                  type="text"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="Marketplace For Teachers <onboarding@resend.dev>"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-hidden font-medium"
                />
                {/* Presets */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setFromEmail('Marketplace For Teachers <onboarding@resend.dev>')}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    Resend Dev Sandbox
                  </button>
                  <button
                    type="button"
                    onClick={() => setFromEmail('Marketplace For Teachers Support <support@marketplaceforteachers.com>')}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    Official Support
                  </button>
                  <button
                    type="button"
                    onClick={() => setFromEmail('School Orders & Grants <orders@marketplaceforteachers.com>')}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    PO & Grants
                  </button>
                  <button
                    type="button"
                    onClick={() => setFromEmail('Teacher Verification Desk <verify@marketplaceforteachers.com>')}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    Verification
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  For test sandboxes: <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">onboarding@resend.dev</code>.<br/>
                  Verified domains: <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">support@marketplaceforteachers.com</code>.
                </p>
              </div>

              {/* Reply-To Email */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Default "Reply-To" Destination Address (Where customer replies land):
                </label>
                <input
                  type="email"
                  value={replyToEmail}
                  onChange={(e) => setReplyToEmail(e.target.value)}
                  placeholder="marketplaceforteachers.com@gmail.com"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-hidden font-medium"
                />
                {/* Presets */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setReplyToEmail('marketplaceforteachers.com@gmail.com')}
                    className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    Primary Gmail
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyToEmail('support@marketplaceforteachers.com')}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    support@marketplaceforteachers.com
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyToEmail('orders@marketplaceforteachers.com')}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    orders@marketplaceforteachers.com
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  When recipients hit <strong>"Reply"</strong> in Gmail/Outlook, the response automatically routes to this address!
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer text-xs"
              >
                Save Configuration
              </button>

              <button
                type="button"
                disabled={isTestingKey || !apiKey.trim()}
                onClick={handleTestConnection}
                className={`font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs ${
                  apiKey.trim()
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isTestingKey ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying with Resend API...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Test Resend Connection</span>
                  </>
                )}
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                  testResult.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border border-red-200 text-red-900'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong>{testResult.success ? 'API Key Active & Verified:' : 'Authentication Error:'}</strong>
                  <p className="mt-0.5">{testResult.message}</p>
                </div>
              </div>
            )}
          </div>

          {/* CRITICAL DELIVERABILITY FIX: Gmail SPF & DKIM Error 550-5.7.26 Resolver */}
          <div className="bg-white p-6 rounded-xl border border-red-200 shadow-xs space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white font-extrabold text-xs px-2 py-0.5 rounded">SOLVED</span>
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-red-600" />
                    <span>Fixing the "550-5.7.26 Unauthenticated Sender" Gmail Error</span>
                  </h4>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Gmail and Yahoo enforce strict authentication. If your domain lacks valid SPF/DKIM DNS records, outgoing messages from your hosting server (<code className="text-red-700 font-mono">198.251.84.236</code>) are blocked.
                </p>
              </div>
            </div>

            {/* Error Breakdown Alert */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs space-y-2">
              <div className="font-bold text-red-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Why did Gmail reject your email to omozusidivine@gmail.com?</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                When you sent an email from your hosting control panel (<code className="font-mono text-slate-900">d7.my-control-panel.com</code> with IP <code className="font-mono text-slate-900">198.251.84.236</code>), Gmail inspected the DNS records of <strong>marketplaceforteachers.com</strong> and found:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 font-medium">
                <li><strong className="text-red-700">SPF Failed:</strong> Your domain does not explicitly list <code className="font-mono bg-white px-1 py-0.5 rounded">198.251.84.236</code> as an authorized sending mail server.</li>
                <li><strong className="text-red-700">DKIM Failed:</strong> No cryptographic DKIM digital signature was attached to prove the email wasn't spoofed.</li>
              </ul>
            </div>

            {/* Step-by-Step DNS Records to Add */}
            <div className="space-y-4">
              <h5 className="font-bold text-slate-900 text-xs">
                Copy and Add These Exact DNS Records to your Domain Registrar (Namecheap, GoDaddy, Cloudflare, or cPanel Zone Editor):
              </h5>

              <div className="grid grid-cols-1 gap-3">
                {/* 1. SPF Record */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                      <span>SPF Record (Authorizes Hosting Server IP 198.251.84.236 + Resend API)</span>
                    </span>
                    <span className="bg-blue-100 text-blue-700 font-mono text-[10px] px-2 py-0.5 rounded font-bold">Type: TXT</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-[11px]">
                    <div className="md:col-span-3 bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Host / Name:</span>
                      <code className="text-slate-800 font-bold">@ (or leave blank)</code>
                    </div>
                    <div className="md:col-span-9 bg-white p-2 rounded border border-slate-200 flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="text-slate-400 block text-[10px]">Value / Content:</span>
                        <code className="text-blue-800 font-bold font-mono select-all">v=spf1 ip4:198.251.84.236 include:d7.my-control-panel.com include:resend.com ~all</code>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('v=spf1 ip4:198.251.84.236 include:d7.my-control-panel.com include:resend.com ~all');
                          if (onShowToast) onShowToast('Copied SPF TXT Record! 📋');
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded text-[10px] shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. DMARC Record */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                      <span>DMARC Record (Tells Gmail to accept your verified emails)</span>
                    </span>
                    <span className="bg-indigo-100 text-indigo-700 font-mono text-[10px] px-2 py-0.5 rounded font-bold">Type: TXT</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-[11px]">
                    <div className="md:col-span-3 bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Host / Name:</span>
                      <code className="text-slate-800 font-bold font-mono">_dmarc</code>
                    </div>
                    <div className="md:col-span-9 bg-white p-2 rounded border border-slate-200 flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="text-slate-400 block text-[10px]">Value / Content:</span>
                        <code className="text-indigo-800 font-bold font-mono select-all">v=DMARC1; p=none; sp=none; rua=mailto:marketplaceforteachers.com@gmail.com;</code>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('v=DMARC1; p=none; sp=none; rua=mailto:marketplaceforteachers.com@gmail.com;');
                          if (onShowToast) onShowToast('Copied DMARC TXT Record! 📋');
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded text-[10px] shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Enable DKIM in Control Panel */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                      <span>Enable DKIM Signing in your Hosting Control Panel</span>
                    </span>
                    <span className="bg-emerald-100 text-emerald-700 font-mono text-[10px] px-2 py-0.5 rounded font-bold">Control Panel Setting</span>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200 space-y-1.5 text-[11px] text-slate-700">
                    <p>1. Log in to your hosting panel (<strong>d7.my-control-panel.com</strong> / cPanel / DirectAdmin).</p>
                    <p>2. Navigate to <strong>Email Deliverability</strong> (or <strong>Email Authentication</strong>).</p>
                    <p>3. Find <strong>marketplaceforteachers.com</strong> and click <strong>"Manage"</strong> or <strong>"Enable DKIM"</strong>.</p>
                    <p>4. If your DNS is hosted with the provider, click <strong>"Install the suggested records"</strong>. If your DNS is external (Cloudflare/Namecheap), copy the generated DKIM key into your DNS manager.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comprehensive Architecture Guide: How Receiving & Replying Works */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>Complete Guide: How Receiving & Replying to Emails Works</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Resend is a high-performance outbound transactional delivery API. Here are the 4 standard methods to receive customer replies and respond to them:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Method 1 */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2.5">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">1</span>
                  <span>Direct Gmail Reply-To (Easiest & Ready Now)</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Every outgoing email sent through your platform contains a <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-blue-800">reply_to: marketplaceforteachers.com@gmail.com</code> header.
                </p>
                <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-1 text-[11px] text-slate-600">
                  <p className="font-semibold text-slate-900">How it functions:</p>
                  <p>1. Buyer or teacher receives your order receipt or verification email.</p>
                  <p>2. Recipient clicks <strong>"Reply"</strong> in their email client (Gmail, Outlook, Apple Mail).</p>
                  <p>3. Their response goes directly into your Gmail inbox (<strong className="text-blue-700">marketplaceforteachers.com@gmail.com</strong>), where you can reply immediately from your phone or laptop!</p>
                </div>
              </div>

              {/* Method 2 */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">2</span>
                  <span>In-App Support Inbox & 1-Click Resend Reply</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Use the built-in <strong>Support Inbox</strong> tab right inside this Admin Panel to handle District POs, teacher license verifications, and contact requests.
                </p>
                <div className="bg-white p-3 rounded-lg border border-emerald-100 space-y-1 text-[11px] text-slate-600">
                  <p className="font-semibold text-slate-900">How it functions:</p>
                  <p>1. View incoming inquiries and district PO attachments in the Support Inbox.</p>
                  <p>2. Select a quick response template or type your message.</p>
                  <p>3. Click <strong>"Send Reply via Resend"</strong> — the app delivers your message directly to the customer's inbox and stores the thread in your dashboard.</p>
                </div>
              </div>

              {/* Method 3 */}
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2.5">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-black">3</span>
                  <span>Custom Domain Forwarding (Free Cloudflare / cPanel)</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  To receive emails sent to custom addresses like <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-mono text-purple-800">support@marketplaceforteachers.com</code>:
                </p>
                <div className="bg-white p-3 rounded-lg border border-purple-100 space-y-1 text-[11px] text-slate-600">
                  <p className="font-semibold text-slate-900">Setup Steps:</p>
                  <p>1. In Cloudflare / Namecheap DNS, enable <strong>Email Routing / Forwarding</strong>.</p>
                  <p>2. Set catch-all: <code className="text-purple-700 font-mono">*@marketplaceforteachers.com</code> &rarr; forward to <code className="text-purple-700 font-mono">marketplaceforteachers.com@gmail.com</code>.</p>
                  <p>3. In Gmail Settings &rarr; Accounts &rarr; <em>"Send mail as"</em>, add your domain address so you can send replies displaying your branded domain.</p>
                </div>
              </div>

              {/* Method 4 */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-black">4</span>
                  <span>Programmatic Inbound Webhook Endpoint</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Your server is already equipped with an inbound webhook receiver endpoint to process parsed incoming emails automatically:
                </p>
                <div className="bg-white p-3 rounded-lg border border-amber-100 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between bg-slate-100 p-2 rounded font-mono text-[10px] text-slate-800">
                    <span>POST /api/webhooks/inbound-email</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('/api/webhooks/inbound-email');
                        setCopiedWebhook(true);
                        setTimeout(() => setCopiedWebhook(false), 2000);
                      }}
                      className="text-blue-600 hover:underline font-bold"
                    >
                      {copiedWebhook ? 'Copied! ✓' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-slate-500">
                    Connect this URL in Resend Dashboard &rarr; Webhooks (or Cloudflare Email Workers) to receive real-time POST alerts whenever someone sends an email to your domain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
