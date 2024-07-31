import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./customDropDown.scss";

export function CustomDropdown({
  nameDropdown,
  options,
  selectedOption,
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentOption, setCurrentOption] = useState(
    selectedOption || options[0] || { label: nameDropdown, value: "" }
  );
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setCurrentOption(option);
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    if (options.length > 0) {
      setCurrentOption(selectedOption || options[0]);
    }
  }, [options, selectedOption]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="dropdown-toggle"
        onClick={handleToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {currentOption ? currentOption.label : nameDropdown}
        <span className="dropdown-arrow">▼</span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu" role="menu">
          {options.map((option) => (
            <li
              key={option.value}
              className="dropdown-menu-item"
              role="menuitem"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

CustomDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  nameDropdown: PropTypes.string.isRequired,
  selectedOption: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
};
