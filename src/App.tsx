import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Apartments from "@/pages/Apartments";
import ApartmentUnits from "@/pages/ApartmentUnits";
import UnitDetails from "@/pages/UnitDetails"; // Import the new UnitDetails component
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/agence/appartements" element={<Apartments />} />
        <Route path="/agence/appartement/:id" element={<ApartmentUnits />} />
        <Route path="/agence/unite/:id" element={<UnitDetails />} /> {/* New route for unit details */}
      </Routes>
    </Router>
  );
}

export default App;
