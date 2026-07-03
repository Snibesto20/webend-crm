export const createAdminSlice = (set, get) => ({
  apiKeys: [],
  fetchApiKeys: async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/keys`, { headers: get().getAuthHeaders() });
      if (res.ok) { const data = await res.json(); set({ apiKeys: data }); }
    } catch (err) {}
  },
  createApiKey: async (keyData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/keys`, { method: 'POST', headers: get().getAuthHeaders(), body: JSON.stringify(keyData) });
      const data = await res.json();
      
      if (res.ok) { 
        set(state => ({ apiKeys: [...state.apiKeys, data] })); 
        return { success: true }; 
      }
      return { success: false, error: data.error || 'Nepavyko sukurti rakto.' };
    } catch (err) { 
      return { success: false, error: 'Tinklo klaida. Bandykite vėliau.' }; 
    }
  },
  deleteApiKey: async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/keys/${id}`, { method: 'DELETE', headers: get().getAuthHeaders() });
      if (res.ok) { set(state => ({ apiKeys: state.apiKeys.filter(k => k._id !== id) })); return true; }
      return false;
    } catch (err) { return false; }
  }
});