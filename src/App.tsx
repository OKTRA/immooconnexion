import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import AgencyDashboard from "./pages/AgencyDashboard";
import AgencySettings from "./pages/AgencySettings";
import ApartmentDetails from "./pages/ApartmentDetails";
import ApartmentUnitForm from "./pages/ApartmentUnitForm";
import ApartmentUnits from "./pages/ApartmentUnits";
import Apartments from "./pages/Apartments";
import Expenses from "./pages/Expenses";
import Pricing from "./pages/Pricing";
import PropertySales from "./pages/PropertySales";
import Reports from "./pages/Reports";
import SubscriptionUpgrade from "./pages/SubscriptionUpgrade";
import TenantContracts from "./pages/TenantContracts";
import Tenants from "./pages/Tenants";
import TermsOfService from "./pages/TermsOfService";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminAgencies from "./pages/SuperAdminAgencies";
import SuperAdminUsers from "./pages/SuperAdminUsers";
import SuperAdminSettings from "./pages/SuperAdminSettings";

const router = createBrowserRouter([
  // Public pages
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/tarifs",
    element: <Pricing />,
  },
  {
    path: "/conditions-utilisation",
    element: <TermsOfService />,
  },

  // Authentication pages
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/super-admin/login",
    element: <SuperAdminLogin />,
  },

  // Agency dashboard and management
  {
    path: "/agence",
    element: <AgencyDashboard />,
  },
  {
    path: "/agence/parametres",
    element: <AgencySettings />,
  },
  {
    path: "/agence/appartements",
    element: <Apartments />,
  },
  {
    path: "/agence/appartements/:id",
    element: <ApartmentDetails />,
  },
  {
    path: "/agence/appartements/:id/unites",
    element: <ApartmentUnits />,
  },
  {
    path: "/agence/appartements/:id/unites/nouveau",
    element: <ApartmentUnitForm />,
  },
  {
    path: "/agence/depenses",
    element: <Expenses />,
  },
  {
    path: "/agence/ventes",
    element: <PropertySales />,
  },
  {
    path: "/agence/rapports",
    element: <Reports />,
  },
  {
    path: "/agence/abonnement",
    element: <SubscriptionUpgrade />,
  },

  // Tenant management
  {
    path: "/agence/locataires",
    element: <Tenants />,
  },
  {
    path: "/agence/locataires/:id/contrats",
    element: <TenantContracts />,
  },

  // Super Admin dashboard
  {
    path: "/super-admin",
    element: <SuperAdminDashboard />,
  },
  {
    path: "/super-admin/agences",
    element: <SuperAdminAgencies />,
  },
  {
    path: "/super-admin/utilisateurs",
    element: <SuperAdminUsers />,
  },
  {
    path: "/super-admin/parametres",
    element: <SuperAdminSettings />,
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}