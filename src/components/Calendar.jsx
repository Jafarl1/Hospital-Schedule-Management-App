import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function MyCalendar({ setSelectedDate, formatDate }) {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
    setSelectedDate(formatDate(newDate));
  };

  const tileDisabled = ({ date }) => {
    return date.getDate() > 9 || date.getDate() < 7;
    // in the real project I'll use here new Date().getDate(),
    // but here I use just 7 because of small range of dates.
  };

  return (
    <div>
      <Calendar onChange={onChange} value={date} tileDisabled={tileDisabled} />
    </div>
  );
}

export default MyCalendar;
