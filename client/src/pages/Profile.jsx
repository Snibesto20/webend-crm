import { useState, useEffect, useMemo } from 'react';
import { useStore, TAG_PRIORITY } from '../store/useStore';
import { ProfileHeader } from '../components/headers/ProfileHeader';
import StatusMessage from '../components/StatusMessage';
import { ConfirmModal } from '../components/ConfirmModal';
import { TagBadge } from '../components/TagBadge';
import { MdVpnKey, MdSettings, MdEmail, MdSecurity, MdTrendingUp, MdSearch, MdList, MdPerson } from 'react-icons/md';

export const Profile = () => {
  const { apiKey, user, updateOwnKey, clients } = useStore();
  const [newKey, setNewKey] = useState(apiKey || '');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = useMemo(() => {
    return clients
      .filter(c => c.marketer === user?.owner)
      .filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => (TAG_PRIORITY[b.tag] || 0) - (TAG_PRIORITY[a.tag] || 0));
  }, [clients, user?.owner, searchTerm]);

  useEffect(() => {
    if (status.msg) {
      const timer = setTimeout(() => setStatus({ type: '', msg: '' }), 2500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleUpdate = async () => {
    setIsModalOpen(false);
    if (newKey === apiKey) return setStatus({ type: 'error', msg: 'Raktas negali sutapti su dabartiniu raktu!' });

    const result = await updateOwnKey(newKey);
    setStatus(result.success 
      ? { type: 'success', msg: 'Raktas sėkmingai atnaujintas!' } 
      : { type: 'error', msg: result.error }
    );
  };

  const handleCancel = () => {
    setNewKey(apiKey || '');
    setStatus({ type: '', msg: '' });
  };

  const inputClass = "w-full px-3 py-2 text-[13px] rounded border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] focus:border-[#1a73e8] focus:outline-none transition-all";

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f8f9fa] dark:bg-[#1e1e1e]">
      <ProfileHeader />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm">
              <div className="p-6 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <MdSettings size={20} className="text-[#1a73e8]" />
                </div>
                <h2 className="text-[14px] font-bold text-[#202124] dark:text-[#e8eaed] uppercase tracking-wider">Prieigos nustatymai</h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[11px] font-bold text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">
                    <MdVpnKey size={14} className="text-[#1a73e8]" /> Redaguoti prieigos raktą
                  </label>
                  <input type="text" value={newKey} onChange={(e) => setNewKey(e.target.value)} className={inputClass} />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleCancel} 
                    className="px-4 py-2 rounded text-[13px] font-medium text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-colors"
                  >
                    Atšaukti
                  </button>
                  <button onClick={() => setIsModalOpen(true)} className="flex-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[13px] font-bold py-2 rounded transition-all shadow-sm">Išsaugoti pakeitimus</button>
                </div>
                <div className="h-[40px]"><StatusMessage msg={status.msg} type={status.type} /></div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm flex flex-col h-[400px]">
              <div className="p-4 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <MdList size={20} className="text-[#1a73e8]" />
                  </div>
                  <h2 className="text-[14px] font-bold text-[#202124] dark:text-[#e8eaed] uppercase tracking-wider">Išsiųsti laiškai</h2>
                </div>
                <div className="relative w-48">
                  <MdSearch className="absolute left-2.5 top-2.5 text-[#5f6368]" size={16} />
                  <input 
                    type="text" 
                    placeholder="Paieška..." 
                    className={`${inputClass} pl-9`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {filteredClients.length > 0 ? (
                  <table className="w-full text-[13px] text-[#202124] dark:text-[#e8eaed]">
                    <thead>
                      <tr className="text-[#5f6368] dark:text-[#9aa0a6] border-b border-[#dadce0] dark:border-[#3c4043]">
                        <th className="pb-2 font-medium text-left">Vardas</th>
                        <th className="pb-2 font-medium text-left">Būsena</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map(client => (
                        <tr key={client._id} className="border-b border-[#f1f3f4] dark:border-[#3c4043] last:border-0">
                          <td className="py-3 font-medium">{client.name}</td>
                          <td className="py-3">
                            <TagBadge tag={client.tag} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="h-full flex items-center justify-center text-[13px] text-[#5f6368] italic">Nėra rastų klientų.</div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm h-full flex flex-col">
            <div className="p-6 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <MdPerson size={20} className="text-[#1a73e8]" />
              </div>
              <h2 className="text-[14px] font-bold text-[#202124] dark:text-[#e8eaed] uppercase tracking-wider">Paskyros duomenys</h2>
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
                    <div className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800/40">
                      <MdSecurity size={10} /> Administratorius
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/40">
                      <MdTrendingUp size={10} /> Marketingas
                    </div>
                  )}
                </div>
                <div className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-2">Rolė sistemoje</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal 
        isOpen={isModalOpen}
        title="Patvirtinti pakeitimus"
        message="Ar tikrai norite pakeisti savo prieigos raktą?"
        onConfirm={handleUpdate}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};