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
      if (res.ok) { const newKey = await res.json(); set(state => ({ apiKeys: [...state.apiKeys, newKey] })); return true; }
      return false;
    } catch (err) { return false; }
  },
  deleteApiKey: async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/keys/${id}`, { method: 'DELETE', headers: get().getAuthHeaders() });
      if (res.ok) { set(state => ({ apiKeys: state.apiKeys.filter(k => k._id !== id) })); return true; }
      return false;
    } catch (err) { return false; }
  }
});