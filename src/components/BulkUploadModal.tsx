import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, X, Download } from 'lucide-react';
import { Product, User } from '../types';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onBulkImport: (products: Partial<Product>[]) => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onBulkImport,
}) => {
  const [fileSelected, setFileSelected] = useState<string | null>('Classroom_Surplus_Inventory_2026.csv');
  const [parsedCount, setParsedCount] = useState(8);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Mock generated products from bulk sheet
      const newItems: Partial<Product>[] = [
        {
          title: 'Bulk Box: 24x Crayola Washable Watercolor Sets',
          price: 32.0,
          originalPrice: 72.0,
          categoryId: 'art-crafts',
          subcategoryId: 'paint',
          condition: 'Brand New',
          gradeLevel: ['K-2', '3-5'],
        },
        {
          title: 'Classroom Set: 30x Mini Whiteboards & Felt Erasers',
          price: 28.0,
          originalPrice: 65.0,
          categoryId: 'furniture-storage',
          subcategoryId: 'whiteboards',
          condition: 'Like New',
          gradeLevel: ['K-2', '3-5', '6-8'],
        },
      ];

      onBulkImport(newItems);
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-55 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Bulk CSV / Excel Inventory Upload</h3>
              <p className="text-slate-500 text-[11px]">List entire classrooms, retiring libraries, or department inventories</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropzone */}
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2 bg-slate-50">
          <UploadCloud className="w-10 h-10 text-slate-400 mx-auto" />
          <div>
            <p className="font-bold text-slate-800">Drag & drop your inventory spreadsheet (.csv or .xlsx)</p>
            <p className="text-slate-500 text-[11px]">Columns: Title, Category, Grade, Price, Condition, Description</p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold shadow-xs hover:bg-slate-50"
            >
              Browse Local Files
            </button>
          </div>
        </div>

        {fileSelected && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <div>
                <span className="font-bold text-slate-900 block">{fileSelected}</span>
                <span className="text-[10px] text-emerald-700">{parsedCount} Valid Classroom Listings Detected</span>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert('Sample template downloaded!');
            }}
            className="text-blue-900 font-bold flex items-center gap-1 hover:underline"
          >
            <Download className="w-3.5 h-3.5" /> Download CSV Sample Template
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={isProcessing}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black shadow-sm"
            >
              {isProcessing ? 'Publishing Listings...' : `Import & Publish ${parsedCount} Listings`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
