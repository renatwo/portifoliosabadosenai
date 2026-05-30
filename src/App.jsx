import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router>
      <div className="app-viewport">
        <Routes>
          {/* Rota pública do portfólio */}
          <Route path="/" element={<Home />} />
          
          {/* Rota do painel administrativo */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
