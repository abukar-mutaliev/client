import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import icon from "../../../shared/assets/icons/mobile-search.svg";
import { getPersons } from "../../../app/providers/StoreProvider/personSlice";
import "./mobileSearch.scss";

export function MobileSearch({ closeSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const persons = useSelector((state) => state.persons.persons);
  const dispatch = useDispatch();
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getPersons());
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsResultsVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsResultsVisible(true);
    setHighlightedIndex(-1);
  };

  const filteredPersons = persons.filter((person) =>
    person.person_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "ArrowDown") {
        setHighlightedIndex((prevIndex) =>
          Math.min(prevIndex + 1, filteredPersons.length - 1)
        );
      } else if (event.key === "ArrowUp") {
        setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (event.key === "Enter") {
        if (highlightedIndex >= 0) {
          const selectedPerson = filteredPersons[highlightedIndex];
          navigate(`/person/${selectedPerson.person_id}`);
          setIsResultsVisible(false);
          closeSearch();
        }
      } else if (event.key === "Escape") {
        setIsResultsVisible(false);
      }
    }

    if (isResultsVisible) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    highlightedIndex,
    isResultsVisible,
    filteredPersons,
    navigate,
    closeSearch,
  ]);

  return (
    <div className="mobile-search-container" ref={searchContainerRef}>
      <input
        type="text"
        className="mobile-search-input"
        placeholder="Поиск..."
        value={searchTerm}
        onChange={handleInputChange}
        ref={inputRef}
      />
      <img alt="icon" src={icon} className="mobile-search-icon" />
      {isResultsVisible && searchTerm && (
        <div className="mobile-search-results">
          {filteredPersons.length > 0 ? (
            filteredPersons.map((person, index) => (
              <Link
                key={person.person_id}
                className="mobile-search-link"
                to={`/person/${person.person_id}`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={closeSearch}
              >
                <div
                  className={`mobile-search-result-item ${
                    highlightedIndex === index ? "highlighted" : ""
                  }`}
                >
                  {person.person_name}
                </div>
              </Link>
            ))
          ) : (
            <div className="mobile-no-results">Нет совпадений</div>
          )}
        </div>
      )}
    </div>
  );
}
MobileSearch.propTypes = {
  closeSearch: PropTypes.func.isRequired,
};
