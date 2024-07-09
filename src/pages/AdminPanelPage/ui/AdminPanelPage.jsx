import React, { useEffect, useState, useCallback, useRef } from "react";
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
import { AddNetworkForm } from "../../../widgets/AddNetworkForm";
import { NetworksCardEdit } from "../../../shared/ui/NetworksCardEdit";

export function AdminPanelPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState(null);
  const admin = useSelector((state) => state.admin.admin);
  const loading = useSelector((state) => state.admin.status === "loading");

  const personFormRef = useRef(null);
  const adminFormRef = useRef(null);
  const personsRef = useRef(null);
  const adminsListRef = useRef(null);
  const categoriesRef = useRef(null);
  const regionsRef = useRef(null);
  const networkFormRef = useRef(null);
  const networksRef = useRef(null);

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

  const scrollToRef = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleButtonClick = (component, ref) => {
    setActiveComponent((prevComponent) =>
      prevComponent === component ? null : component
    );
    setTimeout(() => scrollToRef(ref), 0);
  };

  if (loading) {
    return (
      <div className="loader">
        <BarLoader />
      </div>
    );
  }

  if (!admin) {
    return navigate("/login");
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
          onClick={() => handleButtonClick("personForm", personFormRef)}
        >
          Добавить партнера
        </button>
        <button
          className="admin_btn"
          type="button"
          onClick={() => handleButtonClick("personsList", personsRef)}
        >
          Показать список партнеров
        </button>
        {admin.isAdmin && (
          <button
            className="admin_btn"
            type="button"
            onClick={() => handleButtonClick("adminForm", adminFormRef)}
          >
            Добавить Админа
          </button>
        )}
        <button
          className="admin_btn"
          type="button"
          onClick={() => handleButtonClick("adminsList", adminsListRef)}
        >
          Показать список Администраторов
        </button>
      </div>
      <div className="btn_container">
        <button
          className="admin_btn"
          type="button"
          onClick={() => handleButtonClick("categoriesList", categoriesRef)}
        >
          Показать список категорий
        </button>
        <button
          className="admin_btn"
          type="button"
          onClick={() => handleButtonClick("regionsList", regionsRef)}
        >
          Показать список регионов
        </button>
        <button
          className="admin_btn"
          type="button"
          onClick={() => handleButtonClick("networksList", networksRef)}
        >
          Показать список соцсетей
        </button>
      </div>
      {activeComponent === "personForm" && (
        <div ref={personFormRef}>
          <AddPersonForm />
        </div>
      )}
      {activeComponent === "adminForm" && (
        <div ref={adminFormRef}>
          <AddAdminForm />
        </div>
      )}
      {activeComponent === "personsList" && (
        <div ref={personsRef}>
          <PersonsCardEdit />
        </div>
      )}
      {activeComponent === "adminsList" && (
        <div ref={adminsListRef}>
          <AdminsList />
        </div>
      )}
      {activeComponent === "categoriesList" && (
        <div ref={categoriesRef}>
          <CategoriesList />
        </div>
      )}
      {activeComponent === "regionsList" && (
        <div ref={regionsRef}>
          <RegionsList />
        </div>
      )}
      {activeComponent === "networkForm" && (
        <div ref={networkFormRef}>
          <AddNetworkForm />
        </div>
      )}
      {activeComponent === "networksList" && (
        <div ref={networksRef}>
          <NetworksCardEdit />
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
