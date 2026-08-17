import React, { useState } from 'react';
import { Package, Plus, Trash2, X } from 'lucide-react';
import { ProductBundle, User } from '../types';

interface ClassroomBundleBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaveBundle: (bundle: ProductBundle) => void;
}

export const ClassroomBundleBuilderModal: React.FC<ClassroomBundleBuilderModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveBundle,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gradeLevel, setGradeLevel] = useState('3-5');
  const [items, setItems] = useState([
    { id: '1', title: '', quantity: 1, regularPrice: 15 },
    { id: '2', title: '', quantity: 1, regularPrice: 20 },
  ]);
  const [discountPercent, setDiscountPercent] = useState(25);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const originalTotal = items.reduce((acc, curr) => acc + (curr.regularPrice * (curr.quantity || 1)), 0);
  const bundlePrice = Number((originalTotal * (1 - discountPercent / 100)).toFixed(2));

  const handleAddItem = () => {
    setItems((prev) => [...prev, { id: `item-${Date.now()}`, title: '', quantity: 1, regularPrice: 10 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleUpdateItem = (id: string, field: string, value: any) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || items.some((i) => !i.title.trim())) {
      setError('Please fill out bundle title and all item descriptions.');
      return;
    }
    setError(null);

    const newBundle: ProductBundle = {
      id: `bundle-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      sellerId: currentUser.id,
      sellerName: currentUser.name || 'Verified Educator',
      sellerSchool: currentUser.schoolName || 'District School',
      sellerVerified: Boolean(currentUser.verified || currentUser.verifiedTeacher),
      sellerAvatar: currentUser.avatar || currentUser.profilePhoto || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      productIds: items.map((it) => it.id),
      itemTitles: items.map((it) => `${it.title} (${it.quantity}x)`),
      originalPrice: originalTotal,
      bundlePrice,
      discountPercent,
      gradeLevel: [gradeLevel],
      category: 'starter-bundles',
      tags: ['bundle', 'classroom-surplus', gradeLevel],
      images: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80'],
      stock: 1,
      status: 'active',
      createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    };

    onSaveBundle(newBundle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-55 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-900 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Classroom Bundle Builder</h3>
              <p className="text-xs text-slate-500">Bundle multiple items into 1 package for faster sale</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 font-bold rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Bundle Title</label>
            <input
              type="text"
              placeholder="e.g. 1st Grade Reading Corner Starter Bundle (Rugs + 40 Leveled Readers)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description & What is Included</label>
            <textarea
              rows={2}
              placeholder="Detail the condition, grade level, and benefits for the purchasing teacher..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Grade Level</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-white"
              >
                <option value="Pre-K">Pre-K & Kindergarten</option>
                <option value="K-2">1st - 2nd Grade (K-2)</option>
                <option value="3-5">3rd - 5th Grade (3-5)</option>
                <option value="6-8">6th - 8th Grade (6-8)</option>
                <option value="9-12">High School (9-12)</option>
                <option value="All Grades">All Grades</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Bundle Discount (%)</label>
              <input
                type="number"
                min="5"
                max="80"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
              />
            </div>
          </div>

          {/* Itemized list */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Bundle Contents ({items.length})
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-blue-700 hover:text-blue-900 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Supply Item
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="Supply name (e.g. 10x Plastic Book Bins)"
                    value={it.title}
                    onChange={(e) => handleUpdateItem(it.id, 'title', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-xs"
                    required
                  />
                  <div className="w-16">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={it.quantity}
                      onChange={(e) => handleUpdateItem(it.id, 'quantity', Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-xs text-center"
                      title="Quantity"
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="Price"
                      value={it.regularPrice}
                      onChange={(e) => handleUpdateItem(it.id, 'regularPrice', Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-xs"
                      title="Regular Item Value"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(it.id)}
                    className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing summary */}
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block">Original Individual Total: ${originalTotal.toFixed(2)}</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black text-blue-950">${bundlePrice.toFixed(2)}</span>
                <span className="text-[10px] font-bold text-emerald-700">({discountPercent}% OFF bundle price)</span>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-1 rounded-md">
              Save ${(originalTotal - bundlePrice).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-black bg-blue-900 hover:bg-blue-800 text-white shadow-sm"
            >
              Publish Bundle Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
