import React, { useState } from "react";
import * as PropTypes from "prop-types";
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
  const [adPrices, setAdPrices] = useState(person?.AdPrice);

  const handleNetworkChange = (index, field, value) => {
    const newNetworks = networks.map((network, i) => {
      if (i === index) {
        if (field === "followers") {
          return {
            ...network,
            PersonNetwork: { ...network.PersonNetwork, followers: value },
          };
        }
        return {
          ...network,
          PersonNetwork: { ...network.PersonNetwork, network_name: value },
        };
      }
      return network;
    });
    setNetworks(newNetworks);
  };

  const handleAddNetwork = () => {
    const newNetwork = { PersonNetwork: { network_name: "", followers: "" } };
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
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Редактировать Клиента</h2>
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
            <div>
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
            <div>
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
              <span>Репост</span>
              <input
                type="number"
                value={adPrices.repost || ""}
                onChange={(e) => handleAdPriceChange("repost", e.target.value)}
                placeholder="Цена репоста"
                required
              />
            </div>
            <div className="ad_price_item">
              <span>Видео интеграция</span>
              <input
                type="number"
                value={adPrices.video_integration || ""}
                onChange={(e) =>
                  handleAdPriceChange("video_integration", e.target.value)
                }
                placeholder="Цена видеоинтеграции"
              />
            </div>
            <div className="ad_price_item">
              <span>Видео реклама</span>
              <input
                type="number"
                value={adPrices.video_ad_by_user || ""}
                onChange={(e) =>
                  handleAdPriceChange("video_ad_by_user", e.target.value)
                }
                placeholder="Цена видео рекламы"
              />
            </div>
            <div className="ad_price_item">
              <span>Instagram Story реклама </span>
              <input
                type="number"
                value={adPrices.instagram_story_ad || ""}
                onChange={(e) =>
                  handleAdPriceChange("instagram_story_ad", e.target.value)
                }
                placeholder="Цена Instagram Story рекламы"
              />
            </div>
            <div className="ad_price_item">
              <span> Instagram Reels реклама</span>
              <input
                type="number"
                value={adPrices.instagram_reels_ad || ""}
                onChange={(e) =>
                  handleAdPriceChange("instagram_reels_ad", e.target.value)
                }
                placeholder="Цена Instagram Reels рекламы"
              />
            </div>
          </div>
          <div className="button-group">
            <button
              type="button"
              className="card_edit_btn"
              onClick={handleSave}
            >
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
        }).isRequired,
      })
    ),
    AdPrice: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
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
