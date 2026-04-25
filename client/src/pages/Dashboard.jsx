import { ClientForm } from '../components/ClientForm';
import { CardList } from '../components/CardList';
import { ClientRegistry } from '../components/ClientRegistry';
import { DashboardHeader } from '../components/headers/DashboardHeader';
import { useStore } from '../store/useStore';

export const Dashboard = () => {
  const { user } = useStore();

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f8f9fa] dark:bg-[#1e1e1e]">
      <DashboardHeader />
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        <aside className="w-[280px] shrink-0 hidden md:block border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124] rounded shadow-sm overflow-hidden">
          {user?.role === 'admin' ? (
            <ClientForm />
          ) : (
            <div className="p-6 text-sm text-slate-500 italic dark:text-slate-400">
              Tik administratoriai gali pridėti naujus klientus.
            </div>
          )}
        </aside>
        <main className="flex-1 min-w-0 overflow-y-auto custom-scrollbar">
          <CardList />
        </main>

        <aside className="w-[260px] shrink-0 hidden lg:block border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124] rounded shadow-sm overflow-hidden">
          <ClientRegistry />
        </aside>

      </div>
    </div>
  );
};