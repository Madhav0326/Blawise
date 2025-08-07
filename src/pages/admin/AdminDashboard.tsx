import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ pendingConsultants: 0, totalUsers: 0, totalCommission: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            const { count: pendingConsultants } = await supabase.from('consultant_profiles').select('*', { count: 'exact', head: true }).eq('is_approved', false);
            const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { data: adminWallet } = await supabase.from('admin_wallet').select('total_commission_earned').single();
            
            setStats({
                pendingConsultants: pendingConsultants ?? 0,
                totalUsers: totalUsers ?? 0,
                totalCommission: adminWallet?.total_commission_earned ?? 0,
            });
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader><CardTitle>Pending Applications</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold">{stats.pendingConsultants}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold">{stats.totalUsers}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Platform Earnings</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold">₹{stats.totalCommission.toFixed(2)}</p></CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;