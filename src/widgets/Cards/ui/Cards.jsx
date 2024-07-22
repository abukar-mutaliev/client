import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import "./cards.scss";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card } from "../../../shared/ui/Card";
import {
  getPersons,
  pinPerson,
} from "../../../app/providers/StoreProvider/personSlice";
import { getCategories } from "../../../app/providers/StoreProvider/categoriesSlice";
import { Filter } from "../../../shared/ui/filter";

export function Cards() {
  const dispatch = useDispatch();
  const persons = useSelector((state) => state.persons.persons);
  const categories = useSelector((state) => state.categories.categories);
  const regions = useSelector((state) => state.regions.regions);
  const admin = useSelector((state) => state.admin);
  const [visibleCards, setVisibleCards] = useState({});
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    dispatch(getPersons());
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    setFilteredPersons(persons);
  }, [persons]);

  const handleShowMore = (categoryId) => {
    setVisibleCards((prevState) => ({
      ...prevState,
      [categoryId]: (prevState[categoryId] || 4) + 4,
    }));
  };

  const getVisibleCount = (categoryId) => {
    if (window.innerWidth <= 768) {
      return visibleCards[categoryId] || 2;
    }
    return visibleCards[categoryId] || 4;
  };

  const handlePinClick = (personId) => {
    dispatch(pinPerson(personId));
  };

  const handleFilterChange = (filters) => {
    const { category_name, region_name, adPrices } = filters;
    let filtered = persons;

    if (category_name) {
      filtered = filtered.filter((person) =>
        categories.some(
          (category) =>
            category.category_id === person.categoryCategoryId &&
            category.category_name === category_name
        )
      );
    }

    if (region_name) {
      filtered = filtered.filter((person) =>
        regions.some(
          (region) =>
            region.region_id === person.regionRegionId &&
            region.region_name === region_name
        )
      );
    }

    if (adPrices) {
      filtered = filtered.filter(
        (person) =>
          person.AdPrice.instagram_joint_reel >= adPrices[0] &&
          person.AdPrice.instagram_joint_reel <= adPrices[1]
      );
    }

    setFilteredPersons(filtered);
    setIsFiltered(true);
  };

  const handleOpenFilter = () => {
    if (isOpenFilter) {
      setFilteredPersons(persons);
      setIsFiltered(false);
    }
    setIsOpenFilter(!isOpenFilter);
  };
  if (categories.loading) {
    return (
      <div className="loader">
        <BarLoader />
      </div>
    );
  }

  return (
    <div className="cards-container">
      <button type="button" className="filter_btn" onClick={handleOpenFilter}>
        {isOpenFilter ? "Закрыть фильтр" : "Фильтр"}
      </button>
      {isOpenFilter && (
        <div className="category-section">
          <Filter onFilterChange={handleFilterChange} />
        </div>
      )}

      {isOpenFilter && (
        <div className="filtered-cards">
          {filteredPersons?.map((person) => (
            <Card key={person.person_id} admin={admin} item={person} />
          ))}
        </div>
      )}
      {!isOpenFilter &&
        !isFiltered &&
        categories.map((category) => {
          const personsInCategory = persons
            .filter(
              (person) => person.categoryCategoryId === category.category_id
            )
            .sort((a, b) => {
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;
              return a.person_name.localeCompare(b.person_name);
            });

          if (personsInCategory.length === 0) return null;
          return (
            <div key={category.category_id} className="category-section">
              <p className="title-cards">{`Топ ${category.category_name}`}</p>
              <div className="cards">
                {personsInCategory
                  .slice(0, getVisibleCount(category.category_id))
                  .map((person) => (
                    <Card
                      key={person.person_id}
                      onPinClick={handlePinClick}
                      item={person}
                      admin={admin}
                    />
                  ))}
              </div>
              <div className="show-more_btn">
                {personsInCategory.length >
                  getVisibleCount(category.category_id) && (
                  <Link
                    className="show-more"
                    title="Показать всех людей в этой категории"
                    to={{
                      state: { categories: personsInCategory },
                      pathname: `/categories/${category.category_id}`,
                    }}
                  >
                    <button
                      className="more_persons_btn"
                      type="button"
                      onClick={() => handleShowMore(category.category_id)}
                    >
                      Показать всех...
                    </button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
