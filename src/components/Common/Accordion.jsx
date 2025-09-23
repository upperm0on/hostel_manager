import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const Accordion = ({ id, title, defaultOpen = false, children, onToggle }) => {
  const [open, setOpen] = useState(!!defaultOpen);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (onToggle) onToggle(next);
  };

  return (
    <section id={id} className="terms-section">
      <button type="button" className="accordion-header" onClick={toggle} aria-expanded={open} aria-controls={`${id}-panel`}>
        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        <h3>{title}</h3>
      </button>
      {open && (
        <div id={`${id}-panel`} className="section-body">
          {children}
        </div>
      )}
    </section>
  );
};

export default Accordion;
