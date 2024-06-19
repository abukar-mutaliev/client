import React, { useEffect } from "react";
import "./categoriesPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPersons } from "../../../app/providers/StoreProvider/personSlice";
import { Card } from "../../../shared/ui/Card";
import { getCategories } from "../../../app/providers/StoreProvider/categoriesSlice";

export function CategoriesPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const persons = useSelector((state) => state.persons.persons);
  const categories = useSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch(getPersons());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const filteredPersons = persons.filter(
    (person) => person.categoryCategoryId === Number(id)
  );
  const categoryName = categories.find(
    (category) => category.category_id === Number(id)
  )?.category_name;

  return (
    <div className="categories_page">
      <div>
        <p className="category_name">{categoryName}</p>
        <div className="categories_container">
          {filteredPersons.map((item) => {
            return <Card key={item.person_id} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
}
