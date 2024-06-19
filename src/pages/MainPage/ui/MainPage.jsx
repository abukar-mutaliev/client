import React from "react";
import "./MainPage.scss";
import { CustomSlider } from "../../../widgets/Slider";
import { Cards } from "../../../widgets/Cards";

export function MainPage() {
  return (
    <div className="mainPAge">
      <CustomSlider />
      <Cards />
    </div>
  );
}
