import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { timeSlots } from "../localDB";

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [clientID, setClientID] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorID, setDoctorID] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState("");

  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!availableTimes.includes(time)) {
      alert("This time has already been reserved. Please select a new time.");
    } else {
      if (firstName && lastName && date && time) {
        const calculateEndTime = (baseTime, minutesToAdd) => {
          const [baseHours, baseMinutes] = baseTime.split(":").map(Number);

          const baseDate = new Date();
          baseDate.setHours(baseHours);
          baseDate.setMinutes(baseMinutes);

          const resultDate = new Date(
            baseDate.getTime() + minutesToAdd * 60000
          );

          const resultHours = resultDate.getHours().toString().padStart(2, "0");
          const resultMinutes = resultDate
            .getMinutes()
            .toString()
            .padStart(2, "0");

          return `${resultHours}:${resultMinutes}`;
        };

        const formData = {
          id: clientID.toString(),
          doctorId: +doctorID,
          date: date,
          startTime: time,
          endTime: calculateEndTime(time, 30),
          patientName: `${firstName} ${lastName}`,
        };

        try {
          const response = await fetch("http://localhost:3001/appointments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            console.log("Данные успешно отправлены на сервер.");
            setFirstName("");
            setLastName("");
            setTime("");
            fetchingDataFromServer();
          } else {
            console.error("Ошибка при отправке данных на сервер.");
          }
        } catch (error) {
          console.error(
            "Произошла ошибка при отправке данных на сервер:",
            error
          );
        }
      } else {
        alert("Fill in all required fields.");
      }
    }
  };

  const fetchingDataFromServer = useCallback(() => {
    fetch("http://localhost:3001/appointments")
      .then((res) => res.json())
      .then((data) => {
        let lastID = data[data.length - 1]["id"];
        setClientID(params.get("id") || +lastID + 1);

        let actualAppointments = data.filter(
          (appoint) =>
            appoint["doctorId"] === +doctorID && appoint["date"] === date
        );
        let slots = timeSlots;
        actualAppointments.forEach((appoint) => {
          slots = slots.filter((slot) => slot !== appoint["startTime"]);
        });
        setAvailableTimes(slots);
      });
  }, [params, setClientID, doctorID, date]);

  useEffect(() => {
    fetchingDataFromServer();
    setDoctorName(params.get("doctor"));
    setDoctorID(params.get("doctorId"));
    setDate(params.get("date") || "");
    setTime(params.get("startTime") || "");

    if (params.get("patient")) {
      const patient = params.get("patient").split(" ");
      setFirstName(patient[0]);
      setLastName(patient[1]);
    }
  }, [params, fetchingDataFromServer]);

  return (
    <section className="appointment-form">
      <form className="form" onSubmit={handleSubmit}>
        <div className="top-div">
          <Link to="/">
            <button type="button" className="back-btn">
              Home
            </button>
          </Link>
        </div>

        <label htmlFor="firstName">First name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={handleFirstNameChange}
          required
        />

        <label htmlFor="lastName">Last name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={handleLastNameChange}
          required
        />

        <label htmlFor="selectedTime">Doctor:</label>
        <input type="text" value={doctorName} disabled />

        <label htmlFor="selectedTime">Date:</label>
        <input type="text" value={date} disabled />

        <label htmlFor="selectedTime">Time:</label>
        <input
          type="time"
          id="selectedTime"
          name="selectedTime"
          value={time}
          onChange={handleTimeChange}
          min="09:00"
          max="18:00"
          step={1800}
          required
        />

        <button type="submit" className="create-appointment-btn">
          Create
        </button>
      </form>
    </section>
  );
};

export default AppointmentForm;
