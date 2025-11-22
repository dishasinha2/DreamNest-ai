import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProjectDetails = ({ user }) => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [furniture, setFurniture] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRoom, setSelectedRoom] = useState('all');

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  useEffect(() => {
    if (project) {
      fetchRecommendations();
    }
  }, [project, selectedRoom]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const [furnitureRes, vendorsRes] = await Promise.all([
        axios.get(`/furniture-recommendations?style=${project?.style_preference || 'modern'}&room_type=${selectedRoom}`),
        axios.get(`/vendors?location=${project?.location || 'Delhi'}`)
      ]);
      
      setFurniture(furnitureRes.data);
      setVendors(vendorsRes.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const roomTypes = [
    { id: 'all', name: 'All Rooms', icon: '🏠' },
    { id: 'living_room', name: 'Living Room', icon: '🛋️' },
    { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
    { id: 'bathroom', name: 'Bathroom', icon: '🚿' },
    { id: 'dining_room', name: 'Dining', icon: '🍽️' }
  ];

  if (loading) {
    return (
      <div className="dashboard" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div className="loading-spinner" style={{ width: '40px', height: '40px', margin: '0 auto 20px' }}></div>
        <h3>Loading your dream space...</h3>
      </div>
    );
  }

  if (!project) {
    return <div className="dashboard">Project not found</div>;
  }

  return (
    <div className="dashboard">
      {/* Project Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%)',
        padding: '40px',
        borderRadius: '20px',
        marginBottom: '30px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {project.project_name}
        </h1>
        <p style={{ fontSize: '18px', color: '#718096' }}>
          {project.property_type} • {project.location} • {project.area_sqft} sq. ft.
        </p>
        <div style={{ 
          display: 'inline-flex',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '25px',
          marginTop: '15px',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          ₹{project.budget.toLocaleString()}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        background: 'white',
        padding: '10px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
      }}>
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'furniture', label: '🛋️ Furniture', icon: '🛋️' },
          { id: 'vendors', label: '👷 Vendors', icon: '👷' },
          { id: 'timeline', label: '📅 Timeline', icon: '📅' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '15px 20px',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#4a5568',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600'
            }}
          >
            <span style={{ fontSize: '18px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          <div className="project-card">
            <h3>✨ Project Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '20px' }}>
              <div>
                <h4>🏠 Property Details</h4>
                <div style={{ background: '#f7fafc', padding: '15px', borderRadius: '10px', marginTop: '10px' }}>
                  <p><strong>Type:</strong> {project.property_type}</p>
                  <p><strong>Area:</strong> {project.area_sqft} sq. ft.</p>
                  <p><strong>Location:</strong> {project.location}</p>
                </div>
              </div>
              <div>
                <h4>🎨 Design Preferences</h4>
                <div style={{ background: '#f7fafc', padding: '15px', borderRadius: '10px', marginTop: '10px' }}>
                  <p><strong>Style:</strong> 
                    <span style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      marginLeft: '10px',
                      fontSize: '12px'
                    }}>
                      {project.style_preference}
                    </span>
                  </p>
                  <p><strong>Budget:</strong> ₹{project.budget.toLocaleString()}</p>
                  <p><strong>Created:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Allocation Visualization */}
          <div className="project-card" style={{ marginTop: '20px' }}>
            <h4>💰 Budget Allocation</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
              {[
                { category: 'Furniture', amount: project.budget * 0.4, color: '#667eea' },
                { category: 'Labor', amount: project.budget * 0.3, color: '#764ba2' },
                { category: 'Materials', amount: project.budget * 0.2, color: '#f093fb' },
                { category: 'Contingency', amount: project.budget * 0.1, color: '#4fd1c7' }
              ].map((item, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: `conic-gradient(${item.color} 0% ${(item.amount/project.budget)*100}%, #e2e8f0 ${(item.amount/project.budget)*100}% 100%)`,
                    borderRadius: '50%',
                    margin: '0 auto 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    {((item.amount/project.budget)*100).toFixed(0)}%
                  </div>
                  <div><strong>{item.category}</strong></div>
                  <div style={{ color: '#718096', fontSize: '14px' }}>
                    ₹{item.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'furniture' && (
        <div>
          {/* Room Filter */}
          <div style={{ marginBottom: '30px' }}>
            <h3>🛋️ Furniture Recommendations</h3>
            <p>Browse furniture curated for your {project.style_preference} style</p>
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
              {roomTypes.map(room => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  style={{
                    padding: '10px 15px',
                    background: selectedRoom === room.id ? 
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f7fafc',
                    color: selectedRoom === room.id ? 'white' : '#4a5568',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span>{room.icon}</span>
                  {room.name}
                </button>
              ))}
            </div>
          </div>

          {/* Furniture Gallery */}
          <div className="furniture-gallery">
            {furniture.map(item => (
              <div key={item.id} className="furniture-item">
                <div className="furniture-image">
                  {item.item_type === 'furniture' ? '🛋️' : 
                   item.item_type === 'decor' ? '🖼️' : '💡'}
                </div>
                <div className="furniture-details">
                  <h4>{item.item_name}</h4>
                  <p style={{ color: '#718096', fontSize: '14px', margin: '5px 0' }}>
                    {item.room_type.replace('_', ' ')} • {item.style}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: '10px'
                  }}>
                    <span className="price-tag">
                      ₹{item.price_range.toLocaleString()}
                    </span>
                    {item.purchase_link && (
                      <a 
                        href={item.purchase_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          background: '#48bb78',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        Buy Now
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {furniture.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🛋️</div>
              <h4>No furniture recommendations found</h4>
              <p>Try selecting a different room type or check back later for updates</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'vendors' && (
        <div>
          <h3>👷 Local Vendors in {project.location}</h3>
          <p>Trusted professionals for your project needs</p>
          
          <div className="projects-grid" style={{ marginTop: '20px' }}>
            {vendors.map(vendor => (
              <div key={vendor.id} className="project-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold'
                  }}>
                    {vendor.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>{vendor.name}</h4>
                    <span style={{
                      background: '#e2e8f0',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      textTransform: 'capitalize'
                    }}>
                      {vendor.service_type}
                    </span>
                  </div>
                </div>
                
                <div style={{ margin: '15px 0' }}>
                  <p>📍 {vendor.location}</p>
                  <p>📞 {vendor.contact_number}</p>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ color: '#f6ad55' }}>
                      {'⭐'.repeat(Math.floor(vendor.rating))}
                    </span>
                    <span style={{ marginLeft: '5px', fontWeight: '600' }}>
                      {vendor.rating}/5
                    </span>
                  </div>
                  <span style={{ 
                    background: '#c6f6d5',
                    color: '#22543d',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '12px'
                  }}>
                    {vendor.experience_years} years exp.
                  </span>
                </div>
                
                <button style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  marginTop: '15px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>
                  Contact Vendor
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div>
          <h3>📅 Project Timeline</h3>
          <div className="project-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { step: 'Planning', status: 'completed', days: '3 days', description: 'Finalize design and budget' },
                { step: 'Procurement', status: 'current', days: '7 days', description: 'Purchase materials and furniture' },
                { step: 'Execution', status: 'pending', days: '14 days', description: 'Construction and installation' },
                { step: 'Finishing', status: 'pending', days: '5 days', description: 'Final touches and cleanup' }
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: item.status === 'completed' ? '#48bb78' : 
                               item.status === 'current' ? '#ed8936' : '#e2e8f0',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {item.status === 'completed' ? '✓' : index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{item.step}</strong>
                      <span style={{ color: '#718096' }}>{item.days}</span>
                    </div>
                    <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;