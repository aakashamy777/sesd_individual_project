import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotelService } from '../services';

interface Hotel {
  id: string;
  name: string;
  city: string;
}

const HotelsPage = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await hotelService.getAllHotels(city.trim() || undefined);
        const hotelsData = response?.data ?? response;
        setHotels(Array.isArray(hotelsData) ? hotelsData : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hotels.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, [city]);

  return (
    <main className="page">
      <div className="container">
        <h1>Hotels</h1>

        <div className="form-group">
          <label htmlFor="city-filter">Select your city</label>
          <select
            id="city-filter"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          >
            <option value="">All Cities</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>

        {isLoading && <p className="message">Finding best hotels in {city || 'India'}...</p>}
        {error && <p className="message error">{error}</p>}

        {!isLoading && !error && (
          <div className="cards-grid">
            {hotels.map((hotel) => (
              <button
                key={hotel.id}
                type="button"
                className="card card-button hotel-card"
                onClick={() => navigate(`/hotels/${hotel.id}`)}
              >
                <div className="hotel-info">
                  <h3>{hotel.name}</h3>
                  <p className="city-label">📍 {hotel.city}</p>
                </div>
              </button>
            ))}
          </div>
        )}
        {!isLoading && !error && hotels.length === 0 && (
          <p className="message">No hotels found for this filter.</p>
        )}
        <div className="actions-row">
          <button type="button" onClick={() => navigate('/bookings')}>
            View My Bookings
          </button>
        </div>
      </div>
    </main>
  );
};

export default HotelsPage;
