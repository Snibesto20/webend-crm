import { useState } from 'react';
import { useStore } from '../store/useStore';
import { getOptionColorClass, translateTag } from './TagBadge';
import { AnimatePresence } from 'framer-motion';
import { StatusMessage } from './StatusMessage';
import { ERRORS } from '../config';
import { MdPersonAdd, MdAdd, MdDelete, MdContactMail, MdPerson, MdBuild, MdMiscellaneousServices, MdBadge, MdNotes } from 'react-icons/md';

const INITIAL_TAGS = [
  'potential 1', 'potential 2', 'potential 3', 'potential 4', 'potential 5', 
  'potential 6', 'potential 7', 'potential 8', 'potential 9', 'potential 10', 
  'pending', 'disapproved', 'unprocessed'
];

export const ClientForm = () => {
  const addClient = useStore((state) => state.addClient);
  const user = useStore((state) => state.user);

  const [formData, setFormData] = useState({ 
    name: '', 
    tag: 'potential 1', 
    serviceNeeded: '', 
    notes: '',
    contacts: ['']
  });
  
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [issubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isDisapproved = formData.tag === 'disapproved';
  const isGhosted = isDisapproved;

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

    const filteredContacts = formData.contacts.map(c => c.trim()).filter(c => c !== '');
    if (formData.tag === 'unprocessed' && filteredContacts.length === 0) {
      setStatus({ type: 'error', msg: ERRORS.CLIENT_CONTACTS_REQUIRED_FOR_UNPROCESSED });
      return;
    }
    
    try {
      setIsSubmitting(true);

      await addClient({
        ...formData,
        name: trimmedName.toUpperCase(),
        contacts: filteredContacts
      });
      
      setStatus({ type: 'success', msg: 'Naujas klientas pridėtas sėkmingai!' });
      setFormData({ name: '', tag: 'potential 1', serviceNeeded: '', notes: '', contacts: [''] });
    } catch (err) {
      const backendCode = err.message;
      let errorMsg = ERRORS[backendCode] || ERRORS.GLOBAL_UNKNOWN_ERROR;
      
      if (backendCode === 'CLIENT_DUPLICATE_NAME' && err.meta?.name) {
        errorMsg = `Klaida: Klientas "${err.meta.name}" jau egzistuoja sistemoje.`;
      }

      setStatus({ type: 'error', msg: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-3 py-2 text-[13px] rounded border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] focus:border-[#1a73e8] focus:outline-none transition-all";
  const ghostInput = "w-full px-3 py-2 text-[13px] rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 cursor-not-allowed italic focus:outline-none";
  const labelClass = "flex items-center gap-2 text-[11px] text-[#5f6368] dark:text-[#9aa0a6] tracking-wider";
  const removeButtonClass = "p-1.5 text-slate-400 dark:text-slate-500 hover:text-[#1a73e8] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all inline-flex items-center justify-center shrink-0";
  const asterisk = "text-[#5f6368] dark:text-[#9aa0a6] font-bold ml-0.5";

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#292a2d]">
      <div className="p-6 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center gap-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
          <MdPersonAdd size={24} className="text-[#1a73e8]" />
        </div>
        <h2 className="text-[16px] font-medium text-[#202124] dark:text-[#e8eaed]">Naujas klientas</h2>
      </div>
      
      <div className={`flex-1 overflow-y-auto custom-scrollbar p-6 ${!isAdmin ? "opacity-60 pointer-events-none select-none" : ""}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass}>
              <MdPerson size={14} className="text-[#1a73e8]" /> 
              <span>Kliento pavadinimas <span className={asterisk}>*</span></span>
            </label>
            <input type="text" disabled={!isAdmin} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`${inputClass} h-[38px]`} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              <MdContactMail size={14} className="text-[#1a73e8]" /> 
              <span>Kontaktai {formData.tag === 'unprocessed' && <span className={asterisk}>*</span>}</span>
            </label>
            <div className="space-y-2">
              {formData.contacts.map((contact, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <MdContactMail className="absolute left-2.5 top-2.5 text-slate-400" size={16} />
                    <input type="text" disabled={!isAdmin} value={contact} onChange={(e) => handleContactChange(index, e.target.value)} className={`${inputClass} h-[38px] pl-9`} />
                  </div>
                  {formData.contacts.length > 1 && (
                    <button type="button" disabled={!isAdmin} onClick={() => removeContactField(index)} className={`${removeButtonClass} h-[38px] w-[38px]`}>
                      <MdDelete size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" disabled={!isAdmin} onClick={addContactField} className="flex items-center gap-1 text-[13px] text-[#1a73e8] hover:underline pt-0.5 font-medium disabled:no-underline disabled:opacity-40">
                <MdAdd size={16} /> Pridėti kontaktą
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              <MdBadge size={14} className="text-[#1a73e8]" /> 
              <span>Kliento žymė <span className={asterisk}>*</span></span>
            </label>
            <select disabled={!isAdmin} value={formData.tag} onChange={(e) => setFormData({ ...formData, tag: e.target.value })} className={`${inputClass} h-[38px] capitalize font-medium ${getOptionColorClass(formData.tag)}`}>
              {INITIAL_TAGS.map(tag => <option key={tag} value={tag} className={getOptionColorClass(tag)}>{translateTag(tag)}</option>)}
            </select>
          </div>

          <div className={`space-y-1.5 ${isGhosted ? "opacity-60" : "opacity-100"}`}>
            <label className={labelClass}><MdMiscellaneousServices size={14} className="text-[#1a73e8]" /> Paslauga</label>
            <input type="text" disabled={isGhosted || !isAdmin} value={formData.serviceNeeded} onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })} className={isGhosted ? `${ghostInput} h-[38px]` : `${inputClass} h-[38px]`} />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}><MdNotes size={14} className="text-[#1a73e8]" /> Užrašai</label>
            <textarea rows="3" disabled={!isAdmin} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className={`${inputClass} resize-none`} />
          </div>

          <button type="submit" disabled={issubmitting || !isAdmin} className={`w-full text-[13px] h-[38px] rounded transition-all shadow-sm active:scale-[0.98] font-bold ${issubmitting ? "opacity-50 cursor-wait" : ""} ${!isAdmin ? "bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none" : isDisapproved ? "bg-slate-600 hover:bg-slate-700 text-white" : "bg-[#1a73e8] hover:bg-[#1557b0] text-white"}`}>
            {issubmitting ? "Vykdoma..." : isDisapproved ? "Pridėti į juodąjį sąrašą" : "Išsaugoti kontaktą"}
          </button>
        </form>
      </div>
      <AnimatePresence>
        {status.msg && <StatusMessage type={status.type} msg={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />}
      </AnimatePresence>
    </div>
  );
};