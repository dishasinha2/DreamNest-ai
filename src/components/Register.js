import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            return 'Full name is required';
        }
        if (!formData.email.trim()) {
            return 'Email is required';
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            return 'Email is invalid';
        }
        if (formData.password.length < 6) {
            return 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            return 'Passwords do not match';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validate form
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setIsLoading(false);
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check if user already exists (simulation)
            const existingUsers = JSON.parse(localStorage.getItem('dreamnestai_users') || '[]');
            const userExists = existingUsers.find(user => user.email === formData.email);
            
            if (userExists) {
                setError('User with this email already exists');
                setIsLoading(false);
                return;
            }

            // Register user
            const newUser = {
                id: Date.now(),
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password, // In real app, hash this password
                createdAt: new Date().toISOString()
            };

            existingUsers.push(newUser);
            localStorage.setItem('dreamnestai_users', JSON.stringify(existingUsers));
            localStorage.setItem('dreamnestai_currentUser', JSON.stringify(newUser));

            // Redirect to dashboard
            navigate('/dashboard');
            
        } catch (error) {
            setError('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Join DreamNestAI</h2>
                    <p>Create your account to start planning your dream home</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="fullName">FULL NAME:</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">EMAIL:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">PASSWORD:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">CONFIRM PASSWORD:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;