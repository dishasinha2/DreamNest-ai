import React from "react";
import { useLocation } from "react-router-dom";

const currency = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const FurnitureGrid = ({ title, items = [] }) => (
  <div className="card" style={{ marginBottom: "1.5rem" }}>
    <h3 style={{ marginBottom: "1rem" }}>{title}</h3>
    <div className="furniture-gallery">
      {items.map((it) => (
        <div className="furniture-item" key={it.id}>
          <div className="furniture-image" style={{ background: "none" }}>
            <img
              src={it.image_url}
              alt={it.item_name}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
          </div>
          <div className="furniture-details">
            <h4 style={{ marginBottom: 6 }}>{it.item_name}</h4>
            <p style={{ marginBottom: 10 }}>
              {it.style} · {it.item_type} · {currency(it.price_range)}
            </p>
            <a
              className="btn btn-outline"
              href={it.purchase_link}
              target="_blank"
              rel="noreferrer"
            >
              View on store
            </a>
          </div>
        </div>
      ))}
      {!items.length && <p>No matches for this room under the current budget.</p>}
    </div>
  </div>
);

const Vendors = ({ items = [] }) => (
  <div className="card">
    <h3 style={{ marginBottom: "1rem" }}>Trusted Local Vendors</h3>
    <div className="projects-grid">
      {items.map((v) => (
        <div className="project-card" key={v.id}>
          <h4 style={{ marginBottom: 8 }}>{v.name}</h4>
          <p>Service: {v.service_type.replace("_", " ")}</p>
          <p>⭐ {v.rating} · {v.experience_years} yrs</p>
          <p>📍 {v.location}</p>
          <a className="btn" href={`tel:${v.contact_number}`} style={{ marginTop: 10 }}>
            Call {v.contact_number}
          </a>
        </div>
      ))}
      {!items.length && <p>No local vendors found.</p>}
    </div>
  </div>
);

const Results = () => {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <div className="card">
          <p>No results to show. Please generate recommendations first.</p>
        </div>
      </div>
    );
  }

  const { summary, furnitureByRoom, vendors } = state;

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <div className="dashboard-header">
        <h2>Your Smart Plan</h2>
        <p>
          Total Budget: <b>{currency(summary.total_budget)}</b> · Contingency:{" "}
          <b>{currency(summary.contingency)}</b>
        </p>
      </div>

      {summary.allocation.map((room) => (
        <FurnitureGrid
          key={room.type}
          title={`${room.type.replace("_", " ")} · Allocated: ${currency(room.budget)}`}
          items={furnitureByRoom[room.type] || []}
        />
      ))}

      <Vendors items={vendors} />
    </div>
  );
};

export default Results;
