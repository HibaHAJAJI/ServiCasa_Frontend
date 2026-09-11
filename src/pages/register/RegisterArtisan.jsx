import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { artisanSchema } from '../../validation/artisanSchema';
import authService from '../../services/authService';
import { 
  FaUser, 
  FaPhone, 
  FaCity, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaWrench, 
  FaBriefcase, 
  FaMoneyBillWave, 
  FaMapMarkerAlt, 
  FaArrowRight 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './RegisterArtisan.css';

const RegisterArtisan = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(artisanSchema),
    mode: 'onTouched'
  });

  const onSubmit = async (data) => {
    setApiError('');

    const payload = {
      ...data,
      anneesExperience: data.anneesExperience ? Number(data.anneesExperience) : 0,
      tarifHoraire: data.tarifHoraire ? parseFloat(data.tarifHoraire) : 0.0
    };

    try {
      await authService.RegisterArtisan(payload);
      navigate('/login');
    } catch (err) {
      console.error("Erreur backend:", err.response);

      const responseData = err.response?.data;

      if (typeof responseData === 'string') {
        setApiError(responseData);
      } else if (responseData?.message) {
        setApiError(responseData.message);
      } else if (responseData?.errors && typeof responseData.errors === 'object') {
        const firstKey = Object.keys(responseData.errors)[0];
        setApiError(responseData.errors[firstKey]);
      } else {
        setApiError("Une erreur est survenue lors de l'inscription.");
      }
    }
  };

  return (
    <div className="artisan-container">
      <div className="artisan-card">
        <div className="artisan-header">
          <h1>Créer votre compte Artisan</h1>
          <p>Remplissez le formulaire pour rejoindre ServiCasa.</p>
        </div>

        {apiError && <div className="error-message-box">{apiError}</div>}

        <form className="artisan-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Nom</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" size={14} />
                <input type="text" {...register('nom')} className={errors.nom ? 'input-error' : ''} />
              </div>
              {errors.nom && <span className="error-text">{errors.nom.message}</span>}
            </div>

            <div className="form-group">
              <label>Prénom</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" size={14} />
                <input type="text" {...register('prenom')} className={errors.prenom ? 'input-error' : ''} />
              </div>
              {errors.prenom && <span className="error-text">{errors.prenom.message}</span>}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Téléphone</label>
              <div className="input-wrapper">
                <FaPhone className="input-icon" size={14} />
                <input type="tel" {...register('telephone')} className={errors.telephone ? 'input-error' : ''} />
              </div>
              {errors.telephone && <span className="error-text">{errors.telephone.message}</span>}
            </div>

            <div className="form-group">
              <label>Ville</label>
              <div className="input-wrapper">
                <FaCity className="input-icon" size={14} />
                <input type="text" {...register('ville')} className={errors.ville ? 'input-error' : ''} />
              </div>
              {errors.ville && <span className="error-text">{errors.ville.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Adresse email</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" size={14} />
              <input type="email" {...register('email')} className={errors.email ? 'input-error' : ''} />
            </div>
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" size={14} />
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
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Spécialité</label>
              <div className="input-wrapper">
                <FaWrench className="input-icon" size={14} />
                <input type="text" {...register('specialite')} className={errors.specialite ? 'input-error' : ''} />
              </div>
              {errors.specialite && <span className="error-text">{errors.specialite.message}</span>}
            </div>

            <div className="form-group">
              <label>Années d'expérience</label>
              <div className="input-wrapper">
                <FaBriefcase className="input-icon" size={14} />
                <input type="number" {...register('anneesExperience')} className={errors.anneesExperience ? 'input-error' : ''} />
              </div>
              {errors.anneesExperience && <span className="error-text">{errors.anneesExperience.message}</span>}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Tarif horaire (DH)</label>
              <div className="input-wrapper">
                <FaMoneyBillWave className="input-icon" size={14} />
                <input type="number" step="0.01" {...register('tarifHoraire')} className={errors.tarifHoraire ? 'input-error' : ''} />
              </div>
              {errors.tarifHoraire && <span className="error-text">{errors.tarifHoraire.message}</span>}
            </div>

            <div className="form-group">
              <label>Zone d'intervention</label>
              <div className="input-wrapper">
                <FaMapMarkerAlt className="input-icon" size={14} />
                <input type="text" {...register('zoneIntervention')} className={errors.zoneIntervention ? 'input-error' : ''} />
              </div>
              {errors.zoneIntervention && <span className="error-text">{errors.zoneIntervention.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea rows="3" {...register('description')} className={errors.description ? 'input-error' : ''}></textarea>
            {errors.description && <span className="error-text">{errors.description.message}</span>}
          </div>

          <button type="submit" className="submit-artisan-btn">
            <span>S'inscrire</span>
            <FaArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterArtisan;