

import React from 'react';

interface FilterControlsProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  recordCount: number;
  onExport: () => void;
  onAddAll: () => void;
  isDataLoaded: boolean;
  isMappingComplete: boolean;
}

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const ExportIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const AddAllIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" />
    </svg>
);


export const FilterControls: React.FC<FilterControlsProps> = ({ searchTerm, onSearchChange, recordCount, onExport, onAddAll, isDataLoaded, isMappingComplete }) => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
      <div className="relative w-full md:w-auto flex-grow">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="w-5 h-5 text-slate-500" />
        </span>
        <input
          type="text"
          placeholder="Tabloda ara..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full pl-10 pr-4 py-2 text-slate-200 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
        />
      </div>
       <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
         <div className="text-sm text-slate-400 whitespace-nowrap">
          <span className="font-semibold text-slate-200">{recordCount}</span> kayıt gösteriliyor
        </div>
        {isDataLoaded && (
            <>
            <button
                onClick={onAddAll}
                disabled={recordCount === 0 || !isMappingComplete}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-70"
                aria-label="Filtrelenen tüm ürünleri listeye ekle"
                title={!isMappingComplete ? "Önce kolonları eşleştirin" : "Filtrelenmiş tüm ürünleri listeye ekle"}
            >
                <AddAllIcon className="w-5 h-5" />
                <span>Listeye Ekle</span>
            </button>
            <button
                onClick={onExport}
                disabled={recordCount === 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-70"
                aria-label="Filtrelenmiş verileri dışa aktar"
                title={recordCount > 0 ? "Filtrelenmiş verileri Excel dosyası olarak indir" : "Dışa aktarılacak veri yok"}
            >
                <ExportIcon className="w-5 h-5" />
                <span>Dışa Aktar</span>
            </button>
            </>
        )}
      </div>
    </div>
  );
};