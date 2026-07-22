import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import ReservaPage from "../pages/ReservaPage.jsx";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reservar" element={<ReservaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;