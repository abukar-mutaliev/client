import React from "react";
import "./card.scss";
import { Link } from "react-router-dom";
import * as PropTypes from "prop-types";
import btnIcon from "../../../assets/icons/button.svg";

export function Card({ item }) {
  return (
    <div className="card">
      <img
        className="card-image"
        src={`http://31.128.40.169:5000/${item.person_photo}`}
        alt="img"
      />
      <span>{item.person_name}</span>
      <div className="clamp">
        <p>{item.person_description}</p>
      </div>

      <div className="card-description">
        <Link
          to={{
            pathname: `/person/${item.person_id}`,
            state: { item },
          }}
        >
          <button className="card-button" type="button">
            ПОДРОБНЕЕ
            <img className="btn-icon" src={btnIcon} alt="icon" />
          </button>
        </Link>
      </div>
    </div>
  );
}

Card.propTypes = {
  item: PropTypes.shape({
    person_id: PropTypes.number,
    person_name: PropTypes.string,
    person_photo: PropTypes.string,
    person_description: PropTypes.string,
  }).isRequired,
};
