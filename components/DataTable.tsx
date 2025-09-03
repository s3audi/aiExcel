import React from 'react';
import { TableRow } from '../types';

interface DataTableProps {
  headers: string[];
  data: TableRow[];
  onAddProduct?: (row: TableRow) => void;
  isMappingComplete?: boolean;
}

const AddIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);


export const DataTable: React.FC<DataTableProps> = ({ headers, data, onAddProduct, isMappingComplete }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-slate-800 rounded-lg">
        <p className="text-slate-400">Aramanızla eşleşen veri bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-lg bg-slate-800">
      <table className="w-full min-w-[600px] text-sm text-left text-slate-300">
        <thead className="text-xs text-slate-200 uppercase bg-slate-700/50 sticky top-0">
          <tr>
            {onAddProduct && (
                <th scope="col" className="px-4 py-3 text-center">Ekle</th>
            )}
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3 whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-200">
              {onAddProduct && (
                <td className="px-4 py-2 text-center">
                    <button 
                        onClick={() => onAddProduct(row)}
                        disabled={!isMappingComplete}
                        className={`p-2 rounded-full transition-colors duration-200
                            ${isMappingComplete 
                                ? 'text-green-400 bg-green-900/50 hover:bg-green-800/70' 
                                : 'text-slate-500 bg-slate-700 cursor-not-allowed'}`}
                        aria-label="Ürünü listeye ekle"
                        title={isMappingComplete ? "Ürünü listeye ekle" : "Lütfen önce kolonları eşleştirin"}
                    >
                        <AddIcon className="w-5 h-5" />
                    </button>
                </td>
              )}
              {headers.map((header) => (
                <td key={`${header}-${rowIndex}`} className="px-6 py-4 whitespace-nowrap">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
