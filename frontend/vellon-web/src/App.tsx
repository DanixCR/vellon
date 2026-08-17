import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/admin/PrivateRoute';
import AdminLayout from './components/admin/AdminLayout';
import PublicLayout from './components/layout/PublicLayout';

import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ActivitiesPage from './pages/public/ActivitiesPage';
import VolunteerPage from './pages/public/VolunteerPage';
import ContactPage from './pages/public/ContactPage';

import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import DashboardPage from './pages/admin/DashboardPage';
import ContactListPage from './pages/admin/contacts/ContactListPage';
import ContactDetailPage from './pages/admin/contacts/ContactDetailPage';
import ActivityListPage from './pages/admin/activities/ActivityListPage';
import ActivityFormPage from './pages/admin/activities/ActivityFormPage';
import SocioeconomicListPage from './pages/admin/socioeconomic/SocioeconomicListPage';
import SocioeconomicDetailPage from './pages/admin/socioeconomic/SocioeconomicDetailPage';
import SocioeconomicFormPage from './pages/admin/socioeconomic/SocioeconomicFormPage';
import VolunteerListPage from './pages/admin/volunteers/VolunteerListPage';
import VolunteerDetailPage from './pages/admin/volunteers/VolunteerDetailPage';
import ProjectListPage from './pages/admin/projects/ProjectListPage';
import ProjectDetailPage from './pages/admin/projects/ProjectDetailPage';
import ProjectFormPage from './pages/admin/projects/ProjectFormPage';
import UserListPage from './pages/admin/users/UserListPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/nosotros" element={<AboutPage />} />
            <Route path="/actividades" element={<ActivitiesPage />} />
            <Route path="/voluntariado" element={<VolunteerPage />} />
            <Route path="/contacto" element={<ContactPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route element={<PrivateRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />

              <Route path="/admin/contacts" element={<ContactListPage />} />
              <Route path="/admin/contacts/:id" element={<ContactDetailPage />} />

              <Route path="/admin/activities" element={<ActivityListPage />} />
              <Route path="/admin/activities/new" element={<ActivityFormPage />} />
              <Route path="/admin/activities/:id/edit" element={<ActivityFormPage />} />

              <Route path="/admin/socioeconomic" element={<SocioeconomicListPage />} />
              <Route path="/admin/socioeconomic/new" element={<SocioeconomicFormPage />} />
              <Route path="/admin/socioeconomic/:id" element={<SocioeconomicDetailPage />} />
              <Route path="/admin/socioeconomic/:id/edit" element={<SocioeconomicFormPage />} />

              <Route path="/admin/volunteers" element={<VolunteerListPage />} />
              <Route path="/admin/volunteers/:id" element={<VolunteerDetailPage />} />

              <Route path="/admin/projects" element={<ProjectListPage />} />
              <Route path="/admin/projects/new" element={<ProjectFormPage />} />
              <Route path="/admin/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/admin/projects/:id/edit" element={<ProjectFormPage />} />

              <Route path="/admin/users" element={<UserListPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
