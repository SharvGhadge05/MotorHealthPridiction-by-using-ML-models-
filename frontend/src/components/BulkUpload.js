import React, { useState, useRef } from 'react';

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-active');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-active');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-active');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResults([]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict_csv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setResults([]);
  };

  return (
    <div className="glass-panel bulk-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <h2 className="panel-title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
        </svg>
        Bulk Dataset Processing
      </h2>

      {!results.length && (
        <div 
          className="upload-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv" 
            style={{ display: 'none' }} 
          />
          
          <div className="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          
          {file ? (
            <div>
              <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{file.name}</p>
              <button 
                className="btn" 
                style={{ background: 'rgba(255,255,255,0.1)', marginTop: '0.5rem', padding: '0.5rem 1rem' }}
                onClick={clearFile}
              >
                Remove File
              </button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '0.5rem' }}>Click or drag a CSV file here</p>
              <p style={{ color: 'var(--text-secondary)' }}>Format: temperature, vibration, rpm</p>
            </div>
          )}
        </div>
      )}

      {file && !results.length && (
        <button 
          className="btn btn-primary" 
          style={{ marginTop: '1.5rem' }} 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <span className="spinner"></span> : 'Process Dataset'}
        </button>
      )}

      {error && (
        <div className="result-card" style={{ borderColor: 'var(--error-color)', marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--error-color)' }}>{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Processing Results</h3>
            <button 
              className="btn" 
              style={{ width: 'auto', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)' }}
              onClick={() => { setResults([]); setFile(null); }}
            >
              New Upload
            </button>
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Temp (°C)</th>
                  <th>Vib (mm/s)</th>
                  <th>RPM</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row, idx) => (
                  <tr key={idx}>
                    <td>#{idx + 1}</td>
                    <td>{row.temperature}</td>
                    <td>{row.vibration}</td>
                    <td>{row.rpm}</td>
                    <td>
                      <span className={`status-badge ${row.prediction === 1 ? 'status-faulty' : 'status-normal'}`}>
                        {row.prediction === 1 ? 'Faulty' : 'Healthy'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
