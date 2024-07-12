import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  addRegion,
  fetchRegions,
} from "../../../../app/providers/StoreProvider/regionSlice";

export function AddRegionForm() {
  const [regionName, setRegionName] = useState("");
  const [regionId, setRegionId] = useState(null);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.regions);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addRegion(regionName));
      dispatch(fetchRegions());
      setRegionName("");
      toast.success("Регион успешно добавлен!");
    } catch (err) {
      toast.error(`Ошибка при добавлении региона: ${err}`);
    }
  };

  return (
    <div className="add-category_form">
      <div className="add-category_container">
        <h4>Добавление региона</h4>
      </div>
      <div className="add-category_input">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={regionName}
            onChange={(e) => setRegionName(e.target.value)}
            placeholder="Название региона"
            autoComplete="Название региона"
            required
          />

          <button type="submit" disabled={loading} className="btn_submit">
            Добавить регион
          </button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
