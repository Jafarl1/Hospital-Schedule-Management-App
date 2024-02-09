import React from "react";

function DoctorsList({ doctors, setSelectedDoctor }) {
  const selectDoctorName = (e) => {
    let doctor = doctors.find((doctor) => doctor["name"] === e.target.value);
    setSelectedDoctor(doctor);
  };

  return (
    <select name="doctors-list" id="doctors-list" onChange={selectDoctorName}>
      {doctors.map((doctor) => (
        <option value={doctor.name} key={doctor.id}>
          {doctor.name}
        </option>
      ))}
    </select>
  );
}

export default DoctorsList;
