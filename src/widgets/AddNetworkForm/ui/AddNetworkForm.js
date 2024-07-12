import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { addNetwork } from "../../../app/providers/StoreProvider/networkSlice";

export function AddNetworkForm() {
  const [networkName, setNetworkName] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addNetwork({ network_name: networkName })).unwrap();
      setNetworkName("");
      toast.success("Соцсеть успешно добавлена!");
    } catch (err) {
      toast.error(`Ошибка при добавлении соцсети: ${err.message}`);
    }
  };

  return (
    <div className="add-category_input">
      <div className="admin-form-container">
        <h4>Добавление соцсети</h4>
      </div>
      <div className="add-category_input">
        <form onSubmit={handleSubmit}>
          <div className="admin-form-container">
            <input
              type="text"
              id="networkName"
              placeholder="Название соцсети"
              value={networkName}
              onChange={(e) => setNetworkName(e.target.value)}
              required
            />
          </div>
          <button className="btn_submit" type="submit">
            Добавить
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
