import React, { useCallback, useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AddRegionForm } from "../../../shared/ui/AddRegionForm";
import {
  fetchRegions,
  deleteRegion,
  updateRegion,
} from "../../../app/providers/StoreProvider/regionSlice";

export const RegionsList = React.memo(() => {
  const dispatch = useDispatch();
  const regions = useSelector((state) => state.regions.regions);
  const [showConfirm, setShowConfirm] = useState(false);
  const [regionToDelete, setRegionToDelete] = useState(null);
  const [showAddRegion, setShowAddRegion] = useState(false);
  const [editingRegionId, setEditingRegionId] = useState(null);
  const [editingRegionName, setEditingRegionName] = useState("");

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  const handleDeleteRegion = useCallback((regionId) => {
    setRegionToDelete(regionId);
    setShowConfirm(true);
  }, []);

  const confirmDeleteRegion = async () => {
    try {
      await dispatch(deleteRegion(regionToDelete)).unwrap();
      setShowConfirm(false);
      setRegionToDelete(null);
      toast.success("Регион успешно удален!");
    } catch (err) {
      toast.error(`Ошибка при удалении региона: ${err}`);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const handleEditRegion = (region) => {
    setEditingRegionId(region.region_id);
    setEditingRegionName(region.region_name);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateRegion({ id: editingRegionId, editingRegionName })
      ).unwrap();
      dispatch(fetchRegions());
      setEditingRegionId(null);
      setEditingRegionName("");
      toast.success("Регион успешно обновлен!");
    } catch (err) {
      toast.error(`Ошибка при обновлении региона: ${err}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingRegionId(null);
    setEditingRegionName("");
  };

  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      cancelDelete();
    }
  };

  if (!regions.length) {
    return (
      <div className="loader">
        <BarLoader />
      </div>
    );
  }

  return (
    <div className="admins-list">
      <h2>Список Регионов</h2>
      <ul>
        {regions.map((region) => (
          <li key={region.region_id} className="admin-item">
            {editingRegionId === region.region_id ? (
              <form onSubmit={handleSaveEdit}>
                <input
                  type="text"
                  value={editingRegionName}
                  onChange={(e) => setEditingRegionName(e.target.value)}
                />

                <button type="submit">Сохранить</button>
                <button type="button" onClick={handleCancelEdit}>
                  Отмена
                </button>
              </form>
            ) : (
              <>
                <span>{region?.region_name}</span>
                <div className="admin_item-edit">
                  <button
                    type="button"
                    onClick={() => handleEditRegion(region)}
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteRegion(region.region_id)}
                  >
                    Удалить
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {showConfirm && (
        <div className="modal-overlay" onClick={handleBackgroundClick}>
          <div className="modal">
            <p>Вы уверены, что хотите удалить этот регион?</p>
            <button type="button" onClick={confirmDeleteRegion}>
              Да
            </button>
            <button type="button" onClick={cancelDelete}>
              Отмена
            </button>
          </div>
        </div>
      )}
      <div className="btn_container">
        <button
          className="admin_btn"
          type="button"
          onClick={() => {
            setShowAddRegion(!showAddRegion);
          }}
        >
          Добавить регион
        </button>
      </div>
      {showAddRegion && <AddRegionForm />}
    </div>
  );
});
