import React from 'react';
import { Page } from '../App';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const navItems: { page: Page; label: string }[] = [
    { page: 'products', label: 'Ana Liste' },
    { page: 'favorites', label: 'Favoriler' },
    { page: 'data1', label: 'Veri 1' },
    { page: 'data2', label: 'Veri 2' },
    { page: 'data3', label: 'Veri 3' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const commonButtonClasses = "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 whitespace-nowrap";
  const activeButtonClasses = "bg-cyan-500 text-white shadow-md";
  const inactiveButtonClasses = "bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-cyan-500";
  
  return (
    <nav className="flex space-x-2 bg-slate-800 p-2 rounded-lg overflow-x-auto">
      {navItems.map(item => (
        <button 
          key={item.page}
          onClick={() => setCurrentPage(item.page)}
          className={`${commonButtonClasses} ${currentPage === item.page ? activeButtonClasses : inactiveButtonClasses}`}
          aria-current={currentPage === item.page ? 'page' : undefined}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};
