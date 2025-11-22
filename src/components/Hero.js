import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="hero" id="home">
            <div className="container">
                <h2>AI-Powered Home Design Planning</h2>
                <p>
                    Create your dream home with budget-aware designs, personalized recommendations, 
                    and connections to trusted local vendors. Transform your space with the power of artificial intelligence.
                </p>
                <Link to="/register" className="btn btn-primary">
                    Start Planning Now
                </Link>
            </div>
        </section>
    );
};

export default Hero;