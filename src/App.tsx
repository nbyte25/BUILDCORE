import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { QuoteRequestPage } from './pages/QuoteRequestPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Customer Portal Pages
import { CustomerDashboardPage } from './pages/account/CustomerDashboardPage';
import { CustomerQuotesPage } from './pages/account/CustomerQuotesPage';
import { CustomerProfilePage } from './pages/account/CustomerProfilePage';

// Admin Portal Pages
import { AdminDashboardOverview } from './pages/admin/AdminDashboardOverview';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminQuotesPage } from './pages/admin/AdminQuotesPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';
import { AdminTeamPage } from './pages/admin/AdminTeamPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminSetupGuidePage } from './pages/admin/AdminSetupGuidePage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <SettingsProvider>
            <Routes>
              
              {/* 1. PUBLIC WEBSITE ROUTES (Inside PublicLayout with Navbar & Footer) */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:slug" element={<ServiceDetailPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                <Route path="/request-quote" element={<QuoteRequestPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
              </Route>

              {/* 2. AUTHENTICATION ROUTES */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* 3. CUSTOMER PORTAL ROUTES (Client RBAC) */}
              <Route
                path="/account"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'manager', 'admin']}>
                    <CustomerDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/quotes"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'manager', 'admin']}>
                    <CustomerQuotesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/profile"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'manager', 'admin']}>
                    <CustomerProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* 4. ADMIN & MANAGEMENT COMMAND ROUTES (Admin & Manager RBAC) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <AdminDashboardOverview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/projects"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <AdminProjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <AdminServicesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/quotes"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <AdminQuotesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <AdminMessagesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/testimonials"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <AdminTestimonialsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/team"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <AdminTeamPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blog"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <AdminBlogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminCustomersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/media"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <AdminMediaPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/setup-guide"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <AdminSetupGuidePage />
                  </ProtectedRoute>
                }
              />

              {/* 5. 404 CATCH-ALL */}
              <Route path="*" element={<NotFoundPage />} />

            </Routes>
          </SettingsProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
