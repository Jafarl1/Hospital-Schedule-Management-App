import React from "react";
import { Link } from "react-router-dom";

function AppointmentList({ doctors, appointments, timeSlots, selectedDate }) {
  return (
    <section className="appointment-list">
      <table border="1" className="appointment-table">
        <thead>
          <tr>
            <th></th>
            {doctors.map((doctor) => (
              <th key={doctor.id}>{doctor.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time) => (
            <tr key={time}>
              <td>{time}</td>
              {doctors.map((doctor) => (
                <td key={doctor.id} className="td-box">
                  {appointments.map((appoint) =>
                    appoint["date"] === selectedDate &&
                    appoint["startTime"] === time &&
                    appoint["doctorId"] === doctor.id ? (
                      <Link
                        key={appoint["id"]}
                        to={`appointment-form/?patient=${
                          appoint["patientName"]
                        }&id=${appoint["id"]}&doctorId=${doctor.id}&doctor=${
                          doctors.find((doc) => +doc.id === +doctor.id)["name"]
                        }&date=${selectedDate}&startTime=${time}`}
                      >
                        {appoint["patientName"]}
                      </Link>
                    ) : (
                      ""
                    )
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default AppointmentList;
