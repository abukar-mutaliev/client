import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPerson,
  getPersons,
} from "../../../app/providers/StoreProvider/personSlice";
import { getCategories } from "../../../app/providers/StoreProvider/categoriesSlice";
import "react-toastify/dist/ReactToastify.css";
import "./description.scss";
import { AdModal } from "../../../shared/ui/AdModal";

export function Description() {
  const { id } = useParams();
  const personId = Number(id);
  const dispatch = useDispatch();
  const persons = useSelector((state) => state.persons.persons);
  const person = useSelector((state) => state.persons.person);
  const categories = useSelector((state) => state.categories.categories);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const adPrices = person?.AdPrice;
  const emailStatus = useSelector((state) => state.email.status);

  useEffect(() => {
    const fetchCategories = async () => {
      await dispatch(getCategories());
      setIsLoading(false);
    };

    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPerson(personId));
    dispatch(getPersons());
  }, [dispatch, personId]);

  useEffect(() => {
    if (modalIsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalIsOpen]);

  if (isLoading || !persons.length || !person) {
    return (
      <div className="loader">
        <BarLoader />
      </div>
    );
  }

  const categoryName =
    categories.find((item) => item.category_id === person.categoryCategoryId)
      ?.category_name || "Категория не найдена";

  const personNetworks = person.Networks || [];

  const handleOrderClick = () => {
    setModalIsOpen(true);
  };

  return (
    <div className="description">
      <div className="description-container">
        <div className="description-title">
          <span>{categoryName}</span>
        </div>
        <div className="description-content">
          <div className="description-image-container">
            <img
              src={`/${person.person_photo}`}
              alt="img"
              className="description-img"
            />
          </div>
          <AdModal
            modalIsOpen={modalIsOpen}
            setModalIsOpen={setModalIsOpen}
            person={person}
            adPrices={adPrices}
            personNetworks={personNetworks}
          />
          <div className="description-person">
            <div className="description-personName">
              <span>{person.person_name}</span>
            </div>
            <div className="description-personActivity">
              <span className="label">Вид деятельности:</span>
              <span className="value">{person.activity}</span>
            </div>
            <div className="description-personActivity">
              <span className="label">Достижения:</span>
              <span className="value">{person.achievements}</span>
            </div>
            {personNetworks.map((item) => (
              <div key={item.network_id}>
                <div className="description-personActivity">
                  <span className="label">
                    Подписчики в {item.PersonNetwork.network_name}:
                  </span>
                  <span className="value">
                    {item.PersonNetwork ? item.PersonNetwork.followers : "N/A"}
                  </span>
                </div>
                <div className="description-personActivity">
                  <span className="label">
                    Страница в {item.PersonNetwork.network_name}:
                  </span>
                  <Link
                    to={item.PersonNetwork.network_link}
                    className="network_link value"
                  >
                    {item.PersonNetwork ? person.person_name : "N/A"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="description-text">
          {emailStatus === "loading" ? (
            <div className="loader_description">
              <BarLoader />
            </div>
          ) : (
            <button
              className="description-btn desktop-order-btn"
              type="button"
              onClick={handleOrderClick}
            >
              ЗАКАЗАТЬ РЕКЛАМУ
            </button>
          )}
          <span>{person.person_description}</span>
        </div>
        {emailStatus === "loading" ? (
          <div className="mobile-order-loader">
            <BarLoader />
          </div>
        ) : (
          <button
            className="description-btn mobile-order-btn"
            type="button"
            onClick={handleOrderClick}
          >
            ЗАКАЗАТЬ РЕКЛАМУ
          </button>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
