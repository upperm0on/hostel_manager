import React from 'react';
import { Building, Plus } from 'lucide-react';
import './NoHostelState.css';

const NoHostelState = ({ onAddHostel }) => {
  return (
    <div className="no-hostel-state">
      <div className="no-hostel-content">
        <Building size={64} className="no-hostel-icon" />
        <h2>No Hostel Information Found</h2>
        <p>
          It looks like you haven't set up your hostel information yet.
          Let's get started!
        </p>
        <button
          className="btn btn-primary btn-large"
          onClick={onAddHostel}
        >
          <Plus size={20} />
          Add New Hostel
        </button>
      </div>
    </div>
  );
};

export default NoHostelState;
