import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import heroImage from '../assets/hero-illustration.png';

export default function Hero() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <section className="w-full bg-[hsl(240,100%,97%)] py-20 px-4 md:px-20 flex flex-col md:flex-row items-center justify-between">
      <div className="max-w-xl mb-12 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Welcome to Blawise
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Seamless consultations via text, voice, or video with top-rated experts.
        </p>
        {!user && (
          <div className="flex flex-wrap gap-10 ml-20">
            <button
              onClick={() => navigate('/login')}
              className="bg-primary text-white font-semibold px-5 py-2 rounded-md"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="border-2 border-primary text-white px-5 py-2 rounded-md font-semibold"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
      <motion.img
        src={heroImage}
        alt="Consult Illustration"
        className="w-[280px] md:w-[400px] h-auto"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      />
    </section>
  );
}