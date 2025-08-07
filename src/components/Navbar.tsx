import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import LogoutButton from '@/components/LogoutButton';
import { type User } from '@supabase/supabase-js';

const Navbar = () => {
  const { pathname } = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isConsultant, setIsConsultant] = useState(false);

  useEffect(() => {
    const checkUserRole = async (currentUser: User) => {
      // Check if a consultant profile exists for the current user
      const { data } = await supabase
        .from('consultant_profiles')
        .select('user_id')
        .eq('user_id', currentUser.id)
        .single();
      setIsConsultant(!!data);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        // If user is logged in, check if they are a consultant
        checkUserRole(currentUser);
      } else {
        // If user is logged out, they are definitely not a consultant
        setIsConsultant(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/about' },
    { name: 'Contact', to: '/contact' },
  ];

  return (
    <nav className="bg-background fixed w-full z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">Blawise</Link>
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-lg hover:text-accent transition ${
                pathname === item.to ? 'text-accent font-semibold' : 'text-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          {/* FIX: Show link if the user is NOT a consultant (regardless of login state) */}
          {!isConsultant && (
             <Link 
               to="/become-consultant" 
               className={`text-lg hover:text-accent transition ${
                 pathname === '/become-consultant' ? 'text-accent font-semibold' : 'text-foreground'
               }`}
             >
               Become a Consultant
             </Link>
          )}

          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`text-lg hover:text-accent transition ${
                  pathname === '/dashboard' ? 'text-accent font-semibold' : 'text-foreground'
                }`}
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link to="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold">
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;