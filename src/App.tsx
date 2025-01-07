import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import TermsOfService from "./pages/TermsOfService";
import PublicProperties from "./pages/PublicProperties";

// Agency pages
import AgencyDashboard from "./pages/AgencyDashboard";
import AgencySettings from "./pages/AgencySettings";
import AgencyEarnings from "./pages/AgencyEarnings";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import PropertyUnits from "./pages/PropertyUnits";
import PropertyUnitForm from "./pages/PropertyUnitForm";
import Expenses from "./pages/Expenses";
import PropertySales from "./pages/PropertySales";
import Reports from "./pages/Reports";
import SubscriptionUpgrade from "./pages/SubscriptionUpgrade";

// Tenant pages
import Tenants from "./pages/Tenants";
import TenantContracts from "./pages/TenantContracts";

// Super Admin pages
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminAgencies from "./pages/SuperAdminAgencies";
import SuperAdminUsers from "./pages/SuperAdminUsers";
import SuperAdminSettings from "./pages/SuperAdminSettings";
import SuperAdminLogin from "./pages/SuperAdminLogin";

const router = createBrowserRouter([
  // Public pages
  {
    path: "/",
    element: <PublicProperties />,
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
    path: "/agence/revenus",
    element: <AgencyEarnings />,
  },
  {
    path: "/agence/proprietes",
    element: <Properties />,
  },
  {
    path: "/agence/proprietes/:id",
    element: <PropertyDetails />,
  },
  {
    path: "/agence/proprietes/:id/unites",
    element: <PropertyUnits />,
  },
  {
    path: "/agence/proprietes/:id/unites/nouveau",
    element: <PropertyUnitForm />,
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