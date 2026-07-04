export const createClientSlice = (set, get) => ({
  clients: [],
  isLoading: false,
  filterType: 'processed',

  setFilterType: (type) => set({ filterType: type }),

  fetchClients: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/clients`, { headers: get().getAuthHeaders() });
      if (res.status === 401 || res.status === 403) { get().logout(); return; }
      const data = await res.json();
      set({ clients: data, isLoading: false });
    } catch (err) { 
      set({ isLoading: false }); 
    }
  },

  addClient: async (clientData) => {
    try {
      const currentUser = get().user;
      const dataWithMarketer = {
        ...clientData,
        marketer: currentUser ? currentUser.owner : 'Nenurodyta'
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/clients`, { 
        method: 'POST', 
        headers: get().getAuthHeaders(), 
        body: JSON.stringify(dataWithMarketer)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const error = new Error(errorData.code || 'UNKNOWN_ERROR');
        error.meta = errorData.meta;
        throw error;
      }
      
      const newClient = await res.json();
      set((state) => ({ clients: [...state.clients, newClient] }));
      return newClient;
    } catch (err) {
      console.error("Klaida pridedant klientą:", err);
      throw err;
    }
  },

  updateClient: async (id, updatedData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/${id}`, { 
        method: 'PUT', 
        headers: get().getAuthHeaders(), 
        body: JSON.stringify(updatedData) 
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const error = new Error(errorData.code || 'UNKNOWN_ERROR');
        error.meta = errorData.meta;
        throw error;
      }
      
      const updatedClient = await res.json();
      set((state) => ({ 
        clients: state.clients.map(c => c._id === id ? updatedClient : c) 
      }));
    } catch (err) {
      console.error("Klaida atnaujinant klientą:", err);
      throw err;
    }
  },

  deleteClient: async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/${id}`, { 
        method: 'DELETE', 
        headers: get().getAuthHeaders() 
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.code || 'UNKNOWN_ERROR');
      }
      
      set((state) => ({ clients: state.clients.filter(c => c._id !== id) }));
    } catch (err) {
      console.error("Klaida trinant klientą:", err);
      throw err;
    }
  },
});