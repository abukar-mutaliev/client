import React from "react";
import "./logo.scss";
import { Link } from "react-router-dom";
import logo from "./logo.svg";

export function Logo(props) {
  return (
    <Link to="/">
      <img style={{ width: "200px" }} src={logo} alt="logo" />
    </Link>
  );
}
