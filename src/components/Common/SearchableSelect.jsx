import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import './SearchableSelect.css';

const SearchableSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Search and select...", 
  label,
  required = false,
  onSearch,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Update filtered options when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.campus.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Set selected option when value changes
  useEffect(() => {
    if (value && options.length > 0) {
      const option = options.find(opt => opt.campus === value);
      setSelectedOption(option);
    } else {
      setSelectedOption(null);
    }
  }, [value, options]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Call onSearch if provided (for API calls)
    if (onSearch) {
      onSearch(term);
    }
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setSearchTerm(option.campus);
    onChange(option.campus);
    setIsOpen(false);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle input click
  const handleInputClick = () => {
    setIsOpen(true);
  };

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      
      <div className="searchable-select" ref={dropdownRef}>
        <div 
          className={`searchable-select-input ${isOpen ? 'open' : ''}`}
          onClick={handleInputClick}
        >
          <Search className="search-icon" size={16} />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            autoComplete="off"
          />
          <ChevronDown 
            className={`chevron-icon ${isOpen ? 'rotated' : ''}`} 
            size={16} 
          />
        </div>

        {isOpen && (
          <div className="searchable-select-dropdown">
            {loading ? (
              <div className="dropdown-loading">
                <div className="loading-spinner"></div>
                <span>Loading...</span>
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className={`dropdown-option ${
                    selectedOption?.campus === option.campus ? 'selected' : ''
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.campus}
                </div>
              ))
            ) : (
              <div className="dropdown-no-results">
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableSelect;
