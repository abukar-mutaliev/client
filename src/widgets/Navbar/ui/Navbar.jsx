import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { Categories } from "../../../shared/ui/Categories";
import { Logo } from "../../../shared/ui/Logo";
import { Search } from "../../../shared/ui/Search";
import { Regions } from "../../../shared/ui/Regions";
import "./Navbar.scss";
import menuIcon from "../../../shared/assets/icons/menu.svg";
import closeIcon from "../../../shared/assets/icons/close-menu.svg";
import closeSearchIcon from "../../../shared/assets/icons/close-search.svg";
import mobileSearch from "../../../shared/assets/icons/mobile-search.svg";
import { getCategories } from "../../../app/providers/StoreProvider/categoriesSlice";
import { fetchRegions } from "../../../app/providers/StoreProvider/regionSlice";
import { MobileSearch } from "../../MobileSearch";
import { Partner } from "../../../shared/ui/Partner";

export function Navbar() {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const categories = useSelector((state) => state.categories.categories);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const regions = useSelector((state) => state.regions.regions);
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleChangeRegion = (event) => {
    const selectedRegionId = event.target.value;
    setSelectedRegion(selectedRegionId);
    setMenuVisible(!isMenuVisible);
    if (selectedRegionId) {
      navigate(`/region/${selectedRegionId}`);
    }
  };

  const handleChange = (event) => {
    const selectedCategoryId = event.target.value;
    setSelectedCategory(selectedCategoryId);
    setMenuVisible(!isMenuVisible);
    if (selectedCategoryId) {
      navigate(`/categories/${selectedCategoryId}`);
    }
  };

  const handleLogoClick = () => {
    setSelectedCategory("");
    setSelectedRegion("");
    navigate("/");
  };

  const sortedCategories = categories
    ?.slice()
    .sort((a, b) => a.category_name.localeCompare(b.category_name));

  return (
    <div className="navbar">
      <div className="container">
        <Logo onClick={handleLogoClick} />
        <div className="dropdown_menu">
          <Categories
            selectedCategory={selectedCategory}
            onCategoryChange={handleChange}
          />
          <Regions
            selectedRegion={selectedRegion}
            onRegionChange={handleChangeRegion}
          />
        </div>
        <Partner />
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
      <CSSTransition
        in={isSearchVisible}
        timeout={300}
        classNames="fade"
        unmountOnExit
        nodeRef={searchRef}
      >
        <div className="full-screen-search" ref={searchRef}>
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
      </CSSTransition>
      <CSSTransition
        in={isMenuVisible}
        timeout={300}
        classNames="fade"
        unmountOnExit
        nodeRef={menuRef}
      >
        <div className="full-screen-menu" ref={menuRef}>
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
              <select
                onChange={handleChange}
                style={{ width: "225px" }}
                value={selectedCategory}
              >
                <option className="mobile-dropdown_option" value="" disabled>
                  Категории
                </option>
                {sortedCategories?.map((category) => (
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
              <select
                onChange={handleChangeRegion}
                style={{ width: "194px" }}
                value={selectedRegion}
              >
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
            <Link
              to="/partner"
              type="button"
              onClick={() => setMenuVisible(false)}
              className="mobile-about"
            >
              Стать партнером
            </Link>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}
