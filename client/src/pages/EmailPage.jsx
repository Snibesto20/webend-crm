import { useState } from 'react';
import { useStore } from '../store/useStore';
import { EmailPageHeader } from '../components/headers/EmailPageHeader';
import { ClientRegistry } from '../components/ClientRegistry';
import { MdSend, MdEmail, MdPerson, MdBusiness } from 'react-icons/md';
import { StatusMessage } from '../components/StatusMessage';
import { AnimatePresence } from 'framer-motion';
import { ComponentHeader } from '../components/headers/ComponentHeader';

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

      let clientId = existingClient?._id || existingClient?.id;

      if (existingClient) {
        const hasEmail = existingClient.contacts?.some(
          c => c.trim().toLowerCase() === trimmedEmail.toLowerCase()
        );
        if (!hasEmail && existingClient.contacts && existingClient.contacts.length > 0) {
          throw new Error(`Klientas "${normalizedName}" jau egzistuoja su kitais kontaktais!`);
        }
      }

      const result = await sendEmail({ 
        to: trimmedEmail, 
        name: normalizedName, 
        id: clientId 
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Laiško siuntimas nepavyko.');
      }

      if (!existingClient) {
        try {
          await addClient({
            name: normalizedName,
            contacts: [trimmedEmail],
            tag: 'pending',
            serviceNeeded: '-'
          });
        } catch (addErr) {
          console.warn("Client creation handled by backend or blocked by permissions:", addErr.message);
        }
      }

      setStatus({ type: 'success', msg: 'Laiškas išsiųstas sėkmingai!' });
      setForm({ to: '', name: '' });

    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Įvyko klaida.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#f8f9fa] dark:bg-[#1e1e1e] overflow-hidden">
      <EmailPageHeader />
      <main className="flex-1 p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex gap-6 justify-center items-start">
          
          <div className="flex-1 max-w-2xl shrink-0">
            <div className="bg-white dark:bg-[#292a2d] border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm">
              <ComponentHeader title="Siųsti laišką" icon={MdEmail} />
              
              <form onSubmit={handleSubmit} noValidate={true} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[11px] text-[#5f6368] dark:text-[#9aa0a6] tracking-wider">
                    <MdBusiness size={14} className="text-[#1a73e8]" /> Kliento pavadinimas
                  </label>
                  <input type="text" className="input-base" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[11px] text-[#5f6368] dark:text-[#9aa0a6] tracking-wider">
                    <MdPerson size={14} className="text-[#1a73e8]" /> Kliento el. paštas
                  </label>
                  <input type="text" className="input-base" value={form.to} onChange={(e) => setForm({...form, to: e.target.value})} />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-gray-300 dark:disabled:bg-[#3c4043] text-white text-[13px] h-[38px] rounded transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2">
                  {loading ? "Vykdoma..." : <><MdSend size={16} /> Siųsti laišką</>}
                </button>
              </form>
            </div>
          </div>

          <div className="w-[260px] shrink-0 hidden lg:block h-[calc(100vh-140px)] overflow-hidden border border-[#dadce0] dark:border-[#3c4043] rounded shadow-sm bg-white dark:bg-[#292a2d]">
            <ClientRegistry />
          </div>

        </div>
      </main>
      <AnimatePresence>
        {status.msg && <StatusMessage type={status.type} msg={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />}
      </AnimatePresence>
    </div>
  );
};