import { useEffect, useState } from "react"; 
import { supabase } from "@/lib/supabaseClient"; 
import ConsultantCard from "./ConsultantCard"; 
import { motion } from "framer-motion"; 
import { type User } from "@supabase/supabase-js"; 

 type Consultant = { 
   user_id: string; 
   title: string; 
   categories: string[]; 
   experience: string; 
   rating: number; 
   total_reviews: number; 
   skills: string[]; 
   text_rate: number; 
   voice_rate: number; 
   video_rate: number; 
   avatar_url: string | null; 
 }; 

 export default function TopConsultants() { 
   const [consultants, setConsultants] = useState<Consultant[]>([]); 
   const [loading, setLoading] = useState(true); 
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
         .select( 
           "user_id, title, categories, experience, rating, total_reviews, skills, text_rate, voice_rate, video_rate, avatar_url" 
         ) 
         .eq("is_approved", true) 
         .eq("is_active", true) 
         .order('rating', { ascending: false }) 
         .limit(10);

       if (currentUser) { 
         query = query.neq('user_id', currentUser.id); 
       } 

       const { data, error } = await query; 

       if (error) { 
         console.error("Supabase error:", error); 
       } 
        
       if (data) { 
         setConsultants(data.slice(0, 5)); 
       } 

       setLoading(false); 
     }; 

     fetchConsultants(); 
   }, [currentUser]);

   return ( 
     <section className="bg-background py-16"> 
       <div className="max-w-6xl mx-auto px-4"> 
         <motion.h2 
           className="text-3xl md:text-4xl font-bold text-center text-primary mb-10" 
           initial={{ opacity: 0, y: 30 }} 
           whileInView={{ opacity: 1, y: 0 }} 
           transition={{ duration: 0.5 }} 
         > 
           Top-Rated Consultants 
         </motion.h2> 

         {loading ? ( 
           <p className="text-center text-gray-500">Loading consultants...</p> 
         ) : consultants.length === 0 ? ( 
           <p className="text-center text-gray-500"> 
             No top consultants available. 
           </p> 

         ) : ( 
           <div className="flex gap-6 overflow-x-auto scrollbar-hide px-2 pb-4"> 
             {consultants.map((consultant, i) => ( 
               <motion.div 
                 key={consultant.user_id} 
                 initial={{ opacity: 0, x: 100 }} 
                 whileInView={{ opacity: 1, x: 0 }} 
                 transition={{ duration: 0.4, delay: i * 0.1 }} 
                 className="flex-shrink-0" 
               > 
                 <ConsultantCard 
                   id={consultant.user_id} 
                   name={consultant.title} 
                   category={ 
                     Array.isArray(consultant.categories) 
                       ? consultant.categories.join(", ") 
                       : consultant.categories 
                   } 
                   rating={consultant.rating} 
                   reviews={consultant.total_reviews} 
                   experience={consultant.experience} 
                   skills={consultant.skills} 
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

         <div className="mt-8 text-center"> 
           <a 
             href="/consultants" 
             className="px-6 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition" 
           > 
             Explore More 
           </a> 
         </div> 
       </div> 
     </section> 
   ); 
 }