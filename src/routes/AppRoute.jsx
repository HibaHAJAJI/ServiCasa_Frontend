import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/login/Login';
import RegisterSelection from '../pages/register/RegisterSelection';
import RegisterArtisan from '../pages/register/RegisterArtisan';
import RegisterClient from '../pages/register/RegisterClient';

import Dashboard from '../pages/dashboard/DashboardArtisan';
import DashboardAdmin from '@/pages/dashboard/DashboardAdmin';
import DashboardClient from '@/pages/dashboard/DashboardClient';

import DemandesArtisan from '@/pages/artisans/DemandesArtisan';
import InterventionsArtisan from '@/pages/artisans/InterventionsArtisan';
import AvisArtisan from '@/pages/artisans/AvisArtisan';
import Profile from '@/pages/profile/Profile';
import MesReservations from '@/pages/client/MesReservations';
import NotFound from "../components/notFound/NotFound";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Home from '@/pages/Home';
import Artisans from '@/pages/artisans/Artisans';
import ArtisanProfile from '@/pages/artisans/ArtisanProfile';

import AuthGuard from '../guards/AuthGuard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/artisans" element={<Artisans />} />
      <Route path="/artisans/:id" element={<ArtisanProfile />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterSelection />} />
      <Route path="/register/client" element={<RegisterClient />} />
      <Route path="/register/artisan" element={<RegisterArtisan />} />

      <Route element={<AuthGuard />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/artisan" element={<Dashboard />} />
          <Route path="/artisan/demandes" element={<DemandesArtisan />} />
          <Route path="/artisan/interventions" element={<InterventionsArtisan />} />
          <Route path="/artisan/avis" element={<AvisArtisan />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/dashboard/admin" element={<DashboardAdmin />} />

          <Route path="/client/dashboard" element={<DashboardClient />} />
          <Route
            path="/dashboard/client"
            element={<Navigate to="/client/dashboard" replace />}
          />
          <Route path="/client/reservations" element={<MesReservations />} />
          <Route path="/client/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
