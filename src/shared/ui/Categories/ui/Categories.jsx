import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import "./categories.scss";
import PropTypes from "prop-types";
import { getCategories } from "../../../../app/providers/StoreProvider/categoriesSlice";

export function Categories({ selectedCategory, onCategoryChange }) {
  const [categoryWidth, setCategoryWidth] = useState("175px");
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories?.categories);
  const loading = useSelector((state) => state.categories.status === "loading");

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleChange = (event) => {
    const selectedCategoryId = event.target.value;
    const selectedOption = event.target.selectedOptions[0];
    setCategoryWidth(`${selectedOption.text.length * 10 + 100}px`);
    onCategoryChange(event);
  };

  if (loading) {
    return (
      <div className="loader">
        <BarLoader />
      </div>
    );
  }

  const sortedCategories = categories
    ?.slice()
    .sort((a, b) => a.category_name.localeCompare(b.category_name));

  return (
    <div className="dropdown_menu">
      <select
        style={{ width: categoryWidth }}
        onChange={handleChange}
        value={selectedCategory}
      >
        <option className="dropdown_option" value="" disabled>
          Категории
        </option>
        {sortedCategories?.map((category) => (
          <option key={category.category_id} value={category.category_id}>
            {category.category_name}
          </option>
        ))}
      </select>
    </div>
  );
}
Categories.propTypes = {
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func.isRequired,
};
