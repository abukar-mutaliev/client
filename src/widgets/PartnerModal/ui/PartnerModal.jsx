import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import "./partnerModal.scss";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getNetworks } from "../../../app/providers/StoreProvider/networkSlice";

export function PartnerModal({ isOpen, onSubmit, setModalIsOpen }) {
  const initialFormData = {
    firstName: "",
    lastName: "",
    activity: "",
    achievements: "",
    networks: [{ name: "", followers: "" }],
    contactInfo: "",
    email: "",
  };
  const modalRef = useRef(null);
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

  const handleCloseModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setModalIsOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    handleCloseModal();
  };

  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames="modal"
      unmountOnExit
      nodeRef={modalRef}
    >
      <div className="modal-overlay" onClick={handleCloseModal}>
        <div className="modal" ref={modalRef}>
          <h2>Стань Партнером</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="Ваше имя"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Ваша фамилия"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="activity"
              placeholder="Ваш вид деятельности"
              value={formData.activity}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="achievements"
              placeholder="Ваши достижения"
              value={formData.achievements}
              onChange={handleInputChange}
            />
            <div className="partner-dropdown_menu">
              <select onChange={addNetworkFromDropdown} defaultValue="">
                <option className="partner-dropdown_option" value="" disabled>
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
                  placeholder="Ваши подписчики"
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
              placeholder="Ваши контакты"
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
              required
            />
            <button type="submit">Отправить</button>
            <button type="button" onClick={() => setModalIsOpen(false)}>
              Закрыть
            </button>
          </form>
        </div>
      </div>
    </CSSTransition>
  );
}

PartnerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  setModalIsOpen: PropTypes.bool.isRequired,
};
