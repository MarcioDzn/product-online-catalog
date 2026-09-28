
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import './index.css'
import ProductListPage from './pages/ProductListPage.tsx';
import Navbar from './components/navbar/Navbar.tsx';
import { StrictMode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/QueryClient.ts';
import AppLayout from './components/layout/AppLayout.tsx';
import AdminDashboardPage from './pages/AdminDashboardPage.tsx';
import SearchNavbar from './components/navbar/SearchNavbar.tsx';
import ActionNavbar from './components/navbar/ActionNavbar.tsx';
import PageActionProviderLayout from './components/layouts/PageActionProviderLayout.tsx';
import ProductFormPage from './pages/ProductFormPage.tsx';
import { Toaster } from 'react-hot-toast';
import ProductPage from './pages/ProductPage.tsx';
import AdminAuthPage from './pages/AdminAuthPage.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AdminRegisterPage from './pages/AdminRegisterPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
            <Toaster position="bottom-right" />

            <Routes>
              <Route path="/" element={<Navigate to="/products" replace />} />

              <Route element={<SearchNavbar />}>
                <Route element={<AppLayout />}>
                  <Route
                    path="/products"
                    element={<ProductListPage />}
                  />
                  <Route
                    path="/products/:id"
                    element={<ProductPage />}
                  />
                </Route>
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route element={<Navbar />}>
                  <Route element={<AppLayout />}>
                    <Route
                      path="/admin/products"
                      element={<AdminDashboardPage />}
                    />
                  </Route>        
                </Route>
                <Route element={<PageActionProviderLayout />}>
                  <Route element={<ActionNavbar />}>
                    <Route element={<AppLayout />}>
                      <Route
                        path="/admin/products/new"
                        element={<ProductFormPage />}
                      />
                      <Route
                        path="/admin/products/:id"
                        element={<ProductFormPage />}
                      />
                    </Route>        
                  </Route>
                </Route>
              </Route>
              <Route element={<AppLayout />}>
                <Route
                  path="/admin"
                  element={<AdminAuthPage />}
                />

                <Route
                  path="/register"
                  element={<AdminRegisterPage />}
                />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
  
)
