import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Logout failed: ' + error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}