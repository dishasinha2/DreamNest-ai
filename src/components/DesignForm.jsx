import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// API base URL
axios.defaults.baseURL = "http://localhost:5000/api";

const DesignForm = () => {
  const navigate = useNavigate();

  // FORM STATES
  const [form, setForm] = useState({
    total_budget: "",
    style: "modern",
    location: "",
    rooms: [],
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // ROOM OPTIONS
  const roomOptions = [
    "living_room",
    "bedroom",
    "kitchen",
    "bathroom",
    "dining_room",
  ];

  // HANDLE ROOM SELECT/UNSELECT
  const handleRooms = (type) => {
    setForm((f) => {
      const selected = f.rooms.includes(type);
      return {
        ...f,
        rooms: selected
          ? f.rooms.filter((r) => r !== type)
          : [...f.rooms, type],
      };
    });
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const body = {
        total_budget: Number(form.total_budget),
        style: form.style,
        location: form.location,
        rooms: form.rooms.map((r) => ({ type: r })),
      };

      if (!body.total_budget || !body.style || !body.location || !body.rooms.length) {
        setErr("Please fill all fields & select rooms.");
        setLoading(false);
        return;
      }

      const { data } = await axios.post("/recommendations", body);

      // Navigate to results page with AI-generated data
      navigate("/results", { state: data });

    } catch (e) {
      console.error(e);
      setErr(e.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="project-creation container" style={{ padding: "2rem 0" }}>
      <h2 className="section-title">Plan Your Dream Home</h2>

      {err && <div className="error-message" style={{ color: "red" }}>{err}</div>}

      <form className="project-form" onSubmit={handleSubmit}>
        
        {/* BUDGET + STYLE */}
        <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Total Budget (₹)</label>
            <input
              type="number"
              required
              value={form.total_budget}
              onChange={(e) =>
                setForm({ ...form, total_budget: e.target.value })
              }
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Style</label>
            <select
              value={form.style}
              onChange={(e) => setForm({ ...form, style: e.target.value })}
            >
              <option value="modern">Modern</option>
              <option value="traditional">Traditional</option>
              <option value="minimalist">Minimalist</option>
              <option value="luxury">Luxury</option>
              <option value="contemporary">Contemporary</option>
            </select>
          </div>
        </div>

        {/* LOCATION */}
        <div className="form-row" style={{ marginTop: "1rem" }}>
          <div className="form-group" style={{ width: "100%" }}>
            <label>City / Location</label>
            <input
              required
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />
          </div>
        </div>

        {/* ROOM SELECT */}
        <div className="form-group" style={{ marginTop: "1rem" }}>
          <label>Select Rooms</label>

          <div className="room-selection" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {roomOptions.map((r) => (
              <div
                key={r}
                className={`room-option ${form.rooms.includes(r) ? "selected" : ""}`}
                onClick={() => handleRooms(r)}
                style={{
                  cursor: "pointer",
                  padding: "10px 15px",
                  borderRadius: "6px",
                  border: form.rooms.includes(r)
                    ? "2px solid #007bff"
                    : "1px solid #aaa",
                }}
              >
                {r.replace("_", " ")}
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button className="btn btn-primary" disabled={loading} style={{ marginTop: "1.5rem" }}>
          {loading ? "Generating..." : "Get Recommendations"}
        </button>
      </form>
    </section>
  );
};

export default DesignForm;
