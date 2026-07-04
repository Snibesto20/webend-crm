import React from 'react';
import { MdClose, MdList } from 'react-icons/md';
import { ClientCard } from './ClientCard';

export const ClientModal = ({ client, onClose, onSave }) => {
  if (!client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#292a2d] w-full max-w-lg rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700">
        <div className="p-6 bg-white dark:bg-[#292a2d] border-b border-[#dadce0] dark:border-[#3c4043] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <MdList size={24} className="text-[#1a73e8]" />
            </div>
            <h2 className="text-[16px] font-medium text-[#202124] dark:text-[#e8eaed]">Kliento informacija</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
            <MdClose size={20} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto custom-scrollbar max-h-[80vh] bg-[#f8f9fa]/30 dark:bg-[#202124]/10">
          <ClientCard client={client} onSave={onSave} />
        </div>
      </div>
    </div>
  );
};