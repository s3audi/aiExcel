import React, { useRef, useState, useMemo } from 'react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  listTitle: string;
  onDeleteProduct: (barcode: string) => void;
  onUpdateProductCost: (barcode: string, cost: number) => void;
  onToggleFavorite: (barcode: string) => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
}

const StarIcon: React.FC<React.SVGProps<SVGSVGElement> & { isFavorite: boolean }> = ({ isFavorite, ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2.882l2.34 6.887h7.243l-5.86 4.254 2.34 6.887L10 16.657l-5.86 4.253 2.34-6.887-5.86-4.254h7.243L10 2.882z" clipRule="evenodd" />
    </svg>
);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const ExportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>);
const ImportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>);
const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);


export const ProductList: React.FC<ProductListProps> = ({ products, listTitle, onDeleteProduct, onUpdateProductCost, onToggleFavorite, onImport, onExport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const handleImportClick = () => fileInputRef.current?.click();

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const lowercasedFilter = searchTerm.toLowerCase();
    return products.filter(product =>
      product.barcode.toLowerCase().includes(lowercasedFilter) ||
      product.description.toLowerCase().includes(lowercasedFilter)
    );
  }, [products, searchTerm]);

  const placeholderImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='1.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm1.5-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z' /%3E%3C/svg%3E`;

  if (products.length === 0) {
    return (
      <main className="bg-slate-800/50 p-6 rounded-xl shadow-2xl border border-slate-700">
          <div className="text-center py-10 px-4">
              <h3 className="text-lg font-semibold text-slate-300">{listTitle} Boş</h3>
              <p className="text-slate-400 mt-1">Bu listeye ürün eklemek için yukarıdaki Excel yükleyicisini kullanabilir veya mevcut bir yedeği içe aktarabilirsiniz.</p>
              <input type="file" ref={fileInputRef} onChange={onImport} className="hidden" accept=".json" />
              <button onClick={handleImportClick} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700">
                  <ImportIcon className="w-5 h-5" /> Veri İçe Aktar (JSON)
              </button>
          </div>
      </main>
    );
  }
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);

  return (
    <main className="bg-slate-800/50 p-6 rounded-xl shadow-2xl border border-slate-700">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-200 whitespace-nowrap">{listTitle} ({filteredProducts.length})</h2>
            <div className="flex items-center gap-2 flex-shrink-0">
                <input type="file" ref={fileInputRef} onChange={onImport} className="hidden" accept=".json" />
                <button onClick={handleImportClick} className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-slate-700 text-slate-200 font-semibold rounded-md hover:bg-slate-600">
                    <ImportIcon className="w-5 h-5" /> Veri İçe Aktar
                </button>
                <button onClick={onExport} className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700">
                    <ExportIcon className="w-5 h-5" /> Veri Dışa Aktar
                </button>
            </div>
        </div>
        <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon className="w-5 h-5 text-slate-500" /></span>
            <input type="text" placeholder="Barkod veya açıklamaya göre ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 text-slate-200 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-lg bg-slate-800">
          {filteredProducts.length > 0 ? (
            <table className="w-full min-w-[1800px] text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-200 uppercase bg-slate-700/50">
                    <tr>
                        <th scope="col" className="px-2 py-3 text-center">Favori</th>
                        <th scope="col" className="px-4 py-3">Fotoğraf</th>
                        <th scope="col" className="px-6 py-3">Barkod</th>
                        <th scope="col" className="px-6 py-3">Açıklama</th>
                        <th scope="col" className="px-6 py-3 text-right">Fiyat</th>
                        <th scope="col" className="px-6 py-3 text-right">Komisyon (%)</th>
                        <th scope="col" className="px-6 py-3 text-right">Maliyet</th>
                        <th scope="col" className="px-6 py-3 text-right">Kar</th>
                        <th scope="col" className="px-6 py-3">Özel Veri 1</th>
                        <th scope="col" className="px-6 py-3">Özel Veri 2</th>
                        <th scope="col" className="px-6 py-3">Özel Veri 3</th>
                        <th scope="col" className="px-6 py-3 text-center">İşlem</th>
                    </tr>
                </thead>
                <tbody>
                {filteredProducts.map((product) => {
                    const profit = product.price - (product.price * (product.commission / 100)) - product.cost;
                    const profitColor = profit >= 0 ? 'text-green-400' : 'text-red-400';
                    const imageElement = (<img src={product.photo1 || placeholderImage} alt={product.description} className="h-24 w-24 object-cover rounded-md bg-slate-700" onError={(e) => { e.currentTarget.src = placeholderImage; }} />);
                    return (
                      <tr key={product.barcode} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="px-2 py-4 text-center align-middle">
                            <button onClick={() => onToggleFavorite(product.barcode)} className={`p-2 rounded-full transition-colors ${product.isFavorite ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-500'}`} title="Favorilere ekle/kaldır">
                                <StarIcon className="w-5 h-5" isFavorite={product.isFavorite} />
                            </button>
                        </td>
                        <td className="px-4 py-2 align-middle">
                          {product.productUrl ? (<a href={product.productUrl} target="_blank" rel="noopener noreferrer" title="Ürün linkini aç">{imageElement}</a>) : (imageElement)}
                        </td>
                        <td className="px-6 py-4 font-mono text-cyan-400 align-middle">{product.barcode}</td>
                        <td className="px-6 py-4 align-middle">{product.description}</td>
                        <td className="px-6 py-4 text-right align-middle">{formatCurrency(product.price)}</td>
                        <td className="px-6 py-4 text-right align-middle">{product.commission} %</td>
                        <td className="px-6 py-4 text-right align-middle">
                            <input type="number" value={product.cost} onChange={(e) => onUpdateProductCost(product.barcode, parseFloat(e.target.value))} onFocus={(e) => e.target.select()} className="w-24 bg-slate-700 border border-slate-600 rounded-md p-1 text-right focus:outline-none focus:ring-2 focus:ring-cyan-500" step="0.01" />
                        </td>
                        <td className={`px-6 py-4 text-right font-semibold align-middle ${profitColor}`}>{formatCurrency(profit)}</td>
                        <td className="px-6 py-4 align-middle">{product.data1}</td>
                        <td className="px-6 py-4 align-middle">{product.data2}</td>
                        <td className="px-6 py-4 align-middle">{product.data3}</td>
                        <td className="px-6 py-4 text-center align-middle">
                            <button onClick={() => onDeleteProduct(product.barcode)} className="p-2 text-slate-400 hover:text-red-400 rounded-full hover:bg-slate-600">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </td>
                      </tr>
                    );
                })}
                </tbody>
            </table>
          ) : ( <div className="text-center py-10 px-4"><p className="text-slate-400 mt-1">Aramanızla eşleşen ürün bulunamadı.</p></div> )}
      </div>
    </main>
  );
};