import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { TopNavbar } from './components/TopNavbar';
import { Dashboard } from './pages/Dashboard';
import { ApiKeyManager } from './pages/ApiKeyManager';
import { Login } from './pages/Login';
import { EmailPage } from './pages/EmailPage';
import { Profile } from './pages/Profile';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useStore();
  if (isLoading) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useStore();
  
  if (isLoading) return null; 
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  if (user?.role !== 'admin') return <Navigate to="/email" />;
  
  return children;
};

function App() {
  const { 
    initUI, verifyAuth, fetchClients, fetchUsers, fetchApiKeys, 
    isLoading, isAuthenticated, user 
  } = useStore();

  useEffect(() => {
    initUI();
    verifyAuth();
  }, []);

  // Centralizuotas duomenų krovimas priklausantis nuo autentifikacijos ir rolės
  useEffect(() => {
    if (isAuthenticated && user) {
      // Kliantai reikalingi visiems
      fetchClients();
      
      // Admin specifiniai duomenys
      if (user.role === 'admin') {
        fetchUsers();
        fetchApiKeys();
      }
    }
  }, [isAuthenticated, user]);

  if (isLoading && isAuthenticated) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-[#1e1e1e] text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a73e8] mb-4"></div>
        <div className="italic tracking-wide font-medium">Mezgamas saugus ryšys su Webend...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col bg-[#f8f9fa] dark:bg-[#1e1e1e] overflow-hidden font-sans">
        {isAuthenticated && <TopNavbar />}

        <main className="flex-1 overflow-hidden flex flex-col">
          <Routes>
            <Route path="/login" element={
              !isAuthenticated 
                ? <Login /> 
                : <Navigate to={user?.role === 'marketing' ? "/email" : "/"} />
            } />
            
            <Route path="/" element={
              <PrivateRoute>
                {user?.role === 'marketing' ? <Navigate to="/email" /> : <Dashboard />}
              </PrivateRoute>
            } />

            <Route path="/email" element={
              <PrivateRoute>
                <EmailPage />
              </PrivateRoute>
            } />

            <Route path="/keys" element={
              <AdminRoute>
                <ApiKeyManager />
              </AdminRoute>
            } />

            <Route path="/settings" element={
              <AdminRoute>
                <div className="p-10 dark:text-white text-2xl">Sistemos nustatymai</div>
              </AdminRoute>
            } />

            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />

            <Route path="*" element={
              <Navigate to={user?.role === 'marketing' ? "/email" : "/"} />
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;