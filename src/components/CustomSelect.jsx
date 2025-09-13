import React, { useState, useEffect } from 'react';

const CustomSelect = ({ name, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  
  const getSelectedLabel = () => {
    if (options && options.length > 0) {
      const selectedOption = options.find((option) => option.value === value);
      if (selectedOption) {
        return selectedOption.label;
      }
    }
    return "Нет доступных опций";
  };

  const toggleOpen = () => {
    if (options && options.length > 0) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionMouseEnter = (optionValue) => {
    setHoveredOption(optionValue);
  };

  const handleOptionMouseLeave = () => {
    setHoveredOption(null);
  };

  const handleOptionClick = (option) => {
    onChange({ target: { name, value: option.value } });
    setIsOpen(false);
  };

  return (
    <div className="custom-select">
      <div className="select-header" onClick={toggleOpen}>
        {getSelectedLabel()}
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