import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/login/Login';
import RegisterSelection from '../pages/register/RegisterSelection';
import RegisterArtisan from '../pages/register/RegisterArtisan'; 
import RegisterClient from '../pages/register/RegisterClient';

import Dashboard from '../pages/dashboard/DashboardArtisan';
import NotFound from "../components/notFound/NotFound";

import AuthGuard from '../guards/AuthGuard'; 

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterSelection />} />
      <Route path="/register/client" element={<RegisterClient />} />
      <Route path="/register/artisan" element={<RegisterArtisan />} />

      <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;