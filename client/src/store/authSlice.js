export const createAuthSlice = (set, get) => ({
  user: null, // Čia saugosime visą ApiKey dokumentą
  apiKey: localStorage.getItem('crm-api-key') || null,
  isAuthenticated: !!localStorage.getItem('crm-api-key'),
  isLoading: true,

  getAuthHeaders: () => ({ 
    'Content-Type': 'application/json', 
    'x-api-key': get().apiKey 
  }),

  verifyAuth: async () => {
    const key = get().apiKey;
    if (!key) { set({ isLoading: false }); return; }
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, { 
        headers: { 'x-api-key': key } 
      });
      if (res.ok) {
        const data = await res.json();
        // Saugome visą user objektą (kuris apima role, owner, emailsSent ir kt.)
        set({ user: data, isAuthenticated: true, isLoading: false });
      } else { 
        get().logout(); 
      }
    } catch (err) { 
      get().logout(); 
    }
  },

  login: async (inputKey) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ key: inputKey }) 
      });
      if (!res.ok) return false;
      const data = await res.json();
      
      console.log("pasifetchinom: ", `${import.meta.env.VITE_API_URL}/api/login`);
      

      set({ 
        user: data.user, 
        apiKey: data.apiKey, 
        isAuthenticated: true 
      });
      localStorage.setItem('crm-api-key', data.apiKey);
      return true;
    } catch (err) { return false; }
  },

  logout: () => {
    set({ 
      user: null, 
      apiKey: null, 
      isAuthenticated: false, 
      clients: [], 
      apiKeys: [], 
      masterList: [] 
    });
    localStorage.removeItem('crm-api-key');
  },

  updateOwnKey: async (newKey) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/me/update-key`, { 
        method: 'PUT', 
        headers: get().getAuthHeaders(), 
        body: JSON.stringify({ newKey }) 
      });
      if (res.ok) { 
        set({ apiKey: newKey }); 
        localStorage.setItem('crm-api-key', newKey); 
        // Po rakto atnaujinimo iškart atnaujiname user duomenis
        get().verifyAuth();
        return { success: true }; 
      }
      const data = await res.json();
      return { success: false, error: data.error };
    } catch (err) { return { success: false, error: "Tinklo klaida" }; }
  }
});