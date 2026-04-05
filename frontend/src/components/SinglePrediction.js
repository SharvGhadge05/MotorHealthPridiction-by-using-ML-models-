import React, { useState } from 'react';

const SinglePrediction = () => {
  const [formData, setFormData] = useState({
    temperature: '',
    vibration: '',
    rpm: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temperature: parseFloat(formData.temperature),
          vibration: parseFloat(formData.vibration),
          rpm: parseFloat(formData.rpm)
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setResult(data.prediction);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h2 className="panel-title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        Single Motor Profiling
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Temperature (°C)</label>
          <input 
            type="number" 
            name="temperature"
            className="form-control"
            value={formData.temperature}
            onChange={handleChange}
            placeholder="e.g., 85"
            required
            step="any"
          />
        </div>
        
        <div className="form-group">
          <label>Vibration (mm/s)</label>
          <input 
            type="number" 
            name="vibration"
            className="form-control"
            value={formData.vibration}
            onChange={handleChange}
            placeholder="e.g., 7.5"
            required
            step="any"
          />
        </div>
        
        <div className="form-group">
          <label>RPM</label>
          <input 
            type="number" 
            name="rpm"
            className="form-control"
            value={formData.rpm}
            onChange={handleChange}
            placeholder="e.g., 3200"
            required
            step="any"
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Run Prediction Model'}
        </button>
      </form>

      {error && (
        <div className="result-card" style={{ borderColor: 'var(--error-color)' }}>
          <p style={{ color: 'var(--error-color)' }}>{error}</p>
        </div>
      )}

      {result !== null && (
        <div className="result-card animate-fade-in">
          <p className="text-secondary">Health Status Prediction</p>
          <div className={`result-value ${result === 1 ? 'danger' : ''}`}>
            {result === 1 ? 'Faulty / Danger' : 'Normal / Healthy'}
          </div>
          <p className="text-secondary" style={{ fontSize: '0.85rem' }}>
            {result === 1 ? 'Immediate maintenance recommended.' : 'Motor is operating within safe parameters.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SinglePrediction;
