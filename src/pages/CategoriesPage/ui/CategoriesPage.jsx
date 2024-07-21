import React, { useEffect } from "react";
import "./categoriesPage.scss";
import { BarLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getPersons,
  pinPerson,
} from "../../../app/providers/StoreProvider/personSlice";
import { Card } from "../../../shared/ui/Card";
import { getCategories } from "../../../app/providers/StoreProvider/categoriesSlice";

export function CategoriesPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const persons = useSelector((state) => state.persons.persons);
  const categories = useSelector((state) => state.categories.categories);
  const admin = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getPersons());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const filteredPersons = persons
    .filter((person) => person.categoryCategoryId === Number(id))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return a.person_name.localeCompare(b.person_name);
    });

  const categoryName = categories
    .slice()
    .sort((a, b) => a.category_name.localeCompare(b.category_name))
    .find((category) => category.category_id === Number(id))?.category_name;

  if (!categories.length) {
    return (
      <div className="loader">
        <BarLoader />
      </div>
    );
  }

  const handlePinClick = (personId) => {
    dispatch(pinPerson(personId));
  };

  return (
    <div className="categories_page">
      <div>
        <p className="category_name">{categoryName}</p>
        <div className="categories_container">
          {filteredPersons.map((item) => (
            <Card
              key={item.person_id}
              item={item}
              admin={admin}
              onPinClick={handlePinClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
