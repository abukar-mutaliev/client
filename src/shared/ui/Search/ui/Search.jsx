import React, { useEffect, useRef, useState } from "react";
import "./search.scss";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import icon from "../../../assets/icons/SerachIcon.svg";
import { getPersons } from "../../../../app/providers/StoreProvider/personSlice";

export function Search(props) {
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
  }, [highlightedIndex, isResultsVisible, filteredPersons, navigate]);

  return (
    <div className="search-container" ref={searchContainerRef}>
      <input
        type="text"
        className="search-input"
        placeholder="Поиск..."
        value={searchTerm}
        onChange={handleInputChange}
        ref={inputRef}
      />
      <img alt="icon" src={icon} className="search-icon" />
      {isResultsVisible && searchTerm && (
        <div className="search-results">
          {filteredPersons.length > 0 ? (
            filteredPersons.map((person, index) => (
              <Link
                key={person.person_id}
                className="search-link"
                to={`/person/${person.person_id}`}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div
                  className={`search-result-item ${
                    highlightedIndex === index ? "highlighted" : ""
                  }`}
                >
                  {person.person_name}
                </div>
              </Link>
            ))
          ) : (
            <div className="no-results">Нет совпадений</div>
          )}
        </div>
      )}
    </div>
  );
}
