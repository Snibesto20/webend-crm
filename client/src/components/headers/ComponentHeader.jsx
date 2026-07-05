import React from 'react';
import { MdClose } from 'react-icons/md';

export const ComponentHeader = ({ title, icon: Icon, onClose }) => {
  return (
    <div className="p-6 bg-white dark:bg-[#292a2d] border-b border-[#dadce0] dark:border-[#3c4043] flex justify-between items-center shrink-0 w-full select-none">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <Icon size={24} className="text-[#1a73e8]" />
          </div>
        )}
        <h2 className="text-[16px] font-medium text-[#202124] dark:text-[#e8eaed]">{title}</h2>
      </div>

      {/* Jei perduotas onClose, atvaizduojame integruotą uždarymo mygtuką */}
      {onClose && (
        <button 
          onClick={onClose} 
          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
        >
          <MdClose size={20} />
        </button>
      )}
    </div>
  );
};