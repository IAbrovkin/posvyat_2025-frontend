import React, { useState, useEffect } from 'react';

const CustomSelect = ({ name, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [selectedValue, setSelectedValue] = useState(value || options[0].value); 

  useEffect(() => {
    if (!value && options.length > 0) {
      setSelectedValue(options[0].value); 
    }
  }, [value, options]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionMouseEnter = (optionValue) => {
    setHoveredOption(optionValue);
  };

  const handleOptionMouseLeave = () => {
    setHoveredOption(null);
  };

  const handleOptionClick = (option) => {
    onChange({ target: { name, value: option.value } });
    setSelectedValue(option.value);
    setIsOpen(false);
  };

  return (
    <div className="custom-select">
      <div className="select-header" onClick={toggleOpen}>
        {options.find((option) => option.value === selectedValue)?.label || options[0].label}
      </div>
      {isOpen && (
        <ul className="select-options">
          {options.map((option) => (
            <li
              key={option.value}
              className={`select-option ${hoveredOption === option.value ? 'hovered' : ''}`}
              onMouseEnter={() => handleOptionMouseEnter(option.value)}
              onMouseLeave={handleOptionMouseLeave}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;