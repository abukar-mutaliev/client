import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../../../app/providers/StoreProvider/categoriesSlice";
import "./categories.scss";

export function Categories() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories?.categories);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleChange = (event) => {
    const selectedCategoryId = event.target.value;
    if (selectedCategoryId) {
      navigate(`/categories/${selectedCategoryId}`);
    }
  };

  return (
    <div className="dropdown_menu">
      <select onChange={handleChange} defaultValue="">
        <option className="dropdown_option" value="" disabled>
          Категории
        </option>
        {categories?.map((category) => (
          <option key={category.category_id} value={category.category_id}>
            {category.category_name}
          </option>
        ))}
      </select>
    </div>
  );
}
