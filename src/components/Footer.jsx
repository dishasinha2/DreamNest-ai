import React from 'react';

const Footer = () => {
    return (
        <footer id="contact">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>DreamNestAI</h3>
                        <p>AI-powered home design planning that makes dream homes accessible to everyone.</p>
                    </div>
                    <div className="footer-section">
                        <h3>Contact Us</h3>
                        <p><i className="fas fa-envelope"></i> info@dreamnestai.com</p>
                        <p><i className="fas fa-phone"></i> +91 98765 43210</p>
                    </div>
                    <div className="footer-section">
                        <div className="footer-section">
                        <h3>Team Members</h3>
                        <p>Disha Sinha</p>
                        <p>Geet Goyal</p>
                        <p>Ambikasya Verma</p>
                    </div>
                        
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 DreamNestAI. B.Tech CSE Batch 8 Project.</p>
                </div>
            </div>

            <style jsx>{`
                footer {
                    background-color: var(--dark);
                    color: white;
                    padding: 3rem 0;
                    margin-top: 4rem;
                }
                
                .footer-content {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                }
                
                .footer-section {
                    flex: 1;
                    min-width: 250px;
                    margin-bottom: 2rem;
                }
                
                .footer-section h3 {
                    margin-bottom: 1rem;
                    color: var(--accent);
                }
                
                .footer-section i {
                    margin-right: 10px;
                    color: var(--accent);
                }
                
                .footer-bottom {
                    text-align: center;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </footer>
    );
};

export default Footer;