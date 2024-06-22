import React, { useEffect, useState, useCallback } from "react";
import "./AdminPanelPage.scss";
import { BarLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AddPersonForm } from "../../../widgets/AddPersonForm";
import { PersonsCardEdit } from "../../../widgets/PersonsCardEdit";
import {
  checkAdminStatus,
  fetchAdmins,
  logoutAdmin,
} from "../../../app/providers/StoreProvider/adminSlice";
import { AddAdminForm } from "../../../widgets/AddAdminForm";
import { AdminsList } from "../../../widgets/AdminsList/ui/AdminsList";
import { CategoriesList } from "../../../widgets/CategoriesList";
import { RegionsList } from "../../../widgets/RegionsList";

export function AdminPanelPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [showPersons, setShowPersons] = useState(false);
  const [showAdminsList, setShowAdminsList] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showRegions, setShowRegions] = useState(false);
  const admin = useSelector((state) => state.admin.admin);
  const loading = useSelector((state) => state.admin.status === "loading");

  useEffect(() => {
    dispatch(checkAdminStatus());
  }, [dispatch]);

  useEffect(() => {
    if (admin && admin.isAdmin) {
      dispatch(fetchAdmins());
    } else if (!loading && !admin) {
      navigate("/login");
    }
  }, [dispatch, admin, loading, navigate]);

  const handleLogout = useCallback(() => {
    dispatch(logoutAdmin());
    navigate("/login");
  }, [dispatch, navigate]);

  if (loading) {
    return (
      <div className="loader">
        <BarLoader />
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="admin_page">
      <div className="admin_navbar">
        <h2>Панель администратора</h2>
        <button className="logout_btn" type="button" onClick={handleLogout}>
          ВЫЙТИ
        </button>
      </div>
      <div className="btn_container">
        <button
          className="admin_btn"
          type="button"
          onClick={() => {
            setShowPersonForm(!showPersonForm);
            setShowAdminForm(false);
            setShowPersons(false);
            setShowAdminsList(false);
            setShowCategories(false);
            setShowRegions(false);
          }}
        >
          Добавить Клиента
        </button>
        <button
          className="admin_btn"
          type="button"
          onClick={() => {
            setShowPersons(!showPersons);
            setShowAdminForm(false);
            setShowPersonForm(false);
            setShowAdminsList(false);
            setShowCategories(false);
            setShowRegions(false);
          }}
        >
          Показать список клиентов
        </button>
        {admin.isAdmin && (
          <button
            className="admin_btn"
            type="button"
            onClick={() => {
              setShowAdminForm(!showAdminForm);
              setShowPersonForm(false);
              setShowPersons(false);
              setShowAdminsList(false);
              setShowCategories(false);
              setShowRegions(false);
            }}
          >
            Добавить Админа
          </button>
        )}

        <button
          className="admin_btn"
          type="button"
          onClick={() => {
            setShowPersons(false);
            setShowAdminForm(false);
            setShowPersonForm(false);
            setShowAdminsList(!showAdminsList);
            setShowCategories(false);
            setShowRegions(false);
          }}
        >
          Показать список Администраторов
        </button>
      </div>
      <div className="btn_container">
        <button
          className="admin_btn"
          type="button"
          onClick={() => {
            setShowPersons(false);
            setShowAdminForm(false);
            setShowPersonForm(false);
            setShowAdminsList(false);
            setShowRegions(false);
            setShowCategories(!showCategories);
          }}
        >
          Показать список категорий
        </button>
        <button
          className="admin_btn"
          type="button"
          onClick={() => {
            setShowPersons(false);
            setShowAdminForm(false);
            setShowPersonForm(false);
            setShowAdminsList(false);
            setShowCategories(false);
            setShowRegions(!showRegions);
          }}
        >
          Показать список регионов
        </button>
      </div>
      {showPersonForm && <AddPersonForm />}
      {showAdminForm && <AddAdminForm />}
      {showPersons && <PersonsCardEdit />}
      {showAdminsList && <AdminsList />}
      {showCategories && <CategoriesList />}
      {showRegions && <RegionsList />}
      <ToastContainer />
    </div>
  );
}
