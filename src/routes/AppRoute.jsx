import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/login/Login';
import RegisterSelection from '../pages/register/RegisterSelection';
import RegisterArtisan from '../pages/register/RegisterArtisan';
import RegisterClient from '../pages/register/RegisterClient';

import Dashboard from '../pages/dashboard/DashboardArtisan';
import DashboardAdmin from '@/pages/dashboard/DashboardAdmin';

import DemandesArtisan from '@/artisans/DemandesArtisan';
import Profile from '@/pages/profile/Profile';
import NotFound from "../components/notFound/NotFound";
import DashboardLayout from "../components/DashboardLayout ";

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
          <Route path="/dashboard/artisan" element={<Dashboard />} />
         <Route path="/dashboard/admin" element={<DashboardAdmin />} />
          <Route path="/artisan/demandes" element={<DemandesArtisan />}/>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;