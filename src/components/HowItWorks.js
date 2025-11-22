import React from 'react';

const HowItWorks = () => {
    return (
        <section className="how-it-works" id="how-it-works">
            <div className="container">
                <h2 className="section-title">How DreamNestAI Works</h2>
                <div className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Enter Your Details</h3>
                        <p>Provide your budget, property type, location, and style preferences to get started.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>AI Analysis</h3>
                        <p>Our advanced AI processes your inputs to generate personalized design recommendations.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Get Your Plan</h3>
                        <p>Receive detailed design suggestions, budget allocation, and vendor connections.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">4</div>
                        <h3>Execute Your Plan</h3>
                        <p>Bring your design to life with purchase links and professional vendor contacts.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;