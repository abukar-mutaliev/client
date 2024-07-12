import React, { useState } from "react";
import PropTypes from "prop-types";
import "./editPersonModal.scss";
import { toast, ToastContainer } from "react-toastify";
import uploadIcon from "../../../shared/assets/icons/upload.svg";

export function EditPersonModal({
  person,
  onClose,
  onSave,
  categories,
  regions,
}) {
  const [personName, setPersonName] = useState(person.person_name);
  const [personPhotoPreview, setPersonPhotoPreview] = useState(null);
  const [activity, setActivity] = useState(person.activity);
  const [achievements, setAchievements] = useState(person.achievements);
  const [description, setDescription] = useState(person.person_description);
  const [photo, setPhoto] = useState(null);
  const [category, setCategory] = useState(person.categoryCategoryId);
  const [region, setRegion] = useState(person.regionRegionId);
  const [networks, setNetworks] = useState(person.Networks || []);
  const [adPrices, setAdPrices] = useState(person.AdPrice || {});

  const handleNetworkChange = (index, field, value) => {
    const newNetworks = networks.map((network, i) => {
      if (i === index) {
        return {
          ...network,
          PersonNetwork: { ...network.PersonNetwork, [field]: value },
        };
      }
      return network;
    });
    setNetworks(newNetworks);
  };

  const handleAddNetwork = () => {
    const newNetwork = {
      PersonNetwork: { network_name: "", followers: "", network_link: "" },
    };
    setNetworks([...networks, newNetwork]);
  };

  const handleAdPriceChange = (field, value) => {
    setAdPrices((prevAdPrices) => ({
      ...prevAdPrices,
      [field]: parseFloat(value) || null,
    }));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("person_name", personName);
    formData.append("activity", activity);
    formData.append("achievements", achievements);
    formData.append("person_description", description);
    formData.append("categoryCategoryId", category);
    formData.append("regionRegionId", region);
    if (photo) {
      formData.append("image", photo);
    }

    try {
      const serializedNetworks = JSON.stringify(
        networks.map((network) => ({
          network_id: network.network_id,
          network_name: network.PersonNetwork.network_name,
          followers: network.PersonNetwork.followers,
          network_link: network.PersonNetwork.network_link,
        }))
      );
      formData.append("networks", serializedNetworks);
      formData.append("ad_prices", JSON.stringify(adPrices));
      toast.success("Данные партнера изменены");
    } catch (error) {
      toast.error("Ошибка при изменении партнера:", error);
      return;
    }

    await onSave(person.person_id, formData);
    onClose();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPersonPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    document.getElementById("photoUpload").click();
  };

  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains("modal_edit_person")) {
      onClose();
    }
  };

  return (
    <div className="modal_edit_person" onClick={handleBackgroundClick}>
      <div className="modal-content_edit_person">
        <span className="modal_edit-close" onClick={onClose}>
          &times;
        </span>
        <h2>Редактирование Партнера</h2>
        <form>
          <span>Имя</span>
          <input
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="Имя"
            required
          />
          <span>Вид деятельности</span>
          <input
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="Вид деятельности"
            required
          />
          <span>Достижение</span>
          <input
            type="text"
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
            placeholder="Достижение"
            required
          />
          <span>Описание</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание"
            required
          />
          <div className="edit_select">
            <div className="edit_select-network">
              <span>Категории</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Выбрать категорию</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="edit_select-network">
              <span>Регионы</span>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">Выбрать регион</option>
                {regions.map((reg) => (
                  <option key={reg.region_id} value={reg.region_id}>
                    {reg.region_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="upload_photo" onClick={handlePhotoClick}>
            <span>Загрузить фото</span>
            <img src={uploadIcon} alt="icon" />
            <input
              type="file"
              id="photoUpload"
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
            />
          </div>
          <div className="networks-section">
            <h3>Соцсети</h3>
            {networks.map((network, index) => (
              <div key={index} className="network">
                <input
                  type="text"
                  value={network.PersonNetwork.network_name}
                  onChange={(e) =>
                    handleNetworkChange(index, "network_name", e.target.value)
                  }
                  placeholder="Название соцсети"
                  required
                />
                <input
                  type="number"
                  value={network.PersonNetwork.followers}
                  onChange={(e) =>
                    handleNetworkChange(index, "followers", e.target.value)
                  }
                  placeholder="Количество подписчиков"
                  required
                />
                <input
                  type="text"
                  value={network.PersonNetwork.network_link}
                  onChange={(e) =>
                    handleNetworkChange(index, "network_link", e.target.value)
                  }
                  placeholder="Ссылка на соцсеть"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              className="card_edit_btn"
              onClick={handleAddNetwork}
            >
              Добавить соцсеть
            </button>
          </div>
          <div className="ad_prices_container">
            <h3>Цены на рекламу</h3>
            <div className="ad_price_item">
              <span>Совместный Reel в Instagram:</span>
              <input
                type="number"
                value={adPrices.instagram_joint_reel || ""}
                onChange={(e) =>
                  handleAdPriceChange("instagram_joint_reel", e.target.value)
                }
                placeholder="Цена"
                required
              />
            </div>
            <div className="ad_price_item">
              <span>Story в Instagram:</span>
              <input
                type="number"
                value={adPrices.instagram_story || ""}
                onChange={(e) =>
                  handleAdPriceChange("instagram_story", e.target.value)
                }
                placeholder="Цена"
              />
            </div>
            <div className="ad_price_item">
              <span>Repost в сторис Instagram:</span>
              <input
                type="number"
                value={adPrices.instagram_story_repost || ""}
                onChange={(e) =>
                  handleAdPriceChange("instagram_story_repost", e.target.value)
                }
                placeholder="Цена"
              />
            </div>
            <div className="ad_price_item">
              <span>Публикация в Instagram:</span>
              <input
                type="number"
                value={adPrices.instagram_post || ""}
                onChange={(e) =>
                  handleAdPriceChange("instagram_post", e.target.value)
                }
                placeholder="Цена"
              />
            </div>
            <div className="ad_price_item">
              <span> Публикация в VK:</span>
              <input
                type="number"
                value={adPrices.vk_post || ""}
                onChange={(e) => handleAdPriceChange("vk_post", e.target.value)}
                placeholder="Цена"
              />
            </div>
            <div className="ad_price_item">
              <span> Публикация в Телеграм:</span>
              <input
                type="number"
                value={adPrices.telegram_post || ""}
                onChange={(e) =>
                  handleAdPriceChange("telegram_post", e.target.value)
                }
                placeholder="Цена"
              />
            </div>
            <div className="ad_price_item">
              <span> Стандартная интеграция в ролике на YouTube:</span>
              <input
                type="number"
                value={adPrices.youtube_standard_integration || ""}
                onChange={(e) =>
                  handleAdPriceChange(
                    "youtube_standard_integration",
                    e.target.value
                  )
                }
                placeholder="Цена"
              />
            </div>
            <div className="ad_price_item">
              <span>Видео привет, поздравление:</span>
              <input
                type="number"
                value={adPrices.video_greeting || ""}
                onChange={(e) =>
                  handleAdPriceChange("video_greeting", e.target.value)
                }
                placeholder="Цена"
              />
            </div>
          </div>
          <div className="button-group">
            <button type="button" className="btn_submit" onClick={handleSave}>
              Сохранить
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

EditPersonModal.propTypes = {
  person: PropTypes.shape({
    person_id: PropTypes.number.isRequired,
    person_name: PropTypes.string.isRequired,
    activity: PropTypes.string.isRequired,
    achievements: PropTypes.string,
    person_description: PropTypes.string,
    person_photo: PropTypes.string,
    categoryCategoryId: PropTypes.number,
    regionRegionId: PropTypes.number,
    Networks: PropTypes.arrayOf(
      PropTypes.shape({
        network_id: PropTypes.number.isRequired,
        PersonNetwork: PropTypes.shape({
          followers: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          network_name: PropTypes.string.isRequired,
          network_link: PropTypes.string.isRequired,
        }).isRequired,
      })
    ),
    AdPrice: PropTypes.shape({
      instagram_joint_reel: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      instagram_story: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      instagram_story_repost: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      instagram_post: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      vk_post: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      telegram_post: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      youtube_standard_integration: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      video_greeting: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      category_id: PropTypes.number.isRequired,
      category_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  regions: PropTypes.arrayOf(
    PropTypes.shape({
      region_id: PropTypes.number.isRequired,
      region_name: PropTypes.string.isRequired,
    })
  ).isRequired,
};
