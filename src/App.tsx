import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Apartments from "@/pages/Apartments";
import ApartmentUnits from "@/pages/ApartmentUnits";
import UnitDetails from "@/pages/UnitDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/agence/appartements" element={<Apartments />} />
        <Route path="/agence/appartement/:id" element={<ApartmentUnits />} />
        <Route path="/agence/unite/:id" element={<UnitDetails />} />
      </Routes>
    </Router>
  );
}

export default App;