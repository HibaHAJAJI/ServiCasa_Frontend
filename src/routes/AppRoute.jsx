import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login/Login';

const AppRoutes = () => {
  return (
    <Routes>
     
      <Route path="/login" element={<Login />} />
 
      <Route path="/" element={<Navigate to="/login" replace />} />
    
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;