import React from 'react';

function Calendar({ view }) {
  const renderCalendar = () => {
    if (view === 'weekly') {
      return (
        <div className="calendar-grid weekly">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div className="calendar-cell" key={day}>
              <h3>{day}</h3>
              <div className="recommendation">No data</div>
            </div>
          ))}
        </div>
      );
    } else if (view === 'monthly') {
      return (
        <div className="calendar-grid monthly">
          {Array.from({ length: 30 }, (_, i) => (
            <div className="calendar-cell" key={i}>
              <h3>{i + 1}</h3>
              <div className="recommendation">No data</div>
            </div>
          ))}
        </div>
      );
    }
  };

  return <div className="calendar-container">{renderCalendar()}</div>;
}

export default Calendar;
