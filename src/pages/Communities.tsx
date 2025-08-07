import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Community {
  id: string;
  name: string;
  description: string;
}

const CommunitiesPage = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      const { data } = await supabase.from('communities').select('*');
      if (data) setCommunities(data);
      setLoading(false);
    };
    fetchCommunities();
  }, []);

  if (loading) return <div>Loading communities...</div>;

  return (
    <div className="max-w-4xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-6">Communities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communities.map(community => (
          <Card key={community.id}>
            <CardHeader>
              <CardTitle>{community.name}</CardTitle>
              <CardDescription>{community.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to={`/community/${community.id}`}>View Community</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunitiesPage;