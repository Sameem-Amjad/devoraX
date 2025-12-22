import { createClient } from '@/lib/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { name, email, date, time } = body;

        // Validation
        if (!name || !email || !date || !time) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('bookings')
            .insert([{ name, email, booking_date: date, booking_time: time }])
            .select();

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
