import React from 'react';

const Hero = () => {
    return (
        <section className="hero">
            <div className="container">
                <h1>AI-Powered Home Design Planning</h1>
                <p>Create your dream home with budget-aware designs, personalized recommendations, and connections to trusted local vendors.</p>
                <a href="#plan" className="btn">Start Planning</a>
            </div>

            <style jsx>{`
                .hero {
                    padding: 4rem 0;
                    background: linear-gradient(135deg, var(--secondary) 0%, var(--light) 100%);
                    text-align: center;
                }
                
                .hero h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    color: var(--primary);
                }
                
                .hero p {
                    font-size: 1.2rem;
                    max-width: 700px;
                    margin: 0 auto 2rem;
                    color: var(--dark);
                }
                
                @media (max-width: 768px) {
                    .hero h1 {
                        font-size: 2rem;
                    }
                    
                    .hero p {
                        font-size: 1rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default Hero;