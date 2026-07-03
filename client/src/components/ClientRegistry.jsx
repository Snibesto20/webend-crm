import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { MdSearch, MdPeople, MdDelete, MdClose } from 'react-icons/md';
import { ConfirmModal } from './ConfirmModal';
import { ClientCard } from './ClientCard';

export const ClientRegistry = ({ onSelect }) => {
  const clients = useStore((state) => state.clients);
  const deleteClient = useStore((state) => state.deleteClient);
  const updateClient = useStore((state) => state.updateClient);
  const user = useStore((state) => state.user);
  
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });
  const [selectedClient, setSelectedClient] = useState(null);

  const role = user?.role;
  const searchQuery = search.toUpperCase().trim();

  const filteredClients = (clients || []).filter(client => {
    const matchName = client.name?.toUpperCase().includes(searchQuery);
    const matchContacts = client.contacts?.some(contact => 
      contact?.toUpperCase().includes(searchQuery)
    );
    return matchName || matchContacts;
  });

  const filteredNames = [...new Set(filteredClients.map(c => c.name.toUpperCase()))].sort();

  useEffect(() => {
    if (selectedClient) {
      const currentId = selectedClient._id || selectedClient.id;
      const freshData = clients.find(c => (c._id || c.id) === currentId);
      if (freshData) {
        setSelectedClient(freshData);
      }
    }
  }, [clients, selectedClient]);

  const handleSaveClient = async (updatedData) => {
    if (updateClient && selectedClient) {
      const clientId = selectedClient._id || selectedClient.id;
      await updateClient(clientId, updatedData);
      
      setSelectedClient(prevState => ({
        ...prevState,
        ...updatedData
      }));
    }
  };

  return (
    <>
      <div className="h-full flex flex-col bg-white dark:bg-[#292a2d] rounded shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center gap-3 shrink-0">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <MdPeople size={24} className="text-[#1a73e8]" />
          </div>
          <h2 className="text-[16px] font-medium text-[#202124] dark:text-[#e8eaed]">Klientų registras</h2>
        </div>
        <div className="p-4 border-b border-[#dadce0] dark:border-[#3c4043] bg-[#f8f9fa]/50 dark:bg-[#202124]/30 shrink-0">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5f6368]" size={18} />
            <input type="text" placeholder="Ieškoti pagal pavadinimą arba kontaktą..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-[13px] rounded border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] focus:border-[#1a73e8] focus:outline-none transition-colors" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <ul className="divide-y divide-[#dadce0] dark:divide-[#3c4043]">
            {filteredNames.length > 0 ? (
              filteredNames.map(name => {
                const found = clients.find(c => c.name.toUpperCase() === name);

                return (
                  <li key={name} onClick={() => { if (onSelect) { onSelect(found); } else { setSelectedClient(found); } }} className="group flex items-center justify-between px-6 py-3 hover:bg-[#f8f9fa] dark:hover:bg-[#3c4043]/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 min-w-0 pr-4">
                      <span className="text-[13px] text-[#202124] dark:text-[#e8eaed] truncate font-medium">{name}</span>
                    </div>
                    {role === 'admin' && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setDeleteModal({ isOpen: true, id: found?._id || found?.id, name }); 
                        }} 
                        className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-[#1a73e8] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all opacity-0 group-hover:opacity-100 shrink-0 inline-flex items-center justify-center"
                      >
                        <MdDelete size={18} />
                      </button>
                    )}
                  </li>
                );
              })
            ) : (
              <div className="p-8 text-center text-[12px] text-gray-400 italic">Įrašų nerasta</div>
            )}
          </ul>
        </div>
      </div>
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#292a2d] w-full max-w-lg rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700">
            <div className="p-6 bg-white dark:bg-[#292a2d] border-b border-[#dadce0] dark:border-[#3c4043] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <MdPeople size={24} className="text-[#1a73e8]" />
                </div>
                <h2 className="text-[16px] font-medium text-[#202124] dark:text-[#e8eaed]">Kliento informacija</h2>
              </div>
              <button onClick={() => setSelectedClient(null)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                <MdClose size={20} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto custom-scrollbar max-h-[80vh] bg-[#f8f9fa]/30 dark:bg-[#202124]/10">
              <ClientCard client={selectedClient} onSave={handleSaveClient} />
            </div>
          </div>
        </div>
      )}
      <ConfirmModal isOpen={deleteModal.isOpen} title="Pašalinti iš registro?" message={<>Ar tikrai norite pašalinti <span className="font-bold text-[#202124] dark:text-[#e8eaed]">„{deleteModal.name}“</span>? <br /><span className="text-blue-600 text-[12px] font-medium">Dėmesio: bus ištrinta kliento kortelė ir visi jos duomenys.</span></>} onConfirm={async () => { if (deleteModal.id) { await deleteClient(deleteModal.id); if (selectedClient?._id === deleteModal.id || selectedClient?.id === deleteModal.id) setSelectedClient(null); } setDeleteModal({ isOpen: false, id: null, name: '' }); }} onCancel={() => setDeleteModal({ isOpen: false, id: null, name: '' })} />
    </>
  );
};