export const createClientSlice = (set, get) => ({
  clients: [],
  isLoading: false,

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
      // Automatiškai pridedame marketerį iš prisijungusio vartotojo objekto
      const currentUser = get().user;
      const dataWithMarketer = {
        ...clientData,
        marketer: currentUser ? currentUser.owner : 'Nenurodyta'
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/clients`, { 
        method: 'POST', 
        headers: get().getAuthHeaders(), 
        body: JSON.stringify(dataWithMarketer) // Siunčiame papildytus duomenis
      });
      
      if (!res.ok) throw new Error('Nepavyko pridėti kliento');
      
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
      if (!res.ok) throw new Error('Update failed');
      
      const updatedClient = await res.json();
      set((state) => ({ 
        clients: state.clients.map(c => c.id === id ? updatedClient : c) 
      }));
    } catch (err) {
      console.error("Klaida atnaujinant klientą:", err);
    }
  },

  deleteClient: async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/clients/${id}`, { 
        method: 'DELETE', 
        headers: get().getAuthHeaders() 
      });
      set((state) => ({ clients: state.clients.filter(c => c.id !== id) }));
    } catch (err) {
      console.error("Klaida trinant klientą:", err);
    }
  },
});