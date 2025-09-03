import React from 'react';
import { ColumnMapping, Product } from '../types';

interface ColumnMapperProps {
  headers: string[];
  mapping: ColumnMapping;
  onMappingChange: (newMapping: ColumnMapping) => void;
}

const productFieldLabels: Record<keyof Omit<Product, 'cost' | 'isFavorite'>, string> = {
  barcode: 'Barkod',
  description: 'Ürün Açıklaması',
  price: 'Fiyat',
  commission: 'Komisyon',
  productUrl: 'Ürün Linki',
  photo1: 'Fotoğraf 1 (Ana)',
  photo2: 'Fotoğraf 2',
  photo3: 'Fotoğraf 3',
  data1: 'Özel Veri 1',
  data2: 'Özel Veri 2',
  data3: 'Özel Veri 3',
};

export const ColumnMapper: React.FC<ColumnMapperProps> = ({ headers, mapping, onMappingChange }) => {
  const handleSelectChange = (field: keyof Omit<Product, 'cost' | 'isFavorite'>, selectedHeader: string) => {
    const newMapping = { ...mapping };
    for (const key in newMapping) {
        if (newMapping[key as keyof Omit<Product, 'cost' | 'isFavorite'>] === selectedHeader) {
            newMapping[key as keyof Omit<Product, 'cost' | 'isFavorite'>] = null;
        }
    }
    newMapping[field] = selectedHeader === '' ? null : selectedHeader;
    onMappingChange(newMapping);
  };
  
  return (
    <div className="mb-8 p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Kolon Eşleştirme</h3>
      <p className="text-sm text-slate-400 mb-4">Lütfen ürün listenize eklemek için Excel dosyanızdaki ilgili kolonları seçin. (Diğer alanlar isteğe bağlıdır)</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(productFieldLabels) as Array<keyof Omit<Product, 'cost' | 'isFavorite'>>).map((field) => (
          <div key={field}>
            <label htmlFor={`select-${field}`} className="block text-sm font-medium text-slate-300 mb-1">
              {productFieldLabels[field]}
            </label>
            <select
              id={`select-${field}`}
              value={mapping[field] || ''}
              onChange={(e) => handleSelectChange(field, e.target.value)}
              className="w-full pl-3 pr-8 py-2 text-slate-200 bg-slate-700 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm"
            >
              <option value="">Kolon Seçiniz...</option>
              {headers.map(header => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};