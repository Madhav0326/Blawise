import { useEffect, useState } from "react";
import ConsultantCard from "@/components/ConsultantCard";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { type User } from "@supabase/supabase-js";

interface Consultant {
  id: string;
  user_id: string;
  title: string;
  categories: string;
  experience: string;
  skills: string[];
  text_rate: number;
  voice_rate: number;
  video_rate: number;
  rating: number;
  total_reviews: number;
  avatar_url: string | null;
}

const Consultants = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
    }
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchConsultants = async () => {
      setLoading(true);

      let query = supabase
        .from("consultant_profiles")
        .select("*")
        .eq("is_approved", true)
        .eq("is_active", true);

      if (currentUser) {
        query = query.neq('user_id', currentUser.id);
      }
      
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%,skills.cs.{${searchTerm}}`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching consultants:", error.message);
      } else {
        setConsultants(data || []);
      }

      setLoading(false);
    };

    const timerId = setTimeout(() => {
        fetchConsultants();
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm, currentUser]);

  return (
    <section className="bg-background py-16 min-h-screen pt-24 md:pt-32">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
            Explore All Consultants
            </h2>
            <div className="max-w-lg mx-auto mb-10">
                <Input
                    type="text"
                    placeholder="Search by name, title, or skill..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
            </div>
        </motion.div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading consultants...</p>
        ) : consultants.length === 0 ? (
          <p className="text-center text-muted-foreground">No consultants found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultants.map((consultant, index) => (
              <motion.div
                key={consultant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <ConsultantCard
                  id={consultant.user_id}
                  name={consultant.title}
                  category={consultant.categories}
                  experience={consultant.experience}
                  skills={consultant.skills}
                  rating={consultant.rating}
                  reviews={consultant.total_reviews}
                  rates={{
                    text: consultant.text_rate,
                    voice: consultant.voice_rate,
                    video: consultant.video_rate,
                  }}
                  avatarUrl={consultant.avatar_url}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Consultants;