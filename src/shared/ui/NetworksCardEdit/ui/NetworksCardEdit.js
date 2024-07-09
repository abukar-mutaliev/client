import React, { useCallback, useEffect, useState } from "react";
import "./networksCardEdit.scss";
import { useDispatch, useSelector } from "react-redux";
import { BarLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import {
  deleteNetwork,
  getNetworks,
} from "../../../../app/providers/StoreProvider/networkSlice";
import { AddNetworkForm } from "../../../../widgets/AddNetworkForm";

export function NetworksCardEdit() {
  const dispatch = useDispatch();
  const { networks, isLoading, error } = useSelector((state) => state.networks);
  const [networkToDelete, setNetworkToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddNetwork, setShowAddNetwork] = useState(false);

  useEffect(() => {
    dispatch(getNetworks());
  }, [dispatch]);

  const handleDeleteNetwork = useCallback((networkId) => {
    setNetworkToDelete(networkId);
    setShowConfirm(true);
  }, []);

  const confirmDeleteNetwork = async () => {
    try {
      await dispatch(deleteNetwork(networkToDelete)).unwrap();
      setShowConfirm(false);
      setNetworkToDelete(null);
      toast.success("Соцсеть успешно удалена!");
    } catch (err) {
      toast.error(`Ошибка при удалении соцсети: ${err}`);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setNetworkToDelete(null);
  };

  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      cancelDelete();
    }
  };

  if (isLoading)
    return (
      <div className="loader">
        <BarLoader />
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="network_list">
      <h2>Соцсети</h2>
      <ul>
        {networks.map((network) => (
          <li key={network.network_id} className="admin-item">
            <span>{network.network_name}</span>
            <button
              type="button"
              onClick={() => handleDeleteNetwork(network.network_id)}
            >
              Удалить
            </button>
          </li>
        ))}
        {showConfirm && (
          <div className="modal-overlay" onClick={handleBackgroundClick}>
            <div className="modal">
              <h1>Вы уверены, что хотите удалить эту соцсеть?</h1>
              <button type="button" onClick={confirmDeleteNetwork}>
                Да
              </button>
              <button type="button" onClick={cancelDelete}>
                Отмена
              </button>
            </div>
          </div>
        )}
      </ul>
      <div className="btn_container">
        <button
          className="admin_btn"
          type="button"
          onClick={() => {
            setShowAddNetwork(!showAddNetwork);
          }}
        >
          Добавить соцсеть
        </button>
      </div>
      {showAddNetwork && <AddNetworkForm />}
      <ToastContainer />
    </div>
  );
}
