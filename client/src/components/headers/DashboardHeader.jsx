import { useStore } from '../../store/useStore';
import { MdVisibility, MdVisibilityOff, MdEuro, MdPeople, MdPhoneInTalk } from 'react-icons/md';

export const DashboardHeader = () => {
  const { 
    showTrash, 
    toggleTrash, 
    clients, 
    filterType, 
    setFilterType 
  } = useStore();

  const totalEarnings = (clients || []).reduce((sum, client) => sum + (client.moneyMade || 0), 0);
  const isUnprocessed = filterType === 'unprocessed';

  return (
    <header className="h-[48px] border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between px-6 bg-white dark:bg-[#292a2d] shadow-sm shrink-0">
      {/* Kairioji pusė: Pavadinimas + Atmestų klientų jungiklis */}
      <div className="flex items-center gap-6">
        <h1 className="text-[18px] font-medium text-[#5f6368] dark:text-[#9aa0a6]">
          <span className="text-[#1a73e8] font-bold">Webend</span> Klientų tvarkyklė
        </h1>

        {/* Slėpti/Rodyti atmestus mygtukas – rodomas šalia pavadinimo ir tik prie apdorotų */}
        {!isUnprocessed && (
          <button 
            onClick={toggleTrash} 
            className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] text-[#5f6368] dark:text-[#9aa0a6] text-[13px] transition-colors border border-transparent hover:border-[#dadce0] dark:hover:border-[#5f6368]"
          >
            {showTrash ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
            {showTrash ? "Slėpti atmestus" : "Rodyti atmestus"}
          </button>
        )}
      </div>
      
      {/* Dešinioji pusė: Apdoroti/Neapdoroti toggle + Uždarbis */}
      <div className="flex items-center gap-4">
        {/* Apdorotų / Neapdorotų filtrų jungiklis (Vienodas abiejų stilius) */}
        <div className="flex bg-[#f1f3f4] dark:bg-[#3c4043] p-0.5 rounded border border-[#dadce0] dark:border-[#5f6368] text-[13px]">
          <button 
            onClick={() => setFilterType('processed')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all font-medium ${!isUnprocessed ? "bg-white dark:bg-[#202124] text-[#1a73e8] shadow-sm" : "text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed]"}`}
          >
            <MdPeople size={16} /> Apdoroti
          </button>
          <button 
            onClick={() => setFilterType('unprocessed')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all font-medium ${isUnprocessed ? "bg-white dark:bg-[#202124] text-[#1a73e8] shadow-sm" : "text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed]"}`}
          >
            <MdPhoneInTalk size={14} /> Neapdoroti
          </button>
        </div>

        {/* Uždarbis */}
        <div className="flex items-center gap-1.5 text-[13px] font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-200 dark:border-green-800/50">
          <MdEuro size={14} />
          <span>{totalEarnings.toLocaleString()}</span>
        </div>
      </div>
    </header>
  );
};