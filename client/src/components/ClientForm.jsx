import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getOptionColorClass, translateTag } from './TagBadge';
import StatusMessage from './StatusMessage';
import { MdPersonAdd } from 'react-icons/md';

const INITIAL_TAGS = ['pending', 'potential 1', 'potential 2', 'potential 3', 'potential 4', 'potential 5', 'potential 6', 'potential 7', 'potential 8', 'potential 9', 'potential 10', 'disapproved'];

export const ClientForm = () => {
  const addClient = useStore((state) => state.addClient);

  const [formData, setFormData] = useState({ name: '', tag: 'pending', serviceNeeded: '', notes: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [issubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status.msg) {
      const timer = setTimeout(() => setStatus({ type: '', msg: '' }), 2500);
      return () => clearTimeout(timer);
    }
  }, [status.msg]);

  const isPending = formData.tag === 'pending';
  const isDisapproved = formData.tag === 'disapproved';
  const isGhosted = isPending || isDisapproved;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    
    try {
      const trimmedName = formData.name.trim();
      if (!trimmedName) throw new Error("Įmonės pavadinimas yra privalomas.");
      if (!isGhosted && !formData.serviceNeeded.trim()) {
        throw new Error("Būtina nurodyti reikiamą paslaugą.");
      }

      setIsSubmitting(true);

      const normalizedName = trimmedName.toUpperCase();

      await addClient({
        ...formData,
        name: normalizedName
      });
      
      setStatus({ type: 'success', msg: 'Kontaktas sėkmingai pridėtas!' });
      setFormData({ name: '', tag: 'pending', serviceNeeded: '', notes: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Nepavyko išsaugoti kontakto.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase = "w-full px-3 py-2 text-[14px] rounded border transition-all duration-200 focus:outline-none";
  const activeInput = `${inputBase} border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]`;
  const ghostInput = `${inputBase} border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 cursor-not-allowed italic`;
  const labelClass = "block text-[12px] font-medium text-[#5f6368] dark:text-[#9aa0a6] mb-1 transition-colors";

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#292a2d]">
      <div className="p-6 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center gap-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
          <MdPersonAdd size={24} className="text-[#1a73e8]" />
        </div>
        <h2 className="text-[16px] font-medium text-[#202124] dark:text-[#e8eaed]">Naujas klientas</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <StatusMessage msg={status.msg} type={status.type} />
          <div>
            <label className={labelClass}>Įmonės pavadinimas</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={activeInput} placeholder="Įveskite pavadinimą" />
          </div>
          <div>
            <label className={labelClass}>Pradinė būsena</label>
            <select value={formData.tag} onChange={(e) => setFormData({ ...formData, tag: e.target.value })} className={`${activeInput} capitalize font-medium ${getOptionColorClass(formData.tag)}`}>
              {INITIAL_TAGS.map(tag => <option key={tag} value={tag} className={getOptionColorClass(tag)}>{translateTag(tag)}</option>)}
            </select>
          </div>
          <div className={isGhosted ? "opacity-60" : "opacity-100"}>
            <label className={`${labelClass} ${isGhosted ? "text-slate-400 dark:text-slate-600" : ""}`}>Reikiama paslauga {isGhosted && "(Neprivaloma)"}</label>
            <input type="text" disabled={isGhosted} value={formData.serviceNeeded} onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })} className={isGhosted ? ghostInput : activeInput} placeholder={isGhosted ? "Nėra" : "pvz. Svetainės atnaujinimas"} />
          </div>
          <div className={isGhosted ? "opacity-60" : "opacity-100"}>
            <label className={`${labelClass} ${isGhosted ? "text-slate-400 dark:text-slate-600" : ""}`}>Užrašai</label>
            <textarea rows="3" disabled={isGhosted} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className={`${isGhosted ? ghostInput : activeInput} resize-none`} placeholder={isGhosted ? "Nėra" : "Skambučio detalės..."} />
          </div>
          <button type="submit" disabled={issubmitting} className={`w-full py-2 mt-2 text-[14px] font-medium rounded transition-all ${issubmitting ? "opacity-50 cursor-wait" : ""} ${isDisapproved ? "bg-slate-600 hover:bg-slate-700 text-white" : "bg-[#1a73e8] hover:bg-[#1557b0] text-white"}`}>
            {issubmitting ? "Saugoma..." : isDisapproved ? "Pridėti į juodąjį sąrašą" : "Išsaugoti kontaktą"}
          </button>
        </form>
      </div>
    </div>
  );
};