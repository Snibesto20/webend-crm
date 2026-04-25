export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#292a2d] w-full max-w-md p-6 rounded-lg shadow-2xl border border-[#dadce0] dark:border-[#3c4043] animate-in zoom-in-95 duration-200">
        <h3 className="text-[16px] font-bold text-[#202124] dark:text-[#e8eaed] mb-2">{title}</h3>
        <p className="text-[13px] text-[#5f6368] dark:text-[#9aa0a6] mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel} 
            className="px-4 py-2 rounded text-[13px] font-medium text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-colors"
          >
            Atšaukti
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 rounded text-[13px] font-bold text-white bg-[#1a73e8] hover:bg-[#1557b0] transition-colors shadow-sm"
          >
            Priimti
          </button>
        </div>
      </div>
    </div>
  );
};