import { useState, useEffect, useMemo } from 'react';
import { useStore, TAG_PRIORITY } from '../store/useStore';
import { ApiKeyHeader } from '../components/headers/ApiKeyHeader';
import { ConfirmModal } from '../components/ConfirmModal';
import { TagBadge } from '../components/TagBadge';
import StatusMessage from '../components/StatusMessage';
import { 
  MdDelete, MdVpnKey, MdPerson, MdShield, 
  MdBlock, MdContentCopy, MdSecurity, MdTrendingUp, 
  MdClose, MdInfoOutline, MdSearch, MdList, MdBadge
} from 'react-icons/md';

const ApiKeyProfileModal = ({ user, clients, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const userClients = useMemo(() => {
    if (!user) return [];
    return clients
      .filter(c => c.marketer === user.owner)
      .filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => (TAG_PRIORITY[b.tag] || 0) - (TAG_PRIORITY[a.tag] || 0));
  }, [clients, user, searchTerm]);

  if (!user) return null;

  const inputClass = "w-full px-3 py-2 text-[13px] rounded border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] focus:border-[#1a73e8] focus:outline-none transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#f8f9fa] dark:bg-[#1e1e1e] w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">

        <div className="p-4 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <MdPerson size={20} className="text-[#1a73e8]" />
            </div>
            <h2 className="text-[14px] text-[#202124] dark:text-[#e8eaed] uppercase tracking-wider font-bold">Vartotojo profilio apžvalga</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
            <MdClose size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm flex flex-col h-full">
              <div className="p-4 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <MdPerson size={20} className="text-[#1a73e8]" />
                </div>
                <h2 className="text-[14px] text-[#202124] dark:text-[#e8eaed] tracking-wider uppercase font-bold">Paskyros duomenys</h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <div className="text-[14px] font-medium text-[#202124] dark:text-[#e8eaed]">{user?.name || user?.owner || 'Nenustatyta'}</div>
                  <div className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-0.5 tracking-wide text-[10px]">Sistemos slapyvardis</div>
                </div>
                <div className="pt-6 border-t border-[#dadce0] dark:border-[#3c4043]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[32px] font-light text-[#202124] dark:text-[#e8eaed] leading-none">{user?.emailsSent || 0}</span>
                  </div>
                  <div className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] mt-1 tracking-wide text-[10px]">Išsiųsta laiškų</div>
                </div>
                <div className="pt-6 border-t border-[#dadce0] dark:border-[#3c4043]">
                  <div className="mb-2">
                    {user?.role === 'admin' ? (
                      <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter w-fit text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800/40">
                        <MdSecurity size={10} /> Administratorius
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[9px] font-black w-fit uppercase tracking-tighter text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/40">
                        <MdTrendingUp size={10} /> Marketingas
                      </div>
                    )}
                  </div>
                  <div className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] tracking-wide text-[10px]">Prieigos lygis</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm flex flex-col min-h-[450px]">
              <div className="p-4 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <MdList size={20} className="text-[#1a73e8]" />
                  </div>
                  <h2 className="text-[14px] text-[#202124] dark:text-[#e8eaed] uppercase tracking-wider font-bold">Išsiųsti laiškai</h2>
                </div>
                
                <div className="relative w-48">
                  <MdSearch className="absolute left-2.5 top-2.5 text-[#5f6368]" size={16} />
                  <input type="text" placeholder="Ieškoti..." className={`${inputClass} pl-9 h-[32px] text-[12px]`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {userClients.length > 0 ? (
                  <table className="w-full text-[13px]">
                    <thead className="sticky top-0 bg-[#f8f9fa] dark:bg-[#202124] text-[#5f6368] dark:text-[#9aa0a6] text-[11px] uppercase tracking-wider border-b border-[#dadce0] dark:border-[#3c4043]">
                      <tr>
                        <th className="px-6 py-3 text-left">Vardas</th>
                        <th className="px-6 py-3 text-left">Būsena</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f3f4] dark:divide-[#3c4043]">
                      {userClients.map(client => (
                        <tr key={client._id} className="hover:bg-gray-50 dark:hover:bg-[#333333]/50 transition-colors">
                          <td className="px-6 py-3.5 font-medium text-[#202124] dark:text-[#e8eaed]">{client.name}</td>
                          <td className="px-6 py-3.5">
                            <TagBadge tag={client.tag} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-[#5f6368] italic text-[13px] p-10 py-40">
                    Nėra rastų klientų.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export const ApiKeyManager = () => {
  const { apiKeys, fetchApiKeys, createApiKey, deleteApiKey, clients } = useStore();
  const [formData, setFormData] = useState({ owner: '', key: '', role: 'marketing' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, owner: '' });
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => { fetchApiKeys(); }, []);

  useEffect(() => {
    if (status.msg) {
      const timer = setTimeout(() => setStatus({ type: '', msg: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const renderRoleTag = (role) => {
    return role === 'admin' ? (
      <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter w-fit text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800/40">
        <MdSecurity size={10} /> Administratorius
      </div>
    ) : (
      <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter w-fit text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/40">
        <MdTrendingUp size={10} /> Marketingas
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.owner || !formData.key) return;
    const result = await createApiKey(formData);
    if (result) {
      setFormData({ owner: '', key: '', role: 'marketing' });
      setStatus({ type: 'success', msg: 'Naujas prieigos raktas sėkmingai sukurtas!' });
    } else {
      setStatus({ type: 'error', msg: 'Nepavyko sukurti rakto.' });
    }
  };

  const confirmDelete = async () => {
    const success = await deleteApiKey(deleteModal.id);
    if (success) {
      setStatus({ type: 'success', msg: `Prieigos raktas (${deleteModal.owner}) panaikintas!` });
    }
    setDeleteModal({ isOpen: false, id: null, owner: '' });
  };

  const inputClass = "w-full px-3 py-2 text-[13px] rounded border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] focus:border-[#1a73e8] focus:outline-none transition-all";

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f8f9fa] dark:bg-[#1e1e1e]">
      <ApiKeyHeader />

      <ApiKeyProfileModal 
        user={selectedUser} 
        clients={clients}
        onClose={() => setSelectedUser(null)} 
      />

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        title="Panaikinti prieigą?"
        message={`Ar tikrai norite ištrinti ${deleteModal.owner} raktą? Vartotojas tuoj pat praras prieigą prie sistemos.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, owner: '' })}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <MdVpnKey size={20} className="text-[#1a73e8]" />
              </div>
              <h2 className="text-[14px] text-[#202124] dark:text-[#e8eaed] uppercase tracking-wider font-bold">Generuoti naują prieigą</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[11px] text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">
                  <MdPerson size={14} className="text-[#1a73e8]" /> Savininkas
                </label>
                <input type="text" placeholder="Vardas / Slapyvardis" className={inputClass} value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[11px] text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">
                  <MdShield size={14} className="text-[#1a73e8]" /> API Raktas
                </label>
                <input type="text" placeholder="Slaptas raktas" className={`${inputClass} text-[12px]`} value={formData.key} onChange={e => setFormData({...formData, key: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[11px] text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">
                    <MdBadge size={14} className="text-[#1a73e8]" /> Rolė
                </label>
                <select 
                  className={`${inputClass} font-bold ${
                    formData.role === 'admin' 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-blue-600 dark:text-blue-400'
                  }`} 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="marketing" className="text-blue-600 dark:text-blue-400 font-bold">Marketingas</option>
                  <option value="admin" className="text-red-600 dark:text-red-400 font-bold">Administratorius</option>
                </select>
              </div>
              <button type="submit" className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[13px] h-[38px] rounded transition-all shadow-sm active:scale-[0.98]">
                Sukurti raktą
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] dark:bg-[#202124] text-[11px] text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider border-b border-[#dadce0] dark:border-[#3c4043]">
                  <th className="px-6 py-4">Savininkas</th>
                  <th className="px-6 py-4">Raktas</th>
                  <th className="px-6 py-4 text-center">Aktyvumas</th>
                  <th className="px-6 py-4">Rolė</th>
                  <th className="px-6 py-4 text-right">Veiksmai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dadce0] dark:divide-[#3c4043]">
                {apiKeys.map(k => (
                  <tr key={k._id} className="transition-colors group text-[13px]">
                    <td className="px-6 py-4 text-[#1a73e8] cursor-pointer hover:underline" onClick={() => setSelectedUser(k)}>
                      <div className="flex items-center gap-2">
                        <MdInfoOutline className="text-blue-600 dark:text-blue-400" size={16} />
                        {k.owner}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[12px]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded">{k.key}</span>
                        <MdContentCopy size={14} className="opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" onClick={() => { navigator.clipboard.writeText(k.key); setStatus({ type: 'success', msg: 'Raktas nukopijuotas!' }); }} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      <span className="text-gray-500 dark:text-gray-400">{k.emailsSent || 0}</span>
                      <span className="text-[10px] text-gray-400 ml-1">laiškai</span>
                    </td>
                    <td className="px-6 py-4">
                      {renderRoleTag(k.role)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {k.role === 'admin' ? (
                        <div className="inline-flex p-1.5 text-gray-300 dark:text-gray-600 cursor-not-allowed" title="Administratoriaus ištrinti negalima">
                          <MdBlock size={18} />
                        </div>
                      ) : (
                        <button onClick={() => setDeleteModal({ isOpen: true, id: k._id, owner: k.owner })} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                          <MdDelete size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <StatusMessage msg={status.msg} type={status.type} />
          
        </div>
      </main>
    </div>
  );
};