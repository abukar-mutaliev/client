import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRegions,
  addRegion,
  updateRegion,
  deleteRegion,
} from "../../../app/providers/StoreProvider/regionSlice";

export function RegionManager() {
  const dispatch = useDispatch();
  const regions = useSelector((state) => state.regions.regions);
  const [regionName, setRegionName] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  const handleAddRegion = () => {
    dispatch(addRegion({ region_name: regionName }));
    setRegionName("");
  };

  const handleUpdateRegion = (id) => {
    dispatch(updateRegion({ id, regionData: { region_name: regionName } }));
    setSelectedRegion(null);
    setRegionName("");
  };

  const handleDeleteRegion = (id) => {
    dispatch(deleteRegion(id));
  };

  return (
    <div>
      <h1>Manage Regions</h1>
      <div>
        <input
          type="text"
          value={regionName}
          onChange={(e) => setRegionName(e.target.value)}
          placeholder="Region Name"
        />
        <button
          onClick={
            selectedRegion
              ? () => handleUpdateRegion(selectedRegion)
              : handleAddRegion
          }
        >
          {selectedRegion ? "Update Region" : "Add Region"}
        </button>
      </div>
      <ul>
        {regions.map((region) => (
          <li key={region.region_id}>
            {region.region_name}
            <button
              type="button"
              onClick={() => setSelectedRegion(region.region_id)}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDeleteRegion(region.region_id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
