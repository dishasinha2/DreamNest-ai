import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    
    // Don't show header on auth pages
    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    return (
        <header>
            <div className="container">
                <div className="header-content">
                    <div className="logo">
                        <i className="fas fa-home"></i>
                        <Link to="/" style={{textDecoration: 'none', color: 'white'}}>
                            <h1>DreamNestAI</h1>
                        </Link>
                    </div>
                    <nav>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#how-it-works">How It Works</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </nav>
                    <div className="auth-buttons">
                        <Link to="/login" className="btn btn-outline">Login</Link>
                        <Link to="/register" className="btn btn-primary">Get Started</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;