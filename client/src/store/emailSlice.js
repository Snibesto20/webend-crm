export const createEmailSlice = (set, get) => ({
  sendEmail: async (clientData) => {
    const apiKey = localStorage.getItem('crm-api-key');
    
    const to = (clientData.to || clientData.email || '').trim();
    const name = (clientData.name || 'Nenurodytas').trim().toUpperCase();
    
    const payload = {
      to: to,
      name: name,
      context: clientData.context || 'Siunčiant laišką'
    };

    if (!to) {
      return { success: false, error: 'Gavėjo el. paštas yra būtinas.' };
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/send-email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Nepavyko išsiųsti laiško.' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Klaida siunčiant laišką:', error);
      return { success: false, error: 'Nepavyko susisiekti su serveriu.' };
    }
  }
});