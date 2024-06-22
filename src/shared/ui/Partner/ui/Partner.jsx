import React from "react";
import { Link } from "react-router-dom";
import "./contact.scss";

export function Partner(props) {
  return (
    <div className="contact">
      <Link to="/partner" type="button">
        Стать партнером
      </Link>
    </div>
  );
}
