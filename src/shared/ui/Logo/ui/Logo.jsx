import React from "react";
import "./logo.scss";
import { Link } from "react-router-dom";

export function Logo(props) {
  return (
    <Link className="logo" to="/">
      <div className="logo-link">LOGO</div>
    </Link>
  );
}
