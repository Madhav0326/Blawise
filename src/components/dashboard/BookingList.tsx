import React from 'react';
import type { Booking } from '@/types/database';
import { format, differenceInMinutes } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface BookingListProps {
  bookings: Booking[];
  title: string;
  userRole: 'client' | 'consultant';
}

const BookingList: React.FC<BookingListProps> = ({ bookings, title, userRole }) => {
  if (bookings.length === 0) {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-muted-foreground">You have no {title.toLowerCase()}.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {bookings.map((booking) => {
          const personName = userRole === 'client'
            ? booking.consultant_profiles?.full_name || 'N/A'
            : `${booking.profiles?.first_name || ''} ${booking.profiles?.last_name || ''}`.trim() || 'N/A';

          const sessionTime = new Date(booking.scheduled_at);
          const now = new Date();
          // Session is considered "joinable" 10 minutes before it starts
          const isJoinable = differenceInMinutes(sessionTime, now) <= 10 && sessionTime > now;

          return (
            <div key={booking.id} className="bg-card text-card-foreground p-4 border rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className='mb-2 sm:mb-0'>
                <p className="font-bold">{userRole === 'client' ? 'Consultant:' : 'Client:'} {personName}</p>
                <p className="text-sm text-muted-foreground">
                  {format(sessionTime, "MMMM d, yyyy 'at' h:mm a")}
                </p>
                <p className="text-sm">Type: {booking.consultation_type} ({booking.duration_minutes} min)</p>
              </div>
              <div className="text-left sm:text-right flex items-center gap-4">
                <div className='text-right'>
                  <p className="font-semibold text-lg">₹{booking.total_amount}</p>
                  <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full capitalize">{booking.status}</span>
                </div>
                {/* Conditionally render the "Join Session" button */}
                {title === 'Upcoming Sessions' && (
                   <Button asChild disabled={!isJoinable}>
                     <Link to={`/session/${booking.id}`}>
                       Join Session
                     </Link>
                   </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingList;