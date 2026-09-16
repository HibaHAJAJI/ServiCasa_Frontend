import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/login/Login';
import RegisterSelection from '../pages/register/RegisterSelection';
import RegisterArtisan from '../pages/register/RegisterArtisan'; 
import RegisterClient from '../pages/register/RegisterClient';

import Dashboard from '../pages/dashboard/DashboardArtisan';
import Profile from '@/pages/profile/Profile';
import NotFound from "../components/notFound/NotFound";
import DashboardLayout from '../components/DashboardLayout ';

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
       <Route element={<DashboardLayout />}>
          <Route path="/artisan/dashboard" element={<Dashboard />} />
          <Route path="/artisan/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;