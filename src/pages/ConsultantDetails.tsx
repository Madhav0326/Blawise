import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import BookingModal from "../components/BookingModal";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Consultant {
  id: string; 
  user_id: string;
  full_name: string;
  title: string;
  bio: string;
  skills: string[];
  rating: number;
  total_reviews: number;
  text_rate: number;
  voice_rate: number;
  video_rate: number;
  avatar_url: string | null;
  portfolio_files: { name: string; url: string; }[] | null;
}

const ConsultantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchConsultant = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("consultant_profiles")
        .select("*")
        .eq("user_id", id)
        .single();

      if (error || !data) {
        setError("Consultant not found or an error occurred.");
      } else {
        setConsultant(data);
        setError("");
      }
      setLoading(false);
    };

    if (id) {
      fetchConsultant();
    } else {
      setError("Invalid consultant ID provided.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-destructive">{error}</div>;
  }

  if (!consultant) return null;

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32">
      <div className="max-w-4xl mx-auto px-4 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card text-card-foreground rounded-lg shadow-lg p-8"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
            <Avatar className="w-28 h-28 text-lg">
              <AvatarImage src={consultant.avatar_url || ''} alt={consultant.full_name} />
              <AvatarFallback>{consultant.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow text-center sm:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-1">{consultant.full_name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{consultant.title}</p>
            </div>
          </div>
          
          <p className="text-foreground/80 mb-6 border-t border-border pt-6">{consultant.bio}</p>

          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-2">Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {consultant.skills?.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">{skill}</span>
              ))}
            </div>
          </div>
          
          {consultant.portfolio_files && consultant.portfolio_files.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-2">Portfolio & Documents</h3>
              <div className="space-y-2 border border-border rounded-md p-4">
                {consultant.portfolio_files.map((file, index) => (
                  <a 
                    key={index} 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    <span>{file.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 text-sm text-muted-foreground">
            ⭐ {consultant.rating} rating from {consultant.total_reviews} reviews
          </div>

          {/* FIX: Restored the missing rates section here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6 text-foreground border-t border-border pt-6">
            <div className="text-center p-2 rounded-md bg-background">
              <p className="text-muted-foreground">Text Rate</p>
              <strong className="text-lg">₹{consultant.text_rate}/min</strong>
            </div>
            <div className="text-center p-2 rounded-md bg-background">
              <p className="text-muted-foreground">Voice Rate</p>
              <strong className="text-lg">₹{consultant.voice_rate}/min</strong>
            </div>
            <div className="text-center p-2 rounded-md bg-background">
              <p className="text-muted-foreground">Video Rate</p>
              <strong className="text-lg">₹{consultant.video_rate}/min</strong>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            disabled={!currentUserId}
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book a Session
          </button>
        </motion.div>

        {showModal && consultant && currentUserId && (
          <BookingModal consultant={consultant} userId={currentUserId} onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
};

export default ConsultantDetails;