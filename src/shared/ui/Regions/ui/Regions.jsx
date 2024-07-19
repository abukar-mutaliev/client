import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { BarLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRegions } from "../../../../app/providers/StoreProvider/regionSlice";
import "./regions.scss";

export function Regions({ selectedRegion, onRegionChange }) {
  const dispatch = useDispatch();
  const regions = useSelector((state) => state.regions?.regions);
  const navigate = useNavigate();
  const [regionWidth, setRegionWidth] = useState("150px");
  const loading = useSelector((state) => state.regions.status === "loading");

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  const handleChange = (event) => {
    const selectedRegionId = event.target.value;
    const selectedOption = event.target.selectedOptions[0];
    setRegionWidth(`${selectedOption.text.length * 10 + 150}px`);
    onRegionChange(event);
  };

  if (loading) {
    return (
      <div className="loader">
        <BarLoader />
      </div>
    );
  }

  return (
    <div className="dropdown_menu">
      <select
        style={{ width: regionWidth }}
        onChange={handleChange}
        value={selectedRegion}
      >
        <option className="dropdown_option" value="" disabled>
          Регионы
        </option>
        {regions?.map((region) => (
          <option key={region.region_id} value={region.region_id}>
            {region.region_name}
          </option>
        ))}
      </select>
    </div>
  );
}

Regions.propTypes = {
  selectedRegion: PropTypes.string,
  onRegionChange: PropTypes.func.isRequired,
};
