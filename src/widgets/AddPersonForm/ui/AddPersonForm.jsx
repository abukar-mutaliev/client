import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchRegions } from "../../../app/providers/StoreProvider/regionSlice";
import { getCategories } from "../../../app/providers/StoreProvider/categoriesSlice";
import { addPerson } from "../../../app/providers/StoreProvider/personSlice";
import addPhoto from "../../../shared/images/addPhoto.png";
import "./addPersonForm.scss";

export function AddPersonForm() {
  const navigate = useNavigate();
  const [personPhoto, setPersonPhoto] = useState(null);
  const [personName, setPersonName] = useState("");
  const [activity, setActivity] = useState("");
  const [achievements, setAchievements] = useState("");
  const [description, setDescription] = useState("");
  const [networks, setNetworks] = useState([
    { network_name: "", followers: "" },
  ]);
  const [adPrices, setAdPrices] = useState({
    instagram_reels_ad: null,
    instagram_story_ad: null,
    repost: null,
    video_ad_by_user: null,
    video_integration: null,
  });

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [addStatus, setAddStatus] = useState(null);

  const dispatch = useDispatch();
  const regions = useSelector((state) => state.regions.regions);
  const categories = useSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch(fetchRegions());
    dispatch(getCategories());
  }, [dispatch]);

  const handleNetworkChange = (index, event) => {
    const values = [...networks];
    values[index][event.target.name] = event.target.value;
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
    setNetworks([...networks, { network_name: "", followers: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", personPhoto);
    formData.append("person_name", personName);
    formData.append("activity", activity);
    formData.append("achievements", achievements);
    formData.append("person_description", description);
    formData.append("regionRegionId", selectedRegion);
    formData.append("categoryCategoryId", selectedCategory);
    formData.append("networks", JSON.stringify(networks));
    formData.append("ad_prices", JSON.stringify(adPrices));

    try {
      await dispatch(addPerson(formData));
      setAddStatus("success");
      setPersonPhoto("");
      setPersonName("");
      setActivity("");
      setAchievements("");
      setDescription("");
      setNetworks([{ network_name: "", followers: "" }]);
      setSelectedRegion("");
      setSelectedCategory("");
      setPersonPhoto(null);
      setAdPrices({
        instagram_reels_ad: null,
        instagram_story_ad: null,
        repost: null,
        video_ad_by_user: null,
        video_integration: null,
      });
      toast.success("Клиент добавлен!");
    } catch (err) {
      setAddStatus("error");
      toast.error(`Ошибка при добавления партнера: ${err}`);
    }
  };

  const handlePhotoClick = () => {
    document.getElementById("photoUpload").click();
  };

  return (
    <div className="add_person-body">
      <div className="add_person-form">
        <h1>ДОБАВЛЕНИЕ ПАРТНЕРА</h1>
      </div>
      <div className="form_container">
        <form onSubmit={handleSubmit}>
          <div className="add_person_container">
            <div>
              {personPhoto === null ? (
                <div
                  onClick={handlePhotoClick}
                  style={{ cursor: "pointer", width: "158px" }}
                >
                  <img
                    alt="img"
                    src={addPhoto}
                    style={{
                      width: "158px",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                  />
                  <input
                    type="file"
                    id="photoUpload"
                    placeholder="Загрузить фото"
                    style={{ display: "none" }}
                    onChange={(e) => setPersonPhoto(e.target.files[0])}
                  />
                  <p
                    style={{
                      fontSize: "12px",
                      fontFamily: "Montserrat, sans serif",
                      textAlign: "center",
                      marginTop: "-20px",
                    }}
                  >
                    Загрузить фото
                  </p>
                </div>
              ) : (
                <div
                  onClick={handlePhotoClick}
                  style={{ cursor: "pointer", width: "158px" }}
                >
                  <img
                    alt="img"
                    src={personPhoto ? URL.createObjectURL(personPhoto) : ""}
                    style={{
                      width: "158px",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                  />
                  <input
                    type="file"
                    id="photoUpload"
                    placeholder="Загрузить фото"
                    style={{ display: "none" }}
                    onChange={(e) => setPersonPhoto(e.target.files[0])}
                  />
                </div>
              )}

              <input
                type="file"
                id="photoUpload"
                placeholder="Загрузить фото"
                style={{ display: "none" }}
                onChange={(e) => setPersonPhoto(e.target.files[0])}
              />
            </div>
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
                    <input
                      type="text"
                      name="network_name"
                      value={network.network_name}
                      onChange={(e) => handleNetworkChange(index, e)}
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
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="add_person_network-btn"
                onClick={handleAddNetwork}
              >
                Добавить соцсеть
              </button>
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
              <label htmlFor="instagram_reels_ad">
                Instagram Reels:
                <input
                  type="number"
                  id="instagram_reels_ad"
                  name="instagram_reels_ad"
                  value={adPrices.instagram_reels_ad || ""}
                  onChange={handleAdPriceChange}
                  placeholder="Цена"
                />
              </label>
            </div>
            <div className="ad_price_item">
              <label htmlFor="instagram_story_ad">
                Instagram Story:
                <input
                  type="number"
                  id="instagram_story_ad"
                  name="instagram_story_ad"
                  value={adPrices.instagram_story_ad || ""}
                  onChange={handleAdPriceChange}
                  placeholder="Цена"
                />
              </label>
            </div>
            <div className="ad_price_item">
              <label htmlFor="repost">
                Repost:
                <input
                  type="number"
                  id="repost"
                  name="repost"
                  value={adPrices.repost || ""}
                  onChange={handleAdPriceChange}
                  placeholder="Цена"
                />
              </label>
            </div>
            <div className="ad_price_item">
              <label htmlFor="video_ad_by_user">
                Видеореклама от партнера:
                <input
                  type="number"
                  id="video_ad_by_user"
                  name="video_ad_by_user"
                  value={adPrices.video_ad_by_user || ""}
                  onChange={handleAdPriceChange}
                  placeholder="Цена"
                />
              </label>
            </div>
            <div className="ad_price_item">
              <label htmlFor="video_integration">
                Интегрированная реклама:
                <input
                  type="number"
                  id="video_integration"
                  name="video_integration"
                  value={adPrices.video_integration || ""}
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
