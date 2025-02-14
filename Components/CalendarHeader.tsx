import React from 'react';

interface CalendarHeaderProps {
  currentDate: Date;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  toggleFullScreen: () => void;
  isFullScreen: boolean;
  months: string[];
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  handlePrevMonth,
  handleNextMonth,
  toggleFullScreen,
  isFullScreen,
  months,
}) => {
  return (
    <div className="calendar-header">
      <button onClick={handlePrevMonth}>Prev</button>
      <h2>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
      <button onClick={handleNextMonth}>Next</button>
      <button onClick={toggleFullScreen}>
        {isFullScreen ? '−' : '⛶'}
      </button>
    </div>
  );
};

export default CalendarHeader;