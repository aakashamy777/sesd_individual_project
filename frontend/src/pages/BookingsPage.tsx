import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services';

interface Booking {
  id: string;
  roomId: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice?: number;
}

const BookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelingBookingId, setCancelingBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await bookingService.getUserBookings();
        const bookingsData = response?.data ?? response;
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bookings.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    setCancelingBookingId(bookingId);
    setError('');

    try {
      await bookingService.cancelBooking(bookingId);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: 'CANCELLED' } : booking
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking.');
    } finally {
      setCancelingBookingId(null);
    }
  };

  return (
    <main className="page">
      <div className="container">
        <h1>My Bookings</h1>

        {isLoading && <p className="message">Loading bookings...</p>}
        {error && <p className="message error">{error}</p>}

        {!isLoading && !error && bookings.length === 0 && (
          <p className="message">No bookings found.</p>
        )}

        {!isLoading && bookings.length > 0 && (
          <ul className="list">
            {bookings.map((booking) => {
              const isCancelable =
                booking.status.toUpperCase() === 'CONFIRMED' &&
                new Date(booking.endDate) > new Date();

              return (
                <li key={booking.id} className="list-item">
                  <p><strong>Booking ID:</strong> {booking.id}</p>
                  <p><strong>Room ID:</strong> {booking.roomId}</p>
                  <p><strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
                  <p><strong>Total Price:</strong> {booking.totalPrice ? `₹${booking.totalPrice}` : '-'}</p>
                  <p><strong>Status:</strong> {booking.status}</p>

                  {isCancelable && (
                    <button
                      type="button"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancelingBookingId === booking.id}
                    >
                      {cancelingBookingId === booking.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <div className="actions-row">
          <button type="button" onClick={() => navigate('/hotels')}>
            Back to Hotels
          </button>
        </div>
      </div>
    </main>
  );
};

export default BookingsPage;
