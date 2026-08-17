import React, { useState } from 'react';
import { ScanLine, X } from 'lucide-react';
import { ProductCondition } from '../types';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (itemData: {
    title: string;
    description: string;
    categoryId: string;
    gradeLevel: string[];
    condition: ProductCondition;
    price: number;
    originalPrice: number;
    isbn?: string;
  }) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete,
}) => {
  const [isbnInput, setIsbnInput] = useState('9780545162074');
  const [isScanning, setIsScanning] = useState(false);
  const [detectedBook, setDetectedBook] = useState<{
    title: string;
    author: string;
    grade: string[];
    originalPrice: number;
    suggestedPrice: number;
    categoryId: string;
    coverUrl: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleScanSample = (code: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (code.includes('9780545162074')) {
        setDetectedBook({
          title: 'The Great Kapok Tree: A Tale of the Amazon Rain Forest',
          author: 'Lynne Cherry (Voyager Books)',
          grade: ['K-2', '3-5'],
          originalPrice: 18.99,
          suggestedPrice: 6.50,
          categoryId: 'classroom-books',
          coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
        });
      } else {
        setDetectedBook({
          title: 'FOSS Science Magnetism & Electricity Complete Lab Kit',
          author: 'Delta Education & UC Berkeley Lawrence Hall of Science',
          grade: ['3-5', '6-8'],
          originalPrice: 145.0,
          suggestedPrice: 48.0,
          categoryId: 'science-stem',
          coverUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80',
        });
      }
    }, 500);
  };

  const handleApply = () => {
    if (!detectedBook) return;
    onScanComplete({
      title: detectedBook.title,
      description: `Classroom book/kit: ${detectedBook.title} by ${detectedBook.author}. Complete and clean pages with no missing elements. Perfect for guided reading inquiry.`,
      categoryId: detectedBook.categoryId,
      gradeLevel: detectedBook.grade,
      condition: 'Like New',
      price: detectedBook.suggestedPrice,
      originalPrice: detectedBook.originalPrice,
      isbn: isbnInput,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-55 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-900 rounded-xl">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Barcode & ISBN Scanner</h3>
              <p className="text-xs text-slate-500">Scan book ISBNs or supply UPCs for instant autofill</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Simulator Stage */}
        <div className="bg-slate-950 rounded-xl h-48 relative overflow-hidden flex flex-col items-center justify-center text-white border border-slate-800">
          {/* Animated Laser Scanline */}
          <div className="absolute inset-x-8 top-1/2 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
          <div className="w-48 h-24 border-2 border-white/40 rounded-lg flex items-center justify-center text-slate-400 text-xs">
            <ScanLine className="w-6 h-6 text-red-400 animate-bounce" />
          </div>
          <span className="text-[10px] text-slate-400 mt-2">Center ISBN or Barcode in frame</span>
        </div>

        {/* Quick Sample Barcodes */}
        <div className="space-y-1.5 text-xs">
          <span className="font-bold text-slate-700 block">Quick Scan Samples:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setIsbnInput('9780545162074');
                handleScanSample('9780545162074');
              }}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-[11px] font-semibold text-slate-800 cursor-pointer"
            >
              📖 ISBN: 9780545162074 (Kapok Tree)
            </button>
            <button
              type="button"
              onClick={() => {
                setIsbnInput('084329104821');
                handleScanSample('084329104821');
              }}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-[11px] font-semibold text-slate-800 cursor-pointer"
            >
              🔬 UPC: 084329104821 (FOSS Science)
            </button>
          </div>
        </div>

        {/* Detected Product Card */}
        {detectedBook && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <img
                src={detectedBook.coverUrl}
                alt={detectedBook.title}
                className="w-12 h-14 object-cover rounded-lg border border-slate-200"
              />
              <div>
                <span className="text-[10px] text-emerald-800 font-extrabold uppercase">
                  Item Recognized!
                </span>
                <h4 className="font-extrabold text-slate-900 line-clamp-1">{detectedBook.title}</h4>
                <p className="text-[11px] text-slate-600">{detectedBook.author}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-black text-blue-950">${detectedBook.suggestedPrice.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400 line-through">
                    ${detectedBook.originalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApply}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-xs shadow-xs"
            >
              Apply Scanned Data to Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
