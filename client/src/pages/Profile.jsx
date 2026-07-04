import React, { useState, useMemo, useEffect } from 'react';
import { useStore, TAG_PRIORITY } from '../store/useStore';
import { ProfileHeader } from '../components/headers/ProfileHeader';
import { StatusMessage } from '../components/StatusMessage';
import { ConfirmModal } from '../components/ConfirmModal';
import { TagBadge } from '../components/TagBadge';
import { ClientModal } from '../components/ClientModal';
import { 
  MdVpnKey, MdSettings, MdSecurity, MdTrendingUp, 
  MdSearch, MdList, MdPerson, MdDelete, MdBadge 
} from 'react-icons/md';
import { AnimatePresence } from 'framer-motion';

export const Profile = () => {
  const { apiKey, user, updateOwnKey, clients, deleteClient, updateClient } = useStore();
  const [newKey, setNewKey] = useState(apiKey || '');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredClients = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return clients
      .filter(c => c.marketer === user?.owner)
      .filter(c => {
        const matchName = c.name?.toLowerCase().includes(query);
        const matchContacts = c.contacts?.some(contact => contact?.toLowerCase().includes(query));
        return matchName || matchContacts;
      })
      .sort((a, b) => (TAG_PRIORITY[b.tag] || 0) - (TAG_PRIORITY[a.tag] || 0));
  }, [clients, user?.owner, searchTerm]);

  useEffect(() => {
    if (selectedClient) {
      const currentId = selectedClient._id || selectedClient.id;
      const freshData = clients.find(c => (c._id || c.id) === currentId);
      if (freshData) {
        setSelectedClient(freshData);
      } else {
        // Jei klientas nebeegzistuoja bendrame sąraše (buvo ištrintas), uždarome modalą
        setSelectedClient(null);
      }
    }
  }, [clients, selectedClient]);

  const handleSaveClient = async (updatedData) => {
    if (updateClient && selectedClient) {
      const clientId = selectedClient._id || selectedClient.id;
      await updateClient(clientId, updatedData);
      setSelectedClient(prevState => ({ ...prevState, ...updatedData }));
    }
  };

  const handleUpdate = async () => {
    setIsKeyModalOpen(false);
    if (newKey === apiKey) return setStatus({ type: 'error', msg: 'Raktas negali sutapti su dabartiniu raktu!' });
    const result = await updateOwnKey(newKey);
    setStatus(result.success ? { type: 'success', msg: 'Raktas sėkmingai atnaujintas!' } : { type: 'error', msg: result.error });
  };

  const handleDeleteClient = async () => {
    if (!deleteModal.id || isDeleting) return;
    
    setIsDeleting(true);
    const targetId = deleteModal.id;
    
    // Uždarome patvirtinimo langą iškart
    setDeleteModal({ isOpen: false, id: null, name: '' });
    
    try {
      await deleteClient(targetId);
      
      // Jei triname tą klientą, kuris dabar atidarytas detaliame lange – uždarome jį
      if (selectedClient?._id === targetId || selectedClient?.id === targetId) {
        setSelectedClient(null);
      }
      
      setStatus({ type: 'success', msg: 'Klientas sėkmingai pašalintas iš registro.' });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Nepavyko ištrinti kliento iš registro.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setNewKey(apiKey || '');
    setStatus({ type: '', msg: '' });
  };

  const showKey = isInputHovered || isInputFocused;
  const inputClass = "w-full px-3 py-2 text-[13px] rounded border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] focus:border-[#1a73e8] focus:outline-none transition-all";

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f8f9fa] dark:bg-[#1e1e1e]">
      <ProfileHeader />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm">
              <div className="p-6 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded"><MdSettings size={24} className="text-[#1a73e8]" /></div>
                  <h2 className="text-[16px] font-medium text-[#202124] dark:text-[#e8eaed]">Prieigos nustatymai</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[11px] text-[#5f6368] dark:text-[#9aa0a6] tracking-wider"><MdVpnKey size={14} className="text-[#1a73e8]" /> Redaguoti prieigos raktą</label>
                  <div onMouseEnter={() => setIsInputHovered(true)} onMouseLeave={() => setIsInputHovered(false)} className="relative w-full">
                    <input type={showKey ? "text" : "password"} value={newKey} onChange={(e) => setNewKey(e.target.value)} onFocus={() => setIsInputFocused(true)} onBlur={() => setIsInputFocused(false)} className={`${inputClass} h-[38px] ${!showKey ? "tracking-[0.3em] font-mono text-[12px] text-white dark:text-white [text-security:_disc] [-webkit-text-security:_disc]" : ""}`} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCancel} className="px-4 py-2 rounded text-[13px] font-medium text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-colors">Atšaukti</button>
                  <button onClick={() => setIsKeyModalOpen(true)} className="flex-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[13px] font-bold h-[38px] rounded transition-all shadow-sm active:scale-[0.98]">Išsaugoti pakeitimus</button>
                </div>
              </div>
            </div>
            
            <div className={`bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm flex flex-col h-[400px] ${isDeleting ? "opacity-60 pointer-events-none" : ""}`}>
              <div className="p-6 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded"><MdList size={24} className="text-[#1a73e8]" /></div>
                  <h2 className="text-[16px] font-medium text-[#202124] dark:text-[#e8eaed]">Sukurti klientai</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-48">
                    <MdSearch className="absolute left-2.5 top-2 text-[#5f6368]" size={16} />
                    <input type="text" className={`${inputClass} pl-9 h-[32px] text-[12px]`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <span className="text-[12px] bg-[#f1f3f4] dark:bg-[#3c4043] text-[#5f6368] dark:text-[#9aa0a6] px-2.5 py-0.5 rounded-full font-medium shrink-0">{filteredClients.length}</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                {filteredClients.length > 0 ? (
                  <table className="flex flex-col h-full w-full text-[13px] text-[#202124] dark:text-[#e8eaed]">
                    <thead className="block w-full border-b border-[#dadce0] dark:border-[#3c4043] bg-[#f8f9fa] dark:bg-[#202124]">
                      <tr className="flex w-full text-[13px] text-[#5f6368] dark:text-[#9aa0a6]">
                        <th className="py-3 text-left pl-6 flex-1 flex items-center gap-2 font-normal"><MdPerson size={14} className="text-[#1a73e8]" /> Vardas</th>
                        <th className="py-3 text-left flex-1 flex items-center gap-2 font-normal"><MdBadge size={14} className="text-[#1a73e8]" /> Būsena</th>
                        <th className="py-3 text-right pr-6 w-32 flex items-center justify-end gap-2 font-normal shrink-0"><MdDelete size={14} className="text-[#1a73e8]" /> Ištrynimas</th>
                      </tr>
                    </thead>
                    <tbody className="flex-1 block w-full overflow-y-auto custom-scrollbar">
                      {filteredClients.map(client => (
                        <tr key={client._id || client.id} onClick={() => setSelectedClient(client)} className="group flex w-full border-b border-[#f1f3f4] dark:border-[#3c4043] last:border-0 hover:bg-[#f8f9fa] dark:hover:bg-[#3c4043]/30 transition-colors cursor-pointer">
                          <td className="py-3 font-medium pl-6 flex-1 flex items-center min-w-0"><span className="truncate block w-full">{client.name}</span></td>
                          <td className="py-3 flex-1 flex items-center"><TagBadge tag={client.tag} /></td>
                          <td className="py-3 pr-6 text-right w-32 flex items-center justify-end shrink-0">
                            <button onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, id: client._id || client.id, name: client.name }); }} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-[#1a73e8] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all inline-flex items-center justify-center"><MdDelete size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-[13px] text-[#5f6368] italic py-10">Nėra rastų klientų.</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm h-full flex flex-col">
            <div className="p-6 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded"><MdPerson size={24} className="text-[#1a73e8]" /></div>
                <h2 className="text-[16px] font-medium text-[#202124] dark:text-[#e8eaed]">Paskyros duomenys</h2>
              </div>
            </div>
            <div className="p-6 space-y-6 flex-1">
              <div>
                <div className="text-[32px] font-light text-[#202124] dark:text-[#e8eaed]">{user?.emailsSent || 0}</div>
                <div className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6]">Išsiųsta laiškų</div>
              </div>
              <div className="pt-6 border-t border-[#dadce0] dark:border-[#3c4043]">
                <div className="text-[14px] font-medium text-[#202124] dark:text-[#e8eaed]">{user?.owner || 'Nenustatyta'}</div>
                <div className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">Sistemos slapyvardis</div>
              </div>
              <div className="flex flex-col pt-6 border-t border-[#dadce0] dark:border-[#3c4043]">
                <div className="w-fit">
                  {user?.role === 'admin' ? (
                    <div className="inline-flex items-center gap-1 text-[9px] font-black tracking-tighter text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800/40"><MdSecurity size={10} /> Administratorius</div>
                  ) : (
                    <div className="inline-flex items-center gap-1 text-[9px] font-black tracking-tighter text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-200 dark:border-red-800/40"><MdTrendingUp size={10} /> Marketingas</div>
                  )}
                </div>
                <div className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-2">Rolė sistemoje</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ClientModal client={selectedClient} onClose={() => setSelectedClient(null)} onSave={handleSaveClient} />

      <ConfirmModal isOpen={isKeyModalOpen} title="Patvirtinti pakeitimus" message="Ar tikrai norite pakeisti savo prieigos raktą?" onConfirm={handleUpdate} onCancel={() => setIsKeyModalOpen(false)} />
      <ConfirmModal isOpen={deleteModal.isOpen} title="Pašalinti iš registro?" message={<>Ar tikrai norite pašalinti <span className="font-bold text-[#202124] dark:text-[#e8eaed]">„{deleteModal.name}“</span>? <br /><span className="text-blue-600 text-[12px] font-medium">Dėmesio: bus ištrinta kliento kortelė ir visi jos duomenys.</span></>} onConfirm={handleDeleteClient} onCancel={() => setDeleteModal({ isOpen: false, id: null, name: '' })} />

      <AnimatePresence>
        {status.msg && <StatusMessage type={status.type} msg={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />}
      </AnimatePresence>
    </div>
  );
};

export default Profile;