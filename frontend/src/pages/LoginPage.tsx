import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await authService.login({ email: email.trim(), password });
      const token = response?.token ?? response?.data?.token;

      if (!token) {
        throw new Error('Token not found in login response.');
      }

      localStorage.setItem('token', token);
      navigate('/hotels');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <div className="container auth-container">
        <h1>Login</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error && <p className="message error">{error}</p>}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="helper-text">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
