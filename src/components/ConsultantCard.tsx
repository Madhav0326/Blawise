import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ConsultantProps = {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  experience: string;
  skills: string[];
  rates: {
    text: number;
    voice: number;
    video: number;
  };
  avatarUrl: string | null;
};

const ConsultantCard: React.FC<ConsultantProps> = ({
  id,
  name,
  category,
  rating,
  reviews,
  experience,
  skills,
  rates,
  avatarUrl,
}) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    checkUser();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleViewProfile = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(`/consultant/${id}`);
    }
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      className="relative h-full min-w-[320px] overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, rgba(30, 27, 75, 0.05), transparent 80%)`,
        }}
      />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="flex items-start gap-4 mb-4">
            <Avatar>
              <AvatarImage src={avatarUrl || ''} alt={name} />
              <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground -mt-1">{category}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-yellow-500 text-sm mb-2">
            ⭐ {rating} ({reviews} reviews)
          </div>
          <p className="text-sm mb-2 text-muted-foreground line-clamp-2">{experience}</p>
          <div className="flex flex-wrap gap-1 text-xs mb-2">
            {skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>
          <div className="text-sm space-y-1 text-muted-foreground border-t border-border pt-2 mt-2">
            <p>Text Rate: ₹{rates.text}/min</p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="default" onClick={handleViewProfile} className="w-full">
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultantCard;