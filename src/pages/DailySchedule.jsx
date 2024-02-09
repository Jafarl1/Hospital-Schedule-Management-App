import React, { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import DoctorsList from "../components/DoctorsList";
import AppointmentList from "../components/AppointmentList";
import { doctors, timeSlots } from "../localDB";
import { Link } from "react-router-dom";

function DailySchedule() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  useEffect(() => {
    fetch("http://localhost:3001/appointments")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setAppointments(data))
      .catch((error) => {
        console.error("Error receiving data:", error);
      });

    setSelectedDate(formatDate(new Date()));
  }, []);

  useEffect(() => {
    if (doctors.length > 0) {
      setSelectedDoctor(doctors[0]);
    }
  }, []);

  return (
    <section className="daily-schedule">
      <aside className="main-panel">
        <p>Select the date to view the appointments table.</p>
        <Calendar setSelectedDate={setSelectedDate} formatDate={formatDate} />
        <p>Select the name of the doctor to view the appointments table.</p>
        <DoctorsList doctors={doctors} setSelectedDoctor={setSelectedDoctor} />
        <Link
          to={`/appointment-form?date=${selectedDate}&doctor=${selectedDoctor["name"]}&doctorId=${selectedDoctor["id"]}`}
        >
          <button className="create-appointment-btn">
            Create an appointment
          </button>
        </Link>
      </aside>
      <AppointmentList
        doctors={doctors}
        appointments={appointments}
        timeSlots={timeSlots}
        selectedDate={selectedDate}
      />
    </section>
  );
}

export default DailySchedule;
