import { MdArchive, MdCancel, MdPending, MdTrendingUp, MdCheckCircle, MdVerifiedUser, MdStar } from 'react-icons/md';

export const translateTag = (tag) => {
  if (!tag) return '';
  const translations = {
    'pending': 'laukia',
    'disapproved': 'atmesta',
    'approved': 'patvirtinta',
    'active client': 'aktyvus klientas',
    'archived client': 'archyvuotas klientas'
  };

  const t = tag.toLowerCase();
  if (translations[t]) return translations[t];

  if (t.startsWith('potential')) {
    return t.replace('potential', 'potencialas');
  }
  
  return tag;
};

export const getOptionColorClass = (tag) => {
  const t = tag.toLowerCase();
  if (t === 'disapproved' || ['potential 1', 'potential 2', 'potential 3', 'potential 4'].includes(t)) {
    return "text-red-600 dark:text-red-400 font-medium";
  }
  if (t === 'pending' || ['potential 5', 'potential 6', 'potential 7'].includes(t)) {
    return "text-yellow-600 dark:text-yellow-400 font-medium";
  }
  if (t === 'approved' || ['potential 8', 'potential 9', 'potential 10'].includes(t)) {
    return "text-green-600 dark:text-green-400 font-medium";
  }
  if (t === 'active client') {
    return "text-blue-600 dark:text-blue-400 font-bold";
  }
  if (t === 'archived client') {
    return "text-amber-800 dark:text-amber-500 font-medium";
  }
  return "text-slate-600 dark:text-slate-400";
};

const getTagStyles = (tag) => {
  const t = tag.toLowerCase();
  
  if (t === 'disapproved' || ['potential 1', 'potential 2', 'potential 3', 'potential 4'].includes(t)) {
    return { color: "bg-red-50 text-red-600 border-red-600 dark:bg-red-950/30 dark:text-red-400 dark:border-red-400", icon: MdCancel };
  }
  if (t === 'pending') {
    return { color: "bg-yellow-50 text-yellow-600 border-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-400", icon: MdPending };
  }
  if (['potential 5', 'potential 6', 'potential 7'].includes(t)) {
    return { color: "bg-yellow-50 text-yellow-600 border-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-400", icon: MdTrendingUp };
  }
  if (['potential 8', 'potential 9', 'potential 10'].includes(t)) {
    return { color: "bg-green-50 text-green-600 border-green-600 dark:bg-green-950/30 dark:text-green-400 dark:border-green-400", icon: MdTrendingUp };
  }
  if (t === 'approved') {
    return { color: "bg-green-50 text-green-600 border-green-600 dark:bg-green-950/30 dark:text-green-400 dark:border-green-400", icon: MdCheckCircle };
  }
  if (t === 'active client') {
    return { color: "bg-blue-50 text-blue-600 border-blue-600 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-400", icon: MdStar };
  }
  if (t === 'archived client') {
    return { color: "bg-amber-100 text-amber-800 border-amber-800 dark:bg-amber-950/40 dark:text-amber-500 dark:border-amber-600", icon: MdArchive };
  }
  
  return { color: "bg-slate-50 text-slate-600 border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-400", icon: MdVerifiedUser };
};

export const TagBadge = ({ tag }) => {
  const { color, icon: Icon } = getTagStyles(tag);
  
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${color}`}>
      <Icon size={12} />
      {translateTag(tag)}
    </span>
  );
};