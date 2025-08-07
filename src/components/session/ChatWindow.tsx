import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { type User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatWindowProps {
  bookingId: string;
  currentUser: User;
  otherUserId: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ bookingId, currentUser, otherUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
    };
    fetchMessages();
  }, [bookingId]);

  // Listen for new messages in real-time
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${bookingId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `booking_id=eq.${bookingId}` },
        (payload) => {
          setMessages((currentMessages) => [...currentMessages, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    await supabase.from('messages').insert({
      booking_id: bookingId,
      sender_id: currentUser.id,
      receiver_id: otherUserId,
      content: newMessage.trim(),
    });
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b font-semibold">Chat</div>
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`py-2 px-3 rounded-lg max-w-xs ${msg.sender_id === currentUser.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          autoComplete="off"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

export default ChatWindow;