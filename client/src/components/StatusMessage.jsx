import React, { useState, useEffect } from 'react';
import { MdCheckCircle, MdError, MdClose } from 'react-icons/md';

const StatusMessage = ({ msg, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!msg) return;
    
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [msg, onClose]);

  if (!msg || !visible) return null;

  const isSuccess = type === 'success';

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 p-3.5 rounded-lg text-[13px] border shadow-lg max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300 ${isSuccess ? 'bg-green-50 text-green-800 border-green-200 dark:bg-[#1c3d27] dark:border-green-800/60 dark:text-green-300' : 'bg-red-50 text-red-800 border-red-200 dark:bg-[#3d1c1c] dark:border-red-800/60 dark:text-red-300'}`}>
      <div className="flex items-center gap-2 flex-1">
        {isSuccess ? <MdCheckCircle size={18} className="text-green-600 dark:text-green-400 shrink-0" /> : <MdError size={18} className="text-red-600 dark:text-red-400 shrink-0" />}
        <span className="font-medium leading-relaxed">{msg}</span>
      </div>
      <button onClick={() => { setVisible(false); if (onClose) onClose(); }} className={`p-1 rounded transition-colors shrink-0 ${isSuccess ? 'hover:bg-green-200/50 text-green-600 dark:hover:bg-green-800/30 dark:text-green-400' : 'hover:bg-red-200/50 text-red-600 dark:hover:bg-red-800/30 dark:text-red-400'}`}>
        <MdClose size={16} />
      </button>
    </div>
  );
};

export default StatusMessage;