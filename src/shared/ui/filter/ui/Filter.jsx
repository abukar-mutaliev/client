import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./Filter.scss";
import PropTypes from "prop-types";

export function Filter({ onFilterChange }) {
  const categories = useSelector((state) => state.categories?.categories);
  const regions = useSelector((state) => state.regions.regions);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [adPrices, setAdPrices] = useState([0, 100000]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    onFilterChange({
      category_name: e.target.value,
      region_name: selectedRegion,
      adPrices,
    });
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    onFilterChange({
      category_name: selectedCategory,
      region_name: e.target.value,
      adPrices,
    });
  };

  const handlePriceChange = (e, index) => {
    const newRange = [...adPrices];
    newRange[index] = Number(e.target.value);
    setAdPrices(newRange);
    onFilterChange({
      category_name: selectedCategory,
      region_name: selectedRegion,
      adPrices: newRange,
    });
  };

  return (
    <div className="filter">
      <div>
        <label>Категория:</label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Все</option>
          {categories?.map((category) => (
            <option key={category.category_id} value={category.category_name}>
              {category.category_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Регион:</label>
        <select value={selectedRegion} onChange={handleRegionChange}>
          <option value="">Все</option>
          {regions?.map((region) => (
            <option key={region.region_id} value={region.region_name}>
              {region.region_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Цена:</label>
        <div>
          <input
            type="number"
            value={adPrices[0]}
            onChange={(e) => handlePriceChange(e, 0)}
            min="0"
          />
          <span> - </span>
          <input
            type="number"
            value={adPrices[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            min="0"
          />
        </div>
      </div>
    </div>
  );
}

Filter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};
