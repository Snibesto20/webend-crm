export const createUserSlice = (set, get) => ({
  users: [],
  isUsersLoading: false,
  usersError: null,

  fetchUsers: async () => {
    set({ isUsersLoading: true, usersError: null });
    try {
      // Svarbu naudoti get().getAuthHeaders(), nes serveriui reikia autorizacijos
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: get().getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Nepavyko gauti vartotojų');
      
      const data = await response.json();
      set({ users: data, isUsersLoading: false });
    } catch (error) {
      set({ usersError: error.message, isUsersLoading: false });
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, { 
        method: 'DELETE',
        headers: get().getAuthHeaders() // Saugumo patikrinimas
      });
      
      if (!response.ok) throw new Error('Nepavyko pašalinti');
      
      set((state) => ({ 
        users: state.users.filter((u) => u._id !== id) 
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
});