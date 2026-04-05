import React from 'react';
import SinglePrediction from './components/SinglePrediction';
import BulkUpload from './components/BulkUpload';

function App() {
  return (
    <div className="app-container">
      <header className="animate-fade-in">
        <h1>Motor Health Prediction AI</h1>
        <p>Advanced machine learning to monitor and predict motor component failure</p>
      </header>

      <div className="main-grid">
        <SinglePrediction />
        <BulkUpload />
      </div>
    </div>
  );
}

export default App;
