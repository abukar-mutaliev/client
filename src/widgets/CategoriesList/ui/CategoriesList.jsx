import React, { useCallback, useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../../app/providers/StoreProvider/categoriesSlice";
import { AddCategoryForm } from "../../AddCategoryForm";

export const CategoriesList = React.memo(() => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const [showConfirm, setShowConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleDeleteCategory = useCallback((categoryId) => {
    setCategoryToDelete(categoryId);
    setShowConfirm(true);
  }, []);

  const confirmDeleteCategory = async () => {
    try {
      await dispatch(deleteCategory(categoryToDelete)).unwrap();
      setShowConfirm(false);
      setCategoryToDelete(null);
      toast.success("Категория успешно удалена!");
    } catch (err) {
      toast.error(`Ошибка при удалении категории: ${err}`);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category.category_id);
    setEditingCategoryName(category.category_name);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateCategory({ id: editingCategoryId, editingCategoryName })
      ).unwrap();
      dispatch(getCategories());
      setEditingCategoryId(null);
      setEditingCategoryName("");
      toast.success("Категория успешно обновлена!");
    } catch (err) {
      toast.error(`Ошибка при обновлении категории: ${err}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      cancelDelete();
    }
  };

  if (!categories.length) {
    return <div className="loader">В этой категории пока нет партнеров</div>;
  }

  if (!categories) {
    return (
      <div className="loader">
        <BarLoader />
      </div>
    );
  }

  return (
    <div className="admins-list">
      <h2>Список Категорий</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.category_id} className="admin-item">
            {editingCategoryId === category.category_id ? (
              <form onSubmit={handleSaveEdit}>
                <input
                  type="text"
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                />

                <button type="submit">Сохранить</button>
                <button type="button" onClick={handleCancelEdit}>
                  Отмена
                </button>
              </form>
            ) : (
              <>
                <span>{category?.category_name}</span>
                <div className="admin_item-edit">
                  <button
                    type="button"
                    onClick={() => handleEditCategory(category)}
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category.category_id)}
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
            <p>Вы уверены, что хотите удалить этот категорию?</p>
            <button type="button" onClick={confirmDeleteCategory}>
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
            setShowAddCategory(!showAddCategory);
          }}
        >
          Добавить категорию
        </button>
      </div>
      {showAddCategory && <AddCategoryForm />}
    </div>
  );
});
