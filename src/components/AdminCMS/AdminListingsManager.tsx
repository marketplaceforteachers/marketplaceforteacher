import React, { useState } from 'react';
import {
  Tag,
  Star,
  Trash2,
  Eye,
  ShieldAlert,
  CheckCircle,
  Search,
  AlertTriangle,
} from 'lucide-react';
import { Product } from '../../types';

interface AdminListingsManagerProps {
  products: Product[];
  onToggleFeatured: (productId: string) => void;
  onDeleteListing: (productId: string) => void;
  onSelectProduct: (p: Product) => void;
}

export const AdminListingsManager: React.FC<AdminListingsManagerProps> = ({
  products = [],
  onToggleFeatured,
  onDeleteListing,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredProducts = (products || []).filter((p) => {
    const title = p?.title || '';
    const sellerSchool = p?.sellerSchool || '';
    const matchSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sellerSchool.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !categoryFilter || p?.categoryId === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Classroom Catalog Moderation</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Feature quality teacher listings, inspect flagged items, and manage active supplies.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>{products.filter((p) => p.featured).length} Featured</span>
          </span>
          <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-md">
            {products.length} Active Items
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search listing title or teacher school..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:border-blue-600 font-medium"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="p-3.5">Listing Title</th>
                <th className="p-3.5">Teacher / School</th>
                <th className="p-3.5">Condition</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Featured</th>
                <th className="p-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
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

                  <td className="p-3.5 text-slate-700">
                    <p className="font-medium text-slate-900">{p.sellerName}</p>
                    <p className="text-[11px] text-slate-500">{p.sellerSchool}</p>
                  </td>

                  <td className="p-3.5">
                    <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {p.condition}
                    </span>
                  </td>

                  <td className="p-3.5 font-extrabold text-blue-900 text-sm">
                    ${p.price.toFixed(2)}
                  </td>

                  <td className="p-3.5 text-slate-700">{p.stock}</td>

                  <td className="p-3.5">
                    <button
                      onClick={() => onToggleFeatured(p.id)}
                      className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                        p.featured
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                      title={p.featured ? 'Remove from featured' : 'Feature on homepage'}
                    >
                      <Star className={`w-3.5 h-3.5 ${p.featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>{p.featured ? 'Featured' : 'Standard'}</span>
                    </button>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectProduct(p)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="View listing detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteListing(p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete listing"
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
      </div>
    </div>
  );
};
