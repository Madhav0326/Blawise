import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { type Booking, type Profile } from '@/types/database';
import BookingList from '@/components/dashboard/BookingList';
import WalletSettings from '@/components/dashboard/WalletSettings';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import EarningsPanel from '@/components/dashboard/EarningsPanel';
import { type User } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isConsultant, setIsConsultant] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConsultantView, setIsConsultantView] = useState(false);

  // This single, robust useEffect handles all data fetching and prevents race conditions.
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        setLoading(true);
        
        // Fetch profile and check role in sequence
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
        if (profileData) setProfile(profileData as Profile);

        const { count } = await supabase.from('consultant_profiles').select('user_id', { count: 'exact', head: true }).eq('user_id', currentUser.id);
        const userIsConsultant = (count ?? 0) > 0;
        setIsConsultant(userIsConsultant);
        
        // Default to consultant view if they are one, otherwise respect the toggle
        const currentViewIsConsultant = isConsultantView ? userIsConsultant : false;

        // Fetch bookings based on the correct view
        const bookingColumn = currentViewIsConsultant ? 'consultant_id' : 'user_id';
        const { data: bookingData } = await supabase
          .from('bookings')
          .select(`*, consultant_profiles(*), profiles(*)`)
          .eq(bookingColumn, currentUser.id)
          .order('scheduled_at', { ascending: false });

        setBookings(bookingData as unknown as Booking[] || []);
        setLoading(false);
      } else {
        // Clear all state if user logs out
        setIsConsultant(false);
        setProfile(null);
        setBookings([]);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [isConsultantView]); // Re-run all logic when the view is manually switched

  // Set the initial view state after the role has been determined
  useEffect(() => {
    if (isConsultant) {
      setIsConsultantView(true);
    }
  }, [isConsultant]);


  if (loading) return <div className="text-center py-20 min-h-screen">Loading Dashboard...</div>;
  if (!user) return <div className="text-center py-20 min-h-screen">Please log in to view your dashboard.</div>;

  const upcomingBookings = bookings.filter(b => new Date(b.scheduled_at) > new Date() && !['completed', 'cancelled'].includes(b.status));
  const pastBookings = bookings.filter(b => new Date(b.scheduled_at) <= new Date() || ['completed', 'cancelled'].includes(b.status));

  // --- CONSULTANT DASHBOARD VIEW ---
  if (isConsultant && isConsultantView) {
    return (
        <div className="min-h-screen bg-background pt-24 md:pt-32">
            <div className="max-w-6xl mx-auto px-4 pb-10 space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">Consultant Dashboard</h1>
                        <p className="text-muted-foreground">Manage your consultations and earnings.</p>
                    </div>
                    <Button variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setIsConsultantView(false)}>Switch to User View</Button>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card><CardHeader><CardTitle>Upcoming Sessions</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{upcomingBookings.length}</p></CardContent></Card>
                    <EarningsPanel user={user} />
                </div>
                
                <div className="space-y-10">
                    <BookingList bookings={upcomingBookings} title="Your Upcoming Sessions" userRole={'consultant'} />
                    <BookingList bookings={pastBookings} title="Your Session History" userRole={'consultant'} />
                </div>
            </div>
        </div>
    );
  }

  // --- REGULAR USER DASHBOARD VIEW (OR CONSULTANT IN USER MODE) ---
  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32">
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {profile?.first_name || user.email}!</p>
            </div>
            {isConsultant && (
              <Button variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setIsConsultantView(true)}>
              Switch to Consultant View
              </Button>
            )}
        </motion.div>
        
        <Tabs defaultValue="bookings" className="w-full">
            <TabsList>
                <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
                <div className="space-y-10 mt-6">
                    <BookingList bookings={upcomingBookings} title="Upcoming Sessions" userRole={'client'} />
                    <BookingList bookings={pastBookings} title="Session History" userRole={'client'} />
                </div>
            </TabsContent>

            <TabsContent value="wallet">
                <div className="mt-6">
                    <WalletSettings user={user} />
                </div>
            </TabsContent>

            <TabsContent value="profile">
                <div className="mt-6">
                    <ProfileSettings user={user} />
                </div>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;