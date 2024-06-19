import React from "react";
import "./AboutPage.scss";
import { Link } from "react-router-dom";
import logo from "../../../shared/assets/icons/maxbro.svg";

export function AboutPage(props) {
  return (
    <div className="about-page">
      <p>Вы можете посетить сайт нашего генерального партнера </p>
      <Link to="https://maxbro.tv/">
        <div className="about-page_container">
          <img src={logo} alt="icon" />
        </div>
      </Link>
    </div>
  );
}
