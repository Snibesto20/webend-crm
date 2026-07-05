import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ApiKeyHeader } from '../components/headers/ApiKeyHeader';
import { ConfirmModal } from '../components/ConfirmModal';
import { TagBadge } from '../components/TagBadge';
import { StatusMessage } from "../components/StatusMessage";
import { ComponentHeader } from '../components/headers/ComponentHeader';
import { ERRORS, VALIDATION_CONFIG, TAG_PRIORITY } from '../config';
import { 
  MdDelete, MdVpnKey, MdPerson, MdShield, 
  MdSecurity, MdTrendingUp, MdSearch, MdList, 
  MdBadge, MdPeople, MdBlock, MdContentCopy
} from 'react-icons/md';

const ApiKeyProfileModal = ({ user, clients, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (user) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [user, onClose]);

  const totalUserClientsCount = useMemo(() => {
    if (!user) return 0;
    return clients.filter(c => c.marketer === user.owner).length;
  }, [clients, user]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-150">
      <div ref={modalRef} className="bg-[#f8f9fa] dark:bg-[#1e1e1e] h-[62vh] w-full max-w-5xl rounded-lg shadow-xl overflow-hidden flex flex-col border border-[#dadce0] dark:border-[#3c4043] animate-in scale-in duration-150 origin-center">
        
        {/* PAKEISTA: Naudojamas bendras ComponentHeader */}
        <ComponentHeader title="Vartotojo profilio apžvalga" icon={MdPerson} onClose={onClose} />

        <div className="p-6 bg-[#f8f9fa] dark:bg-[#1e1e1e] flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm flex flex-col h-[47.5vh]">
              
              {/* PAKEISTA: Naudojamas bendras ComponentHeader paskyros duomenims be uždarymo mygtuko */}
              <ComponentHeader title="Paskyros duomenys" icon={MdPerson} />

              <div className="p-6 space-y-6">
                <div>
                  <div className="text-[14px] font-medium text-[#202124] dark:text-[#e8eaed]">{user?.name || user?.owner || 'Nenustatyta'}</div>
                  <div className="text-[#5f6368] dark:text-[#9aa0a6] mt-0.5 tracking-wide text-[10px]">Sistemos slapyvardis</div>
                </div>
                <div className="pt-6 border-t border-[#dadce0] dark:border-[#3c4043]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[32px] font-light text-[#202124] dark:text-[#e8eaed] leading-none">{totalUserClientsCount}</span>
                  </div>
                  <div className="text-[#5f6368] dark:text-[#9aa0a6] mt-1 tracking-wide text-[10px]">Pridėti klientai</div>
                </div>
                <div className="pt-6 border-t border-[#dadce0] dark:border-[#3c4043]">
                  <div className="mb-2">
                    {user?.role === 'admin' ? (
                      <div className="flex items-center gap-1 text-[9px] font-black tracking-tighter w-fit text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800/40">
                        <MdSecurity size={10} /> ADMINISTRATORIUS
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[9px] font-black w-fit tracking-tighter text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-200 dark:border-[#dadce0] dark:border-[#3c4043]">
                        <MdTrendingUp size={10} /> MARKETINGAS
                      </div>
                    )}
                  </div>
                  <div className="text-[#5f6368] dark:text-[#9aa0a6] tracking-wide text-[10px]">Prieigos lygis</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm flex flex-col">
              <div className="border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between pr-6">
                
                {/* PAKEISTA: Naudojamas bendras ComponentHeader pritaikytas su paieškos el. grupavimu */}
                <div className="flex-1">
                  <ComponentHeader title="Pridėti klientai" icon={MdList} />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative w-48">
                    <MdSearch className="absolute left-2.5 top-2 text-[#5f6368]" size={16} />
                    <input type="text" className="input-base pl-9 h-[32px] text-[12px] mb-0" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <span className="text-[12px] bg-[#f1f3f4] dark:bg-[#3c4043] text-[#5f6368] dark:text-[#9aa0a6] px-2.5 py-0.5 rounded-full font-medium shrink-0">
                    {totalUserClientsCount}
                  </span>
                </div>
              </div>

              <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                {userClients.length > 0 ? (
                  <table className="w-full text-[13px] text-[#202124] dark:text-[#e8eaed]">
                    <thead>
                      <tr className="bg-[#f8f9fa] dark:bg-[#202124] text-[13px] text-[#5f6368] dark:text-[#9aa0a6] tracking-wider border-b border-[#dadce0] dark:border-[#3c4043]">
                        <th className="py-3 text-left pl-6 align-middle font-normal">
                          <span className="inline-flex items-center gap-2">
                            <MdPerson size={14} className="text-[#1a73e8]" /> Vardas
                          </span>
                        </th>
                        <th className="py-3 text-left px-6 align-middle font-normal">
                          <span className="inline-flex items-center gap-2">
                            <MdBadge size={14} className="text-[#1a73e8]" /> Būsena
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f3f4] dark:divide-[#3c4043]">
                      {userClients.map(client => (
                        <tr key={client._id} className="transition-colors">
                          <td className="pl-6 pr-4 py-3.5 font-medium text-left align-middle">
                            <span className="truncate block">{client.name}</span>
                          </td>
                          <td className="px-6 py-3.5 text-left align-middle">
                            <div className="flex justify-start">
                              <TagBadge tag={client.tag} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-[#5f6368] italic text-[13px] p-10 py-20">
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => { fetchApiKeys(); }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCloseStatus = () => {
    setStatus({ type: '', msg: '' });
  };

  const getUserClientCount = (ownerName) => {
    if (!clients) return 0;
    return clients.filter(c => c.marketer === ownerName).length;
  };

  const handleCopyKey = async (e, keyString) => {
    e.stopPropagation();
    setStatus({ type: '', msg: '' });
    try {
      await navigator.clipboard.writeText(keyString);
      setTimeout(() => setStatus({ type: 'success', msg: ERRORS.FORM_COPY_SUCCESS }));
    } catch (err) {
      setTimeout(() => setStatus({ type: 'error', msg: ERRORS.FORM_COPY_ERROR }));
    }
  };

  const renderRoleTag = (role) => {
    return role === 'admin' ? (
      <div className="flex items-center justify-start gap-1 text-[9px] font-black tracking-tighter w-fit text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800/40">
        <MdSecurity size={10} /> ADMINISTRATORIUS
      </div>
    ) : (
      <div className="flex items-center justify-start gap-1 text-[9px] font-black tracking-tighter w-fit text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/40">
        <MdTrendingUp size={10} /> MARKETINGAS
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedOwner = formData.owner.trim();
    const trimmedKey = formData.key.trim();
    setStatus({ type: '', msg: '' });

    if (!trimmedOwner && !trimmedKey) {
      setTimeout(() => setStatus({ type: 'error', msg: ERRORS.FORM_ALL_FIELDS_REQUIRED }));
      return;
    }
    if (!trimmedOwner) {
      setTimeout(() => setStatus({ type: 'error', msg: ERRORS.FORM_OWNER_REQUIRED }));
      return;
    }
    if (!trimmedKey) {
      setTimeout(() => setStatus({ type: 'error', msg: ERRORS.FORM_KEY_REQUIRED }));
      return;
    }
    if (trimmedKey.length < VALIDATION_CONFIG.MIN_KEY_LENGTH) {
      setTimeout(() => setStatus({ type: 'error', msg: ERRORS.KEY_TOO_SHORT }));
      return;
    }

    try {
      await createApiKey({
        owner: trimmedOwner,
        key: trimmedKey,
        role: formData.role
      });
      setFormData({ owner: '', key: '', role: 'marketing' });
      setTimeout(() => setStatus({ type: 'success', msg: ERRORS.FORM_CREATE_SUCCESS }));
    } catch (err) {
      const backendCode = err.message;
      const errorMsg = ERRORS[backendCode] || ERRORS.FORM_CREATE_ERROR;
      setTimeout(() => setStatus({ type: 'error', msg: errorMsg }));
    }
  };

  const confirmDelete = async () => {
    setStatus({ type: '', msg: '' });
    const success = await deleteApiKey(deleteModal.id);
    if (success) {
      setTimeout(() => setStatus({ type: 'success', msg: `Prieigos raktas (${deleteModal.owner}) panaikintas sėkmingai.` }));
    }
    setDeleteModal({ isOpen: false, id: null, owner: '' });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f8f9fa] dark:bg-[#1e1e1e]">
      <ApiKeyHeader />

      <ApiKeyProfileModal user={selectedUser} clients={clients} onClose={() => setSelectedUser(null)} />

      <ConfirmModal isOpen={deleteModal.isOpen} title="Panaikinti prieigą?" message={`Ar tikrai norite ištrinti ${deleteModal.owner} raktą? Vartotojas tuoj pat praras prieigą prie sistemos.`} onConfirm={confirmDelete} onCancel={() => setDeleteModal({ isOpen: false, id: null, owner: '' })} />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm overflow-visible relative z-30">
            
            {/* PAKEISTA: Naudojamas bendras ComponentHeader raktų generavimui */}
            <ComponentHeader title="Generuoti naują prieigą" icon={MdVpnKey} />

            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* PAKEISTA: Pritaikyta .label-base klasė iš input.css */}
              <div className="space-y-1.5">
                <label className="label-base"><MdPerson size={14} className="text-[#1a73e8]" /> Savininkas</label>
                <input type="text" className="input-base h-[38px] mb-0" value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} />
              </div>
              
              {/* PAKEISTA: Pritaikyta .label-base klasė iš input.css */}
              <div className="space-y-1.5">
                <label className="label-base"><MdShield size={14} className="text-[#1a73e8]" /> Prieigos raktas</label>
                <input type="text" className="input-base h-[38px] text-[12px] mb-0" value={formData.key} onChange={e => setFormData({...formData, key: e.target.value})} />
              </div>
              
              {/* PAKEISTA: Pritaikyta .label-base klasė iš input.css */}
              <div ref={dropdownRef} className="space-y-1.5 relative z-40">
                <label className="label-base"><MdBadge size={14} className="text-[#1a73e8]" /> Rolė</label>
                <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="input-base flex items-center justify-between bg-white dark:bg-[#202124] w-full h-[38px] mb-0 text-left cursor-pointer focus:border-[#1a73e8] focus:outline-none select-none">
                  <div className="flex items-center">{renderRoleTag(formData.role)}</div>
                  <span className={`text-[10px] text-[#5f6368] dark:text-[#9aa0a6] mr-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                <div className={`absolute left-0 right-0 mt-1.5 max-h-50 overflow-y-auto bg-white dark:bg-[#2d2e31] border border-[#b8bbbf] dark:border-[#4a4d51] rounded shadow-xl z-50 custom-scrollbar divide-y divide-slate-100 dark:divide-[#3c4043] transition-all duration-200 origin-top ${isDropdownOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  <ul className="py-0.5">
                    <li onClick={() => { setFormData({...formData, role: 'marketing'}); setIsDropdownOpen(false); }} className="flex items-center px-3 py-1.5 bg-white odd:bg-slate-50/80 dark:bg-[#292a2d] dark:odd:bg-[#232427] hover:bg-blue-50/60 dark:hover:bg-[#1a73e8]/20 cursor-pointer transition-colors">
                      <div className="flex items-center justify-start gap-1 text-[9px] font-black tracking-tighter w-fit text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/40"><MdTrendingUp size={10} /> MARKETINGAS</div>
                    </li>
                    <li onClick={() => { setFormData({...formData, role: 'admin'}); setIsDropdownOpen(false); }} className="flex items-center px-3 py-1.5 bg-white odd:bg-slate-50/80 dark:bg-[#292a2d] dark:odd:bg-[#232427] hover:bg-blue-50/60 dark:hover:bg-[#1a73e8]/20 cursor-pointer transition-colors">
                      <div className="flex items-center justify-start gap-1 text-[9px] font-black tracking-tighter w-fit text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800/40"><MdSecurity size={10} /> ADMINISTRATORIUS</div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* PAKEISTA: Panaudota .btn-blue klasė iš input.css */}
              <button type="submit" className="btn-blue h-[38px] mb-0 w-full">
                Sukurti raktą
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm overflow-hidden">
            <div className="border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between pr-6">
              
              {/* PAKEISTA: Naudojamas bendras ComponentHeader raktų sąrašui */}
              <div className="flex-1">
                <ComponentHeader title="Prieigos raktų sąrašas" icon={MdList} />
              </div>
              
              <span className="text-[12px] bg-[#f1f3f4] dark:bg-[#3c4043] text-[#5f6368] dark:text-[#9aa0a6] px-2.5 py-0.5 rounded-full font-medium">
                {apiKeys.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px] text-[#202124] dark:text-[#e8eaed]">
                <thead>
                  <tr className="bg-[#f8f9fa] dark:bg-[#202124] text-[13px] text-[#5f6368] dark:text-[#9aa0a6] tracking-wider border-b border-[#dadce0] dark:border-[#3c4043]">
                    <th className="py-3 px-6 font-normal text-left align-middle">
                      <span className="inline-flex items-center gap-2 justify-start text-[13px] text-[#5f6368] dark:text-[#9aa0a6] tracking-wider"><MdPerson size={14} className="text-[#1a73e8]" /> Savininkas</span>
                    </th>
                    <th className="py-3 px-6 font-normal text-left align-middle">
                      <span className="inline-flex items-center gap-2 justify-start text-[13px] text-[#5f6368] dark:text-[#9aa0a6] tracking-wider"><MdBadge size={14} className="text-[#1a73e8]" /> Rolė</span>
                    </th>
                    <th className="py-3 px-6 font-normal text-left align-middle">
                      <span className="inline-flex items-center gap-2 justify-start text-[13px] text-[#5f6368] dark:text-[#9aa0a6] tracking-wider"><MdPeople size={14} className="text-[#1a73e8]" /> Pridėti klientai</span>
                    </th>
                    <th className="py-3 px-6 font-normal text-left align-middle">
                      <span className="inline-flex items-center gap-2 justify-start text-[13px] text-[#5f6368] dark:text-[#9aa0a6] tracking-wider"><MdShield size={14} className="text-[#1a73e8]" /> Prieigos raktas</span>
                    </th>
                    <th className="py-3 px-6 font-normal text-right w-24 align-middle">
                      <span className="inline-flex items-center gap-2 justify-end text-[13px] text-[#5f6368] dark:text-[#9aa0a6] tracking-wider"><MdDelete size={14} className="text-[#1a73e8]" /> Ištrynimas</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f3f4] dark:divide-[#3c4043]">
                  {apiKeys.map((item) => (
                    <tr key={item._id} onClick={() => setSelectedUser(item)} className="group hover:bg-[#f8f9fa] dark:hover:bg-[#3c4043]/30 transition-colors cursor-pointer">
                      <td className="py-3 px-6 font-medium text-left align-middle">
                        <span className="truncate block max-w-[180px]">{item.owner}</span>
                      </td>
                      <td className="py-3 px-6 text-left align-middle">{renderRoleTag(item.role)}</td>
                      <td className="py-3 px-6 font-bold text-slate-500 dark:text-slate-400 text-left align-middle">
                        {getUserClientCount(item.owner)}
                      </td>
                      <td className="py-3 px-6 font-mono text-[12px] max-w-[180px] text-left align-middle overflow-hidden">
                        <div className="inline-flex items-center gap-2 max-w-full">
                          <div className="relative h-5 overflow-hidden w-20 shrink-0">
                            <span className="absolute inset-0 tracking-[0.3em] text-slate-400 dark:text-slate-500 transition-all duration-300 transform group-hover:opacity-0 group-hover:tracking-normal group-hover:scale-95">••••••••</span>
                            <span className="absolute inset-0 truncate opacity-0 text-slate-400 dark:text-slate-500 transition-all duration-300 transform scale-95 group-hover:opacity-100 group-hover:scale-100">{item.key}</span>
                          </div>
                          <button onClick={(e) => handleCopyKey(e, item.key)} className="p-1 text-slate-400 dark:text-slate-500 rounded shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" title="Kopijuoti raktą">
                            <MdContentCopy size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-right align-middle">
                        <div className="flex justify-end">
                          {item.role === 'admin' ? (
                            <div className="p-1.5 text-slate-300 dark:text-slate-600 cursor-not-allowed pointer-events-none inline-flex items-center justify-center">
                              <MdBlock size={16} />
                            </div>
                          ) : (
                            /* PAKEISTA: Užtikrinta, kad trynimo mygtukas naudoja .btn-blue-icon klasę */
                            <button onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, id: item._id, owner: item.owner }); }} className="btn-blue-icon inline-flex items-center justify-center">
                              <MdDelete size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      
      <AnimatePresence>
        {status.msg && <StatusMessage type={status.type} msg={status.msg} onClose={handleCloseStatus} />}
      </AnimatePresence>
    </div>
  );
};

export default ApiKeyManager;