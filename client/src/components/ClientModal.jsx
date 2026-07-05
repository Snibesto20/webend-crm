import React, { useRef, useEffect, useState } from 'react';
import { MdList } from 'react-icons/md';
import { ClientCard } from './ClientCard';
import { StatusMessage } from './StatusMessage';
import { ComponentHeader } from './headers/ComponentHeader';

export const ClientModal = ({ client, onClose, onSave }) => {
  const [modalStatus, setModalStatus] = useState({ type: '', msg: '' });
  const [isActionDone, setIsActionDone] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (!isActionDone) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isActionDone, onClose]);

  if (isActionDone) {
    return (
      <>
        {modalStatus.msg && (
          <StatusMessage 
            type={modalStatus.type} 
            msg={modalStatus.msg} 
            onClose={() => { 
              setModalStatus({ type: '', msg: '' }); 
              onClose(); 
              setIsActionDone(false); 
            }} 
          />
        )}
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] overflow-hidden">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-[#292a2d] w-full max-w-lg rounded border border-[#dadce0] dark:border-[#3c4043] shadow-xl overflow-hidden flex flex-col"
      >
        <ComponentHeader 
          title="Kliento informacija" 
          icon={MdList} 
          onClose={onClose} 
        />
        
        <div className="p-5 overflow-y-auto max-h-[80vh] bg-[#f8f9fa]/30 dark:bg-[#202124]/10">
          <ClientCard 
            client={client} 
            onSave={onSave} 
            onDeleteSuccess={(msg) => { setModalStatus({ type: 'success', msg }); setIsActionDone(true); }} 
            onSaveSuccess={(msg) => { setModalStatus({ type: 'success', msg }); setIsActionDone(true); }} 
            forceNonGhost={true}
          />
        </div>
      </div>
    </div>
  );
};