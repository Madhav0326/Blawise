import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { type User } from '@supabase/supabase-js';

const CommunityDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null); // State to hold the current user
  const [community, setCommunity] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 1. Fetch the current user session
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // 2. Fetch community details
      const { data: communityData } = await supabase.from('communities').select('*').eq('id', id).single();
      if (communityData) setCommunity(communityData);

      // 3. Fetch posts for this community
      const { data: postsData } = await supabase.from('community_posts').select('*, profiles (first_name, last_name)').eq('community_id', id).order('created_at', { ascending: false });
      if (postsData) setPosts(postsData);
      
      // 4. Check if the current user is a member
      if (user) {
        const { data: membership } = await supabase.from('community_memberships').select('*').eq('community_id', id).eq('user_id', user.id).single();
        setIsMember(!!membership);
      }
      
      setLoading(false);
    };
    fetchData();
  }, [id]); // Re-fetch data if the community ID changes

  const handleJoinCommunity = async () => {
    if (!user) {
      // In a real app, you might navigate to the login page here
      alert("You must be logged in to join a community.");
      return;
    }
    const { error } = await supabase.from('community_memberships').insert({ community_id: id, user_id: user.id });
    if (!error) setIsMember(true);
  };

  const handleCreatePost = async () => {
      if (!user || !newPostContent.trim()) return;
      const { data } = await supabase.from('community_posts').insert({
          community_id: id,
          user_id: user.id,
          content: newPostContent,
      }).select('*, profiles (first_name, last_name)').single();

      if (data) {
          setPosts([data, ...posts]);
          setNewPostContent('');
      }
  };

  if (loading) return <div>Loading community...</div>;
  if (!community) return <div>Community not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-16">
      <h1 className="text-3xl font-bold">{community.name}</h1>
      <p className="text-muted-foreground mb-6">{community.description}</p>
      
      {!isMember ? (
        <Button onClick={handleJoinCommunity}>Join Community</Button>
      ) : (
        <div>
          <Card className="mb-6">
            <CardContent className="p-4 space-y-2">
              <Textarea 
                placeholder="Share something with the community..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <Button onClick={handleCreatePost}>Create Post</Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {posts.map(post => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <p className="font-semibold">{post.profiles?.first_name || 'A user'} says:</p>
                  <p className="mt-2">{post.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityDetailsPage;