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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comments, setComments] = useState("");
  const [selectedAds, setSelectedAds] = useState({});
  const [otherAd, setOtherAd] = useState("");
  const [formError, setFormError] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    if (emailStatus === "succeeded") {
      toast.success("Заказ рекламы успешно сформирован!");
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
    if (!email || !phone || !comments) {
      setFormError(true);
      return;
    }

    const selectedAdTypes = Object.keys(selectedAds).filter(
      (ad) => selectedAds[ad]
    );

    const formattedAdDetails = selectedAdTypes
      .map((adType) => {
        switch (adType) {
          case "instagram_joint_reel":
            return `Совместный Reel в Instagram - ${adPrices.instagram_joint_reel} ₽`;
          case "instagram_story":
            return `Story в Instagram - ${adPrices.instagram_story} ₽`;
          case "instagram_story_repost":
            return `Repost в сторис Instagram - ${adPrices.instagram_story_repost} ₽`;
          case "instagram_post":
            return `Публикация в Instagram - ${adPrices.instagram_post} ₽`;
          case "vk_post":
            return `Публикация в VK - ${adPrices.vk_post} ₽`;
          case "telegram_post":
            return `Публикация в Телеграм - ${adPrices.telegram_post} ₽`;
          case "youtube_standard_integration":
            return `Стандартная интеграция в ролике на YouTube - ${adPrices.youtube_standard_integration} ₽`;
          case "video_greeting":
            return `Видео привет, поздравление - ${adPrices.video_greeting} ₽`;
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
      contactInfo: {
        email,
        phone,
      },
      comments,
      adDetails: formattedAdDetails,
      otherAd,
    };

    setEmail("");
    setPhone("");
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
            type="email"
            placeholder="Ваш E-mail почта"
            value={email}
            required
            onChange={(e) => {
              setEmail(e.target.value);
              setFormError(false);
            }}
            className={formError && !email ? "input-error" : ""}
          />
          <input
            type="tel"
            placeholder="Ваш номер телефона"
            value={phone}
            required
            onChange={(e) => {
              setPhone(e.target.value);
              setFormError(false);
            }}
            className={formError && !phone ? "input-error" : ""}
          />
          <div className="ad-options">
            <h3>Выберите рекламу</h3>
            {adPrices?.instagram_joint_reel && (
              <label htmlFor="instagram_joint_reel" className="adPrice_label">
                <input
                  type="checkbox"
                  id="instagram_joint_reel"
                  name="instagram_joint_reel"
                  checked={selectedAds?.instagram_joint_reel || false}
                  onChange={handleCheckboxChange}
                />
                Совместный Reel в Instagram -{" "}
                <span>
                  {adPrices?.instagram_joint_reel} <span>₽</span>
                </span>
              </label>
            )}

            {adPrices?.instagram_story && (
              <label htmlFor="instagram_story" className="adPrice_label">
                <input
                  type="checkbox"
                  id="instagram_story"
                  name="instagram_story"
                  checked={selectedAds?.instagram_story || false}
                  onChange={handleCheckboxChange}
                />
                Story в Instagram -{" "}
                <span>
                  {adPrices?.instagram_story} <span>₽</span>
                </span>
              </label>
            )}

            {adPrices?.instagram_story_repost && (
              <label htmlFor="instagram_story_repost" className="adPrice_label">
                <input
                  type="checkbox"
                  id="instagram_story_repost"
                  name="instagram_story_repost"
                  checked={selectedAds?.instagram_story_repost || false}
                  onChange={handleCheckboxChange}
                />
                Repost в сторис Instagram -{" "}
                <span>
                  {adPrices?.instagram_story_repost} <span>₽</span>
                </span>
              </label>
            )}

            {adPrices?.instagram_post && (
              <label htmlFor="instagram_post" className="adPrice_label">
                <input
                  type="checkbox"
                  id="instagram_post"
                  name="instagram_post"
                  checked={selectedAds?.instagram_post || false}
                  onChange={handleCheckboxChange}
                />
                Публикация в Instagram -{" "}
                <span>
                  {adPrices?.instagram_post} <span>₽</span>
                </span>
              </label>
            )}

            {adPrices?.vk_post && (
              <label htmlFor="vk_post" className="adPrice_label">
                <input
                  type="checkbox"
                  id="vk_post"
                  name="vk_post"
                  checked={selectedAds?.vk_post || false}
                  onChange={handleCheckboxChange}
                />
                Публикация в VK -{" "}
                <span>
                  {adPrices?.vk_post} <span>₽</span>
                </span>
              </label>
            )}

            {adPrices?.telegram_post && (
              <label htmlFor="telegram_post" className="adPrice_label">
                <input
                  type="checkbox"
                  id="telegram_post"
                  name="telegram_post"
                  checked={selectedAds?.telegram_post || false}
                  onChange={handleCheckboxChange}
                />
                Публикация в Телеграм -{" "}
                <span>
                  {adPrices?.telegram_post} <span>₽</span>
                </span>
              </label>
            )}

            {adPrices?.youtube_standard_integration && (
              <label
                htmlFor="youtube_standard_integration"
                className="adPrice_label"
              >
                <input
                  type="checkbox"
                  id="youtube_standard_integration"
                  name="youtube_standard_integration"
                  checked={selectedAds?.youtube_standard_integration || false}
                  onChange={handleCheckboxChange}
                />
                Стандартная интеграция в ролике на YouTube -{" "}
                <span>
                  {adPrices?.youtube_standard_integration} <span>₽</span>
                </span>
              </label>
            )}

            {adPrices?.video_greeting && (
              <label htmlFor="video_greeting" className="adPrice_label">
                <input
                  type="checkbox"
                  id="video_greeting"
                  name="video_greeting"
                  checked={selectedAds?.video_greeting || false}
                  onChange={handleCheckboxChange}
                />
                Видео привет, поздравление -{" "}
                <span>
                  {adPrices?.video_greeting} <span>₽</span>
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
    person_name: PropTypes.string,
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
    instagram_joint_reel: PropTypes.number,
    instagram_story: PropTypes.number,
    instagram_story_repost: PropTypes.number,
    instagram_post: PropTypes.number,
    vk_post: PropTypes.number,
    telegram_post: PropTypes.number,
    youtube_standard_integration: PropTypes.number,
    video_greeting: PropTypes.number,
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
