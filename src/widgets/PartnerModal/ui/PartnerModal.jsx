import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./partnerModal.scss";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getNetworks } from "../../../app/providers/StoreProvider/networkSlice";

export function PartnerModal({ isOpen, onClose, onSubmit }) {
  const initialFormData = {
    firstName: "",
    lastName: "",
    activity: "",
    achievements: "",
    networks: [{ name: "", followers: "" }],
    contactInfo: "",
    email: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const networks = useSelector((state) => state.networks.networks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNetworks());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNetworkChange = (index, e) => {
    const { name, value } = e.target;
    const newNetworks = [...formData.networks];
    newNetworks[index][name] = value;
    setFormData((prevData) => ({ ...prevData, networks: newNetworks }));
  };

  const addNetwork = () => {
    setFormData((prevData) => ({
      ...prevData,
      networks: [...prevData.networks, { name: "", followers: "" }],
    }));
  };

  const addNetworkFromDropdown = (e) => {
    const networkId = e.target.value;
    const selectedNetwork = networks.find(
      (network) => network.network_id === parseInt(networkId, 10)
    );
    if (selectedNetwork) {
      setFormData((prevData) => ({
        ...prevData,
        networks: [
          ...prevData.networks,
          { name: selectedNetwork.network_name, followers: "" },
        ],
      }));
    }
  };

  const removeNetwork = (index) => {
    setFormData((prevData) => {
      const newNetworks = prevData.networks.filter((_, i) => i !== index);
      return { ...prevData, networks: newNetworks };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Стань Партнером</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="Имя"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Фамилия"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="activity"
            placeholder="Вид деятельности"
            value={formData.activity}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="achievements"
            placeholder="Достижения"
            value={formData.achievements}
            onChange={handleInputChange}
          />
          <div className="dropdown_menu">
            <select onChange={addNetworkFromDropdown} defaultValue="">
              <option className="dropdown_option" value="" disabled>
                Соцсети
              </option>
              {networks.map((network) => (
                <option key={network.network_id} value={network.network_id}>
                  {network.network_name}
                </option>
              ))}
            </select>
          </div>
          {formData.networks.map((network, index) => (
            <div key={index} className="network-field">
              <input
                type="text"
                name="name"
                placeholder="Соцсеть"
                value={network.name}
                onChange={(e) => handleNetworkChange(index, e)}
                required
              />
              <input
                type="number"
                name="followers"
                placeholder="Подписчики"
                value={network.followers}
                onChange={(e) => handleNetworkChange(index, e)}
                required
              />
              <RiDeleteBin6Line
                type="button"
                role="button"
                onClick={() => removeNetwork(index)}
              />
            </div>
          ))}
          <button type="button" onClick={addNetwork}>
            Добавить соцсеть
          </button>
          <input
            type="text"
            name="contactInfo"
            placeholder="Контактная информация"
            value={formData.contactInfo}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Ваша электронная почта"
            value={formData.email}
            onChange={handleInputChange}
          />
          <button type="submit">Отправить</button>
          <button type="button" onClick={onClose}>
            Закрыть
          </button>
        </form>
      </div>
    </div>
  );
}

PartnerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
