import React from 'react';

interface SheetSelectorProps {
  sheetNames: string[];
  selectedSheet: string | null;
  onSheetSelect: (sheetName: string) => void;
}

export const SheetSelector: React.FC<SheetSelectorProps> = ({ sheetNames, selectedSheet, onSheetSelect }) => {
  // Don't render the selector if there's only one sheet or none
  if (sheetNames.length <= 1) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-md font-semibold text-slate-300 mb-3">Sayfa Seçin:</h3>
      <div className="flex flex-wrap gap-2">
        {sheetNames.map((name) => (
          <button
            key={name}
            onClick={() => onSheetSelect(name)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800
                        ${selectedSheet === name 
                          ? 'bg-cyan-500 text-white shadow-md' 
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-cyan-500'}`}
            aria-pressed={selectedSheet === name}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};