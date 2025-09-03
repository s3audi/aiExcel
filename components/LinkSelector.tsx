import React from 'react';
import { Link } from '../types';

interface LinkSelectorProps {
  links: Link[];
}

export const LinkSelector: React.FC<LinkSelectorProps> = ({ links }) => {
  const handleLinkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const url = event.target.value;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      event.target.value = ''; // Reset dropdown after selection
    }
  };

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="max-w-xs ml-auto">
      <select
        onChange={handleLinkChange}
        className="w-full px-4 py-2 text-slate-200 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
        defaultValue=""
        aria-label="Hızlı Bağlantılar"
      >
        <option value="" disabled>Hızlı Bağlantılar...</option>
        {links.map((link, index) => (
          <option key={index} value={link.url}>
            {link.name}
          </option>
        ))}
      </select>
    </div>
  );
};
