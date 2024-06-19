import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { registerAdmin } from "../../../app/providers/StoreProvider/adminSlice";
import { AdminForm } from "../../../shared/ui/AddForm";
import "./addAdminForm.scss";

export function AddAdminForm() {
  const dispatch = useDispatch();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleAddAdmin = useCallback(
    async (adminData) => {
      try {
        await dispatch(registerAdmin(adminData)).unwrap();
        toast.success("Админ добавлен");
      } catch (err) {
        toast.error(`Ошибка при добавлении админа: ${err}`);
      }
    },
    [dispatch]
  );

  return (
    <div className="admin-form-container">
      <AdminForm
        onSubmit={handleAddAdmin}
        showSuccessMessage={showSuccessMessage}
      />
    </div>
  );
}
