import React, { useCallback, useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import {
  deleteAdmin,
  fetchAdmins,
} from "../../../app/providers/StoreProvider/adminSlice";
import "./adminsList.scss";

export const AdminsList = React.memo(() => {
  const dispatch = useDispatch();
  const admins = useSelector((state) => state.admin.admins);
  const [showConfirm, setShowConfirm] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const handleDeleteAdmin = useCallback((adminId) => {
    setAdminToDelete(adminId);
    setShowConfirm(true);
  }, []);

  const confirmDeleteAdmin = async () => {
    try {
      await dispatch(deleteAdmin(adminToDelete)).unwrap();
      setShowConfirm(false);
      setAdminToDelete(null);
      toast.success("Админ успешно удален!");
    } catch (err) {
      toast.error(`Ошибка при удалении админа: ${err}`);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setAdminToDelete(null);
  };

  if (!admins.length) {
    return (
      <div className="loader">
        <BarLoader />
      </div>
    );
  }
  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      cancelDelete();
    }
  };

  return (
    <div className="admins-list">
      <h2>Список Админов</h2>
      <ul>
        {admins.map((admin) => (
          <li key={admin?.user_id} className="admin-item">
            <span>
              {admin.username} ({admin.email})
            </span>
            <button
              type="button"
              onClick={() => handleDeleteAdmin(admin.user_id)}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
      {showConfirm && (
        <div className="modal-overlay" onClick={handleBackgroundClick}>
          <div className="modal">
            <p>Вы уверены, что хотите удалить этого администратора?</p>
            <button type="button" onClick={confirmDeleteAdmin}>
              Да
            </button>
            <button type="button" onClick={cancelDelete}>
              Отмена
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
});
