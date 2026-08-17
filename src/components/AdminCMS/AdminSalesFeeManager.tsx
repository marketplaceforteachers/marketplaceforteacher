import React, { useState } from 'react';
import {
  Percent,
  DollarSign,
  Globe,
  MapPin,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Sparkles,
  Calculator,
  RefreshCw,
  Search,
  Building,
  Info,
  Layers,
  ArrowUpRight,
  Receipt,
  FileCheck,
} from 'lucide-react';
import { AdminFeeSettings, USStateInfo, Order } from '../../types';
import { ALL_US_STATES_DATA, US_STATE_TAX_RATES } from '../../data/mockData';

interface AdminSalesFeeManagerProps {
  feeSettings: AdminFeeSettings;
  onUpdateFeeSettings: (updated: AdminFeeSettings) => void;
  orders: Order[];
  onLogAudit?: (action: string, details: string) => void;
}

export const AdminSalesFeeManager: React.FC<AdminSalesFeeManagerProps> = ({
  feeSettings,
  onUpdateFeeSettings,
  orders,
  onLogAudit,
}) => {
  const [commissionRate, setCommissionRate] = useState<number>(
    feeSettings.nationwideCommissionRate || 5.0
  );
  const [feeModel, setFeeModel] = useState<'deduct_seller' | 'add_buyer' | 'split'>(
    feeSettings.feeModel || 'deduct_seller'
  );
  const [statesData, setStatesData] = useState<USStateInfo[]>(() => {
    return ALL_US_STATES_DATA.map((st) => {
      const savedRate = feeSettings.stateTaxRates?.[st.code];
      const savedSurcharge = feeSettings.stateSurcharges?.[st.code] || 0;
      return {
        ...st,
        baseTaxRate: savedRate !== undefined ? +(savedRate * 100).toFixed(3) : st.baseTaxRate,
        surchargePercent: savedSurcharge,
      };
    });
  });

  const [stateSearch, setStateSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'south' | 'west' | 'midwest' | 'northeast'>('all');
  const [testOrderAmount, setTestOrderAmount] = useState<number>(100.0);
  const [selectedTestState, setSelectedTestState] = useState<string>('OK');
  const [saveBanner, setSaveBanner] = useState(false);
  const [appliedNationwideBanner, setAppliedNationwideBanner] = useState(false);

  // Filtered States
  const filteredStates = statesData.filter((st) => {
    const query = stateSearch.toLowerCase().trim();
    const matchesQuery =
      !query ||
      st.name.toLowerCase().includes(query) ||
      st.code.toLowerCase().includes(query) ||
      st.majorCities.some((c) => c.toLowerCase().includes(query));

    if (!matchesQuery) return false;

    if (regionFilter === 'south') {
      return ['OK', 'TX', 'FL', 'GA', 'NC', 'SC', 'VA', 'WV', 'KY', 'TN', 'AL', 'MS', 'AR', 'LA', 'MD', 'DE', 'DC'].includes(st.code);
    }
    if (regionFilter === 'west') {
      return ['CA', 'WA', 'OR', 'NV', 'AZ', 'CO', 'UT', 'ID', 'MT', 'WY', 'NM', 'AK', 'HI'].includes(st.code);
    }
    if (regionFilter === 'midwest') {
      return ['IL', 'OH', 'MI', 'IN', 'WI', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'].includes(st.code);
    }
    if (regionFilter === 'northeast') {
      return ['NY', 'PA', 'NJ', 'MA', 'CT', 'RI', 'NH', 'VT', 'ME'].includes(st.code);
    }
    return true;
  });

  // Commission Preset Helper
  const applyPresetRate = (rate: number) => {
    setCommissionRate(rate);
  };

  // Bulk Apply to All 50 States
  const handleApplyNationwideToAllStates = () => {
    const updatedTaxRates: Record<string, number> = {};
    const updatedSurcharges: Record<string, number> = {};

    statesData.forEach((st) => {
      updatedTaxRates[st.code] = +(st.baseTaxRate / 100).toFixed(4);
      updatedSurcharges[st.code] = 0;
    });

    const newSettings: AdminFeeSettings = {
      ...feeSettings,
      nationwideCommissionRate: commissionRate,
      feeModel,
      applyToAllStates: true,
      stateTaxRates: updatedTaxRates,
      stateSurcharges: updatedSurcharges,
      lastUpdated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      updatedBy: 'info@marketplaceforteachers.com',
    };

    onUpdateFeeSettings(newSettings);
    if (onLogAudit) {
      onLogAudit(
        'Admin Sales Rate Updated',
        `Applied universal sales fee of ${commissionRate}% across all 50 US states and cities.`
      );
    }

    setAppliedNationwideBanner(true);
    setTimeout(() => setAppliedNationwideBanner(false), 3500);
  };

  // Individual State Rate Change
  const handleStateTaxChange = (code: string, newRate: number) => {
    setStatesData((prev) =>
      prev.map((s) => (s.code === code ? { ...s, baseTaxRate: newRate } : s))
    );
  };

  const handleStateSurchargeChange = (code: string, newSurcharge: number) => {
    setStatesData((prev) =>
      prev.map((s) => (s.code === code ? { ...s, surchargePercent: newSurcharge } : s))
    );
  };

  // Save All Settings
  const handleSaveAll = () => {
    const updatedTaxRates: Record<string, number> = {};
    const updatedSurcharges: Record<string, number> = {};

    statesData.forEach((st) => {
      updatedTaxRates[st.code] = +(st.baseTaxRate / 100).toFixed(4);
      if (st.surchargePercent > 0) {
        updatedSurcharges[st.code] = st.surchargePercent;
      }
    });

    const newSettings: AdminFeeSettings = {
      nationwideCommissionRate: commissionRate,
      feeModel,
      applyToAllStates: true,
      universalTaxRateEnabled: false,
      universalTaxRatePercent: 8.0,
      stateTaxRates: updatedTaxRates,
      stateSurcharges: updatedSurcharges,
      lastUpdated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      updatedBy: 'info@marketplaceforteachers.com',
    };

    onUpdateFeeSettings(newSettings);
    if (onLogAudit) {
      onLogAudit(
        'Sales Fee & US State Matrix Saved',
        `Configured nationwide commission: ${commissionRate}%, model: ${feeModel}`
      );
    }

    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    setCommissionRate(5.0);
    setFeeModel('deduct_seller');
    setStatesData(
      ALL_US_STATES_DATA.map((st) => ({
        ...st,
        surchargePercent: 0,
      }))
    );
  };

  // Calculations for Simulator
  const testStateObj = statesData.find((s) => s.code === selectedTestState) || statesData[0];
  const simTaxRate = testStateObj ? testStateObj.baseTaxRate / 100 : 0.0895;
  const simCommissionAmount = +(testOrderAmount * (commissionRate / 100)).toFixed(2);
  const simSellerEarnings = +(testOrderAmount - simCommissionAmount).toFixed(2);
  const simTaxAmount = +(testOrderAmount * simTaxRate).toFixed(2);
  const simBuyerTotal = +(testOrderAmount + simTaxAmount).toFixed(2);

  // Total GMV & Platform Revenue based on active orders
  const ordersList = orders || [];
  const totalGMV = ordersList.reduce((acc, o) => acc + (o?.subtotal || 0), 0);
  const projectedPlatformRevenue = (totalGMV * (commissionRate / 100)).toFixed(2);

  return (
    <div id="admin-sales-fee-manager" className="space-y-6">
      {/* Top Banner Alert / Success */}
      {appliedNationwideBanner && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <p className="text-xs font-bold">
              Successfully applied {commissionRate}% Sales Percentage across all 50 US States & major cities (Oklahoma City, Dallas, Los Angeles, Chicago, New York, etc.)!
            </p>
          </div>
          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded font-bold">LIVE NATIONWIDE</span>
        </div>
      )}

      {saveBanner && (
        <div className="bg-blue-900 text-white p-4 rounded-xl shadow-md flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-blue-300" />
            <p className="text-xs font-bold">
              Admin sales fee configuration saved and synchronized with checkout & educator invoices.
            </p>
          </div>
          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded font-bold">SAVED</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
              <Percent className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              USA Marketplace Sales Percentage & State Fee Control
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure platform sales fee percentages, escrow commission deductions, and sales tax across all 50 US States & cities.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Rate Changes</span>
          </button>
        </div>
      </div>

      {/* TOP CONTROLS & LIVE SIMULATOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: GLOBAL NATIONWIDE RATE CONTROLLER (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Percentage Controller Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                  Nationwide Sales Percentage (Universal USA Rate)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Applied to all classroom materials, books, and STEM kit sales across all 50 states.
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-blue-950 font-mono">
                  {commissionRate.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Slider Control */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={commissionRate}
                onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono font-semibold">
                <span>0% (Fee-Free)</span>
                <span>5% (Standard)</span>
                <span>10% (Growth)</span>
                <span>15%</span>
                <span>20%</span>
                <span>25% (Max)</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600">Quick Fee Presets:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '0% Free Promo', rate: 0.0 },
                  { label: '3.5% Cost Recovery', rate: 3.5 },
                  { label: '5.0% Standard Educator', rate: 5.0 },
                  { label: '7.5% Growth', rate: 7.5 },
                  { label: '10.0% Commercial', rate: 10.0 },
                  { label: '12.5% Premium', rate: 12.5 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPresetRate(preset.rate)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      commissionRate === preset.rate
                        ? 'bg-blue-900 text-white shadow-xs scale-105'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fee Application Model */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">
                Fee Collection Structure:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFeeModel('deduct_seller')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    feeModel === 'deduct_seller'
                      ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-950 ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold text-slate-900">Seller Escrow Fee</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Deduct {commissionRate}% from seller earnings upon sale.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFeeModel('add_buyer')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    feeModel === 'add_buyer'
                      ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-950 ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold text-slate-900">Buyer Surcharge</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Add {commissionRate}% marketplace fee at checkout.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFeeModel('split')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    feeModel === 'split'
                      ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-950 ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold text-slate-900">Split 50/50</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {(commissionRate / 2).toFixed(1)}% buyer + {(commissionRate / 2).toFixed(1)}% seller.
                  </p>
                </button>
              </div>
            </div>

            {/* BIG ACTION: Apply Across All States Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleApplyNationwideToAllStates}
                className="w-full bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Apply {commissionRate}% Nationwide Across All 50 US States & Cities</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE REVENUE SIMULATOR (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-600" />
                Live Sale Impact Simulator
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Real-Time
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Sample Item Price ($):
                </label>
                <input
                  type="number"
                  min="5"
                  max="5000"
                  value={testOrderAmount}
                  onChange={(e) => setTestOrderAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-hidden focus:border-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Sample US State:
                </label>
                <select
                  value={selectedTestState}
                  onChange={(e) => setSelectedTestState(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
                >
                  {statesData.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.code}) - {s.baseTaxRate}%
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Breakdown Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Classroom Item Price:</span>
                <span className="font-semibold font-mono text-slate-900">${testOrderAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-blue-900 font-bold bg-blue-100/60 p-1.5 rounded-lg">
                <span>Platform Commission ({commissionRate}%):</span>
                <span className="font-mono text-emerald-700">+${simCommissionAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Teacher Seller Net Payout:</span>
                <span className="font-semibold font-mono text-slate-900">${simSellerEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>
                  State Sales Tax ({testStateObj?.name} {testStateObj?.baseTaxRate}%):
                </span>
                <span className="font-semibold font-mono text-slate-900">${simTaxAmount.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                <span>Buyer Total Paid:</span>
                <span className="font-mono text-blue-950">${simBuyerTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Annual Platform Projection */}
            <div className="bg-linear-to-br from-blue-900 to-indigo-950 text-white p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-200">
                <span>Projected Platform Revenue</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black font-mono text-emerald-400">
                ${(50000 * (commissionRate / 100)).toFixed(2)}
              </p>
              <p className="text-[10.5px] text-blue-200 leading-snug">
                Annual estimated marketplace net revenue on $50,000 educator GMV volume.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: 50 US STATES & CITIES INTERACTIVE MATRIX */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>All 50 US States & Major Cities Fee Matrix</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and adjust individual state sales taxes and local city surcharges across the United States.
            </p>
          </div>

          {/* Search & Region Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search state or city (e.g. Oklahoma City, Dallas, Miami)..."
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs w-64 focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {(['all', 'south', 'west', 'midwest', 'northeast'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegionFilter(r)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                    regionFilter === r
                      ? 'bg-white text-blue-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* State Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                <th className="p-3">State & Code</th>
                <th className="p-3">Major Cities Covered</th>
                <th className="p-3 text-center">Base State Sales Tax %</th>
                <th className="p-3 text-center">Sales Commission Rate %</th>
                <th className="p-3 text-center">State Platform Surcharge %</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStates.map((st) => (
                <tr key={st.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-blue-100 text-blue-800 font-mono text-[11px] font-extrabold flex items-center justify-center">
                        {st.code}
                      </span>
                      <span>{st.name}</span>
                    </div>
                  </td>

                  <td className="p-3 text-slate-600 max-w-xs">
                    <span className="text-[11px] text-slate-500">
                      {st.majorCities.join(', ')}
                    </span>
                  </td>

                  <td className="p-3 text-center font-mono">
                    <div className="inline-flex items-center gap-1">
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        max="15"
                        value={st.baseTaxRate}
                        onChange={(e) => handleStateTaxChange(st.code, parseFloat(e.target.value) || 0)}
                        className="w-16 p-1 text-center font-bold text-slate-900 rounded border border-slate-300 focus:border-blue-600 text-xs"
                      />
                      <span className="text-slate-400 font-bold">%</span>
                    </div>
                  </td>

                  <td className="p-3 text-center font-mono font-bold text-blue-900">
                    <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded">
                      {commissionRate.toFixed(1)}%
                    </span>
                  </td>

                  <td className="p-3 text-center font-mono">
                    <div className="inline-flex items-center gap-1">
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        max="10"
                        value={st.surchargePercent}
                        onChange={(e) =>
                          handleStateSurchargeChange(st.code, parseFloat(e.target.value) || 0)
                        }
                        className="w-16 p-1 text-center font-bold text-slate-900 rounded border border-slate-300 focus:border-blue-600 text-xs"
                      />
                      <span className="text-slate-400 font-bold">%</span>
                    </div>
                  </td>

                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active USA
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>
            Showing {filteredStates.length} of {statesData.length} US jurisdictions (50 States + DC).
          </span>
          <span>
            Official Administrator Support: <strong>info@marketplaceforteachers.com</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
