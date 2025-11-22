import React from 'react';

const Features = () => {
    const features = [
        {
            icon: 'fas fa-wallet',
            title: 'Budget-Aware Planning',
            description: 'Generate layouts and designs that fit perfectly within your budget constraints.'
        },
        {
            icon: 'fas fa-palette',
            title: 'Personalized Designs',
            description: 'Get recommendations based on your property type and style preferences.'
        },
        {
            icon: 'fas fa-shopping-cart',
            title: 'Real Purchase Links',
            description: 'Direct links to buy recommended furniture and decor items from trusted retailers.'
        },
        {
            icon: 'fas fa-handshake',
            title: 'Vendor Connection',
            description: 'Connect with trusted local vendors and laborers for seamless execution.'
        }
    ];

    return (
        <section className="features" id="features">
            <div className="container">
                <h2 className="section-title">Why Choose DreamNestAI?</h2>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">
                                <i className={feature.icon}></i>
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .features {
                    padding: 4rem 0;
                }
                
                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                }
                
                .feature-card {
                    background: white;
                    border-radius: 8px;
                    padding: 1.5rem;
                    box-shadow: var(--shadow);
                    transition: transform 0.3s;
                    text-align: center;
                }
                
                .feature-card:hover {
                    transform: translateY(-5px);
                }
                
                .feature-icon {
                    font-size: 2.5rem;
                    color: var(--primary);
                    margin-bottom: 1rem;
                }
                
                .feature-card h3 {
                    margin-bottom: 1rem;
                    color: var(--primary);
                }
            `}</style>
        </section>
    );
};

export default Features;