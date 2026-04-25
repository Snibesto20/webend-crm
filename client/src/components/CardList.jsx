import { useMemo } from 'react';
import { useStore, TAG_PRIORITY } from '../store/useStore';
import { ClientCard } from './ClientCard';
import { MdViewModule } from 'react-icons/md';

export const CardList = () => {
  const clients = useStore((state) => state.clients);
  const showTrash = useStore((state) => state.showTrash);

  const sortedClients = useMemo(() => {
    return [...clients]
      .filter(c => showTrash ? true : !['disapproved', 'Archived Client'].includes(c.tag))
      .sort((a, b) => TAG_PRIORITY[b.tag] - TAG_PRIORITY[a.tag]);
  }, [clients, showTrash]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <MdViewModule size={24} className="text-[#1a73e8]" />
          </div>
          <h2 className="text-[16px] font-medium text-[#202124] dark:text-[#e8eaed]">Klientų sąrašas</h2>
        </div>
        <span className="text-[12px] bg-[#f1f3f4] dark:bg-[#3c4043] text-[#5f6368] dark:text-[#9aa0a6] px-2.5 py-0.5 rounded-full font-medium">
          {sortedClients.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {sortedClients.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#5f6368] dark:text-[#9aa0a6] text-sm italic">
            Nėra rodomų klientų kortelių.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 auto-rows-max">
            {sortedClients.map(client => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};