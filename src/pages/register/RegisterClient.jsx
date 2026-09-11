import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { clientSchema } from '../../validation/clientSchema';
import authService from '../../services/authService';
import { 
  FaUser, 
  FaPhone, 
  FaCity, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaHome,
  FaArrowRight 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './RegisterClient.css';

const RegisterClient = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(clientSchema),
    mode: 'onTouched'
  });

  const onSubmit = async (data) => {
    try {
      await authService.RegisterClient(data);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="client-container">
      <div className="client-card">
        <div className="client-header">
          <h1>Créer votre compte Client</h1>
          <p>Remplissez le formulaire pour rejoindre ServiCasa.</p>
        </div>

        <form className="client-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Nom</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" size={15} />
                <input 
                  type="text" 
                  {...register('nom')}
                  className={errors.nom ? 'input-error' : ''}
                />
              </div>
              {errors.nom && <span className="error-text">{errors.nom.message}</span>}
            </div>

            <div className="form-group">
              <label>Prénom</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" size={15} />
                <input 
                  type="text" 
                  {...register('prenom')}
                  className={errors.prenom ? 'input-error' : ''}
                />
              </div>
              {errors.prenom && <span className="error-text">{errors.prenom.message}</span>}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Téléphone</label>
              <div className="input-wrapper">
                <FaPhone className="input-icon" size={15} />
                <input 
                  type="tel" 
                  {...register('telephone')}
                  className={errors.telephone ? 'input-error' : ''}
                />
              </div>
              {errors.telephone && <span className="error-text">{errors.telephone.message}</span>}
            </div>

            <div className="form-group">
              <label>Ville</label>
              <div className="input-wrapper">
                <FaCity className="input-icon" size={15} />
                <input 
                  type="text" 
                  {...register('ville')}
                  className={errors.ville ? 'input-error' : ''}
                />
              </div>
              {errors.ville && <span className="error-text">{errors.ville.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Adresse</label>
            <div className="input-wrapper">
              <FaHome className="input-icon" size={15} />
              <input 
                type="text" 
                {...register('adresse')}
                className={errors.adresse ? 'input-error' : ''}
              />
            </div>
            {errors.adresse && <span className="error-text">{errors.adresse.message}</span>}
          </div>

          <div className="form-group">
            <label>Adresse email</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" size={15} />
              <input 
                type="email" 
                {...register('email')}
                className={errors.email ? 'input-error' : ''}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" size={15} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                {...register('password')}
                className={errors.password ? 'input-error' : ''}
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <button type="submit" className="submit-client-btn">
            <span>S'inscrire</span>
            <FaArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterClient;