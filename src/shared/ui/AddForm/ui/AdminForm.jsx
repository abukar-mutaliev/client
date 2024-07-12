import React, { useState } from "react";
import PropTypes from "prop-types";
import checkbox from "../../../assets/icons/checkbox.svg";

export const AdminForm = React.memo(({ onSubmit, showSuccessMessage }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminData = { username, email, password, isAdmin };
    try {
      await onSubmit(adminData);
      setErrors({});
      setUsername("");
      setEmail("");
      setPassword("");
      setIsAdmin(true);
    } catch (err) {
      setErrors(err);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2>Добавление Админа</h2>
      <div className="form-group">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Имя админа"
          required
        />
        {errors.username && <p className="error-message">{errors.username}</p>}
      </div>
      <div className="form-group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
      </div>
      <div className="form-group">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
      </div>
      <label className="checkbox-label" htmlFor="isAdmin">
        <input
          type="checkbox"
          id="isAdmin"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />
        <div className="custom-checkbox">
          <img alt="icon" src={checkbox} />
        </div>
        <p>Возможность удалять админов</p>
      </label>

      <button type="submit">Добавить</button>
      {showSuccessMessage && <p className="success-message">Админ добавлен</p>}
    </form>
  );
});

AdminForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  showSuccessMessage: PropTypes.bool.isRequired,
};
