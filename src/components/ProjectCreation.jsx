import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProjectCreation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    project_name: "",
    property_type: "flat",
    budget: "",
    style_preference: "modern",
    location: "",
    area_sqft: ""
  });

  // ---------------------- ROOM OPTIONS ----------------------
  const roomTypes = [
    { id: "living_room", name: "Living Room", icon: "🛋️" },
    { id: "bedroom", name: "Bedroom", icon: "🛏️" },
    { id: "kitchen", name: "Kitchen", icon: "🍳" },
    { id: "bathroom", name: "Bathroom", icon: "🚿" },
    { id: "dining_room", name: "Dining Room", icon: "🍽️" },
    { id: "home_office", name: "Home Office", icon: "💻" }
  ];

  // ---------------------- STYLES ----------------------
  const styleOptions = [
    { value: "modern", label: "Modern", emoji: "✨" },
    { value: "traditional", label: "Traditional", emoji: "🏛️" },
    { value: "luxury", label: "Luxury", emoji: "💎" },
    { value: "minimal", label: "Minimal", emoji: "⚪" },
    { value: "industrial", label: "Industrial", emoji: "🏗️" },
    { value: "scandinavian", label: "Scandinavian", emoji: "🌿" }
  ];

  // ---------------------- HANDLERS ----------------------
  const handleRoomSelect = (roomId) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setCurrentStep((p) => p + 1);
  const prevStep = () => setCurrentStep((p) => p - 1);

  // AUTO-BUDGET SUGGESTION  
  const suggestedBudget = formData.area_sqft
    ? Number(formData.area_sqft) * 1500
    : 0;

  // ---------------------- DIRECT AI CALL ----------------------
  const handleDirectAI = async () => {
    setLoading(true);

    const body = {
      total_budget: Number(formData.budget),
      style: formData.style_preference.toLowerCase(),
      location: formData.location,
      rooms: selectedRooms.map((r) => ({ type: r })),
      area_sqft: formData.area_sqft,
      project_name: formData.project_name,
      property_type: formData.property_type
    };

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/recommendations",
        body
      );
      navigate("/results", { state: data });
    } catch (error) {
      console.error("AI error:", error);
      alert("Something went wrong while generating recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => (currentStep / 4) * 100;

  // ---------------------- UI START ----------------------
  return (
    <div className="project-wrapper">

      {/* HEADER */}
      <div className="title-box">
        <h2>✨ Design Your Dream Home</h2>
        <p>Tell us your vision — we’ll convert it into reality.</p>
      </div>

      {/* PROGRESS BAR */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="form-card">

        {/* STEP 1 — BASIC INFO */}
        {currentStep === 1 && (
          <div className="step fade-in">
            <h3>🏡 Basic Information</h3>

            <label>Project Name</label>
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              placeholder="e.g., Modern 2BHK Makeover"
            />

            <label>Property Type</label>
            <select name="property_type" value={formData.property_type} onChange={handleChange}>
              <option value="flat">Flat / Apartment</option>
              <option value="villa">Villa</option>
              <option value="bungalow">Bungalow</option>
              <option value="office">Office</option>
            </select>

            <label>Total Area (sq.ft)</label>
            <input
              type="number"
              name="area_sqft"
              value={formData.area_sqft}
              onChange={handleChange}
              placeholder="Enter area (e.g., 1200)"
            />

            {/* Suggested Price */}
            {formData.area_sqft && (
              <div className="suggest-box">
                ⭐ Suggested Minimum Budget:  
                <b> ₹{suggestedBudget.toLocaleString()} </b>
              </div>
            )}

            <label>Project Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Mumbai"
            />

            <button className="btn-primary" onClick={nextStep}>Next →</button>
          </div>
        )}

        {/* STEP 2 — ROOMS */}
        {currentStep === 2 && (
          <div className="step fade-in">
            <h3>🛋️ Select Rooms</h3>

            <div className="room-grid">
              {roomTypes.map((room) => (
                <div
                  key={room.id}
                  className={`room-card ${
                    selectedRooms.includes(room.id) ? "selected" : ""
                  }`}
                  onClick={() => handleRoomSelect(room.id)}
                >
                  <span className="room-icon">{room.icon}</span>
                  <p>{room.name}</p>
                </div>
              ))}
            </div>

            <div className="step-nav">
              <button className="btn-secondary" onClick={prevStep}>← Back</button>
              <button className="btn-primary" disabled={selectedRooms.length === 0} onClick={nextStep}>Next →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — STYLE + BUDGET */}
        {currentStep === 3 && (
          <div className="step fade-in">
            <h3>🎨 Choose Style & Budget</h3>

            <label>Style Preference</label>
            <div className="style-grid">
              {styleOptions.map((style) => (
                <div
                  key={style.value}
                  className={`style-card ${
                    formData.style_preference === style.value ? "active" : ""
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, style_preference: style.value })
                  }
                >
                  <span className="style-icon">{style.emoji}</span>
                  <p>{style.label}</p>
                </div>
              ))}
            </div>

            <label>Total Budget (₹)</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder={`Suggested: ₹${suggestedBudget.toLocaleString()}`}
            />

            <div className="step-nav">
              <button className="btn-secondary" onClick={prevStep}>← Back</button>
              <button className="btn-primary" onClick={nextStep}>Next →</button>
            </div>
          </div>
        )}

        {/* STEP 4 — REVIEW */}
        {currentStep === 4 && (
          <div className="step fade-in">
            <h3>📋 Review Your Project</h3>

            <div className="review-box">
              <p><b>Name:</b> {formData.project_name}</p>
              <p><b>Property:</b> {formData.property_type}</p>
              <p><b>Area:</b> {formData.area_sqft} sq.ft</p>
              <p><b>Location:</b> {formData.location}</p>
              <p><b>Style:</b> {formData.style_preference}</p>
              <p><b>Budget:</b> ₹{formData.budget}</p>

              <p><b>Rooms:</b></p>
              <ul>
                {selectedRooms.map((r) => (
                  <li key={r}>{r.replace("_", " ")}</li>
                ))}
              </ul>
            </div>

            <div className="step-nav">
              <button className="btn-secondary" onClick={prevStep}>← Back</button>
              <button className="btn-primary" disabled={loading} onClick={handleDirectAI}>
                {loading ? "Generating..." : "Create My Dream Project!"}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* CSS */}
      <style jsx>{`
        .project-wrapper {
          padding: 40px 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #f5f7fb;
        }

        .title-box {
          text-align: center;
          margin-bottom: 25px;
          animation: fadeIn 1s ease;
        }

        .title-box h2 {
          font-size: 2.2rem;
          background: linear-gradient(135deg,#6a11cb,#2575fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .progress-container {
          width: 80%;
          max-width: 700px;
          margin-bottom: 20px;
        }

        .progress-bar {
          background: #dce3f0;
          border-radius: 20px;
          height: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg,#6a11cb,#2575fc);
          transition: width .4s ease;
        }

        .form-card {
          max-width: 700px;
          width: 100%;
          padding: 30px;
          border-radius: 18px;
          background: rgba(255,255,255,0.9);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          backdrop-filter: blur(8px);
          animation: fadeInUp 0.6s ease;
        }

        .fade-in {
          animation: fadeIn 0.6s ease;
        }

        .step h3 {
          margin-bottom: 20px;
        }

        label {
          font-weight: 600;
          margin-top: 15px;
          display: block;
        }

        input, select {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 2px solid #dfe4ee;
          margin-bottom: 10px;
          font-size: 1rem;
        }

        .room-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(150px,1fr));
          gap: 15px;
        }

        .room-card {
          background: #f1f4fc;
          padding: 18px;
          border-radius: 14px;
          cursor: pointer;
          text-align: center;
          transition: 0.3s;
          border: 2px solid transparent;
        }

        .room-card.selected {
          border-color: #6a11cb;
          background: #e9ddff;
        }

        .room-icon {
          font-size: 35px;
        }

        .style-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(140px,1fr));
          gap: 15px;
        }

        .style-card {
          padding: 15px;
          border-radius: 14px;
          text-align: center;
          background: #f1f4fc;
          border: 2px solid transparent;
          cursor: pointer;
          transition: 0.3s;
        }

        .style-card.active {
          border-color: #2575fc;
          background: #e0efff;
        }

        .style-icon {
          font-size: 30px;
        }

        .step-nav {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
        }

        .btn-primary {
          background: linear-gradient(135deg,#6a11cb,#2575fc);
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }

        .btn-primary:hover {
          transform: scale(1.03);
        }

        .btn-secondary {
          background: #cfd7e7;
          color: #333;
          padding: 12px 20px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
        }

        .review-box {
          background: #f7f9ff;
          padding: 20px;
          border-radius: 14px;
        }

        .suggest-box {
          background: #eff4ff;
          border-left: 5px solid #2575fc;
          padding: 10px;
          border-radius: 8px;
          margin-top: 5px;
          font-size: 0.95rem;
        }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProjectCreation;
