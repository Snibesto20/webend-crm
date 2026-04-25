export const createUISlice = (set, get) => ({
  darkMode: false,
  showTrash: false,
  isLoading: true,

  initUI: () => {
    const isDark = localStorage.getItem('crm-dark') === 'true';
    const isTrash = localStorage.getItem('crm-trash') === 'true';
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    set({ darkMode: isDark, showTrash: isTrash });
  },

  toggleDarkMode: () => {
    const newMode = !get().darkMode;
    
    set({ darkMode: newMode });
    localStorage.setItem('crm-dark', newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggleTrash: () => {
    const trash = !get().showTrash;
    set({ showTrash: trash });
    localStorage.setItem('crm-trash', trash);
  }
});