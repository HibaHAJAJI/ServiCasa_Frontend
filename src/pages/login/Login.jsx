import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight
} from "react-icons/fa";

import { loginSchema } from "../../validation/loginSchema";
import authService from "../../services/authService";
import { useAuth } from "../../context/auth/AuthContext";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      const response = await authService.login(data);

      login(response.token);

      const from = location.state?.from?.pathname || location.state?.from || "/dashboard";
      navigate(from);
    } catch (error) {
      setServerError("Email ou mot de passe incorrect.",error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-logo">
          <span>Servi</span>
          <span>Casa</span>
        </div>

        <h1>Connexion</h1>

        <p className="login-subtitle"> Connectez-vous pour accéder à votre espace.</p>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="form-group">
            <label>EMAIL</label>

            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />

              <input
                type="email"
                placeholder="Votre adresse email"
                {...register("email")}
              />
            </div>

            {errors.email && (
              <p className="error-message">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>MOT DE PASSE</label>

            <div className="input-wrapper">
              <FaLock className="input-icon" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                {...register("password")}
              />

              <button
                type="button"
                className="password-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errors.password && (
              <p className="error-message">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="server-error">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}

            {!loading && <FaArrowRight />}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Login;