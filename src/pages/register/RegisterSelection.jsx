import { FaUser, FaBriefcase, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './RegisterSelection.css';

const RegisterSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Créer un compte</h1>
          <p>Comment souhaitez-vous utiliser ServiCasa ?</p>
        </div>

        <div className="roles-grid">
          <div className="role-card">
            <div className="role-icon-wrapper">
              <FaUser className="role-icon" size={20} />
            </div>
            <span className="role-badge badge-client">Particulier</span>
            <h2 className="role-title">Client</h2>
            <p className="role-description">
              Je cherche un artisan pour mes travaux et services à domicile.
            </p>
            <button
              className="role-btn"
              onClick={() => navigate('/register/client')}
            >
              <span>Créer un compte Client</span>
              <FaChevronRight size={14} />
            </button>
          </div>

          <div className="role-card">
            <div className="role-icon-wrapper">
              <FaBriefcase className="role-icon" size={20} />
            </div>
            <span className="role-badge badge-artisan">Professionnel certifié</span>
            <h2 className="role-title">Artisan</h2>
            <p className="role-description">
              Je propose mes services professionnels aux particuliers.
            </p>
            <button
              className="role-btn"
              onClick={() => navigate('/register/artisan')}
            >
              <span>Devenir Artisan</span>
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="card-footer">
          <p>
            Déjà un compte ? <a href="/login">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSelection;