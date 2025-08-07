import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { type User } from '@supabase/supabase-js';

import ChatWindow from '@/components/session/ChatWindow';
import AgoraVideoPlayer from '@/components/session/AgoraVideoPlayer';

interface BookingDetails {
  id: string;
  consultation_type: 'Text' | 'Voice' | 'Video';
  user_id: string; // The client's ID
  consultant_profiles: {
    user_id: string; // The consultant's ID
    full_name: string;
  } | null;
}

const SessionPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agoraToken, setAgoraToken] = useState<string | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to join a session.');
        setLoading(false);
        navigate('/login');
        return;
      }
      setCurrentUser(user);

      const { data, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          id,
          consultation_type,
          user_id,
          consultant_profiles ( user_id, full_name )
        `)
        .eq('id', bookingId)
        .single();

      if (bookingError || !data) {
        setError('Booking not found or an error occurred.');
        setLoading(false);
        return;
      }

      const bookingData = data as unknown as BookingDetails;

      const isClient = bookingData.user_id === user.id;
      const isConsultant = bookingData.consultant_profiles?.user_id === user.id;

      if (!isClient && !isConsultant) {
        setError('You are not authorized to view this session.');
        setLoading(false);
        return;
      }

      setBooking(bookingData);
      
      if (bookingData.consultation_type !== 'Text') {
        try {
          // Agora's UID must be a number. We create one from the user's UUID.
          const numericUserId = user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000000;

          const { data: tokenData, error: tokenError } = await supabase.functions.invoke('agora-token-generator', {
            body: { channelName: bookingData.id, userId: numericUserId },
          });

          if (tokenError) throw tokenError;
          setAgoraToken(tokenData.token);
        } catch (e) {
          setError('Could not connect to the call service. Please try again later.');
        }
      }

      setLoading(false);
    };

    initializeSession();
  }, [bookingId, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading Session...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-destructive">{error}</div>;
  }
  
  if (!booking || !currentUser) {
    return <div className="flex items-center justify-center min-h-screen">Booking data could not be loaded.</div>;
  }

  const otherUser = currentUser.id === booking.user_id 
    ? { id: booking.consultant_profiles?.user_id, name: booking.consultant_profiles?.full_name }
    : { id: booking.user_id, name: "Client" };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Main content area for Video/Voice or other info */}
      <div className="flex-grow p-4 flex flex-col">
        <h2 className="text-2xl font-bold">Session with {otherUser.name || 'Participant'}</h2>
        <p className="text-muted-foreground">Type: {booking.consultation_type} Consultation</p>
        <hr className="my-4"/>
        
        {booking.consultation_type !== 'Text' ? (
          <div className="bg-black border rounded-lg flex-grow relative">
             {agoraToken ? (
              <AgoraVideoPlayer
                channelName={booking.id}
                token={agoraToken}
                appId={import.meta.env.VITE_AGORA_APP_ID}
                userId={currentUser.id}
                isVoiceCall={booking.consultation_type === 'Voice'}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p>Connecting to call service...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-muted-foreground">This is a text-only session.</p>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="w-full md:w-96 border-l bg-card flex flex-col h-full">
        <ChatWindow 
          bookingId={booking.id} 
          currentUser={currentUser} 
          otherUserId={otherUser.id!} 
        />
      </div>
    </div>
  );
};

export default SessionPage;