
import React from 'react';

interface FileUploadProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);


export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <label
        htmlFor="file-upload"
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
                    ${isLoading 
                      ? 'border-slate-600 bg-slate-800 cursor-not-allowed' 
                      : 'border-slate-500 bg-slate-700/50 hover:bg-slate-700 hover:border-cyan-400'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadIcon className={`w-10 h-10 mb-3 ${isLoading ? 'text-slate-500' : 'text-slate-400'}`} />
            {isLoading ? (
                 <>
                    <p className="mb-2 text-sm text-slate-400">
                        <span className="font-semibold">Yükleniyor...</span>
                    </p>
                    <p className="text-xs text-slate-500">Lütfen bekleyin</p>
                 </>
            ) : (
                <>
                    <p className="mb-2 text-sm text-slate-400">
                        <span className="font-semibold">Yüklemek için tıklayın</span> veya dosyayı sürükleyip bırakın
                    </p>
                    <p className="text-xs text-slate-500">XLSX, XLS veya CSV</p>
                </>
            )}
        </div>
        <input
          id="file-upload"
          type="file"
          className="sr-only"
          accept=".xlsx, .xls, .csv"
          onChange={onFileSelect}
          disabled={isLoading}
        />
      </label>
    </div>
  );
};
