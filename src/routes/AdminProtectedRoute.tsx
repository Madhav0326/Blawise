import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const AdminProtectedRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null;

      if (currentUser) {
        // If a user is logged in, check if they are an admin
        // FIX: Correctly destructure 'count' from the Supabase response
        const { count, error } = await supabase
          .from('admin_users')
          .select('user_id', { count: 'exact', head: true })
          .eq('user_id', currentUser.id);
        
        if (error) {
          console.error("Admin check error:", error);
          setIsAdmin(false);
        } else {
          // FIX: Check if count is a valid number before comparing
          setIsAdmin((count ?? 0) > 0);
        }
      } else {
        // If logged out, they are not an admin
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // If the check is complete and the user is not an admin, redirect
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  // If the user is a confirmed admin, render the nested admin pages
  return <Outlet />;
};

export default AdminProtectedRoute;