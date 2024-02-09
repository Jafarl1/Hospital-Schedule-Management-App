import React from "react";
import { Routes, Route } from "react-router-dom";

import DailySchedule from "./pages/DailySchedule";
import AppointmentForm from "./pages/AppointmentForm";

function App() {
  return (
    <div className="app">
      <header className="main-header">
        <h1>Hospital Schedule Management</h1>
      </header>
      <Routes>
        <Route path="/" element={<DailySchedule />} />
        <Route path="/appointment-form" element={<AppointmentForm />} />
      </Routes>
    </div>
  );
}

export default App;
