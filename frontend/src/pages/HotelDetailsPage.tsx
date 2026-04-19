import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { bookingService, hotelService, reviewService, roomService } from '../services';

interface Hotel {
  id: string;
  name: string;
  city: string;
}

interface Room {
  id: string;
  type?: string;
  capacity?: number;
  price?: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt?: string;
  user?: {
    id?: string;
    name?: string;
  };
}

const HotelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [isLoadingHotel, setIsLoadingHotel] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isBooking, setIsBooking] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }

      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) {
        return null;
      }

      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = window.atob(`${base64}${'='.repeat((4 - (base64.length % 4)) % 4)}`);
      const payload = JSON.parse(decoded) as { userId?: string; sub?: string };
      return payload.userId ?? payload.sub ?? null;
    } catch {
      return null;
    }
  };

  const fetchReviews = async (hotelId: string) => {
    setIsLoadingReviews(true);
    setReviewError('');

    try {
      const response = await reviewService.getHotelReviews(hotelId);
      const reviewsData = response?.data ?? response;
      const parsedReviews = Array.isArray(reviewsData) ? reviewsData : [];
      setReviews(parsedReviews);

      const currentUserId = getCurrentUserId();
      const alreadyReviewed = currentUserId
        ? parsedReviews.some((review) => review.user?.id === currentUserId)
        : false;
      setHasReviewed(alreadyReviewed);

      if (alreadyReviewed) {
        setReviewMessage('You have already reviewed this hotel.');
      }
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Failed to load reviews.');
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchHotel = async () => {
      setIsLoadingHotel(true);
      setError('');

      try {
        const response = await hotelService.getHotelById(id);
        const hotelData = response?.data ?? response;
        setHotel(hotelData ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hotel.');
      } finally {
        setIsLoadingHotel(false);
      }
    };

    fetchHotel();
    fetchReviews(id);
  }, [id]);

  const handleCheckAvailability = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) {
      return;
    }
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError('End date must be after start date.');
      return;
    }

    setIsCheckingAvailability(true);
    setError('');
    setAvailableRooms([]);

    try {
      const response = await roomService.getAvailableRooms({
        hotelId: id,
        startDate,
        endDate,
      });
      const roomsData = response?.data ?? response;
      setAvailableRooms(Array.isArray(roomsData) ? roomsData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check availability.');
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleBookRoom = async (roomId: string) => {
    if (!startDate || !endDate) {
      setError('Please select valid booking dates first.');
      return;
    }
    setIsBooking(roomId);
    setError('');
    setSuccessMessage('');

    try {
      await bookingService.createBooking({ roomId, startDate, endDate });
      setSuccessMessage('Booking created successfully. Redirecting to your bookings...');
      setTimeout(() => {
        navigate('/bookings');
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError('This room is no longer available for the selected dates. Please choose another room.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create booking.');
      }
    } finally {
      setIsBooking(null);
    }
  };

  const handleSubmitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      return;
    }
    if (hasReviewed) {
      setReviewError('You have already reviewed this hotel.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewError('');
    setReviewMessage('');

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setReviewError('Rating must be an integer between 1 and 5.');
      setIsSubmittingReview(false);
      return;
    }

    try {
      await reviewService.addReview({ hotelId: id, rating, comment });
      setReviewMessage('Review added successfully.');
      setComment('');
      setRating(5);
      await fetchReviews(id);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setReviewError('You have already reviewed this hotel.');
        setHasReviewed(true);
      } else {
        setReviewError(err instanceof Error ? err.message : 'Failed to add review.');
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <main className="page">
      <div className="container">
        <h1>Hotel Details</h1>

        {isLoadingHotel && <p className="message">Loading hotel...</p>}
        {!isLoadingHotel && hotel && (
          <section className="card">
            <p><strong>Name:</strong> {hotel.name}</p>
            <p><strong>City:</strong> {hotel.city}</p>
          </section>
        )}

        <section className="section">
          <h2>Check Availability</h2>
          <form className="form" onSubmit={handleCheckAvailability}>
            <div className="form-group">
              <label htmlFor="start-date">Start Date</label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(event) => setStartDate(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="end-date">End Date</label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                min={startDate || new Date().toISOString().split('T')[0]}
                onChange={(event) => setEndDate(event.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={isCheckingAvailability}>
              {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
            </button>
          </form>
        </section>

        {error && <p className="message error">{error}</p>}
        {successMessage && <p className="message success">{successMessage}</p>}

        <section className="section">
          <h2>Available Rooms</h2>
          {availableRooms.length === 0 ? (
            <p className="message">No rooms to show. Check availability first.</p>
          ) : (
            <ul className="list">
              {availableRooms.map((room) => (
                <li key={room.id} className="list-item">
                  <p><strong>Type:</strong> {room.type ?? '-'}</p>
                  <p><strong>Capacity:</strong> {room.capacity ?? '-'}</p>
                  <p><strong>Price per night:</strong> {room.price ? `₹${room.price}` : '-'}</p>
                  <button
                    type="button"
                    onClick={() => handleBookRoom(room.id)}
                    disabled={isBooking === room.id || !startDate || !endDate}
                  >
                    {isBooking === room.id ? 'Booking...' : 'Book'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="section">
          <h2>Reviews</h2>

          {isLoadingReviews && <p className="message">Loading reviews...</p>}
          {reviewError && <p className="message error">{reviewError}</p>}
          {reviewMessage && <p className="message success">{reviewMessage}</p>}

          {!isLoadingReviews && reviews.length === 0 && <p className="message">No reviews yet.</p>}

          {!isLoadingReviews && reviews.length > 0 && (
            <ul className="list">
              {reviews.map((review) => (
                <li key={review.id} className="list-item">
                  <p><strong>Rating:</strong> {review.rating}</p>
                  <p><strong>Comment:</strong> {review.comment}</p>
                  <p><strong>User:</strong> {review.user?.name ?? 'Unknown'}</p>
                  <p><strong>Date:</strong> {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '-'}</p>
                </li>
              ))}
            </ul>
          )}

          <h3>Add Review</h3>
          <form className="form" onSubmit={handleSubmitReview}>
            <div className="form-group">
              <label htmlFor="rating">Rating (1-5)</label>
              <input
                id="rating"
                type="number"
                min={1}
                max={5}
                step={1}
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
                disabled={hasReviewed || isSubmittingReview}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                disabled={hasReviewed || isSubmittingReview}
                required
              />
            </div>
            <button type="submit" disabled={isSubmittingReview || hasReviewed}>
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
          {hasReviewed && (
            <p className="message">Review form is disabled because you already reviewed this hotel.</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default HotelDetailsPage;
