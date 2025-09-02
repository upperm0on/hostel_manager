import React from 'react';
import './SettingsTabs.css';

const ProgressIndicator = ({ currentSlide }) => {
  const steps = ['Hostel Details', 'General Amenities', 'Room Details', 'Submit'];

  return (
    <div className="form-progress">
      <div className="progress-steps">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`progress-step ${index === currentSlide ? 'active' : ''} ${index < currentSlide ? 'completed' : ''}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
