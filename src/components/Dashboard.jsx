import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: 'Disha Sinha',
        email: 'disha@example.com',
        joinDate: '2024-01-15'
    });
    
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({
        totalProjects: 0,
        completedProjects: 0,
        totalBudget: 0,
        savedAmount: 0
    });
    
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        // Simulate loading user projects
        const userProjects = [
            {
                id: 1,
                name: 'Modern Apartment Makeover',
                type: 'Apartment',
                budget: 750000,
                location: 'Mumbai',
                progress: 75,
                status: 'In Progress',
                startDate: '2024-01-20',
                endDate: '2024-03-20',
                image: '🏠'
            },
            {
                id: 2,
                name: 'Luxury Villa Design',
                type: 'Villa',
                budget: 2500000,
                location: 'Delhi',
                progress: 30,
                status: 'Planning',
                startDate: '2024-02-01',
                endDate: '2024-06-01',
                image: '🏰'
            },
            {
                id: 3,
                name: 'Studio Optimization',
                type: 'Studio',
                budget: 350000,
                location: 'Bangalore',
                progress: 100,
                status: 'Completed',
                startDate: '2024-01-10',
                endDate: '2024-02-15',
                image: '📐'
            }
        ];

        setProjects(userProjects);
        
        // Calculate stats
        const totalProjects = userProjects.length;
        const completedProjects = userProjects.filter(p => p.progress === 100).length;
        const totalBudget = userProjects.reduce((sum, project) => sum + project.budget, 0);
        const savedAmount = totalBudget * 0.15; // Assuming 15% savings

        setStats({
            totalProjects,
            completedProjects,
            totalBudget,
            savedAmount
        });
    }, []);

    const createNewProject = () => {
        navigate('/create-project');
    };

    const viewProjectDetails = (projectId) => {
        navigate(`/project/${projectId}`);
    };

    return (
        <div className="dashboard">
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>Welcome back, {user.name}! 👋</h1>
                    <p>Here's what's happening with your projects today</p>
                </div>
                <button className="btn btn-accent" onClick={createNewProject}>
                    <i className="fas fa-plus"></i>
                    Create New Project
                </button>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>
                        <i className="fas fa-project-diagram"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalProjects}</h3>
                        <p>Total Projects</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--gradient-secondary)' }}>
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.completedProjects}</h3>
                        <p>Completed</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--gradient-accent)' }}>
                        <i className="fas fa-wallet"></i>
                    </div>
                    <div className="stat-info">
                        <h3>₹{(stats.totalBudget / 100000).toFixed(1)}L</h3>
                        <p>Total Budget</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>
                        <i className="fas fa-piggy-bank"></i>
                    </div>
                    <div className="stat-info">
                        <h3>₹{(stats.savedAmount / 100000).toFixed(1)}L</h3>
                        <p>Amount Saved</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-content">
                {/* Projects Section */}
                <div className="projects-section">
                    <div className="section-header">
                        <h2>Your Projects</h2>
                        <div className="view-options">
                            <button 
                                className={`view-option ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                            <button 
                                className={`view-option ${activeTab === 'list' ? 'active' : ''}`}
                                onClick={() => setActiveTab('list')}
                            >
                                List View
                            </button>
                        </div>
                    </div>

                    {activeTab === 'overview' ? (
                        <div className="projects-grid">
                            {projects.map(project => (
                                <div key={project.id} className="project-card" onClick={() => viewProjectDetails(project.id)}>
                                    <div className="project-header">
                                        <div className="project-image">
                                            {project.image}
                                        </div>
                                        <div className="project-info">
                                            <h3>{project.name}</h3>
                                            <div className="project-meta">
                                                <span className="project-type">{project.type}</span>
                                                <span className="project-location">{project.location}</span>
                                            </div>
                                        </div>
                                        <div className="project-status" data-status={project.status.toLowerCase()}>
                                            {project.status}
                                        </div>
                                    </div>
                                    
                                    <div className="project-progress">
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill" 
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className="progress-text">{project.progress}% Complete</span>
                                    </div>
                                    
                                    <div className="project-footer">
                                        <div className="project-budget">
                                            <strong>₹{(project.budget / 100000).toFixed(1)}L</strong>
                                            <span>Budget</span>
                                        </div>
                                        <div className="project-dates">
                                            <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                                            <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="projects-list">
                            {projects.map(project => (
                                <div key={project.id} className="project-list-item" onClick={() => viewProjectDetails(project.id)}>
                                    <div className="list-item-main">
                                        <div className="item-icon">{project.image}</div>
                                        <div className="item-details">
                                            <h4>{project.name}</h4>
                                            <p>{project.type} • {project.location}</p>
                                        </div>
                                        <div className="item-status" data-status={project.status.toLowerCase()}>
                                            {project.status}
                                        </div>
                                    </div>
                                    <div className="list-item-secondary">
                                        <span>Budget: ₹{(project.budget / 100000).toFixed(1)}L</span>
                                        <span>Progress: {project.progress}%</span>
                                        <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="sidebar">
                     <div className="quick-actions-box">

                    <h3>Quick Actions</h3>

                    <div className="quick-btn" onClick={() => navigate("/create-project")}>
                        ➕ New Project
                    </div>

                    <div className="quick-btn" onClick={() => navigate("/vendors")}>
                        🔍 Find Vendors
                    </div>

                    <div className="quick-btn" onClick={() => navigate("/furniture")}>
                        🛒 Browse Furniture
                    </div>

                    <div className="quick-btn" onClick={() => navigate("/reports")}>
                        📊 View Reports
                    </div>

                    </div>

                    <div className="recent-activity card">
                        <h3>Recent Activity</h3>
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="activity-content">
                                    <p>Studio Optimization project completed</p>
                                    <span>2 days ago</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-bolt"></i>
                                </div>
                                <div className="activity-content">
                                    <p>Vendor assigned to Luxury Villa project</p>
                                    <span>1 week ago</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-shopping-cart"></i>
                                </div>
                                <div className="activity-content">
                                    <p>Furniture order placed for Modern Apartment</p>
                                    <span>2 weeks ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .dashboard {
                    padding: 30px 0;
                    min-height: 100vh;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                    animation: slideUp 0.6s ease;
                }

                .welcome-section h1 {
                    font-size: 2.5rem;
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 10px;
                }

                .welcome-section p {
                    color: var(--medium-gray);
                    font-size: 1.1rem;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px;
                }

                .stat-card {
                    background: white;
                    padding: 25px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    box-shadow: var(--shadow);
                    transition: all 0.3s ease;
                }

                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-hover);
                }

                .stat-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.5rem;
                }

                .stat-info h3 {
                    font-size: 2rem;
                    color: var(--dark);
                    margin-bottom: 5px;
                }

                .stat-info p {
                    color: var(--medium-gray);
                    font-weight: 500;
                }

                .dashboard-content {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 30px;
                }

                .projects-section {
                    animation: fadeIn 0.8s ease;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }

                .section-header h2 {
                    color: var(--dark);
                    font-size: 1.8rem;
                }

                .view-options {
                    display: flex;
                    background: var(--light-gray);
                    border-radius: 10px;
                    padding: 5px;
                }

                .view-option {
                    padding: 8px 16px;
                    border: none;
                    background: transparent;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .view-option.active {
                    background: var(--primary);
                    color: white;
                }

                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 25px;
                }

                .project-card {
                    background: white;
                    padding: 25px;
                    border-radius: 20px;
                    box-shadow: var(--shadow);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }

                .project-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-hover);
                    border-color: var(--primary-light);
                }

                .project-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .project-image {
                    font-size: 2.5rem;
                    margin-right: 15px;
                }

                .project-info h3 {
                    color: var(--dark);
                    margin-bottom: 5px;
                }

                .project-meta {
                    display: flex;
                    gap: 10px;
                }

                .project-type, .project-location {
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    font-weight: 500;
                }

                .project-type {
                    background: var(--primary-light);
                    color: white;
                }

                .project-location {
                    background: var(--light-gray);
                    color: var(--dark-gray);
                }

                .project-status {
                    margin-left: auto;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                .project-status[data-status="completed"] {
                    background: var(--success);
                    color: white;
                }

                .project-status[data-status="in progress"] {
                    background: var(--warning);
                    color: white;
                }

                .project-status[data-status="planning"] {
                    background: var(--accent);
                    color: white;
                }

                .project-progress {
                    margin-bottom: 20px;
                }

                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: var(--light-gray);
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 8px;
                }

                .progress-fill {
                    height: 100%;
                    background: var(--gradient-primary);
                    border-radius: 4px;
                    transition: width 0.3s ease;
                }

                .progress-text {
                    font-size: 0.9rem;
                    color: var(--medium-gray);
                }

                .project-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .project-budget {
                    text-align: center;
                }

                .project-budget strong {
                    display: block;
                    color: var(--primary);
                    font-size: 1.2rem;
                }

                .project-dates {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    font-size: 0.8rem;
                    color: var(--medium-gray);
                }

                /* List View */
                .projects-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .project-list-item {
                    background: white;
                    padding: 20px;
                    border-radius: 15px;
                    box-shadow: var(--shadow);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .project-list-item:hover {
                    transform: translateX(5px);
                    box-shadow: var(--shadow-hover);
                }

                .list-item-main {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 10px;
                }

                .item-icon {
                    font-size: 1.5rem;
                }

                .item-details {
                    flex: 1;
                }

                .item-details h4 {
                    color: var(--dark);
                    margin-bottom: 5px;
                }

                .item-details p {
                    color: var(--medium-gray);
                    font-size: 0.9rem;
                }

                .item-status {
                    padding: 6px 12px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                .list-item-secondary {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    color: var(--medium-gray);
                }

                /* Sidebar */
                .sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                }

                .quick-actions h3, .recent-activity h3 {
                    margin-bottom: 20px;
                    color: var(--dark);
                }

                .action-buttons {
                    display: grid;
                    gap: 12px;
                }

                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px;
                    background: var(--light);
                    border: 2px solid var(--light-gray);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .action-btn:hover {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                }

                .activity-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .activity-item {
                    display: flex;
                    gap: 12px;
                    padding: 12px;
                    background: var(--light);
                    border-radius: 10px;
                }

                .activity-icon {
                    width: 30px;
                    height: 30px;
                    background: var(--primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 0.8rem;
                }

                .activity-content p {
                    font-size: 0.9rem;
                    margin-bottom: 4px;
                }

                .activity-content span {
                    font-size: 0.8rem;
                    color: var(--medium-gray);
                }

                @media (max-width: 1024px) {
                    .dashboard-content {
                        grid-template-columns: 1fr;
                    gap: 20px;
                    }
                
                    .sidebar {
                        order: -1;
                        }
                }

                @media (max-width: 768px) {
                    .dashboard-header {
                        flex-direction: column;
                        gap: 20px;
                        text-align: center;
                        }
                
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                        }
                
                    .projects-grid {
                        grid-template-columns: 1fr;
                        }
                
                    .list-item-secondary {
                        flex-direction: column;
                        gap: 5px;
                        }
                }

                @media (max-width: 480px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                        }
                
                    .project-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                        }
                
                    .project-status {
                        align-self: flex-start;
                        }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
