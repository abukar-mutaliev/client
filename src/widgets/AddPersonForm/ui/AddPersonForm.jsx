import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cropper from "react-easy-crop";
import { fetchRegions } from "../../../app/providers/StoreProvider/regionSlice";
import { getCategories } from "../../../app/providers/StoreProvider/categoriesSlice";
import { getNetworks } from "../../../app/providers/StoreProvider/networkSlice";
import getCroppedImg from "./cropImage";
import { addPerson } from "../../../app/providers/StoreProvider/personSlice";
import addPhoto from "../../../shared/images/addPhoto.png";
import "./addPersonForm.scss";

export function AddPersonForm() {
  const [personPhoto, setPersonPhoto] = useState(null);
  const [personName, setPersonName] = useState("");
  const [activity, setActivity] = useState("");
  const [achievements, setAchievements] = useState("");
  const [description, setDescription] = useState("");
  const [networks, setNetworks] = useState([
    { network_name: "", followers: "", network_link: "" },
  ]);
  const [adPrices, setAdPrices] = useState({
    instagram_joint_reel: null,
    instagram_story: null,
    instagram_story_repost: null,
    instagram_post: null,
    vk_post: null,
    telegram_post: null,
    youtube_standard_integration: null,
    video_greeting: null,
  });
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [addStatus, setAddStatus] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropData, setCropData] = useState(null);

  const dispatch = useDispatch();
  const regions = useSelector((state) => state.regions.regions);
  const networksData = useSelector((state) => state.networks.networks);
  const categories = useSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch(fetchRegions());
    dispatch(getCategories());
    dispatch(getNetworks());
  }, [dispatch]);

  const handleNetworkChange = (index, event) => {
    const values = [...networks];
    if (event.target.name === "network_id") {
      const selectedNetwork = networksData.find(
        (network) => network.network_id === parseInt(event.target.value, 10)
      );
      if (selectedNetwork) {
        values[index].network_name = selectedNetwork.network_name;
        values[index].network_id = event.target.value;
      } else {
        values[index].network_name = "";
        values[index].network_id = "";
      }
    } else {
      values[index][event.target.name] = event.target.value;
    }
    setNetworks(values);
  };

  const handleAdPriceChange = (event) => {
    const { name, value } = event.target;
    setAdPrices((prevAdPrices) => ({
      ...prevAdPrices,
      [name]: value.trim() === "" ? null : parseFloat(value),
    }));
  };

  const handleAddNetwork = () => {
    setNetworks([
      ...networks,
      { network_name: "", followers: "", network_link: "" },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const croppedImage = await getCroppedImg(
        personPhoto,
        croppedAreaPixels,
        500,
        400
      );
      const formData = new FormData();
      formData.append("image", croppedImage);
      formData.append("person_name", personName);
      formData.append("activity", activity);
      formData.append("achievements", achievements);
      formData.append("person_description", description);
      formData.append("regionRegionId", selectedRegion);
      formData.append("categoryCategoryId", selectedCategory);
      formData.append("networks", JSON.stringify(networks));
      formData.append("ad_prices", JSON.stringify(adPrices));

      dispatch(addPerson(formData));
      setAddStatus("success");
      setPersonPhoto(null);
      setPersonName("");
      setActivity("");
      setAchievements("");
      setDescription("");
      setNetworks([{ network_name: "", followers: "", network_link: "" }]);
      setSelectedRegion("");
      setSelectedCategory("");
      setAdPrices({
        instagram_joint_reel: null,
        instagram_story: null,
        instagram_story_repost: null,
        instagram_post: null,
        vk_post: null,
        telegram_post: null,
        youtube_standard_integration: null,
        video_greeting: null,
      });
      toast.success("Партнер добавлен!");
    } catch (err) {
      setAddStatus("error");
      toast.error(`Ошибка при добавлении партнера: ${err}`);
    }
  };

  const handlePhotoClick = () => {
    document.getElementById("photoUpload").click();
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPersonPhoto(fileURL);
      setCropData(null);
    }
  };

  const renderPhotoUpload = () => {
    if (personPhoto === null) {
      return (
        <div
          onClick={handlePhotoClick}
          style={{ cursor: "pointer", width: 160, height: 160 }}
        >
          <img
            alt="img"
            src={addPhoto}
            style={{
              width: 160,
              height: 160,
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
          <input
            type="file"
            id="photoUpload"
            placeholder="Загрузить фото"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
          <p
            style={{
              fontSize: "12px",
              fontFamily: "Montserrat, sans-serif",
              textAlign: "center",
              marginTop: "-20px",
            }}
          >
            Загрузить фото
          </p>
        </div>
      );
    }

    return (
      <div
        onClick={handlePhotoClick}
        style={{ cursor: "pointer", width: 160, height: 160 }}
      >
        {cropData ? (
          <img
            alt="img"
            src={cropData}
            style={{
              width: 160,
              height: 160,
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              position: "relative",
              width: 160,
              height: 160,
            }}
          >
            <Cropper
              image={personPhoto}
              crop={crop}
              zoom={zoom}
              aspect={500 / 400} // соотношение сторон для исходного разрешения
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        )}
        <input
          type="file"
          id="photoUpload"
          placeholder="Загрузить фото"
          style={{ display: "none" }}
          onChange={handlePhotoChange}
        />
      </div>
    );
  };

  return (
    <div className="add_person-body">
      <div className="add_person-form">
        <h1>ДОБАВЛЕНИЕ ПАРТНЕРА</h1>
      </div>
      <div className="form_container">
        <form onSubmit={handleSubmit}>
          <div className="add_person_container">
            <div>{renderPhotoUpload()}</div>
            <div className="add_person">
              <input
                type="text"
                className="add_person_input"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Введите Имя и Фамилию"
                required
              />
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="Вид деятельности"
                required
              />
              <input
                type="text"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                placeholder="Достижения"
                required
              />
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание"
              required
            />
          </div>
          <div className="add_person-regions-networks">
            <div className="add_person_network-container">
              <div className="add_person_network">
                <span>Добавить соцсеть</span>
                {networks.map((network, index) => (
                  <div key={index} className="add_person_network_form">
                    <div className="add_person_select">
                      <select
                        name="network_id"
                        value={network.network_id || ""}
                        style={{ width: "90px" }}
                        onChange={(e) => handleNetworkChange(index, e)}
                        required
                      >
                        <option value="" disabled>
                          Соцсети
                        </option>
                        {networksData.map((network) => (
                          <option
                            key={network.network_id}
                            value={network.network_id}
                          >
                            {network.network_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      name="network_name"
                      value={network.network_name}
                      readOnly
                      placeholder="Название соцсети"
                      required
                    />
                    <input
                      type="number"
                      name="followers"
                      value={network.followers}
                      onChange={(e) => handleNetworkChange(index, e)}
                      placeholder="Подписчики"
                      required
                    />
                    <input
                      type="text"
                      name="network_link"
                      value={network.network_link}
                      onChange={(e) => handleNetworkChange(index, e)}
                      placeholder="Ссылка на соцсеть"
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="add_person_network-btn"
                  onClick={handleAddNetwork}
                >
                  Добавить соцсеть
                </button>
              </div>
            </div>
            <div className="add_person_select">
              <select
                value={selectedRegion}
                style={{ width: "90px" }}
                onChange={(e) => setSelectedRegion(e.target.value)}
                required
              >
                <option value="" disabled>
                  Регион
                </option>
                {regions.map((region) => (
                  <option key={region.region_id} value={region.region_id}>
                    {region.region_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="add_person_select">
              <select
                value={selectedCategory}
                style={{ width: "120px" }}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  Категория
                </option>
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="ad_prices_container">
            <h3>Цены на рекламу:</h3>
            <div className="ad_price_item">
              <label htmlFor="instagram_joint_reel">
                Совместный Reel в Instagram:
                <input
                  type="number"
                  id="instagram_joint_reel"
                  name="instagram_joint_reel"
                  value={adPrices.instagram_joint_reel || ""}
                  onChange={handleAdPriceChange}
                  placeholder="Цена"
                />
              </label>
            </div>
            <div className="ad_price_item">
              <label htmlFor="instagram_story">
                Story в Instagram:
                <input
                  type="number"
                  id="instagram_story"
                  name="instagram_story"
                  value={adPrices.instagram_story || ""}
                  onChange={handleAdPriceChange}
                  placeholder="Цена"
                />
              </label>
            </div>
            <div className="ad_price_item">
              <label htmlFor="instagram_story_repost">
                Repost в сторис Instagram:
                <input
                  type="number"
                  id="instagram_story_repost"
                  name="instagram_story_repost"
                  value={adPrices.instagram_story_repost || ""}
                  onChange={handleAdPriceChange}
                  placeholder="Цена"
                />
              </label>
            </div>
            <div className="ad_price_item">
              <label htmlFor="instagram_post">
                Публикация в Instagram:
                <input
                  type="number"
                  id="instagram_post"
                  name="instagram_post"
                  value={adPrices.instagram_post || ""}
                  onChange={handleAdPriceChange}
                  placeholder="Цена"
                />
              </label>
            </div>
            <div className="ad_price_item">
              <label htmlFor="vk_post">
                Публикация в VK:
                <input
                  type="number"
                  id="vk_post"
                  name="vk_post"
                  value={adPrices.vk_post || ""}
                  onChange={handleAdPriceChange}
                  placeholder="Цена"
                />
              </label>
            </div>
            <div className="ad_price_item">
              <label htmlFor="telegram_post">
                Публикация в Телеграм:
                <input
                  type="number"
                  id="telegram_post"
                  name="telegram_post"
                  value={adPrices.telegram_post || ""}
                  onChange={handleAdPriceChange}
                  placeholder="Цена"
                />
              </label>
            </div>
            <div className="ad_price_item">
              <label htmlFor="youtube_standard_integration">
                Стандартная интеграция в ролике на YouTube:
                <input
                  type="number"
                  id="youtube_standard_integration"
                  name="youtube_standard_integration"
                  value={adPrices.youtube_standard_integration || ""}
                  onChange={handleAdPriceChange}
                  placeholder="Цена"
                />
              </label>
            </div>
            <div className="ad_price_item">
              <label htmlFor="video_greeting">
                Видео привет, поздравление:
                <input
                  type="number"
                  id="video_greeting"
                  name="video_greeting"
                  value={adPrices.video_greeting || ""}
                  onChange={handleAdPriceChange}
                  placeholder="Цена"
                />
              </label>
            </div>
          </div>
          <button className="btn_submit" type="submit">
            добавить партнера
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
