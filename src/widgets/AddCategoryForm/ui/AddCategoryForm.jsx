import "./addCategoryForm.scss";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  createCategory,
  updateCategory,
  getCategories,
} from "../../../app/providers/StoreProvider/categoriesSlice";

export function AddCategoryForm() {
  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.categories);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await dispatch(createCategory(categoryName));
      dispatch(getCategories());
      setCategoryName("");
      toast.success("Категория успешно добавлена!");
    } catch (err) {
      toast.error(`Ошибка при добавлении категории: ${err}`);
    }
  };

  const handleUpdate = async () => {
    await dispatch(
      updateCategory({ id: categoryId, category_name: categoryName })
    );
    dispatch(getCategories());
    setCategoryName("");
    setCategoryId(null);
  };

  return (
    <div className="add-category_form">
      <div className="add-category_container">
        <h4>Добавить Категорию</h4>
      </div>
      <div className="add-category_input">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Название категории"
            autoComplete="Название категории"
            required
          />
          <button type="submit" disabled={loading} className="btn_submit">
            Добавить Категорию
          </button>
        </form>
        {error && <p>{error}</p>}
      </div>
      <ToastContainer />
    </div>
  );
}
