import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRegions } from "../../../../app/providers/StoreProvider/regionSlice";
import "./regions.scss";

export function Regions() {
  const dispatch = useDispatch();
  const regions = useSelector((state) => state.regions?.regions);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  const handleChange = (event) => {
    const selectedRegionId = event.target.value;
    if (selectedRegionId) {
      navigate(`/region/${selectedRegionId}`);
    }
  };

  return (
    <div className="dropdown_menu">
      <select onChange={handleChange} defaultValue="">
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
