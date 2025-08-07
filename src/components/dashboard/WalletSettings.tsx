import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { type User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Wallet } from '@/types/database';

// This makes TypeScript aware of the Razorpay script on the window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

const WalletSettings = ({ user }: { user: User }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [addAmount, setAddAmount] = useState(100);

  useEffect(() => {
    const fetchWallet = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setWallet(data);
      } else if (error) {
        toast.error("Could not load wallet information.");
      }
      setLoading(false);
    };
    fetchWallet();
  }, [user]);

  const handleAddFunds = async () => {
    try {
      const { data: order, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: addAmount },
      });

      if (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Blawise",
        description: "Add Funds to Wallet",
        order_id: order.id,
        // FIX: The 'response' parameter is now prefixed with an underscore
        // to tell TypeScript it's intentionally unused.
        handler: async function (_response: any) {
          const newBalance = (wallet?.balance || 0) + (order.amount / 100);
          await supabase.from('wallets').update({ balance: newBalance }).eq('user_id', user.id);
          
          await supabase.from('wallet_transactions').insert({
            wallet_id: wallet?.id,
            user_id: user.id,
            type: 'credit',
            amount: order.amount / 100,
            description: 'Funds added via Razorpay',
          });

          setWallet(prev => prev ? { ...prev, balance: newBalance } : null);
          toast.success("Funds added successfully!");
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Error: ${err.message}`);
      } else {
        toast.error('An unknown error occurred.');
      }
    }
  };

  if (loading) return <p>Loading wallet...</p>;
  if (!wallet) return <p>No wallet found. A wallet will be created upon your first transaction.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Wallet</CardTitle>
        <CardDescription>View your balance and add funds to your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-4xl font-bold text-primary">₹{(wallet?.balance || 0).toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-2 pt-4 border-t">
          <Input 
            type="number" 
            value={addAmount} 
            onChange={(e) => setAddAmount(Number(e.target.value))}
            placeholder="Amount in ₹"
            className="max-w-xs"
          />
          <Button onClick={handleAddFunds}>Add Funds</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletSettings;