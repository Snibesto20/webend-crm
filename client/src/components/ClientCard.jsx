import { useState } from 'react';
import { useStore } from '../store/useStore';
import { TagBadge, getOptionColorClass, translateTag } from './TagBadge';
import { ConfirmModal } from './ConfirmModal';
import { 
  MdEdit, 
  MdDelete, 
  MdCheck, 
  MdClose, 
  MdEuro, 
  MdMiscellaneousServices, 
  MdNotes,
  MdPerson 
} from 'react-icons/md';

const ALL_TAGS = [
  'pending', 'potential 1', 'potential 2', 'potential 3', 'potential 4', 'potential 5', 
  'potential 6', 'potential 7', 'potential 8', 'potential 9', 'potential 10', 
  'approved', 'Active Client', 'disapproved', 'Archived Client'
];

export const ClientCard = ({ client }) => {
  const { updateClient, deleteClient } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...client });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSave = async () => {
    await updateClient(client.id, editData);
    setIsEditing(false);
  };

  const isDisapproved = client.tag === 'disapproved';
  const isPending = client.tag === 'pending';
  const isArchived = client.tag === 'Archived Client';
  const isActive = client.tag === 'Active Client';

  const isGhosted = isDisapproved || isPending || isArchived;
  const useAbsoluteMarketer = isDisapproved || isPending;
  
  const hideBody = isDisapproved || isPending;
  const showMoney = (isActive || isArchived);

  const isCurrentlyGhosted = editData.tag === 'disapproved' || editData.tag === 'pending';

  const inputClass = "w-full px-2 py-1.5 text-[13px] rounded border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] focus:border-[#1a73e8] focus:outline-none mb-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800";

  return (
    <>
      <div className={`relative bg-white dark:bg-[#292a2d] rounded border transition-all duration-300 p-4 shadow-sm group ${
        isGhosted 
          ? "border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/50 dark:bg-slate-900/10" 
          : "border-[#dadce0] dark:border-[#3c4043]"
      }`}>
        {useAbsoluteMarketer && !isEditing && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-1.5 py-0.5 rounded opacity-70">
            <MdPerson size={10} />
            {client.marketer || 'Nenurodytas'}
          </div>
        )}

        {isEditing ? (
          <div className="animate-in fade-in duration-300">
            <input className={inputClass} placeholder="Įmonės pavadinimas" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} disabled={isCurrentlyGhosted} />
            <input className={inputClass} placeholder="Reikiama paslauga" value={editData.serviceNeeded || ''} onChange={(e) => setEditData({...editData, serviceNeeded: e.target.value})} disabled={isCurrentlyGhosted} />
            
            <select className={`${inputClass} capitalize font-medium ${getOptionColorClass(editData.tag)}`} value={editData.tag} onChange={(e) => setEditData({...editData, tag: e.target.value})}>
              {ALL_TAGS.map(t => (
                <option key={t} value={t} className={getOptionColorClass(t)}>{translateTag(t)}</option>
              ))}
            </select>
            
            {showMoney && (
              <div className="relative mb-2">
                <MdEuro className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="number" className={`${inputClass} pl-7 mb-0`} placeholder="Uždirbta suma" value={editData.moneyMade || 0} onChange={(e) => setEditData({...editData, moneyMade: parseFloat(e.target.value) || 0})} disabled={isCurrentlyGhosted} />
              </div>
            )}

            <textarea className={`${inputClass} resize-none mb-0`} rows="2" placeholder="Pastabos..." value={editData.notes} onChange={(e) => setEditData({...editData, notes: e.target.value})} disabled={isCurrentlyGhosted} />

            <div className="flex gap-2 justify-end mt-3">
              <button 
                onClick={() => { setIsEditing(false); setEditData({...client}); }} 
                className="p-1.5 rounded text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-colors"
              >
                <MdClose size={16} />
              </button>
              <button 
                onClick={handleSave} 
                className="p-1.5 rounded text-white bg-[#1a73e8] hover:bg-[#1557b0] transition-colors shadow-sm"
              >
                <MdCheck size={16} />
              </button>
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
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => setIsEditing(true)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                  <MdEdit size={16} />
                </button>
                <button onClick={() => setIsDeleteModalOpen(true)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                  <MdDelete size={16} />
                </button>
              </div>
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
                  {!useAbsoluteMarketer && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                      <MdPerson size={12} />
                      {client.marketer || 'Nenurodytas'}
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-2 px-3 py-0.5 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-50 max-h-[26px] group-hover:max-h-[500px]">
                  <MdNotes className="mt-0.5 text-slate-400 shrink-0" size={14} />
                  <p className="text-slate-600 dark:text-slate-400 text-[12px] leading-relaxed whitespace-pre-wrap break-words">
                    {client.notes || <span className="italic opacity-50">Nėra papildomų pastabų.</span>}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Ištrinti klientą?"
        message={<>Ar tikrai norite visam laikui ištrinti klientą <span className="font-bold text-[#202124] dark:text-[#e8eaed]">„{client.name}“</span>?</>}
        onConfirm={() => { deleteClient(client.id); setIsDeleteModalOpen(false); }}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};