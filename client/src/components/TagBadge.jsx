import { CLIENT_TAGS_CONFIG } from '../config';

export const TagBadge = ({ tag }) => {
  const config = CLIENT_TAGS_CONFIG[tag];
  if (!config) return null;

  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${config.styles}`}>
      <Icon size={12} />
      {config.translation}
    </span>
  );
};