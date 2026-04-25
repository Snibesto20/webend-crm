import React, { useState, useEffect } from 'react';
import { MdCheckCircle, MdError } from 'react-icons/md';

const StatusMessage = ({ msg, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!msg) return;
    
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [msg, onClose]);

  if (!msg || !visible) return null;

  const isSuccess = type === 'success';

  return (
    <div className={`flex items-center gap-2 p-3 rounded text-[13px] border animate-in zoom-in-95 duration-200 ${
      isSuccess 
        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/10 dark:border-green-800/40 dark:text-green-400' 
        : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/10 dark:border-red-800/40 dark:text-red-400'
    }`}>
      {isSuccess ? <MdCheckCircle size={18} /> : <MdError size={18} />}
      <span>{msg}</span>
    </div>
  );
};

export default StatusMessage;