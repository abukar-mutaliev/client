// Categories.jsx
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import "./categories.scss";
import { getCategories } from "../../../../app/providers/StoreProvider/categoriesSlice";
import { CustomDropdown } from "../../DropDown";

export function Categories({ selectedCategory, onCategoryChange }) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories?.categories);
  const loading = useSelector((state) => state.categories.status === "loading");

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

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

  const options =
    sortedCategories?.map((category) => ({
      value: category.category_id,
      label: category.category_name,
    })) || [];

  const selectedOption = options.find(
    (option) => option.value === selectedCategory
  );

  return (
    <CustomDropdown
      options={options}
      nameDropdown="Категории"
      selectedOption={selectedOption}
      onChange={(option) =>
        onCategoryChange({ target: { value: option.value } })
      }
    />
  );
}

Categories.propTypes = {
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func.isRequired,
};
