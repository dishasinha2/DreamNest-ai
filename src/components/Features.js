import React from 'react';

const Features = () => {
    const features = [
        {
            icon: '💰',
            title: 'Budget Planning',
            description: 'Smart budget allocation and cost estimation for your entire project.'
        },
        {
            icon: '🎨',
            title: 'AI Design',
            description: 'Personalized design recommendations based on your preferences.'
        },
        {
            icon: '👥',
            title: 'Vendor Network',
            description: 'Access to trusted local contractors and suppliers.'
        },
        {
            icon: '📊',
            title: 'Progress Tracking',
            description: 'Real-time project monitoring and milestone tracking.'
        }
    ];

    return (
        <section className="features" id="features">
            <div className="container">
                <h2 className="section-title">Why Choose DreamNestAI?</h2>
                <div className="steps">
                    {features.map((feature, index) => (
                        <div key={index} className="step">
                            <div className="step-number" style={{fontSize: '2.5rem', background: 'var(--accent)'}}>
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;