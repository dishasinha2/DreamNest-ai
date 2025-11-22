import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Don't show header on auth pages
    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <header style={{
            background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'var(--white)',
            backdropFilter: isScrolled ? 'blur(10px)' : 'none'
        }}>
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <i className="fas fa-home"></i>
                        <h1>DreamNestAI</h1>
                    </Link>
                    
                    <nav>
                        <ul>
                            <li>
                                <Link 
                                    to="/" 
                                    className={isActive('/') ? 'active' : ''}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <a href="#features" className={location.hash === '#features' ? 'active' : ''}>
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#how-it-works" className={location.hash === '#how-it-works' ? 'active' : ''}>
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className={location.hash === '#contact' ? 'active' : ''}>
                                    Contact
                                </a>
                            </li>
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