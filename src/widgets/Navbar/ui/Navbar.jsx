import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Categories } from "../../../shared/ui/Categories";
import { Logo } from "../../../shared/ui/Logo";
import { Search } from "../../../shared/ui/Search";
import { Regions } from "../../../shared/ui/Regions";
import { Contact } from "../../../shared/ui/Contact";
import "./Navbar.scss";
import menuIcon from "../../../shared/assets/icons/menu.svg";
import closeIcon from "../../../shared/assets/icons/close-menu.svg";
import closeSearchIcon from "../../../shared/assets/icons/close-search.svg";
import mobileSearch from "../../../shared/assets/icons/mobile-search.svg";
import { getCategories } from "../../../app/providers/StoreProvider/categoriesSlice";
import { fetchRegions } from "../../../app/providers/StoreProvider/regionSlice";
import { MobileSearch } from "../../MobileSearch";

export function Navbar() {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const categories = useSelector((state) => state.categories.categories);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const regions = useSelector((state) => state.regions.regions);

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  const handleChangeRegion = (event) => {
    const selectedRegionId = event.target.value;
    setMenuVisible(!isMenuVisible);

    if (selectedRegionId) {
      navigate(`/region/${selectedRegionId}`);
    }
  };
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleChange = (event) => {
    const selectedCategoryId = event.target.value;
    setMenuVisible(!isMenuVisible);
    if (selectedCategoryId) {
      navigate(`/categories/${selectedCategoryId}`);
    }
  };

  return (
    <div className="navbar">
      <div className="container">
        <Logo />
        <div className="dropdown_menu">
          <Categories />
          <Regions />
        </div>
        <Contact />
        <Search />

        <div className="icons">
          <button
            type="button"
            aria-label="Toggle search"
            className="icon-button"
            onClick={() => setSearchVisible(!isSearchVisible)}
          >
            <img src={mobileSearch} alt="icon" />
          </button>
          <button
            type="button"
            aria-label="Toggle menu"
            className="icon-button"
            onClick={() => setMenuVisible(!isMenuVisible)}
          >
            <img src={menuIcon} className="icon" alt="Menu Icon" />
          </button>
        </div>
      </div>

      {isSearchVisible && (
        <div className="full-screen-search">
          <button
            type="button"
            aria-label="Close menu"
            className="close-search-button"
            onClick={() => setSearchVisible(false)}
          >
            <img
              src={closeSearchIcon}
              className="close-icon"
              alt="Close Icon"
            />
          </button>
          <MobileSearch closeSearch={() => setSearchVisible(false)} />
        </div>
      )}

      {isMenuVisible && (
        <div className="full-screen-menu">
          <button
            type="button"
            aria-label="Close menu"
            className="close-menu-button"
            onClick={() => setMenuVisible(false)}
          >
            <img src={closeIcon} className="close-icon" alt="Close Icon" />
          </button>
          <div className="menu-content">
            <div className="mobile-dropdown-menu">
              <select onChange={handleChange} defaultValue="">
                <option className="mobile-dropdown_option" value="" disabled>
                  Категории
                </option>
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mobile-dropdown-menu">
              <select onChange={handleChangeRegion} defaultValue="">
                <option className="mobile-dropdown_option" value="" disabled>
                  Регионы
                </option>
                {regions.map((region) => (
                  <option key={region.region_id} value={region.region_id}>
                    {region.region_name}
                  </option>
                ))}
              </select>
            </div>
            <Link to="/about" type="button" className="mobile-about">
              О НАС
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
