import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "./description.scss";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPerson,
  getPersons,
} from "../../../app/providers/StoreProvider/personSlice";
import { getCategories } from "../../../app/providers/StoreProvider/categoriesSlice";
import { sendEmail } from "../../../app/providers/StoreProvider/emailSlice";
import "react-toastify/dist/ReactToastify.css";

export function Description(props) {
  const { id } = useParams();
  const personId = Number(id);
  const dispatch = useDispatch();
  const persons = useSelector((state) => state.persons.persons);
  const person = useSelector((state) => state.persons.person);
  const categories = useSelector((state) => state.categories.categories);
  const [contactInfo, setContactInfo] = useState("");
  const [comments, setComments] = useState("");
  const [selectedAds, setSelectedAds] = useState({});
  const [otherAd, setOtherAd] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formError, setFormError] = useState(false);
  const emailStatus = useSelector((state) => state.email.status);
  const emailError = useSelector((state) => state.email.error);
  const [isLoading, setIsLoading] = useState(true);
  const adPrices = person.AdPrice;

  useEffect(() => {
    const fetchCategories = async () => {
      await dispatch(getCategories());
      setIsLoading(false);
    };

    fetchCategories();
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getPerson(personId));
    dispatch(getPersons());
  }, [dispatch, personId]);

  useEffect(() => {
    if (emailStatus === "succeeded") {
      toast.success("Заказ успешно сформирован!");
    }
    if (emailStatus === "failed") {
      toast.error(`Ошибка при заказе рекламы: ${emailError}`);
    }
  }, [emailStatus, emailError]);

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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedAds((prevSelectedAds) => ({
      ...prevSelectedAds,
      [name]: checked,
    }));
  };
  const handleSendEmail = () => {
    if (!contactInfo || !comments) {
      setFormError(true);
      return;
    }

    const selectedAdTypes = Object.keys(selectedAds).filter(
      (ad) => selectedAds[ad]
    );

    const emailData = {
      name: person.person_name,
      activity: person.activity,
      networks: personNetworks.map((network) => ({
        network_name: network.PersonNetwork.network_name,
        followers: network.PersonNetwork.followers,
      })),
      contactInfo,
      comments,
      adDetails: selectedAdTypes.map((adType) => ({
        type: adType,
        price: adPrices[adType],
      })),
      otherAd,
    };
    setContactInfo("");
    setComments("");
    setSelectedAds({});
    setOtherAd("");
    setModalIsOpen(false);
    dispatch(sendEmail(emailData));
  };

  const handleCloseModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setModalIsOpen(false);
    }
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
            {emailStatus === "loading" ? (
              <div className="loader-email">
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
          </div>
          {modalIsOpen && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal">
                <h2>Заказать рекламу</h2>
                <input
                  placeholder="Ваши ФИО"
                  value={comments}
                  required
                  onChange={(e) => {
                    setComments(e.target.value);
                    setFormError(false);
                  }}
                  className={formError && !comments ? "input-error" : ""}
                />
                <input
                  type="text"
                  placeholder="Ваши контактные данные"
                  value={contactInfo}
                  required
                  onChange={(e) => {
                    setContactInfo(e.target.value);
                    setFormError(false);
                  }}
                  className={formError && !contactInfo ? "input-error" : ""}
                />
                <div className="ad-options">
                  <h3>Выберите рекламу</h3>
                  {adPrices?.instagram_reels_ad && (
                    <label
                      htmlFor="instagram_reels_ad"
                      className="adPrice_label"
                    >
                      <input
                        type="checkbox"
                        id="instagram_reels_ad"
                        name="instagram_reels_ad"
                        checked={selectedAds?.instagram_reels_ad || false}
                        onChange={handleCheckboxChange}
                      />
                      Instagram Reels -{" "}
                      <span>
                        {adPrices?.instagram_reels_ad} <span>₽</span>
                      </span>
                    </label>
                  )}

                  {adPrices?.instagram_story_ad && (
                    <label
                      htmlFor="instagram_story_ad"
                      className="adPrice_label"
                    >
                      <input
                        type="checkbox"
                        id="instagram_story_ad"
                        name="instagram_story_ad"
                        checked={selectedAds?.instagram_story_ad || false}
                        onChange={handleCheckboxChange}
                      />
                      Instagram Story -{" "}
                      <span>
                        {adPrices?.instagram_story_ad} <span>₽</span>
                      </span>
                    </label>
                  )}

                  {adPrices?.repost && (
                    <label htmlFor="repost" className="adPrice_label">
                      <input
                        type="checkbox"
                        id="repost"
                        name="repost"
                        checked={selectedAds?.repost || false}
                        onChange={handleCheckboxChange}
                      />
                      Repost -{" "}
                      <span>
                        {adPrices?.repost} <span>₽</span>
                      </span>
                    </label>
                  )}

                  {adPrices?.video_ad_by_user && (
                    <label htmlFor="video_ad_by_user" className="adPrice_label">
                      <input
                        type="checkbox"
                        id="video_ad_by_user"
                        name="video_ad_by_user"
                        checked={selectedAds?.video_ad_by_user || false}
                        onChange={handleCheckboxChange}
                      />
                      Видеореклама от {person.person_name} -{"   "}
                      <span>{adPrices?.video_ad_by_user} ₽</span>
                    </label>
                  )}

                  {selectedAds?.video_integration && (
                    <label
                      htmlFor="video_integration"
                      className="adPrice_label"
                    >
                      <input
                        type="checkbox"
                        id="video_integration"
                        name="video_integration"
                        checked={selectedAds?.video_integration || false}
                        onChange={handleCheckboxChange}
                      />
                      Интегрированная реклама -{" "}
                      <span>
                        {adPrices?.video_integration} <span>₽</span>
                      </span>
                    </label>
                  )}

                  <label htmlFor="other_ad" className="adPrice_label">
                    <input
                      type="checkbox"
                      id="other_ad"
                      name="other_ad"
                      checked={selectedAds?.other_ad || false}
                      onChange={handleCheckboxChange}
                    />
                    Расширенная реклама (цена договорная)
                  </label>
                  {selectedAds?.other_ad && (
                    <textarea
                      placeholder="Вы можете предложить амбассадорство,
                      контракт из нескольких реклам,
                      съемка в клипе или в вашем шоу"
                      value={otherAd}
                      onChange={(e) => setOtherAd(e.target.value)}
                      className="other-ad-input"
                    />
                  )}
                </div>
                {formError && (
                  <div className="error-message">
                    Все поля обязательны для заполнения
                  </div>
                )}
                <button type="button" onClick={handleSendEmail}>
                  Отправить
                </button>
                <button type="button" onClick={() => setModalIsOpen(false)}>
                  Закрыть
                </button>
              </div>
            </div>
          )}
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
              <div key={item.network_id} className="description-personActivity">
                <span className="label">
                  Подписчики в {item.PersonNetwork.network_name}:
                </span>
                <span className="value">
                  {item.PersonNetwork ? item.PersonNetwork.followers : "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="description-text">
          <span>{person.person_description}</span>
        </div>
        {emailStatus !== "loading" && (
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
