// Regions.jsx
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { BarLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegions } from "../../../../app/providers/StoreProvider/regionSlice";
import "./regions.scss";
import { CustomDropdown } from "../../DropDown";

export function Regions({ selectedRegion, onRegionChange }) {
  const dispatch = useDispatch();
  const regions = useSelector((state) => state.regions?.regions);
  const loading = useSelector((state) => state.regions.status === "loading");

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="loader">
        <BarLoader />
      </div>
    );
  }

  const options =
    regions?.map((region) => ({
      value: region.region_id,
      label: region.region_name,
    })) || [];

  const selectedOption = options.find(
    (option) => option.value === selectedRegion
  );

  return (
    <CustomDropdown
      options={options}
      nameDropdown="Регионы"
      selectedOption={selectedOption}
      onChange={(option) => onRegionChange({ target: { value: option.value } })}
    />
  );
}

Regions.propTypes = {
  selectedRegion: PropTypes.string,
  onRegionChange: PropTypes.func.isRequired,
};
