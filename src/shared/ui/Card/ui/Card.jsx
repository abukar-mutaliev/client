import React from "react";
import "./card.scss";
import { Link } from "react-router-dom";
import * as PropTypes from "prop-types";
import { TbPinnedFilled } from "react-icons/tb";
import { VscPinned } from "react-icons/vsc";
import btnIcon from "../../../assets/icons/button.svg";

export function Card({ item, admin, onPinClick }) {
  const handlePinClick = () => {
    onPinClick(item.person_id);
  };
  return (
    <div className="card">
      {admin.isAuthenticated && (
        <button type="button" className="btn-pinned" onClick={handlePinClick}>
          {item.pinned ? (
            <TbPinnedFilled style={{ width: "30px", height: "30px" }} />
          ) : (
            <VscPinned style={{ width: "30px", height: "30px" }} />
          )}
        </button>
      )}
      <img
        className="card-image"
        src={`/${item.person_photo}`}
        alt="бойцы блогеры спортсмены "
      />
      <span>{item.person_name}</span>
      <div className="clamp">
        <p>{item.achievements}</p>
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
    achievements: PropTypes.string,
    pinned: PropTypes.bool,
  }).isRequired,
  admin: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
  }),
  onPinClick: PropTypes.func,
};
