import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { AnimatePresence } from 'framer-motion';
import { StatusMessage } from './StatusMessage';
import { ComponentHeader } from './headers/ComponentHeader';
import { ClientTagDropdown } from './ClientTagDropdown';
import { ERRORS, INITIAL_TAGS } from '../config';
import { MdPersonAdd, MdAdd, MdDelete, MdContactMail, MdPerson, MdMiscellaneousServices, MdBadge, MdNotes } from 'react-icons/md';

const formatPhoneNumber = (contactStr) => {
  const trimmed = contactStr.trim();
  if (!trimmed) return '';

  const hasLetters = /[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ]/i.test(trimmed);
  
  if (hasLetters) {
    return trimmed;
  }

  let cleaned = trimmed.replace(/\D/g, '');
  if (!cleaned) return trimmed;

  if (cleaned.startsWith('370')) {
    cleaned = '0' + cleaned.substring(3);
  } else if (cleaned.startsWith('8')) {
    cleaned = '0' + cleaned.substring(1);
  }

  return cleaned;
};

export const ClientForm = () => {
  const addClient = useStore((state) => state.addClient);
  const user = useStore((state) => state.user);
  const filterType = useStore((state) => state.filterType);

  const getDefaultTag = () => filterType === 'unprocessed' ? 'unprocessed' : 'disapproved';

  const [formData, setFormData] = useState({ 
    name: '', 
    tag: getDefaultTag(), 
    serviceNeeded: '', 
    notes: '',
    contacts: ['']
  });
  
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [issubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const nextTag = getDefaultTag();
    setFormData((prev) => ({
      ...prev,
      tag: nextTag,
      serviceNeeded: nextTag === 'unprocessed' ? '' : prev.serviceNeeded
    }));
  }, [filterType]);

  const isAdmin = user?.role === 'admin';
  const isUnprocessed = formData.tag === 'unprocessed';
  const isDisapproved = formData.tag === 'disapproved';
  
  const isGhosted = isDisapproved || isUnprocessed;

  const handleContactChange = (index, value) => {
    if (!isAdmin) return;
    const newContacts = [...formData.contacts];
    newContacts[index] = value;
    setFormData({ ...formData, contacts: newContacts });
  };

  const addContactField = () => {
    if (!isAdmin) return;
    setFormData({ ...formData, contacts: [...formData.contacts, ''] });
  };

  const removeContactField = (index) => {
    if (!isAdmin) return;
    const newContacts = formData.contacts.filter((_, i) => i !== index);
    setFormData({ ...formData, contacts: newContacts.length ? newContacts : [''] });
  };

  const handleTagChange = (newTag) => {
    setFormData((prev) => ({
      ...prev,
      tag: newTag,
      serviceNeeded: newTag === 'unprocessed' ? '' : prev.serviceNeeded
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setStatus({ type: 'error', msg: 'Tik administratoriai turi teisę pridėti naujus klientus.' });
      return;
    }
    setStatus({ type: '', msg: '' });
    
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setStatus({ type: 'error', msg: ERRORS.CLIENT_NAME_REQUIRED });
      return;
    }
    
    if (!formData.tag) {
      setStatus({ type: 'error', msg: ERRORS.CLIENT_TAG_REQUIRED });
      return;
    }

    if (isUnprocessed && formData.serviceNeeded.trim()) {
      setStatus({ type: 'error', msg: 'Klaida: Neapdorotam (unprocessed) klientui negalima priskirti paslaugos.' });
      return;
    }

    const formattedContacts = formData.contacts
      .map(c => formatPhoneNumber(c))
      .filter(c => c.trim() !== '');

    if (isUnprocessed && formattedContacts.length === 0) {
      setStatus({ type: 'error', msg: ERRORS.CLIENT_CONTACTS_REQUIRED_FOR_UNPROCESSED });
      return;
    }
    
    try {
      setIsSubmitting(true);

      await addClient({
        ...formData,
        name: trimmedName.toUpperCase(),
        contacts: formattedContacts,
        serviceNeeded: isUnprocessed ? '' : formData.serviceNeeded.trim()
      });
      
      setStatus({ type: 'success', msg: 'Naujas klientas pridėtas sėkmingai!' });
      
      setFormData({ 
        name: '', 
        tag: getDefaultTag(), 
        serviceNeeded: '', 
        notes: '', 
        contacts: [''] 
      });
    } catch (err) {
      const backendCode = err.code || err.message;
      let errorMsg = ERRORS[backendCode] || ERRORS.GLOBAL_UNKNOWN_ERROR;
      
      if (backendCode === 'CLIENT_DUPLICATE_NAME' && (err.meta?.name || err.response?.data?.meta?.name)) {
        const nameVal = err.meta?.name || err.response?.data?.meta?.name;
        errorMsg = `Klaida: Klientas "${nameVal}" jau egzistuoja sistemoje.`;
      }

      setStatus({ type: 'error', msg: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm">
      <ComponentHeader title="Naujas klientas" icon={MdPersonAdd} />
      
      <div className={`flex-1 overflow-y-auto custom-scrollbar p-6 ${!isAdmin ? "opacity-60 pointer-events-none select-none" : ""}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="label-base">
              <MdPerson size={14} className="text-[#1a73e8]" /> 
              <span>Kliento pavadinimas <span className="form-asterisk">*</span></span>
            </label>
            <input type="text" disabled={!isAdmin} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-base" />
          </div>

          <div className="space-y-1.5">
            <label className="label-base">
              <MdContactMail size={14} className="text-[#1a73e8]" /> 
              <span>Kontaktai {isUnprocessed && <span className="form-asterisk">*</span>}</span>
            </label>
            <div className="space-y-2">
              {formData.contacts.map((contact, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <input type="text" disabled={!isAdmin} value={contact} onChange={(e) => handleContactChange(index, e.target.value)} className="input-base pl-9" />
                  {formData.contacts.length > 1 && (
                    <button type="button" disabled={!isAdmin} onClick={() => removeContactField(index)} className="btn-blue-icon h-[38px] w-[38px] flex items-center justify-center shrink-0"><MdDelete size={16} /></button>
                  )}
                </div>
              ))}
              <button type="button" disabled={!isAdmin} onClick={addContactField} className="flex items-center gap-1 text-[13px] text-[#1a73e8] hover:underline pt-0.5 font-medium disabled:no-underline disabled:opacity-40">
                <MdAdd size={16} /> Pridėti kontaktą
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label-base">
              <MdBadge size={14} className="text-[#1a73e8]" /> 
              <span>Kliento žymė <span className="form-asterisk">*</span></span>
            </label>
            <ClientTagDropdown value={formData.tag} onChange={handleTagChange} disabled={!isAdmin} tagsList={INITIAL_TAGS} />
          </div>

          <div className={`space-y-1.5 ${isGhosted ? "opacity-60" : "opacity-100"}`}>
            <label className="label-base"><MdMiscellaneousServices size={14} className="text-[#1a73e8]" /> Paslauga</label>
            <input 
              type="text" 
              disabled={isGhosted || !isAdmin} 
              value={formData.serviceNeeded} 
              onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })} 
              className={isGhosted ? "input-ghost" : "input-base"} 
            />
          </div>

          <div className="space-y-1.5">
            <label className="label-base"><MdNotes size={14} className="text-[#1a73e8]" /> Užrašai</label>
            <textarea disabled={!isAdmin} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="input-base resize-none h-auto" rows="3" />
          </div>

          <button type="submit" disabled={issubmitting || !isAdmin} className={`btn-blue w-full h-[38px] ${issubmitting ? "opacity-50 cursor-wait" : ""} ${!isAdmin ? "bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none hover:bg-slate-300 dark:hover:bg-slate-800" : ""}`}>
            {issubmitting ? "Vykdoma..." : "Išsaugoti kontaktą"}
          </button>
        </form>
      </div>
      <AnimatePresence>
        {status.msg && <StatusMessage type={status.type} msg={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />}
      </AnimatePresence>
    </div>
  );
};