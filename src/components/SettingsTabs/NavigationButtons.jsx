import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import './SettingsTabs.css';

const NavigationButtons = ({ 
  currentSlide, 
  onPrevSlide, 
  onNextSlide, 
  onSubmit, 
  hasHostel 
}) => {
  return (
    <div className="navigation-buttons">
      {currentSlide > 0 && (
        <button
          type="button"
          className="btn btn-outline"
          onClick={onPrevSlide}
        >
          <ArrowLeft size={20} />
          Previous
        </button>
      )}
      
      {currentSlide < 3 ? (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onNextSlide}
        >
          Next
          <ArrowRight size={20} />
        </button>
      ) : (
        <button
          type="submit"
          className="btn btn-primary"
          onClick={onSubmit}
        >
          <CheckCircle size={20} />
          {hasHostel ? 'Update Hostel Information' : 'Submit Hostel Information'}
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
