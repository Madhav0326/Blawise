import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { type User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const EarningsPanel = ({ user }: { user: User }) => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user) return;

      // First, get the consultant's profile ID from their user ID
      const { data: profile } = await supabase
        .from('consultant_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        // Now, use the consultant's profile ID to get their earnings
        const { data, error } = await supabase
          .from('consultant_earnings')
          .select('consultant_share')
          .eq('consultant_id', profile.id); // Use the correct ID here
        
        if (data) {
          const total = data.reduce((sum, record) => sum + (record.consultant_share || 0), 0);
          setTotalEarnings(total);
        } else if (error) {
          toast.error("Could not load earnings information.");
        }
      }
      setLoading(false);
    };
    fetchEarnings();
  }, [user]);

  const handleWithdraw = () => {
    toast.success("Payout system integration is a future step!");
  };

  if (loading) {
    return (
        <Card>
            <CardHeader><CardTitle>My Earnings</CardTitle></CardHeader>
            <CardContent><p>Loading...</p></CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Earnings</CardTitle>
        <CardDescription>View your available balance and request a withdrawal.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Available for Payout</p>
          <p className="text-4xl font-bold text-primary">₹{totalEarnings.toFixed(2)}</p>
        </div>
        <Button onClick={handleWithdraw} disabled={totalEarnings <= 0}>
          Withdraw Funds
        </Button>
      </CardContent>
    </Card>
  );
};

export default EarningsPanel;