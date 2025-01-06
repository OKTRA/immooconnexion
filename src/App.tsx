import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import PropertyUnits from "./pages/PropertyUnits";
import AdminDashboard from "./pages/AdminDashboard";
import AgencyDashboard from "./pages/AgencyDashboard";
import AgencySettings from "./pages/AgencySettings";
import ApartmentDetails from "./pages/ApartmentDetails";
import ApartmentUnitForm from "./pages/ApartmentUnitForm";
import ApartmentUnits from "./pages/ApartmentUnits";
import Apartments from "./pages/Apartments";
import Expenses from "./pages/Expenses";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import PropertySales from "./pages/PropertySales";
import PropertyUnitForm from "./pages/PropertyUnitForm";
import PublicProperties from "./pages/PublicProperties";
import Reports from "./pages/Reports";
import SubscriptionUpgrade from "./pages/SubscriptionUpgrade";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import TenantContracts from "./pages/TenantContracts";
import Tenants from "./pages/Tenants";
import TermsOfService from "./pages/TermsOfService";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/properties",
    element: <Properties />,
  },
  {
    path: "/properties/:id",
    element: <PropertyDetails />,
  },
  {
    path: "/properties/:id/units",
    element: <PropertyUnits />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/agence",
    element: <AgencyDashboard />,
  },
  {
    path: "/agence/parametres",
    element: <AgencySettings />,
  },
  {
    path: "/agence/appartements/:id",
    element: <ApartmentDetails />,
  },
  {
    path: "/agence/appartements/:id/unites/nouveau",
    element: <ApartmentUnitForm />,
  },
  {
    path: "/agence/appartements/:id/unites",
    element: <ApartmentUnits />,
  },
  {
    path: "/agence/appartements",
    element: <Apartments />,
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
  {
    path: "/agence/locataires",
    element: <Tenants />,
  },
  {
    path: "/agence/locataires/:id/contrats",
    element: <TenantContracts />,
  },
  {
    path: "/admin/login",
    element: <SuperAdminLogin />,
  },
  {
    path: "/biens",
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
  {
    path: "/properties/:id/units/new",
    element: <PropertyUnitForm />,
  }
]);

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}