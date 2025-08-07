import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type User } from '@supabase/supabase-js';
import { type Profile } from '@/types/database';

const ProfileSettings = ({ user }: { user: User }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfile(data as Profile);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('profiles').update({ first_name: firstName, last_name: lastName }).eq('id', user.id);
    if (error) {
      toast.error('Failed to update name.');
    } else {
      toast.success('Name updated successfully!');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long.');
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error('Failed to update password.');
    } else {
      setPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully!');
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const filePath = `${user.id}/avatar.${avatarFile.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from('profile-pictures').upload(filePath, avatarFile, { upsert: true });

    if (uploadError) {
      return toast.error('Failed to upload new picture.');
    }

    const { data: publicUrlData } = supabase.storage.from('profile-pictures').getPublicUrl(filePath);
    const newAvatarUrl = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;

    const { error: updateError } = await supabase.from('profiles').update({ avatar_url: newAvatarUrl }).eq('id', user.id);

    if (updateError) {
      toast.error('Failed to update profile picture.');
    } else {
      setProfile(prev => prev ? { ...prev, avatar_url: newAvatarUrl } : null);
      toast.success('Profile picture updated!');
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          {/* FIX: Corrected the closing tag from </Card-description> to </CardDescription> */}
          <CardDescription>Update your avatar.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>{firstName.charAt(0)}{lastName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className='flex-grow'>
            <Input type="file" accept="image/png, image/jpeg" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
            <Button onClick={handleAvatarUpload} disabled={!avatarFile} className="mt-2">Upload</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Update Name Section */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your first and last name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateName} className="space-y-4">
            <div className='grid grid-cols-2 gap-4'>
              <div className="space-y-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      {/* Update Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Enter a new password for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;