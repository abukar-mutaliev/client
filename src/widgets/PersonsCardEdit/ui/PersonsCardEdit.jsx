import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState, useCallback } from "react";
import { Card } from "../../../shared/ui/Card";
import {
  deletePerson,
  getPersons,
  pinPerson,
  updatePerson,
} from "../../../app/providers/StoreProvider/personSlice";
import deleteCard from "../../../shared/assets/icons/delete.svg";
import editCard from "../../../shared/assets/icons/edit.svg";
import { getCategories } from "../../../app/providers/StoreProvider/categoriesSlice";
import { fetchRegions } from "../../../app/providers/StoreProvider/regionSlice";
import { EditPersonModal } from "../../EditPersonModal";
import "./personsCardEdit.scss";

export function PersonsCardEdit() {
  const dispatch = useDispatch();
  const persons = useSelector((state) => state.persons.persons);
  const categories = useSelector((state) => state.categories.categories);
  const regions = useSelector((state) => state.regions.regions);
  const [showModal, setShowModal] = useState(false);
  const [currentPerson, setCurrentPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);
  const admin = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getPersons());
    setIsLoading(false);
  }, [dispatch, isLoading]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  const handleDeletePerson = useCallback((id) => {
    setPersonToDelete(id);
    setShowConfirm(true);
  }, []);

  const confirmDeletePerson = async () => {
    try {
      await dispatch(deletePerson(personToDelete)).unwrap();
      setIsLoading(true);
      setShowConfirm(false);
      setPersonToDelete(null);
      toast.success("Партнер успешно удален!");
    } catch (err) {
      toast.error(`Ошибка при удалении партнера: ${err}`);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setPersonToDelete(null);
  };

  const handleUpdatePerson = async (id, updatedData) => {
    try {
      await dispatch(updatePerson({ id, updatedData }));
      dispatch(getPersons());
      setShowModal(false);
      setIsLoading(true);
      setCurrentPerson(null);
      toast.success("Данные партнера изменены");
    } catch (e) {
      toast.error(`Ошибка при изменении данных партнера: ${err}`);
    }
  };

  const handleEditClick = async (person) => {
    await dispatch(getPersons());
    setCurrentPerson(person);
    setShowModal(true);
  };
  const handlePinClick = (personId) => {
    dispatch(pinPerson(personId));
  };
  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      cancelDelete();
    }
  };
  const sortedPersons = persons
    .slice()
    .sort((a, b) => a.person_name?.localeCompare(b.person_name));

  return (
    <div className="admin_cards">
      {sortedPersons.map((item) => (
        <div key={item?.person_id} className="card-container">
          <Card item={item} admin={admin} onPinClick={handlePinClick} />
          <div className="card_edit_btn">
            <button
              type="button"
              style={{
                height: "30px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => handleDeletePerson(item.person_id)}
            >
              <img className="delete_btn" src={deleteCard} alt="icon" />
            </button>
            <button
              type="button"
              style={{
                height: "26px",
                width: "30px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                marginLeft: "10px",
              }}
              onClick={() => handleEditClick(item)}
            >
              <img src={editCard} alt="icon" />
            </button>
          </div>
        </div>
      ))}
      {showModal && currentPerson && (
        <EditPersonModal
          person={currentPerson}
          regions={regions}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSave={handleUpdatePerson}
        />
      )}
      {showConfirm && (
        <div className="modal-overlay" onClick={handleBackgroundClick}>
          <div className="modal">
            <p>Вы уверены, что хотите удалить этого партнера?</p>
            <button type="button" onClick={confirmDeletePerson}>
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
}
