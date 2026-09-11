import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,  
  FaArrowRight 
} from 'react-icons/fa';
import { loginSchema } from '../../validation/loginSchema';
import authService from '../../services/authService';
import './Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);

    try {
      await authService.login(data);
      alert('Connexion réussie !');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setServerError('Email ou mot de passe incorrect.');
      } else {
        setServerError('Une erreur est survenue lors de la connexion.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
          <div className="login-header">
            <h2 className="brand-name">
              <span className="brand-servi">Servi</span>
              <span className="brand-casa">Casa</span>
            </h2>
            <p className="brand-subtext">DES ARTISANS POUR VOTRE MAISON</p>
          </div>

        <div className="title-section">
          <h1>Connexion</h1>
          <p>Connectez-vous pour accéder à votre espace.</p>
        </div>

        {serverError && <div className="error-message">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" size={16} />
              <input
                type="email"
                id="email"
                placeholder="Votre adresse email"
                {...register('email')}
              />
            </div>
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">MOT DE PASSE</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Votre mot de passe"
                {...register('password')}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          <div className="form-options">

            <a href="#forgot" className="forgot-password">
              Mot de passe oublié ?
            </a>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            <span>{loading ? 'Connexion...' : 'Se connecter'}</span>
            <FaArrowRight size={16} />
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Login;