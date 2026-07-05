import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ProfileHeader } from '../components/headers/ProfileHeader';
import { ComponentHeader } from '../components/headers/ComponentHeader';
import { StatusMessage } from '../components/StatusMessage';
import { ConfirmModal } from '../components/ConfirmModal';
import { TAG_PRIORITY } from "../config";
import { TagBadge } from '../components/TagBadge';
import { ClientModal } from '../components/ClientModal';
import { 
  MdVpnKey, MdSettings, MdSecurity, MdTrendingUp, 
  MdSearch, MdList, MdPerson, MdBadge 
} from 'react-icons/md';
import { AnimatePresence } from 'framer-motion';

export const Profile = () => {
  const { apiKey, user, updateOwnKey, clients, updateClient } = useStore();
  const [newKey, setNewKey] = useState(apiKey || '');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

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

  const handleCancel = () => {
    setNewKey(apiKey || '');
    setStatus({ type: '', msg: '' });
  };

  const showKey = isInputHovered || isInputFocused;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f8f9fa] dark:bg-[#1e1e1e]">
      <ProfileHeader />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm">
              <ComponentHeader title="Prieigos nustatymai" icon={MdSettings} />
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[11px] text-[#5f6368] dark:text-[#9aa0a6] tracking-wider"><MdVpnKey size={14} className="text-[#1a73e8]" /> Redaguoti prieigos raktą</label>
                  <div onMouseEnter={() => setIsInputHovered(true)} onMouseLeave={() => setIsInputHovered(false)} className="relative w-full">
                    <input type={showKey ? "text" : "password"} value={newKey} onChange={(e) => setNewKey(e.target.value)} onFocus={() => setIsInputFocused(true)} onBlur={() => setIsInputFocused(false)} className={`input-base ${!showKey ? "tracking-[0.3em] font-mono text-[12px] text-white dark:text-white [text-security:_disc] [-webkit-text-security:_disc]" : ""}`} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCancel} className="px-4 py-2 rounded text-[13px] font-medium text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-colors">Atšaukti</button>
                  <button onClick={() => setIsKeyModalOpen(true)} className="btn-blue flex-1 h-[38px]">Išsaugoti pakeitimus</button>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm flex flex-col h-[400px]">
              <ComponentHeader title="Sukurti klientai" icon={MdList}>
                <div className="relative w-48">
                  <MdSearch className="absolute left-2.5 top-2 text-[#5f6368]" size={16} />
                  <input type="text" className="input-base pl-9 h-[32px] text-[12px]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <span className="text-[12px] bg-[#f1f3f4] dark:bg-[#3c4043] text-[#5f6368] dark:text-[#9aa0a6] px-2.5 py-0.5 rounded-full font-medium shrink-0">{filteredClients.length}</span>
              </ComponentHeader>

              <div className="flex-1 flex flex-col min-h-0">
                {filteredClients.length > 0 ? (
                  <table className="flex flex-col h-full w-full text-[13px] text-[#202124] dark:text-[#e8eaed]">
                    <thead className="block w-full border-b border-[#dadce0] dark:border-[#3c4043] bg-[#f8f9fa] dark:bg-[#202124]">
                      <tr className="flex w-full text-[13px] text-[#5f6368] dark:text-[#9aa0a6]">
                        <th className="py-3 text-left pl-6 flex-1 flex items-center gap-2 font-normal"><MdPerson size={14} className="text-[#1a73e8]" /> Vardas</th>
                        <th className="py-3 text-left flex-1 flex items-center gap-2 font-normal"><MdBadge size={14} className="text-[#1a73e8]" /> Būsena</th>
                      </tr>
                    </thead>
                    <tbody className="flex-1 block w-full overflow-y-auto custom-scrollbar">
                      {filteredClients.map(client => (
                        <tr key={client._id || client.id} onClick={() => setSelectedClient(client)} className="group flex w-full border-b border-[#f1f3f4] dark:border-[#3c4043] last:border-0 hover:bg-[#f8f9fa] dark:hover:bg-[#3c4043]/30 transition-colors cursor-pointer">
                          <td className="py-3 font-medium pl-6 flex-1 flex items-center min-w-0"><span className="truncate block w-full">{client.name}</span></td>
                          <td className="py-3 flex-1 flex items-center"><TagBadge tag={client.tag} /></td>
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
            <ComponentHeader title="Paskyros duomenys" icon={MdPerson} />
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

      <AnimatePresence>
        {selectedClient && (
          <ClientModal client={selectedClient} onClose={() => setSelectedClient(null)} onSave={handleSaveClient} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isKeyModalOpen && (
          <ConfirmModal title="Patvirtinti pakeitimus" message="Ar tikrai norite pakeisti savo prieigos raktą?" onConfirm={handleUpdate} onCancel={() => setIsKeyModalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status.msg && <StatusMessage type={status.type} msg={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />}
      </AnimatePresence>
    </div>
  );
};

export default Profile;