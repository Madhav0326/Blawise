import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type User } from '@supabase/supabase-js';

const BecomeConsultant = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    categories: '',
    experience: '',
    bio: '',
    skills: '',
    text_rate: '',
    voice_rate: '',
    video_rate: '',
    avatarFile: null as File | null,
    identityDoc: null as File | null,
    portfolioFiles: [] as File[],
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [displayRate, setDisplayRate] = useState({ text: 0, voice: 0, video: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user || null);
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const rate = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [name]: value }));
    const finalRate = rate * 1.20;
    const rateName = name.split('_')[0];
    setDisplayRate(prev => ({ ...prev, [rateName]: finalRate }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 250 * 1024) {
        toast.error('Avatar file size must be less than 250KB');
        return;
      }
      setFormData(prev => ({ ...prev, avatarFile: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleIdentityDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error('Identity document must be less than 1MB');
        return;
      }
      setFormData(prev => ({ ...prev, identityDoc: file }));
    }
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, portfolioFiles: Array.from(e.target.files!) }));
    } else {
      setFormData(prev => ({ ...prev, portfolioFiles: [] }));
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let userToSubmit: User;

      if (!currentUser) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error("Could not create user account.");
        userToSubmit = signUpData.user;
      } else {
        userToSubmit = currentUser;
      }

      if (!formData.identityDoc) {
        throw new Error("Please upload an identity document.");
      }
      
      let avatarUrl = '';
      if (formData.avatarFile) {
        const avatarPath = `${userToSubmit.id}/avatar.${formData.avatarFile.name.split('.').pop()}`;
        await supabase.storage.from('profile-pictures').upload(avatarPath, formData.avatarFile, { upsert: true });
        avatarUrl = supabase.storage.from('profile-pictures').getPublicUrl(avatarPath).data.publicUrl;
      }

      const docPath = `${userToSubmit.id}/identity.${formData.identityDoc.name.split('.').pop()}`;
      await supabase.storage.from('consultant-docs').upload(docPath, formData.identityDoc, { upsert: true });
      const identityDocUrl = supabase.storage.from('consultant-docs').getPublicUrl(docPath).data.publicUrl;

      let portfolioFilesData = [];
      if (formData.portfolioFiles.length > 0) {
        for (const file of formData.portfolioFiles) {
          const filePath = `${userToSubmit.id}/portfolio/${file.name}`;
          await supabase.storage.from('consultant-portfolios').upload(filePath, file, { upsert: true });
          const { data: publicUrlData } = supabase.storage.from('consultant-portfolios').getPublicUrl(filePath);
          portfolioFilesData.push({ name: file.name, url: publicUrlData.publicUrl });
        }
      }

      const { error: insertError } = await supabase.from('consultant_profiles').insert([{
        user_id: userToSubmit.id,
        full_name: userToSubmit.user_metadata?.full_name || userToSubmit.email,
        title: formData.title,
        categories: formData.categories.split(',').map(c => c.trim()),
        experience: formData.experience,
        bio: formData.bio,
        skills: formData.skills.split(',').map(s => s.trim()),
        text_rate: parseFloat(formData.text_rate) || 0,
        voice_rate: parseFloat(formData.voice_rate) || 0,
        video_rate: parseFloat(formData.video_rate) || 0,
        avatar_url: avatarUrl,
        identity_doc_url: identityDocUrl,
        portfolio_files: portfolioFilesData,
        is_approved: false,
        is_active: false,
      }]);
      if (insertError) throw insertError;
      
      toast.success(currentUser ? 'Application submitted successfully!' : 'Application submitted! Please check your email to confirm your account.');
      navigate('/dashboard');

    } catch (err) {
      toast.error('Error: ' + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Your Profile</h3>
            <Input name="title" placeholder="Title (e.g., Financial Advisor)" onChange={handleChange} value={formData.title} />
            <Input name="categories" placeholder="Categories (comma-separated)" onChange={handleChange} value={formData.categories} />
            <div>
              <Label>Profile Picture (optional, max 250KB)</Label>
              <Input type="file" accept="image/png, image/jpeg" onChange={handleAvatarChange} />
              {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="mt-4 w-24 h-24 rounded-full object-cover" />}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Your Experience</h3>
            <Input name="experience" placeholder="Years of Experience" onChange={handleChange} value={formData.experience} />
            <textarea name="bio" placeholder="Short Bio" onChange={handleChange} value={formData.bio} className="input w-full p-2 border rounded-md" rows={4} />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Skills & Portfolio</h3>
            <textarea name="skills" placeholder="Skills (comma-separated)" onChange={handleChange} value={formData.skills} className="input w-full p-2 border rounded-md" rows={3} />
            <div>
              <Label>Portfolio / Certificates (Optional)</Label>
              <Input type="file" multiple onChange={handlePortfolioChange} />
              {formData.portfolioFiles.length > 0 && 
                <div className="text-sm text-muted-foreground mt-2">Selected: {formData.portfolioFiles.map(f => f.name).join(', ')}</div>
              }
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Set Your Per-Minute Rates (₹)</h3>
            <p className="text-center text-sm text-muted-foreground">This is the amount you will receive.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input name="text_rate" type="number" placeholder="Text Rate" onChange={handleRateChange} value={formData.text_rate} />
              <Input name="voice_rate" type="number" placeholder="Voice Rate" onChange={handleRateChange} value={formData.voice_rate} />
              <Input name="video_rate" type="number" placeholder="Video Rate" onChange={handleRateChange} value={formData.video_rate} />
            </div>
            <div className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md">
              <p>We add a 20% platform fee. The price shown to users will be:</p>
              <ul className="list-disc list-inside mt-2 font-medium">
                <li>Text: ₹{displayRate.text.toFixed(2)}/min</li>
                <li>Voice: ₹{displayRate.voice.toFixed(2)}/min</li>
                <li>Video: ₹{displayRate.video.toFixed(2)}/min</li>
              </ul>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Verification {currentUser ? '' : '& Account Creation'}</h3>
            <div className="bg-gray-100 p-4 rounded">
              <Label className="font-semibold mb-2 block">Upload Identity Document (Max 1MB)</Label>
              <Input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleIdentityDocChange}/>
              {formData.identityDoc && <p className='text-sm text-green-600 mt-2'>File selected: {formData.identityDoc.name}</p>}
            </div>
            
            {!currentUser && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold">Create Your Account to Submit</h4>
                <div className="space-y-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Create Password</Label>
                  <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                </div>
              </div>
            )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-card rounded-lg shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-4 text-primary">Become a Consultant</h2>
        <p className="text-center text-muted-foreground mb-6">Step {step} of 5</p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-8"><div className="bg-primary h-1.5 rounded-full" style={{ width: `${step * 20}%` }}></div></div>
        <div className="min-h-[300px]">{renderStep()}</div>
        <div className="flex justify-between items-center mt-10">
          <div>
            {step > 1 && <Button type="button" onClick={prevStep}>Back</Button>}
          </div>
          <div>
            {step < 5 && <Button type="button" onClick={nextStep}>Next</Button>}
            {step === 5 && (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BecomeConsultant;