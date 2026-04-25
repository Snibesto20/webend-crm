import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);
  const login = useStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(key)) {
      navigate('/');
    } else {
      setError(true);
      setKey('');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#202124]">
      <form onSubmit={handleLogin} className="bg-white dark:bg-[#292a2d] p-8 rounded-lg shadow-xl border border-[#dadce0] dark:border-[#3c4043] w-[350px]">
        <h2 className="text-xl font-bold mb-6 text-center dark:text-white">Įveskite prieigos raktą</h2>
        <input 
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className={`w-full p-2 rounded border mb-4 dark:bg-[#202124] dark:text-white ${error ? 'border-red-500' : 'border-[#dadce0] dark:border-[#5f6368]'}`}
          placeholder="Raktas..."
          autoFocus
        />
        {error && <p className="text-red-500 text-xs mb-4">Neteisingas raktas. Bandykite dar kartą.</p>}
        <button type="submit" className="w-full bg-[#1a73e8] text-white py-2 rounded font-medium hover:bg-[#1557b0] transition-colors">
          Prisijungti
        </button>
      </form>
    </div>
  );
};