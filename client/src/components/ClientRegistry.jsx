import { useState } from 'react';
import { useStore } from '../store/useStore';
import { MdSearch, MdClose, MdPeople, MdInfoOutline, MdEuro, MdMiscellaneousServices, MdNotes } from 'react-icons/md';
import { ConfirmModal } from './ConfirmModal';
import { TagBadge } from './TagBadge';

const ClientDetailModal = ({ client, onClose }) => {
  if (!client) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#292a2d] w-full max-w-md rounded-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-[16px] font-semibold text-[#202124] dark:text-[#e8eaed]">{client.name}</h3>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <TagBadge tag={client.tag} />
          </div>
          <div className="flex items-center gap-3">
            <MdMiscellaneousServices className="text-blue-500" />
            <span className="text-[13px]">{client.serviceNeeded || 'Nenurodyta'}</span>
          </div>
          <div className="flex items-center gap-3">
            <MdEuro className="text-green-500" />
            <span className="text-[13px] font-bold">{client.moneyMade?.toLocaleString() || 0} EUR</span>
          </div>
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2 text-[12px] font-semibold text-gray-500"><MdNotes size={14}/> Pastabos:</div>
            <p className="text-[13px] text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-black/20 p-3 rounded whitespace-pre-wrap">{client.notes || 'Nėra pastabų.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ClientRegistry = ({ onSelect }) => {
  const { clients, deleteClient, role } = useStore();
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });
  const [selectedClient, setSelectedClient] = useState(null);

  const registry = [...new Set(clients.map(c => c.name.toUpperCase()))].sort();
  const filtered = registry.filter(name => name.includes(search.toUpperCase()));

  return (
    <>
      <div className="h-full flex flex-col bg-white dark:bg-[#292a2d] rounded-sm">
        <div className="p-6 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded"><MdPeople size={24} className="text-[#1a73e8]" /></div>
          <h2 className="text-[16px] font-medium text-[#202124] dark:text-[#e8eaed]">Klientų registras</h2>
        </div>

        <div className="p-4 border-b border-[#dadce0] dark:border-[#3c4043] bg-[#f8f9fa]/50 dark:bg-[#202124]/30">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5f6368]" size={18} />
            <input 
              type="text" 
              placeholder="Ieškoti registre..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-9 pr-3 py-1.5 text-[13px] rounded border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] focus:border-[#1a73e8] focus:outline-none transition-colors" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <ul className="divide-y divide-[#dadce0] dark:divide-[#3c4043]">
            {filtered.length > 0 ? (
              filtered.map(name => (
                <li 
                  key={name} 
                  onClick={() => {
                    const found = clients.find(c => c.name.toUpperCase() === name);
                    setSelectedClient(found);
                  }} 
                  className="group flex items-center justify-between px-6 py-3 hover:bg-[#f8f9fa] dark:hover:bg-[#3c4043]/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <MdInfoOutline className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" size={14}/>
                    <span className="text-[13px] text-[#202124] dark:text-[#e8eaed] truncate font-medium">{name}</span>
                  </div>
                  {role === 'admin' && (
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        const clientToDelete = clients.find(c => c.name.toUpperCase() === name);
                        setDeleteModal({ isOpen: true, id: clientToDelete?.id, name }); 
                      }} 
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <MdClose size={18} />
                    </button>
                  )}
                </li>
              ))
            ) : (
              <div className="p-8 text-center text-[12px] text-gray-400 italic">Įrašų nerasta</div>
            )}
          </ul>
        </div>
      </div>

      <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        title="Pašalinti iš registro?"
        message={
          <>
            Ar tikrai norite pašalinti <span className="font-bold text-[#202124] dark:text-[#e8eaed]">„{deleteModal.name}“</span>? 
            <br/><span className="text-blue-600 text-[12px]">Dėmesio: bus ištrinta kliento kortelė ir visi jos duomenys.</span>
          </>
        }
        onConfirm={async () => { 
          if (deleteModal.id) await deleteClient(deleteModal.id); 
          setDeleteModal({ isOpen: false, id: null, name: '' }); 
        }}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, name: '' })}
      />
    </>
  );
};