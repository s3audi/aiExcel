import React, { useState } from 'react';
import { Link } from '../types';

interface LinkManagerProps {
  links: Link[];
  onAddLink: (name: string, url: string) => void;
  onEditLink: (index: number, updatedLink: Link) => void;
  onDeleteLink: (index: number) => void;
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);


export const LinkManager: React.FC<LinkManagerProps> = ({ links, onAddLink, onEditLink, onDeleteLink }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editError, setEditError] = useState('');

  const handleAddClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      setError('İsim ve URL alanları boş bırakılamaz.');
      return;
    }
    try {
      new URL(url); // Validate URL format
    } catch (_) {
      setError('Lütfen geçerli bir URL girin (örn: https://www.google.com).');
      return;
    }

    onAddLink(name, url);
    setName('');
    setUrl('');
    setError('');
  };

  const handleEditClick = (index: number, link: Link) => {
    setEditingIndex(index);
    setEditName(link.name);
    setEditUrl(link.url);
    setEditError('');
  };

  const handleCancelClick = () => {
    setEditingIndex(null);
    setEditName('');
    setEditUrl('');
    setEditError('');
  };

  const handleSaveClick = (index: number) => {
    if (!editName.trim() || !editUrl.trim()) {
      setEditError('İsim ve URL alanları boş bırakılamaz.');
      return;
    }
     try {
      new URL(editUrl);
    } catch (_) {
      setEditError('Lütfen geçerli bir URL girin.');
      return;
    }
    onEditLink(index, { name: editName, url: editUrl });
    handleCancelClick();
  };


  return (
    <div className="mt-12 bg-slate-800/50 p-6 rounded-xl shadow-2xl border border-slate-700">
      <h2 className="text-2xl font-bold text-slate-200 mb-4">Bağlantıları Yönet</h2>
      
      {/* Add Link Form */}
      <form onSubmit={handleAddClick} className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Bağlantı Adı (örn: Google)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-grow pl-4 pr-4 py-2 text-slate-200 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          aria-label="Bağlantı Adı"
        />
        <input
          type="text"
          placeholder="URL (örn: https://www.google.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow pl-4 pr-4 py-2 text-slate-200 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          aria-label="Bağlantı URL'i"
        />
        <button type="submit" className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors">
          Ekle
        </button>
      </form>

      {error && <p className="text-red-400 text-sm mb-4" role="alert">{error}</p>}

      {/* Links List */}
      <div className="space-y-3">
        {links.length > 0 ? (
          links.map((link, index) => (
            <div key={index} className="p-3 bg-slate-700/50 rounded-md">
                {editingIndex === index ? (
                    // Edit View
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full pl-3 pr-3 py-1.5 text-slate-200 bg-slate-600 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            aria-label="Bağlantı adını düzenle"
                        />
                         <input
                            type="text"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            className="w-full pl-3 pr-3 py-1.5 text-slate-200 bg-slate-600 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            aria-label="Bağlantı URL'sini düzenle"
                        />
                        {editError && <p className="text-red-400 text-xs" role="alert">{editError}</p>}
                        <div className="flex items-center justify-end gap-2 mt-1">
                            <button onClick={handleCancelClick} className="p-2 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-600 transition-colors" aria-label="İptal et">
                                <XIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleSaveClick(index)} className="p-2 text-green-400 hover:text-green-300 rounded-full hover:bg-slate-600 transition-colors" aria-label="Kaydet">
                                <CheckIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    // Display View
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-slate-200">{link.name}</p>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline break-all">
                            {link.url}
                            </a>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handleEditClick(index, link)}
                                aria-label={`${link.name} bağlantısını düzenle`}
                                className="p-2 text-slate-400 hover:text-cyan-400 rounded-full hover:bg-slate-600 transition-colors"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => onDeleteLink(index)}
                                aria-label={`${link.name} bağlantısını sil`}
                                className="p-2 text-slate-400 hover:text-red-400 rounded-full hover:bg-slate-600 transition-colors"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-center py-4">Henüz hiç bağlantı eklenmedi.</p>
        )}
      </div>
    </div>
  );
};