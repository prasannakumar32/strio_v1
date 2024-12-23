import React from 'react';
import { FaChartBar, FaTable } from 'react-icons/fa';

function DashboardCard({ title, type, onClick, isActive }) {
  return (
    <div 
      className={`dashboard-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="card-icon">
        {type === 'graph' ? <FaChartBar size={24} /> : <FaTable size={24} />}
      </div>
      <h4>{title}</h4>
      
      <style jsx>{`
        .dashboard-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid ${isActive ? '#4CAF50' : '#eee'};
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .dashboard-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .dashboard-card.active {
          background: #f0f9f0;
        }

        .card-icon {
          color: ${isActive ? '#4CAF50' : '#666'};
        }

        h4 {
          margin: 0;
          color: #333;
        }
      `}</style>
    </div>
  );
}

export default DashboardCard; 