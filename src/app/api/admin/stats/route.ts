import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = cookies();

    // 2. Fetch Aggregated Stats
    const [
        { count: projectCount },
        { count: inquiryCount },
        { count: bookingCount }
    ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
    ]);

    // 3. Fetch Recent Inquiries
    const { data: recentInquiries } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    return NextResponse.json({
        projects: projectCount || 0,
        leads: inquiryCount || 0,
        bookings: bookingCount || 0,
        revenue: '$124,500', // Hardcoded or calculated from a 'payments' table
        recentInquiries
    });
}
