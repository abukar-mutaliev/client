import React, { useEffect } from "react";
import "./footer.scss";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCategories } from "../../../app/providers/StoreProvider/categoriesSlice";

export function Footer(props) {
  const categories = useSelector((state) => state.categories.categories);
  const dispatch = useDispatch();
  useEffect(() => {
    getCategories();
  }, [dispatch]);

  return (
    <div className="footer">
      <p className="footer_logo"> LOGO</p>
      <div className="footer_categories">
        {categories.map((item) => (
          <Link to={`/categories/${item.category_id}`} key={item.category_id}>
            <div className="footer_categories">{item.category_name}</div>
          </Link>
        ))}
        <div className="footer_partner">
          <Link to="/partner">Стань партнером</Link>
        </div>
      </div>
    </div>
  );
}
