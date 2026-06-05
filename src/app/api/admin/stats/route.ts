import { createClient } from '@/lib/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.app_metadata?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch Aggregated Stats
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
