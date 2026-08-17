import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  Tag,
  Truck,
  MapPin,
  X,
  Sparkles,
  Image as ImageIcon,
  ShieldCheck,
  Star,
  Camera,
  Scale,
  Box,
  QrCode,
  ScanLine,
  FileSpreadsheet,
  Package,
  Layers,
} from 'lucide-react';
import { Product, ProductCondition, User, PackageMeasurements } from '../../types';
import { CATEGORIES } from '../../data/categoriesData';
import { calculateShippingRates } from '../../utils/shippingCalculator';
import { AIListingAssistantModal } from '../AIListingAssistantModal';
import { BarcodeScannerModal } from '../BarcodeScannerModal';
import { BulkUploadModal } from '../BulkUploadModal';
import { QRCodeModal } from '../QRCodeModal';
import { ClassroomBundleBuilderModal } from '../ClassroomBundleBuilderModal';

interface ListingManagerTabProps {
  products: Product[];
  currentUserId: string;
  currentUser?: User;
  onCreateProduct: (newProduct: Partial<Product>) => void;
  onDeleteProduct: (productId: string) => void;
  onSelectProduct: (p: Product) => void;
  onOpenVerification?: () => void;
}

const PRESET_SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
];

export const ListingManagerTab: React.FC<ListingManagerTabProps> = ({
  products = [],
  currentUserId,
  currentUser,
  onCreateProduct,
  onDeleteProduct,
  onSelectProduct,
  onOpenVerification,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const myListings = (products || []).filter((p) => p.sellerId === currentUserId);

  // Modals state
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isBundleBuilderOpen, setIsBundleBuilderOpen] = useState(false);
  const [selectedQRProduct, setSelectedQRProduct] = useState<Product | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [categoryId, setCategoryId] = useState('classroom-supplies');
  const [subcategoryId, setSubcategoryId] = useState('markers');
  const [condition, setCondition] = useState<ProductCondition>('Like New');
  const [stock, setStock] = useState('1');

  // Package Measurements & Weight
  const [weightLbs, setWeightLbs] = useState<string>('2');
  const [weightOz, setWeightOz] = useState<string>('0');
  const [lengthInches, setLengthInches] = useState<string>('12');
  const [widthInches, setWidthInches] = useState<string>('9');
  const [heightInches, setHeightInches] = useState<string>('4');
  const [packageType, setPackageType] = useState<'box' | 'envelope' | 'soft_pack' | 'irregular'>('box');

  // Shipping Pricing Model
  const [shippingPricingType, setShippingPricingType] = useState<'calculated' | 'free_shipping' | 'flat_rate'>('calculated');
  const [customFlatRate, setCustomFlatRate] = useState<string>('6.50');
  const [enableUSPS, setEnableUSPS] = useState(true);
  const [enableUPS, setEnableUPS] = useState(true);
  const [enableFedEx, setEnableFedEx] = useState(false);
  const [localPickup, setLocalPickup] = useState(true);
  const [pickupNotes, setPickupNotes] = useState('Available for contact-free pickup at main school office during school hours.');

  // Live Test Estimator
  const [testBuyerZip, setTestBuyerZip] = useState('75201'); // Dallas test
  
  // Up to 10 Photos State
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    if (photos.length >= 10) return;
    setPhotos([...photos, newPhotoUrl.trim()]);
    setNewPhotoUrl('');
  };

  const handleAddPresetPhoto = (url: string) => {
    if (photos.length >= 10) return;
    if (photos.includes(url)) return;
    setPhotos([...photos, url]);
  };

  const handleRemovePhoto = (index: number) => {
    if (photos.length <= 1) return; // Keep at least 1 photo
    setPhotos(photos.filter((_, idx) => idx !== index));
  };

  const handleSetPrimaryPhoto = (index: number) => {
    if (index === 0) return;
    const selected = photos[index];
    const rest = photos.filter((_, idx) => idx !== index);
    setPhotos([selected, ...rest]);
  };

  // Apply AI Listing Data
  const handleApplyAIData = (data: {
    title: string;
    description: string;
    categoryId: string;
    gradeLevel: string[];
    condition: ProductCondition;
    tags: string[];
    price: number;
    originalPrice?: number;
  }) => {
    setTitle(data.title);
    setDescription(data.description);
    setCategoryId(data.categoryId);
    setCondition(data.condition);
    setPrice(data.price.toString());
    if (data.originalPrice) {
      setOriginalPrice(data.originalPrice.toString());
    }
    setShowCreateModal(true);
  };

  // Apply Barcode Scan
  const handleApplyBarcodeScan = (itemData: {
    title: string;
    description: string;
    categoryId: string;
    gradeLevel: string[];
    condition: ProductCondition;
    price: number;
    originalPrice: number;
  }) => {
    setTitle(itemData.title);
    setDescription(itemData.description);
    setCategoryId(itemData.categoryId);
    setCondition(itemData.condition);
    setPrice(itemData.price.toString());
    setOriginalPrice(itemData.originalPrice.toString());
    setShowCreateModal(true);
  };

  // Handle Bulk Import
  const handleBulkImport = (newItems: Partial<Product>[]) => {
    newItems.forEach((it) => {
      onCreateProduct({
        title: it.title || 'Bulk Imported Classroom Supply',
        price: it.price || 15,
        originalPrice: it.originalPrice || 35,
        categoryId: it.categoryId || 'classroom-supplies',
        subcategoryId: it.subcategoryId || 'general',
        condition: it.condition || 'Like New',
        stock: 1,
        images: ['https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80'],
        gradeLevel: it.gradeLevel || ['3-5'],
        tags: ['bulk-import', 'classroom-surplus'],
      });
    });
  };

  // Temporary product object for previewing shipping calculations
  const previewProduct: Partial<Product> = {
    id: 'temp-preview',
    price: parseFloat(price) || 25,
    location: {
      city: currentUser?.city || 'Oklahoma City',
      state: currentUser?.state || 'OK',
      zip: currentUser?.zip || '73159',
      distanceMiles: 0,
    },
    packageMeasurements: {
      weightLbs: parseFloat(weightLbs) || 1,
      weightOz: parseFloat(weightOz) || 0,
      lengthInches: parseFloat(lengthInches) || 10,
      widthInches: parseFloat(widthInches) || 8,
      heightInches: parseFloat(heightInches) || 3,
      packageType: packageType === 'box' ? 'box' : 'padded_envelope',
    },
    shippingOptions: {
      pricingType: shippingPricingType,
      usps: enableUSPS,
      ups: enableUPS,
      fedex: enableFedEx,
      localPickup,
      freeShipping: shippingPricingType === 'free_shipping',
      flatRate: parseFloat(customFlatRate) || 0,
      estimatedFee: shippingPricingType === 'flat_rate' ? parseFloat(customFlatRate) || 0 : undefined,
    },
  };

  const calculatedPreviewRates = calculateShippingRates(previewProduct as Product, testBuyerZip);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    const pkgMeasurements: PackageMeasurements = {
      weightLbs: parseFloat(weightLbs) || 1,
      weightOz: parseFloat(weightOz) || 0,
      lengthInches: parseFloat(lengthInches) || 10,
      widthInches: parseFloat(widthInches) || 8,
      heightInches: parseFloat(heightInches) || 4,
      packageType: packageType === 'box' ? 'box' : 'padded_envelope',
    };

    onCreateProduct({
      title,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      categoryId,
      subcategoryId,
      condition,
      stock: parseInt(stock) || 1,
      images: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80'],
      packageMeasurements: pkgMeasurements,
      shippingOptions: {
        pricingType: shippingPricingType,
        usps: enableUSPS,
        ups: enableUPS,
        fedex: enableFedEx,
        localPickup,
        freeShipping: shippingPricingType === 'free_shipping',
        flatRate: shippingPricingType === 'flat_rate' ? parseFloat(customFlatRate) || 0 : 0,
        estimatedFee: shippingPricingType === 'flat_rate' ? parseFloat(customFlatRate) || 0 : undefined,
        pickupInstructions: pickupNotes,
      },
      gradeLevel: ['K-2', '3-5'],
      tags: [title.split(' ')[0], 'Classroom', condition],
      featured: false,
    });

    setShowCreateModal(false);
    // Reset form
    setTitle('');
    setDescription('');
    setPrice('');
    setOriginalPrice('');
    setPhotos(['https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80']);
  };

  const isTeacherVerified = currentUser?.verified || currentUser?.verifiedTeacher;

  return (
    <div className="space-y-6">
      {/* Verification Reminder Banner if Unverified */}
      {!isTeacherVerified && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-start gap-3 text-amber-950">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-sm">School Webmail Verification Required for Sellers</h4>
              <p className="text-amber-800 mt-0.5">
                To keep our marketplace trusted and safe, sellers must verify with their official school/work webmail (.edu, .k12.*.us, .org) before listing items. Buyers do not require verification.
              </p>
            </div>
          </div>

          {onOpenVerification && (
            <button
              onClick={onOpenVerification}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg shrink-0 transition-colors cursor-pointer"
            >
              Verify School Webmail (2 min)
            </button>
          )}
        </div>
      )}

      {/* Quick Teacher Tools Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="p-3.5 bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-2xl border border-purple-800 text-left hover:scale-[1.02] transition-transform shadow-sm cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-[9px] bg-purple-800 px-1.5 py-0.5 rounded font-black text-amber-200">AI PRO</span>
          </div>
          <h4 className="font-black text-xs mt-2">AI Listing & Comps</h4>
          <p className="text-[10px] text-purple-200 mt-0.5">Autofill description, tags & pricing</p>
        </button>

        <button
          onClick={() => setIsBarcodeModalOpen(true)}
          className="p-3.5 bg-gradient-to-br from-blue-900 to-cyan-900 text-white rounded-2xl border border-blue-800 text-left hover:scale-[1.02] transition-transform shadow-sm cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <ScanLine className="w-5 h-5 text-cyan-300" />
            <span className="text-[9px] bg-blue-800 px-1.5 py-0.5 rounded font-black text-cyan-200">SCAN</span>
          </div>
          <h4 className="font-black text-xs mt-2">Barcode & ISBN</h4>
          <p className="text-[10px] text-blue-200 mt-0.5">Scan book ISBN or supply UPC</p>
        </button>

        <button
          onClick={() => setIsBulkModalOpen(true)}
          className="p-3.5 bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-2xl border border-emerald-800 text-left hover:scale-[1.02] transition-transform shadow-sm cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
            <span className="text-[9px] bg-emerald-800 px-1.5 py-0.5 rounded font-black text-emerald-200">CSV</span>
          </div>
          <h4 className="font-black text-xs mt-2">Bulk CSV Upload</h4>
          <p className="text-[10px] text-emerald-200 mt-0.5">Upload full inventory spreadsheets</p>
        </button>

        <button
          onClick={() => setIsBundleBuilderOpen(true)}
          className="p-3.5 bg-gradient-to-br from-amber-900 to-orange-900 text-white rounded-2xl border border-amber-800 text-left hover:scale-[1.02] transition-transform shadow-sm cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <Package className="w-5 h-5 text-amber-300" />
            <span className="text-[9px] bg-amber-800 px-1.5 py-0.5 rounded font-black text-amber-200">BUNDLE</span>
          </div>
          <h4 className="font-black text-xs mt-2">Bundle Builder</h4>
          <p className="text-[10px] text-amber-200 mt-0.5">Package kits for 1-click sales</p>
        </button>
      </div>

      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 text-base">My Active Classroom Listings</h3>
            <span className="bg-blue-100 text-blue-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
              {myListings.length} Active Items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage pricing, print QR flyers for staff lounge boards, and dispatch buyer shipments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Listing (Free)</span>
          </button>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {myListings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Tag className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800">No active listings yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Turn unused textbooks, math blocks, science kits, and classroom furniture into budget for your students.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-black px-4 py-2 rounded-xl cursor-pointer shadow-sm"
              >
                Create Listing (Manual)
              </button>
              <button
                onClick={() => setIsAIModalOpen(true)}
                className="bg-purple-900 hover:bg-purple-800 text-white text-xs font-black px-4 py-2 rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Use AI Assistant
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="p-3.5">Product Title & Photos</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Condition</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">QR & Pickup</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myListings.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1 max-w-xs">{p.title}</p>
                          <span className="text-[11px] text-slate-400">ID: {p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 capitalize text-slate-700">
                      {p.categoryId.replace('-', ' ')}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {p.condition}
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-blue-950 text-sm">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-slate-600">{p.stock}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => setSelectedQRProduct(p)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-slate-200 cursor-pointer"
                        title="Generate QR Code for School Pickup & Flyers"
                      >
                        <QrCode className="w-3.5 h-3.5 text-blue-900" />
                        QR Flyer
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectProduct(p)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100 cursor-pointer"
                          title="View Live Listing"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100 cursor-pointer"
                          title="Remove Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {selectedQRProduct && (
        <QRCodeModal
          isOpen={Boolean(selectedQRProduct)}
          onClose={() => setSelectedQRProduct(null)}
          title={selectedQRProduct.title}
          subtitle={`Listed by ${selectedQRProduct.sellerName} • $${selectedQRProduct.price.toFixed(2)}`}
          targetUrl={`https://marketplaceforteachers.com/product/${selectedQRProduct.id}`}
        />
      )}

      {/* AI Assistant Modal */}
      <AIListingAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApplyListingData={handleApplyAIData}
      />

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        onScanComplete={handleApplyBarcodeScan}
      />

      {/* Bulk CSV Upload Modal */}
      {currentUser && (
        <BulkUploadModal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          currentUser={currentUser}
          onBulkImport={handleBulkImport}
        />
      )}

      {/* Classroom Bundle Builder Modal */}
      {currentUser && (
        <ClassroomBundleBuilderModal
          isOpen={isBundleBuilderOpen}
          onClose={() => setIsBundleBuilderOpen(false)}
          currentUser={currentUser}
          onSaveBundle={(bundle) => {
            alert(`Classroom Bundle "${bundle.title}" created successfully!`);
          }}
        />
      )}

      {/* Create Listing Modal with 10 Photos Maximum Support */}
      {showCreateModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Post a Free Classroom Listing</h3>
                  <p className="text-[11px] text-slate-500">
                    Upload up to 10 photos • Escrow Protected • 5% low transaction fee when sold
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Listing Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Snap Circuits Extreme Discovery STEM Kit (Complete Set)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold focus:border-blue-600 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium text-slate-800"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Item Condition *</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ProductCondition)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-medium text-slate-800"
                  >
                    <option value="Brand New">Brand New (Unopened / Unused)</option>
                    <option value="Like New">Like New (Mint Condition)</option>
                    <option value="Gently Used">Gently Used (Classroom-tested)</option>
                    <option value="Fair">Fair (Noticeable cosmetic wear, fully functional)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Price ($ USD) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    placeholder="25.00 (Enter 0 for Free Supply Donation)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                  />
                  {parseFloat(price) === 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 mt-1 block">
                      🎁 This item will be flagged as a FREE Classroom Supply Donation!
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Retail Price ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="60.00"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe parts included, grade level fit, condition details, and any lesson notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 leading-relaxed text-slate-900"
                />
              </div>

              {/* Photo Upload System (Up to 10 photos) */}
              <div className="space-y-2 border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-blue-900" />
                    <span>Classroom Photos ({photos.length} / 10 Max)</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    High-res photos boost buyer confidence & speed up sale
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-slate-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    disabled={photos.length >= 10 || !newPhotoUrl.trim()}
                    className="bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold px-3 py-2 rounded-lg text-xs"
                  >
                    Add URL
                  </button>
                </div>

                {/* Photo thumbnails preview */}
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 pt-2">
                  {photos.map((url, idx) => (
                    <div
                      key={idx}
                      className={`relative group aspect-square rounded-lg overflow-hidden border-2 bg-slate-100 ${
                        idx === 0 ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200'
                      }`}
                    >
                      <img src={url} alt={`Listing photo ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-blue-900 text-white text-[9px] font-extrabold px-1 rounded">
                          Cover
                        </span>
                      )}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryPhoto(idx)}
                            title="Make Cover Photo"
                            className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            <Star className="w-3 h-3 fill-current" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          title="Remove Photo"
                          className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Presets */}
                <div className="pt-1">
                  <span className="text-[10px] text-slate-500 font-medium block mb-1">
                    Or select high-quality classroom sample photos:
                  </span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {PRESET_SAMPLE_PHOTOS.slice(0, 7).map((url, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleAddPresetPhoto(url)}
                        className="w-10 h-10 rounded border border-slate-200 overflow-hidden shrink-0 hover:opacity-80 cursor-pointer"
                      >
                        <img src={url} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Package Measurements & Shipping Dimensions */}
              <div className="space-y-3 border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-blue-900" />
                    <span>Package Weight & Shipping Dimensions</span>
                  </label>
                  <span className="text-[11px] text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded">
                    Calculated USPS / UPS Rates
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Weight (Pounds)</label>
                    <input
                      type="number"
                      min="0"
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Weight (Ounces)</label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={weightOz}
                      onChange={(e) => setWeightOz(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Length (Inches)</label>
                    <input
                      type="number"
                      min="1"
                      value={lengthInches}
                      onChange={(e) => setLengthInches(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Width (Inches)</label>
                    <input
                      type="number"
                      min="1"
                      value={widthInches}
                      onChange={(e) => setWidthInches(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Height (Inches)</label>
                    <input
                      type="number"
                      min="1"
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 font-bold"
                    />
                  </div>
                </div>

                {/* Shipping Model Selection */}
                <div className="space-y-2 pt-2">
                  <label className="font-bold text-slate-700 block">Who Pays For Shipping?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label
                      className={`p-2.5 rounded-xl border flex items-start gap-2 cursor-pointer transition-colors ${
                        shippingPricingType === 'calculated'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingModel"
                        checked={shippingPricingType === 'calculated'}
                        onChange={() => setShippingPricingType('calculated')}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="font-bold text-xs">Buyer Pays Calculated Rate</p>
                        <p className="text-[10px] text-slate-500 font-normal">
                          USPS / UPS based on exact zip code distance & billable weight.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`p-2.5 rounded-xl border flex items-start gap-2 cursor-pointer transition-colors ${
                        shippingPricingType === 'flat_rate'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingModel"
                        checked={shippingPricingType === 'flat_rate'}
                        onChange={() => setShippingPricingType('flat_rate')}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="font-bold text-xs">Fixed Flat Rate</p>
                        <p className="text-[10px] text-slate-500 font-normal">
                          Charge fixed amount nationwide (e.g. $6.50).
                        </p>
                      </div>
                    </label>

                    <label
                      className={`p-2.5 rounded-xl border flex items-start gap-2 cursor-pointer transition-colors ${
                        shippingPricingType === 'free_shipping'
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingModel"
                        checked={shippingPricingType === 'free_shipping'}
                        onChange={() => setShippingPricingType('free_shipping')}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="font-bold text-xs">Free Shipping</p>
                        <p className="text-[10px] text-emerald-800 font-normal">
                          Seller covers shipping. Boosts views by up to 2x.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Local Pickup toggle */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localPickup}
                      onChange={(e) => setLocalPickup(e.target.checked)}
                      className="rounded text-blue-900"
                    />
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-900" />
                      Allow Free Local Pickup at School / Public Zone
                    </span>
                  </label>
                  {localPickup && (
                    <input
                      type="text"
                      value={pickupNotes}
                      onChange={(e) => setPickupNotes(e.target.value)}
                      placeholder="e.g. Pickup at Main School Office during 8am - 4pm"
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 text-[11px]"
                    />
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg font-black bg-blue-900 hover:bg-blue-800 text-white shadow-md cursor-pointer"
                >
                  Publish Classroom Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
