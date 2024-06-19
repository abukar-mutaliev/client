import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./loginPage.scss";
import {
  loginAdmin,
  logoutAdmin,
} from "../../../app/providers/StoreProvider/adminSlice";

export function LoginPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail, isAdmin] = useState("");

  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.admin);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAdmin({ email, password }));
  };

  useEffect(() => {
    if (status === "succeeded") {
      navigate("/admin");
    }
  }, [status, navigate]);

  return (
    <div className="login_page">
      <h1>Авторизуйся</h1>
      <div className="login_input">
        <form className="login_input" onSubmit={handleSubmit}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete="current-password"
          />
          <button type="submit">ВОЙТИ</button>
        </form>
        {status === "failed" && error && (
          <h3 className="error-message">Ошибка авторизации</h3>
        )}
        {isAdmin && (
          <button type="button" onClick={logoutAdmin}>
            ВЫЙТИ
          </button>
        )}
      </div>
    </div>
  );
}
