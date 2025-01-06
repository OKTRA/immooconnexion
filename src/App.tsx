import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import PropertyUnits from "./pages/PropertyUnits";

const router = createBrowserRouter([
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
  }
]);

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}