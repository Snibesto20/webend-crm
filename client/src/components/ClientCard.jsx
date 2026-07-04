import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { TagBadge } from './TagBadge';
import { ConfirmModal } from './ConfirmModal';
import { AnimatePresence } from 'framer-motion';
import { StatusMessage } from './StatusMessage';
import { ERRORS, CLIENT_TAGS_CONFIG } from '../config';
import { 
  MdEdit, 
  MdDelete, 
  MdCheck, 
  MdClose, 
  MdEuro, 
  MdMiscellaneousServices, 
  MdNotes,
  MdPerson,
  MdContactMail,
  MdAdd,
  MdBadge,
  MdCalendarToday
} from 'react-icons/md';

const ALL_TAGS = [
  'potential 1', 'potential 2', 'potential 3', 'potential 4', 'potential 5', 
  'potential 6', 'potential 7', 'potential 8', 'potential 9', 'potential 10', 
  'pending', 'approved', 'active client', 'archived client', 'disapproved', 'unprocessed'
];

const formatPhoneNumber = (contactStr) => {
  const trimmed = contactStr.trim();
  if (!trimmed) return '';

  const hasLetters = /[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ]/i.test(trimmed);
  if (hasLetters) return trimmed;

  let cleaned = trimmed.replace(/\D/g, '');
  if (!cleaned) return trimmed;

  if (cleaned.startsWith('370')) {
    cleaned = '0' + cleaned.substring(3);
  } else if (cleaned.startsWith('8')) {
    cleaned = '0' + cleaned.substring(1);
  }
  return cleaned;
};

const getContactLinkProps = (contactStr) => {
  const trimmed = contactStr.trim();
  if (/^\d+$/.test(trimmed)) return { href: `tel:${trimmed}`, isLink: true };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmed)) return { href: `mailto:${trimmed}`, isLink: true };
  if (/^(https?:\/\/|www\.)/i.test(trimmed)) {
    const href = /^www\./i.test(trimmed) ? `https://${trimmed}` : trimmed;
    return { href, isLink: true, target: "_blank", rel: "noopener noreferrer" };
  }
  return { isLink: false };
};

export const ClientCard = ({ client, onDeleteSuccess, onSaveSuccess }) => {
  const { updateClient, deleteClient } = useStore();
  const user = useStore((state) => state.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...client, contacts: client.contacts || [''] });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEditData({ ...client, contacts: client.contacts || [''] });
  }, [client]);

  const isAdmin = user?.role === 'admin';
  const clientId = client?._id || client?.id;

  const formattedCreationDate = client.createdAt 
    ? new Date(client.createdAt).toLocaleDateString('lt-LT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    : 'Data nežinoma';

  const handleSave = async () => {
    if (!isAdmin || !clientId) return;
    setStatus({ type: '', msg: '' });

    const filteredEditContacts = (editData.contacts || [])
      .map(c => formatPhoneNumber(c))
      .filter(c => c.trim() !== '');

    const currentName = (editData.name || '').trim();
    const currentService = (editData.serviceNeeded || '').trim();
    const currentNotes = (editData.notes || '').trim();
    const currentMoney = Number(editData.moneyMade || 0);

    setIsSubmitting(true);
    
    try {
      await updateClient(clientId, {
        ...editData,
        name: currentName,
        serviceNeeded: currentService,
        notes: currentNotes,
        moneyMade: currentMoney,
        contacts: filteredEditContacts
      });
      
      const successMsg = ERRORS.CLIENT_UPDATE_SUCCESS || 'Kliento duomenys sėkmingai atnaujinti.';
      setIsEditing(false);

      if (onSaveSuccess) {
        onSaveSuccess(successMsg);
      } else {
        setStatus({ type: 'success', msg: successMsg });
      }
    } catch (err) {
      const backendCode = err.message;
      let errorMsg = ERRORS[backendCode] || ERRORS.GLOBAL_UNKNOWN_ERROR || 'Nepavyko atnaujinti kliento duomenų.';
      if (backendCode === 'CLIENT_DUPLICATE_NAME' && err.meta?.name) {
        errorMsg = `Klaida: Klientas "${err.meta.name}" jau egzistuoja sistemoje.`;
      }
      setStatus({ type: 'error', msg: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!clientId) return;
    setStatus({ type: '', msg: '' });
    setIsDeleteModalOpen(false);
    
    try {
      await deleteClient(clientId);
      const successMsg = ERRORS.CLIENT_DELETE_SUCCESS || 'Klientas sėkmingai ištrintas.';
      
      if (onDeleteSuccess) {
        onDeleteSuccess(successMsg);
      } else {
        setStatus({ type: 'success', msg: successMsg });
      }
    } catch (err) {
      const backendCode = err.message;
      const errorMsg = ERRORS[backendCode] || ERRORS.CLIENT_DELETE_ERROR || ERRORS.GLOBAL_UNKNOWN_ERROR;
      setStatus({ type: 'error', msg: errorMsg });
    }
  };

  const handleContactChange = (index, value) => {
    const newContacts = [...(editData.contacts || [])];
    newContacts[index] = value;
    setEditData({ ...editData, contacts: newContacts });
  };

  const addContactField = () => {
    setEditData({ ...editData, contacts: [...(editData.contacts || []), ''] });
  };

  const removeContactField = (index) => {
    const newContacts = (editData.contacts || []).filter((_, i) => i !== index);
    setEditData({ ...editData, contacts: newContacts.length ? newContacts : [''] });
  };
  
  const isDisapproved = client.tag === 'disapproved';
  const isPending = client.tag === 'pending';
  const isArchived = client.tag === 'archived client';
  const isActive = client.tag === 'active client';

  const isGhosted = (isDisapproved || isArchived) && !isEditing;
  const hideBody = isDisapproved || isPending;
  const showMoney = (isActive || isArchived);

  const inputClass = "w-full px-2 py-1.5 text-[13px] rounded border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] focus:border-[#1a73e8] focus:outline-none mb-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800";
  const labelClass = "flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1";
  const blueButtonClass = "p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors";

  return (
    <>
      <div className={`relative bg-white dark:bg-[#292a2d] rounded border transition-all duration-300 p-4 shadow-sm group ${isGhosted ? "border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/50 dark:bg-slate-900/10" : "border-[#dadce0] dark:border-[#3c4043]"} ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}>
        
        {isEditing && isAdmin ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-1.5">
              <label className={labelClass}><MdPerson size={14} className="text-[#1a73e8]" /> Kliento pavadinimas</label>
              <input type="text" className={`${inputClass} h-[38px]`} value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}><MdContactMail size={14} className="text-[#1a73e8]" /> Kontaktai</label>
              <div className="space-y-2">
                {(editData.contacts || []).map((contact, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <MdContactMail className="absolute left-2.5 top-2.5 text-slate-400" size={16} />
                      <input type="text" className={`${inputClass} h-[38px] pl-9 mb-0`} value={contact} onChange={(e) => handleContactChange(index, e.target.value)} />
                    </div>
                    {editData.contacts.length > 1 && (
                      <button type="button" onClick={() => removeContactField(index)} className={`${blueButtonClass} h-[38px] w-[38px] flex items-center justify-center border border-[#dadce0] dark:border-[#5f6368]`}><MdDelete size={16} /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addContactField} className="flex items-center gap-1 text-[13px] text-[#1a73e8] hover:underline pt-0.5 font-medium">
                  <MdAdd size={16} /> Pridėti kontaktą
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}><MdBadge size={14} className="text-[#1a73e8]" /> Kliento žymė</label>
              <select className={`${inputClass} h-[38px] capitalize ${CLIENT_TAGS_CONFIG[editData.tag]?.colorClass || ''}`} value={editData.tag} onChange={(e) => setEditData({...editData, tag: e.target.value})}>
                {ALL_TAGS.map(t => (
                  <option key={t} value={t} className={CLIENT_TAGS_CONFIG[t]?.colorClass || ''}>{CLIENT_TAGS_CONFIG[t]?.translation || ''}</option>
                ))}
              </select>
            </div>
            
            {showMoney && (
              <div className="space-y-1.5">
                <label className={labelClass}><MdEuro size={14} className="text-[#1a73e8]" /> Uždirbta suma</label>
                <div className="relative">
                  <MdEuro className="absolute left-2.5 top-2.5 text-slate-500" size={16} />
                  <input type="number" className={`${inputClass} h-[38px] pl-9 mb-0`} value={editData.moneyMade || 0} onChange={(e) => setEditData({...editData, moneyMade: parseFloat(e.target.value) || 0})} />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className={labelClass}><MdMiscellaneousServices size={14} className="text-[#1a73e8]" /> Paslauga</label>
              <input type="text" className={`${inputClass} h-[38px]`} value={editData.serviceNeeded || ''} onChange={(e) => setEditData({...editData, serviceNeeded: e.target.value})} />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}><MdNotes size={14} className="text-[#1a73e8]" /> Užrašai</label>
              <textarea className={`${inputClass} resize-none mb-0`} rows="3" value={editData.notes} onChange={(e) => setEditData({...editData, notes: e.target.value})} />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => { setIsEditing(false); setEditData({...client, contacts: client.contacts || ['']}); setStatus({ type: '', msg: '' }); }} className="p-1.5 rounded text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-colors"><MdClose size={16} /></button>
              <button type="button" onClick={handleSave} className="p-1.5 rounded text-white bg-[#1a73e8] hover:bg-[#1557b0] transition-colors shadow-sm"><MdCheck size={16} /></button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-medium text-[15px] truncate ${isDisapproved ? "text-slate-400" : isArchived ? "text-amber-900/70 dark:text-amber-600/70" : "text-[#202124] dark:text-[#e8eaed]"}`}>
                    {client.name}
                  </h3>
                  {showMoney && (
                    <span className="flex items-center gap-0.5 text-[11px] font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-full border border-green-200 dark:border-green-800/50 whitespace-nowrap">
                      {client.moneyMade?.toLocaleString() || 0} <MdEuro size={10} />
                    </span>
                  )}
                </div>
                <TagBadge tag={client.tag} />
              </div>
              
              {isAdmin && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => setIsEditing(true)} className={blueButtonClass}><MdEdit size={16} /></button>
                  <button onClick={() => setIsDeleteModalOpen(true)} className={blueButtonClass}><MdDelete size={16} /></button>
                </div>
              )}
            </div>

            {!hideBody && (
              <div className="mt-3 space-y-2 animate-in slide-in-from-top-1 duration-200">
                <div className="flex justify-between items-center text-[13px] text-[#202124] dark:text-[#e8eaed]">
                  <div className="flex items-center gap-2 min-w-0">
                    <MdMiscellaneousServices className={`shrink-0 ${isArchived ? "text-slate-400" : "text-blue-600"}`} size={16} />
                    <span className={`truncate ${isArchived ? "text-slate-500 italic" : "font-medium"}`}>
                      {client.serviceNeeded || "Paslauga nenurodyta"}
                    </span>
                  </div>
                </div>

                {client.contacts && client.contacts.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-2 min-h-[24px]">
                    {client.contacts.map((contact, idx) => {
                      const linkProps = getContactLinkProps(contact);
                      const baseBadgeClass = "flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded border border-blue-100 dark:border-blue-800/30 text-[11px] transition-colors max-w-[150px]";
                      
                      if (linkProps.isLink) {
                        return (
                          <a key={idx} href={linkProps.href} target={linkProps.target} rel={linkProps.rel} className={`${baseBadgeClass} hover:bg-blue-100 dark:hover:bg-blue-900/40 cursor-pointer`}>
                            <MdContactMail size={12} className="shrink-0" />
                            <span className="truncate">{contact}</span>
                          </a>
                        );
                      }

                      return (
                        <div key={idx} className={`${baseBadgeClass} cursor-default`}>
                          <MdContactMail size={12} className="shrink-0" />
                          <span className="truncate">{contact}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-2 h-[24px]" />
                )}

                <div className="flex items-start gap-2 px-3 py-0.5 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-50 max-h-[26px] group-hover:max-h-[500px]">
                  <MdNotes className="mt-0.5 text-slate-400 shrink-0" size={14} />
                  <p className="text-slate-600 dark:text-slate-400 text-[12px] leading-relaxed whitespace-pre-wrap break-words">
                    {client.notes || <span className="italic opacity-50">Nėra papildomų pastabų.</span>}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                    <MdPerson size={12} /> {client.marketer || 'Nenurodytas'}
                  </div>
                  <div className="flex items-center gap-1 shrink-0 pl-2">
                    <MdCalendarToday size={12} className="text-slate-400/80" />
                    <span>{formattedCreationDate}</span>
                  </div>
                </div>
              </div>
            )}

            {hideBody && (
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                  <MdPerson size={12} /> {client.marketer || 'Nenurodytas'}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <MdCalendarToday size={12} />
                  <span>{formattedCreationDate}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal isOpen={isDeleteModalOpen} title="Ištrinti klientą?" message={<>Ar tikrai norite visam laikui ištrinti klientą <span className="font-bold text-[#202124] dark:text-[#e8eaed]">„{client.name}“</span>?</>} onConfirm={handleDelete} onCancel={() => setIsDeleteModalOpen(false)} />

      <AnimatePresence>
        {status.msg && (
          <StatusMessage type={status.type} msg={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />
        )}
      </AnimatePresence>
    </>
  );
};

export default ClientCard;