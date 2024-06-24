import React, { useState, useEffect, useRef } from "react";
import "./adModal.scss";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sendEmail } from "../../../../app/providers/StoreProvider/emailSlice";
import "react-toastify/dist/ReactToastify.css";

export function AdModal({
  modalIsOpen,
  setModalIsOpen,
  person,
  adPrices,
  personNetworks,
}) {
  const dispatch = useDispatch();
  const emailStatus = useSelector((state) => state.email.status);
  const emailError = useSelector((state) => state.email.error);
  const [contactInfo, setContactInfo] = useState("");
  const [comments, setComments] = useState("");
  const [selectedAds, setSelectedAds] = useState({});
  const [otherAd, setOtherAd] = useState("");
  const [formError, setFormError] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    if (emailStatus === "succeeded") {
      toast.success("Заказ успешно сформирован!");
    }
    if (emailStatus === "failed") {
      toast.error(`Ошибка при заказе рекламы: ${emailError}`);
    }
  }, [emailStatus, emailError]);

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

    const formattedAdDetails = selectedAdTypes
      .map((adType) => {
        switch (adType) {
          case "instagram_reels_ad":
            return `Instagram Reels - ${adPrices.instagram_reels_ad} ₽`;
          case "instagram_story_ad":
            return `Instagram Story - ${adPrices.instagram_story_ad} ₽`;
          case "repost":
            return `Repost - ${adPrices.repost} ₽`;
          case "video_ad_by_user":
            return `Видеореклама от ${person.person_name} - ${adPrices.video_ad_by_user} ₽`;
          case "video_integration":
            return `Интегрированная реклама - ${adPrices.video_integration} ₽`;
          case "other_ad":
            return `Расширенная реклама (цена договорная)`;
          default:
            return "";
        }
      })
      .filter(Boolean);

    const emailData = {
      name: person?.person_name,
      activity: person?.activity,
      networks: personNetworks?.map((network) => ({
        network_name: network?.PersonNetwork.network_name,
        followers: network?.PersonNetwork.followers,
      })),
      contactInfo,
      comments,
      adDetails: formattedAdDetails,
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
    <CSSTransition
      in={modalIsOpen}
      timeout={300}
      classNames="modal"
      unmountOnExit
      nodeRef={modalRef}
    >
      <div className="modal-overlay" onClick={handleCloseModal}>
        <div className="modal" ref={modalRef}>
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
              <label htmlFor="instagram_reels_ad" className="adPrice_label">
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
              <label htmlFor="instagram_story_ad" className="adPrice_label">
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

            {adPrices?.video_integration && (
              <label htmlFor="video_integration" className="adPrice_label">
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
    </CSSTransition>
  );
}

AdModal.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  setModalIsOpen: PropTypes.func.isRequired,
  person: PropTypes.shape({
    person_name: PropTypes.string.isRequired,
    activity: PropTypes.string.isRequired,
    Networks: PropTypes.arrayOf(
      PropTypes.shape({
        network_id: PropTypes.number.isRequired,
        PersonNetwork: PropTypes.shape({
          network_name: PropTypes.string.isRequired,
          followers: PropTypes.number.isRequired,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
  adPrices: PropTypes.shape({
    instagram_reels_ad: PropTypes.number,
    instagram_story_ad: PropTypes.number,
    repost: PropTypes.number,
    video_ad_by_user: PropTypes.number,
    video_integration: PropTypes.number,
  }).isRequired,
  personNetworks: PropTypes.arrayOf(
    PropTypes.shape({
      network_id: PropTypes.number.isRequired,
      PersonNetwork: PropTypes.shape({
        network_name: PropTypes.string.isRequired,
        followers: PropTypes.number.isRequired,
      }).isRequired,
    })
  ).isRequired,
};
