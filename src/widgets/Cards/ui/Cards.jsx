import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./cards.scss";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "../../../shared/ui/Card";
import { getPersons } from "../../../app/providers/StoreProvider/personSlice";
import { getCategories } from "../../../app/providers/StoreProvider/categoriesSlice";
import iconMore from "../../../shared/assets/icons/right.svg";
import loaderGif from "../../../shared/assets/icons/preloader.gif";

export function Cards() {
  const dispatch = useDispatch();
  const persons = useSelector((state) => state.persons.persons);
  const categories = useSelector((state) => state.categories.categories);
  const [visibleCards, setVisibleCards] = useState({});

  useEffect(() => {
    dispatch(getPersons());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleShowMore = (categoryId) => {
    setVisibleCards((prevState) => ({
      ...prevState,
      [categoryId]: persons.filter(
        (person) => person.categoryCategoryId === categoryId
      ).length,
    }));
  };

  const getVisibleCount = (categoryId) => {
    return visibleCards[categoryId] || 4;
  };

  if (!persons.length) {
    return <div className="loader">Здесь пока нет партнеров</div>;
  }

  if (!persons) {
    return (
      <div className="loader">
        <img src={loaderGif} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="cards-container">
      {categories.map((category) => {
        const personsInCategory = persons.filter(
          (person) => person.categoryCategoryId === category.category_id
        );
        if (personsInCategory.length === 0) return null;
        return (
          <div key={category.category_id} className="category-section">
            <p className="title-cards">{`Топ ${category.category_name}`}</p>
            <div className="cards">
              {personsInCategory
                .slice(0, getVisibleCount(category.category_id))
                .map((person) => (
                  <Card key={person.person_id} item={person} />
                ))}
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
                    <img
                      style={{ width: "50px", margin: "auto" }}
                      src={iconMore}
                      alt="icon"
                    />
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
