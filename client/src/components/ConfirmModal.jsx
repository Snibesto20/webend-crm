import React, { useRef, useEffect } from 'react';
import { MdWarning } from 'react-icons/md';
import { ComponentHeader } from './headers/ComponentHeader';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] overflow-hidden">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-[#292a2d] w-full max-w-md rounded border border-[#dadce0] dark:border-[#3c4043] shadow-2xl flex flex-col overflow-hidden relative"
      >
        <div className="bg-white dark:bg-[#292a2d] relative z-10">
          <ComponentHeader 
            title={title} 
            icon={MdWarning} 
            onClose={onCancel} 
          />
        </div>
        
        <div className="p-6 flex flex-col bg-white dark:bg-[#292a2d] relative z-10">
          <p className="text-[13px] text-[#5f6368] dark:text-[#9aa0a6] mb-6 leading-relaxed">{message}</p>
          
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onCancel} 
              className="px-4 h-[38px] rounded text-[13px] font-medium text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-colors"
            >
              Atšaukti
            </button>
            <button 
              type="button" 
              onClick={onConfirm} 
              className="px-4 h-[38px] btn-blue"
            >
              Priimti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};