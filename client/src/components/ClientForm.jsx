import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getOptionColorClass, translateTag } from './TagBadge';
import StatusMessage from './StatusMessage';
import { MdPersonAdd, MdAdd, MdDelete, MdContactMail } from 'react-icons/md';

const INITIAL_TAGS = ['pending', 'potential 1', 'potential 2', 'potential 3', 'potential 4', 'potential 5', 'potential 6', 'potential 7', 'potential 8', 'potential 9', 'potential 10', 'disapproved'];

export const ClientForm = () => {
  const addClient = useStore((state) => state.addClient);
  const user = useStore((state) => state.user);

  const [formData, setFormData] = useState({ 
    name: '', 
    tag: 'pending', 
    serviceNeeded: '', 
    notes: '',
    contacts: ['']
  });
  
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [issubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status.msg) {
      const timer = setTimeout(() => setStatus({ type: '', msg: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [status.msg]);

  const isAdmin = user?.role === 'admin';

  const isPending = formData.tag === 'pending';
  const isDisapproved = formData.tag === 'disapproved';
  const isGhosted = isPending || isDisapproved;

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
      setStatus({ type: 'error', msg: 'Klaida: Tik administratoriai turi teisę pridėti naujus klientus.' });
      return;
    }
    setStatus({ type: '', msg: '' });
    
    try {
      const trimmedName = formData.name.trim();
      if (!trimmedName) {
        throw new Error("Lauko klaida: Įmonės pavadinimas yra privalomas.");
      }

      const filteredContacts = formData.contacts.map(c => c.trim()).filter(c => c !== '');
      if (filteredContacts.length === 0) {
        throw new Error("Lauko klaida: Būtina įvesti bent vieną kontaktą (el. paštą arba telefono numerį).");
      }

      setIsSubmitting(true);

      await addClient({
        ...formData,
        name: trimmedName.toUpperCase(),
        contacts: filteredContacts
      });
      
      setStatus({ type: 'success', msg: 'Naujas kontaktas ir įmonė sėkmingai išsaugoti DB!' });
      setFormData({ name: '', tag: 'pending', serviceNeeded: '', notes: '', contacts: [''] });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Nepavyko išsaugoti kontakto dėl nenumatytos sistemos klaidos.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase = "w-full px-3 py-2 text-[14px] rounded border transition-all duration-200 focus:outline-none";
  const activeInput = `${inputBase} border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] disabled:bg-slate-50 dark:disabled:bg-slate-900/40 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-slate-200 dark:disabled:border-slate-800 disabled:cursor-not-allowed`;
  const ghostInput = `${inputBase} border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 cursor-not-allowed italic`;
  const labelClass = `block text-[11px] font-medium mb-1 transition-colors ${isAdmin ? "text-slate-500" : "text-slate-400 dark:text-slate-600"}`;
  const blueButtonClass = "p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500 disabled:cursor-not-allowed";

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
          <div>
            <label className={labelClass}>Įmonės pavadinimas</label>
            <input type="text" disabled={!isAdmin} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={activeInput} placeholder="Įveskite pavadinimą" />
          </div>

          <div>
            <label className={labelClass}>Kontaktai (El. paštas / Tel. nr.)</label>
            <div className="space-y-2">
              {formData.contacts.map((contact, index) => (
                <div key={index} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-200 items-center">
                  <div className="relative flex-1">
                    <MdContactMail className="absolute left-2.5 top-3 text-slate-400" size={16} />
                    <input type="text" disabled={!isAdmin} value={contact} onChange={(e) => handleContactChange(index, e.target.value)} className={`${activeInput} pl-9`} placeholder="pvz. info@imone.lt" />
                  </div>
                  {formData.contacts.length > 1 && (
                    <button type="button" disabled={!isAdmin} onClick={() => removeContactField(index)} className={blueButtonClass}>
                      <MdDelete size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" disabled={!isAdmin} onClick={addContactField} className="flex items-center gap-1 text-[13px] text-[#1a73e8] hover:underline pt-1 font-medium disabled:no-underline disabled:opacity-40">
                <MdAdd size={16} /> Pridėti dar vieną kontaktą
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Kliento statusas</label>
            <select disabled={!isAdmin} value={formData.tag} onChange={(e) => setFormData({ ...formData, tag: e.target.value })} className={`${activeInput} capitalize font-medium ${getOptionColorClass(formData.tag)}`}>
              {INITIAL_TAGS.map(tag => <option key={tag} value={tag} className={getOptionColorClass(tag)}>{translateTag(tag)}</option>)}
            </select>
          </div>

          <div className={isGhosted ? "opacity-60" : "opacity-100"}>
            <label className={`${labelClass} ${isGhosted ? "text-slate-400 dark:text-slate-600" : ""}`}>Reikiama paslauga</label>
            <input type="text" disabled={isGhosted || !isAdmin} value={formData.serviceNeeded} onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })} className={isGhosted ? ghostInput : activeInput} placeholder={isGhosted ? "Nėra" : "pvz. Svetainės atnaujinimas"} />
          </div>

          <div>
            <label className={labelClass}>Užrašai</label>
            <textarea rows="3" disabled={!isAdmin} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className={`${activeInput} resize-none`} placeholder="Skambučio detalės..." />
          </div>

          <button type="submit" disabled={issubmitting || !isAdmin} className={`w-full py-2 mt-2 text-[14px] font-medium rounded transition-all ${issubmitting ? "opacity-50 cursor-wait" : ""} ${!isAdmin ? "bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed" : isDisapproved ? "bg-slate-600 hover:bg-slate-700 text-white" : "bg-[#1a73e8] hover:bg-[#1557b0] text-white"}`}>
            {issubmitting ? "Saugoma..." : isDisapproved ? "Pridėti į juodąjį sąrašą" : "Išsaugoti kontaktą"}
          </button>

          {status.msg && (
            <div className="pt-2 animate-in fade-in duration-200">
              <StatusMessage msg={status.msg} type={status.type} />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};