import React, { useEffect } from "react";
import "./footer.scss";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCategories } from "../../../app/providers/StoreProvider/categoriesSlice";
import logo from "../../../shared/ui/Logo/ui/logo.svg";

export function Footer(props) {
  const categories = useSelector((state) => state.categories.categories);
  const dispatch = useDispatch();
  useEffect(() => {
    getCategories();
  }, [dispatch]);

  const sortedCategories = categories
    .slice()
    .sort((a, b) => a.category_name.localeCompare(b.category_name));

  return (
    <div className="footer-body">
      <div className="footer">
        <p className="footer_logo">
          <img style={{ width: "200px" }} src={logo} alt="logo" />
        </p>
        <div className="footer_categories">
          {sortedCategories.map((item) => (
            <Link to={`/categories/${item.category_id}`} key={item.category_id}>
              <div className="footer_categories">{item.category_name}</div>
            </Link>
          ))}
        </div>
        <div className="footer_partner">
          <Link to="/about">Стать партнером</Link>
        </div>
      </div>
      <p className="footer_p">&copy; 2024 MEDIA HUB. Все права защищены.</p>
    </div>
  );
}
