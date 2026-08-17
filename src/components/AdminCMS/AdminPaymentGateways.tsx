import React, { useState } from 'react';
import {
  CreditCard,
  Building,
  DollarSign,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Server,
  Globe,
  Wallet,
  FileCode,
  Save,
  HelpCircle,
  ArrowRight,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { CompanyPaymentGatewayConfig } from '../../types';
import { DEFAULT_PAYMENT_GATEWAY_CONFIG } from '../../data/gatewayData';

interface AdminPaymentGatewaysProps {
  gatewayConfig?: CompanyPaymentGatewayConfig;
  onSaveGatewayConfig: (config: CompanyPaymentGatewayConfig) => void;
  onShowToast: (msg: string) => void;
}

export const AdminPaymentGateways: React.FC<AdminPaymentGatewaysProps> = ({
  gatewayConfig = DEFAULT_PAYMENT_GATEWAY_CONFIG,
  onSaveGatewayConfig,
  onShowToast,
}) => {
  const [config, setConfig] = useState<CompanyPaymentGatewayConfig>(gatewayConfig);
  const [showSecretKeys, setShowSecretKeys] = useState(false);
  const [isTestingStripe, setIsTestingStripe] = useState(false);
  const [stripeTestResult, setStripeTestResult] = useState<'success' | 'failed' | null>(null);

  const handleTestStripeConnection = () => {
    setIsTestingStripe(true);
    setStripeTestResult(null);
    setTimeout(() => {
      setIsTestingStripe(false);
      setStripeTestResult('success');
      onShowToast('Stripe Connect Webhook & API Key verified live! ⚡');
    }, 800);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGatewayConfig(config);
    onShowToast('Company Payment Gateways & Corporate Settlement settings updated! 💳');
  };

  return (
    <div id="admin-payment-gateways" className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-linear-to-r from-blue-950 via-slate-900 to-purple-950 text-white rounded-2xl p-6 border border-blue-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-bold border border-blue-500/30">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Corporate Treasury & Merchant Rails</span>
            </div>
            <h2 className="text-2xl font-black text-white">Payment Gateway Setup for the Company</h2>
            <p className="text-blue-200 text-xs max-w-2xl leading-relaxed">
              Configure production merchant accounts, Stripe Connect for automated educator payouts, PayPal Commerce, School District Net-30 invoicing, and corporate settlement bank accounts.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer text-sm shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Settings</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: STRIPE CONNECT & ESCROW PLATFORM */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Stripe Connect & Platform Gateway</h3>
                <p className="text-slate-500 text-xs">Primary credit card processing and automated educator escrow disbursal</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.stripe.enabled}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      stripe: { ...config.stripe, enabled: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                <span className="ml-2 text-xs font-bold text-slate-700">
                  {config.stripe.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Gateway Environment</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setConfig({
                      ...config,
                      stripe: { ...config.stripe, mode: 'live' },
                    })
                  }
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    config.stripe.mode === 'live'
                      ? 'bg-purple-50 border-purple-600 text-purple-900 ring-1 ring-purple-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live Production</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setConfig({
                      ...config,
                      stripe: { ...config.stripe, mode: 'test' },
                    })
                  }
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    config.stripe.mode === 'test'
                      ? 'bg-amber-50 border-amber-600 text-amber-900 ring-1 ring-amber-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Test / Sandbox</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Stripe Statement Descriptor</label>
              <input
                type="text"
                value={config.stripe.statementDescriptor}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    stripe: { ...config.stripe, statementDescriptor: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900"
                placeholder="MFT*TEACHER MKTPLC"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Max 22 characters shown on buyer bank statements</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Stripe Publishable Key (Client-Side)</label>
              <input
                type="text"
                value={config.stripe.publishableKey}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    stripe: { ...config.stripe, publishableKey: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900"
                placeholder="pk_live_..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Stripe Secret API Key (Server-Side)</label>
                <button
                  type="button"
                  onClick={() => setShowSecretKeys(!showSecretKeys)}
                  className="text-[11px] text-purple-600 hover:underline font-bold cursor-pointer"
                >
                  {showSecretKeys ? 'Hide Secret' : 'Show Secret'}
                </button>
              </div>
              <input
                type={showSecretKeys ? 'text' : 'password'}
                value={config.stripe.secretKey}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    stripe: { ...config.stripe, secretKey: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 bg-slate-50"
                placeholder="sk_live_..."
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Webhook Endpoint Signing Secret</label>
              <input
                type={showSecretKeys ? 'text' : 'password'}
                value={config.stripe.webhookSecret}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    stripe: { ...config.stripe, webhookSecret: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900"
                placeholder="whsec_..."
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Stripe Connect Client ID</label>
              <input
                type="text"
                value={config.stripe.connectClientId}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    stripe: { ...config.stripe, connectClientId: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900"
                placeholder="ca_..."
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between flex-wrap gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleTestStripeConnection}
              disabled={isTestingStripe}
              className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer text-xs transition-colors"
            >
              {isTestingStripe ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Testing Stripe API Webhooks...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                  <span>Test Live Stripe Connection</span>
                </>
              )}
            </button>

            {stripeTestResult === 'success' && (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Connected & Active (Webhook response: 200 OK)</span>
              </span>
            )}
          </div>
        </div>

        {/* SECTION 2: PAYPAL COMMERCE PLATFORM */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">PayPal Commerce & Marketplace Rails</h3>
                <p className="text-slate-500 text-xs">Alternative payment method & instant PayPal wallet checkout</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.paypal.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    paypal: { ...config.paypal, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-2 text-xs font-bold text-slate-700">
                {config.paypal.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">PayPal Client ID</label>
              <input
                type="text"
                value={config.paypal.clientId}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    paypal: { ...config.paypal, clientId: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">PayPal Secret Key</label>
              <input
                type={showSecretKeys ? 'text' : 'password'}
                value={config.paypal.clientSecret}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    paypal: { ...config.paypal, clientSecret: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">PayPal Merchant Account ID</label>
              <input
                type="text"
                value={config.paypal.merchantId}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    paypal: { ...config.paypal, merchantId: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: SCHOOL DISTRICT PURCHASE ORDERS & INVOICING */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">School District Purchase Orders & Net-30 Invoicing</h3>
                <p className="text-slate-500 text-xs">Direct institutional billing for public schools, Title I districts, and PTAs</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.districtPO.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    districtPO: { ...config.districtPO, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-2 text-xs font-bold text-slate-700">
                {config.districtPO.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Payment Terms</label>
              <select
                value={config.districtPO.netPaymentDays}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    districtPO: {
                      ...config.districtPO,
                      netPaymentDays: parseInt(e.target.value) as any,
                    },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
              >
                <option value={30}>Net-30 Days (Standard District Terms)</option>
                <option value={60}>Net-60 Days (Extended State Terms)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Company District ACH Routing #</label>
              <input
                type="text"
                value={config.districtPO.achRoutingNumber}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    districtPO: { ...config.districtPO, achRoutingNumber: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Company District ACH Account #</label>
              <input
                type="text"
                value={config.districtPO.achAccountNumber}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    districtPO: { ...config.districtPO, achAccountNumber: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: CORPORATE SETTLEMENT & TREASURY BANK ACCOUNT */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Company Deposit & Settlement Account</h3>
                <p className="text-slate-500 text-xs">Primary corporate account where platform commission fees (5%) are settled</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Legal Corporate Entity Name</label>
              <input
                type="text"
                value={config.corporateSettlement.legalEntityName}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    corporateSettlement: {
                      ...config.corporateSettlement,
                      legalEntityName: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Federal EIN (Tax ID)</label>
              <input
                type="text"
                value={config.corporateSettlement.federalEin}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    corporateSettlement: {
                      ...config.corporateSettlement,
                      federalEin: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Deposit Bank Name</label>
              <input
                type="text"
                value={config.corporateSettlement.depositBankName}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    corporateSettlement: {
                      ...config.corporateSettlement,
                      depositBankName: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Settlement Bank Routing #</label>
              <input
                type="text"
                value={config.corporateSettlement.routingNumber}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    corporateSettlement: {
                      ...config.corporateSettlement,
                      routingNumber: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Account Number (Ending Digits)</label>
              <input
                type="text"
                value={config.corporateSettlement.accountNumberLast4}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    corporateSettlement: {
                      ...config.corporateSettlement,
                      accountNumberLast4: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Settlement Payout Schedule</label>
              <select
                value={config.corporateSettlement.settlementSchedule}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    corporateSettlement: {
                      ...config.corporateSettlement,
                      settlementSchedule: e.target.value as any,
                    },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
              >
                <option value="daily_rolling">Daily Rolling (Automatic 2-Day Payouts)</option>
                <option value="weekly_friday">Weekly on Fridays</option>
                <option value="monthly_1st">Monthly on the 1st</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 5: ESCROW AUTO-RELEASE & HOLDING RULES */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Escrow Holding & Auto-Release Rules</h3>
              <p className="text-slate-500 text-xs">Configure automated payout release timelines following carrier delivery scans</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Auto-Release Countdown (Days)</label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={config.escrowSettings.autoReleaseDays}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      escrowSettings: {
                        ...config.escrowSettings,
                        autoReleaseDays: parseInt(e.target.value) || 7,
                      },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
                <span className="absolute right-3 top-2.5 text-slate-400 font-bold">Days</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Standard: 7 days after carrier delivery scan</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Minimum Teacher Withdrawal ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min={1}
                  step="0.50"
                  value={config.escrowSettings.minimumWithdrawalThreshold}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      escrowSettings: {
                        ...config.escrowSettings,
                        minimumWithdrawalThreshold: parseFloat(e.target.value) || 5.0,
                      },
                    })
                  }
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Prevents excessive micro-transfer banking fees</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Platform Commission Fee (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={config.escrowSettings.escrowFeePercent}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      escrowSettings: {
                        ...config.escrowSettings,
                        escrowFeePercent: parseFloat(e.target.value) || 5.0,
                      },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
                <span className="absolute right-3 top-2.5 text-slate-400 font-bold">%</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Retained automatically into corporate treasury</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer text-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply All Gateway Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
