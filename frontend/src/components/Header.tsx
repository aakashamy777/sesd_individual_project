import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="main-header">
            <div className="header-container">
                <Link to="/hotels" className="logo">StaySync</Link>
                <nav className="nav-links">
                    {token ? (
                        <>
                            <Link to="/hotels">Explore</Link>
                            <Link to="/bookings">My Bookings</Link>
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
