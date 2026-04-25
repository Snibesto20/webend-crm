import { useState } from 'react';
import { useStore } from '../store/useStore';
import { EmailPageHeader } from '../components/headers/EmailPageHeader';
import { ClientRegistry } from '../components/ClientRegistry';
import { MdSend, MdEmail, MdPerson, MdBusiness } from 'react-icons/md';
import StatusMessage from '../components/StatusMessage';

export const EmailPage = () => {
  const { sendEmail, clients, addClient } = useStore();
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [form, setForm] = useState({ to: '', name: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    const trimmedName = (form.name || '').trim();
    const trimmedEmail = (form.to || '').trim();

    if (!trimmedName || !trimmedEmail) {
      setStatus({ type: 'error', msg: 'Prašome užpildyti visus laukus.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setStatus({ type: 'error', msg: 'Neteisingas el. pašto formatas.' });
      return;
    }

    setLoading(true);

    try {
      const normalizedName = trimmedName.toUpperCase();
      
      const existingClient = clients?.find(c => 
        (c.name || '').trim().toUpperCase() === normalizedName
      );

      let clientId = existingClient?.id;

      if (!existingClient) {
        const newClient = await addClient({
          name: normalizedName,
          email: trimmedEmail,
          tag: 'pending',
          serviceNeeded: '-'
        });
        clientId = newClient?.id;
      } else if ((existingClient.email || '').trim().toLowerCase() !== trimmedEmail.toLowerCase()) {
        throw new Error(`Klientas "${normalizedName}" jau egzistuoja su kitu el. paštu!`);
      }

      const result = await sendEmail({ 
        to: trimmedEmail, 
        name: normalizedName, 
        id: clientId
      });
      
      if (result.success) {
        setStatus({ type: 'success', msg: 'Laiškas išsiųstas sėkmingai!' });
        setForm({ to: '', name: '' });
        setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
      } else {
        throw new Error(result.error || 'Laiško siuntimas nepavyko.');
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReceiver = (client) => {
    setForm({ to: client.email || '', name: client.name || '' });
    setStatus({ type: '', msg: '' });
  };

  const inputClass = "w-full px-3 py-2 text-[13px] rounded border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] focus:border-[#1a73e8] focus:outline-none transition-all";

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#f8f9fa] dark:bg-[#1e1e1e] overflow-hidden">
      <EmailPageHeader />
      
      <main className="flex-1 p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm">
              <div className="p-6 border-b border-[#dadce0] dark:border-[#3c4043] flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <MdEmail size={24} className="text-[#1a73e8]" />
                </div>
                <h2 className="text-[16px] font-medium text-[#202124] dark:text-[#e8eaed]">Siųsti laišką</h2>
              </div>

              <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[11px] font-bold text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">
                    <MdBusiness size={14} className="text-[#1a73e8]" /> Kliento pavadinimas
                  </label>
                  <input 
                    type="text" 
                    className={inputClass} 
                    value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder="PVZ: WEBEND LIETUVA" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[11px] font-bold text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">
                    <MdPerson size={14} className="text-[#1a73e8]" /> Gavėjo el. paštas
                  </label>
                  <input 
                    type="text" 
                    className={inputClass} 
                    value={form.to} 
                    onChange={(e) => setForm({...form, to: e.target.value})} 
                    placeholder="pvz. pastas@imone.lt" 
                  />
                </div>

                <div className="w-full h-[40px] flex items-center">
                  {status.msg && (
                    <div className="w-full">
                      <StatusMessage type={status.type} msg={status.msg} />
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-gray-300 dark:disabled:bg-[#3c4043] text-white text-[13px] font-bold py-2.5 rounded transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                >
                  {loading ? "Vykdoma..." : <><MdSend size={16} /> Siųsti laišką</>}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1 h-[calc(100vh-140px)] overflow-hidden border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm bg-white dark:bg-[#292a2d]">
            <ClientRegistry onSelect={handleSelectReceiver} />
          </div>

        </div>
      </main>
    </div>
  );
};