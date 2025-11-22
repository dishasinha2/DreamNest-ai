import React from 'react';

const HowItWorks = () => {
    const steps = [
        {
            number: '1',
            title: 'Enter Your Details',
            description: 'Provide your budget, property type, location, and style preferences.'
        },
        {
            number: '2',
            title: 'AI Analysis',
            description: 'Our AI engine processes your inputs to generate personalized recommendations.'
        },
        {
            number: '3',
            title: 'Get Your Plan',
            description: 'Receive design suggestions, budget allocation, and vendor connections.'
        },
        {
            number: '4',
            title: 'Execute Your Plan',
            description: 'Use purchase links and vendor contacts to bring your design to life.'
        }
    ];

    return (
        <section className="how-it-works" id="how-it-works">
            <div className="container">
                <h2 className="section-title">How DreamNestAI Works</h2>
                <div className="steps">
                    {steps.map((step, index) => (
                        <div key={index} className="step">
                            <div className="step-number">{step.number}</div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .how-it-works {
                    padding: 4rem 0;
                    background-color: var(--secondary);
                }
                
                .steps {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    margin-top: 2rem;
                }
                
                .step {
                    flex: 1;
                    min-width: 250px;
                    text-align: center;
                    padding: 1.5rem;
                    position: relative;
                }
                
                .step-number {
                    width: 40px;
                    height: 40px;
                    background-color: var(--primary);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                    font-weight: bold;
                }
                
                .step h3 {
                    margin-bottom: 1rem;
                    color: var(--primary);
                }
                
                @media (max-width: 768px) {
                    .steps {
                        flex-direction: column;
                    gap: 2rem;
                    align-items: center;
                    text-align: center;
                    margin-top: 2rem;
                    padding: 0 1rem;
                    width: 100%;
                        box-sizing: border-box;
                    }
                
                    .step {
                        flex: none;
                        width: 100%;
                        max-width: 300px;
                        margin-bottom: 2rem;
                    }
                
                    .step:last-child {
                        margin-bottom: 0;
                    }
                }

                @media (max-width: 480px) {
                    .steps {
                        gap: 1.5rem;
                    padding: 0 0.5rem;
                    margin-top: 1.5rem;
                    }
                
                    .step {
                        padding: 1rem;
                        min-width: unset;
                        width: 100%;
                    }
                
                    .step-number {
                        width: 35px;
                        height: 35px;
                        margin-bottom: 0.8rem;
                        font-size: 0.9rem;
                    }
                
                    .step h3 {
                        font-size: 1.1rem;
                        margin-bottom: 0.8rem;
                    }
                
                    .step p {
                        font-size: 0.9rem;
                        line-height: 1.4;
                    }
                }
            `}</style>
        </section>
    );
};

export default HowItWorks;