"use client"

import {supabase} from "@/lib/client";
import { motion } from 'framer-motion';
import { X, Zap, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  date: number | null;
  time: string | null;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', date: null, time: null });
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [bookedSlots, setBookedSlots] = useState<{ date: number, time: string }[]>([]);

  // Generate next 7 days
  const getNext7Days = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Generate time slots from 10 AM to 2 AM next day
  const getTimeSlots = () => {
    const slots: string[] = [];
    let hour = 10;
    while (true) {
      const displayHour = hour % 24;
      const ampm = displayHour < 12 || displayHour === 24 ? 'AM' : 'PM';
      const h = displayHour % 12 === 0 ? 12 : displayHour % 12;
      slots.push(`${h}:00 ${ampm}`);
      if (displayHour === 2) break;
      hour++;
    }
    return slots;
  };

  const fetchBookedSlots = async () => {
    try {
      const { data, error } = await supabase.from('bookings').select('booking_date, booking_time');
      if (error) throw error;
      const mappedData = (data || []).map(slot => ({
        date: slot.booking_date,
        time: slot.booking_time,
      }));
      setBookedSlots(mappedData);
    } catch (err) {
      console.error('Failed to fetch booked slots:', err);
    }
  };

  useEffect(() => {
    setAvailableDates(getNext7Days());
    fetchBookedSlots();
  }, []);

  if (!isOpen) return null;

  const isSlotBooked = (date: number, time: string) => {
    return bookedSlots.some(slot => slot.date === date && slot.time === time);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      alert('Please select a date and time');
      return;
    }

    setLoading(true);

    try {
      // Check collision again just before inserting
      const { data: existing, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_date', formData.date)
        .eq('booking_time', formData.time);

      if (fetchError) throw fetchError;
      if (existing && existing.length > 0) {
        alert('This slot is already booked. Please select another.');
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from('bookings').insert([{
        name: formData.name,
        email: formData.email,
        booking_date: formData.date,
        booking_time: formData.time,
        created_at: new Date(),
      }]);

      if (insertError) throw insertError;

      setSuccess(true);
      fetchBookedSlots(); // Refresh booked slots
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Failed to book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md scrollbar-hide">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0a0a0a] border border-teal-500/20 w-full max-w-md rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(45,212,191,0.15)]"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-400" />
            <h3 className="text-xl font-bold text-white">Book a Strategy Call</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className='h-125 overflow-y-auto scrollbar-hide'>
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-teal-400" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h4>
            <p className="text-gray-400 mb-6">We've sent a calendar invitation to your email. See you soon.</p>
            <button onClick={onClose} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg">Close</button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <p className="text-gray-400 text-sm">Schedule a 30-minute consultation with Sameem Amjad.</p>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-teal-500 uppercase">Select a Date</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {availableDates.map(date => {
                  const day = date.getDate();
                  const month = date.toLocaleString('default', { month: 'short' });
                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      onClick={() => setFormData({ ...formData, date: date.getTime() })}
                      className={`flex flex-col items-center justify-center min-w-[3.5rem] h-16 rounded-lg border transition-colors group ${
                        formData.date === date.getTime()
                          ? 'bg-teal-500/20 border-teal-400 text-white'
                          : 'border-white/10 bg-white/5 hover:bg-teal-500/10 text-gray-500'
                      }`}
                    >
                      <span className="text-xs">{month}</span>
                      <span className="text-lg font-bold">{day}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-teal-500 uppercase">Select a Time</label>
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto scrollbar-hide">
                {getTimeSlots().map(time => {
                  const disabled = formData.date ? isSlotBooked(formData.date, time) : false;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => !disabled && setFormData({ ...formData, time })}
                      disabled={disabled}
                      className={`py-2 text-sm rounded-md border transition-colors ${
                        formData.time === time
                          ? 'bg-teal-500/20 border-teal-400 text-white'
                          : 'border-white/10 bg-white/5 text-gray-300 hover:bg-teal-500/10'
                      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t border-white/10">
              <input
                required
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-gray-600"
              />
              <input
                required
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-gray-600"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
          )}
          </div>
      </motion.div>
    </div>
  );
};

export default BookingModal;
