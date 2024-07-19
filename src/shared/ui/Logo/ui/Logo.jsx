import React from "react";
import "./logo.scss";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "./logo.svg";

export function Logo({ onClick }) {
  return (
    <Link to="/" onClick={onClick}>
      <img style={{ width: "200px" }} src={logo} alt="logo" />
    </Link>
  );
}
Logo.propTypes = {
  onClick: PropTypes.func.isRequired,
};
