import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import "./cards.scss";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card } from "../../../shared/ui/Card";
import { getPersons } from "../../../app/providers/StoreProvider/personSlice";
import { getCategories } from "../../../app/providers/StoreProvider/categoriesSlice";

export function Cards() {
  const dispatch = useDispatch();
  const persons = useSelector((state) => state.persons.persons);
  const categories = useSelector((state) => state.categories.categories);
  const [visibleCards, setVisibleCards] = useState({});

  useEffect(() => {
    dispatch(getPersons());
    dispatch(getCategories());
  }, [dispatch]);

  const handleShowMore = (categoryId) => {
    setVisibleCards((prevState) => ({
      ...prevState,
      [categoryId]: 4, // Показываем все карточки при нажатии на "Показать все"
    }));
  };

  const getVisibleCount = (categoryId) => {
    if (window.innerWidth <= 768) {
      // Если ширина экрана меньше или равна 768px, показываем только 2 карточки
      return visibleCards[categoryId] || 2;
    }
    // Иначе показываем 4 карточки
    return visibleCards[categoryId] || 4;
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
                    Показать еще...
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
