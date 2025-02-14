import React, { useState } from 'react';
import { nanoid } from 'nanoid';

interface CalendarItem {
  uniqueId: string;
  content: string;
}

interface CalendarDaysProps {
  currentDate: Date;
  daysOfWeek: string[];
  calendarItems: Record<number, CalendarItem[]>;
  handleDrop: (day: number) => void;
  handleDragStart: (item: CalendarItem | string) => void;
  handleDelete: (day: number, uniqueId: string) => void;
  selectedDate: number | null;
  setSelectedDate: (day: number | null) => void;
}

const CalendarDays: React.FC<CalendarDaysProps> = ({
  currentDate,
  daysOfWeek,
  calendarItems,
  handleDrop,
  handleDragStart,
  handleDelete,
  selectedDate,
  setSelectedDate,
}) => {
  const [draggedItem, setDraggedItem] = useState<CalendarItem | null>(null);

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderDays = (): JSX.Element[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days: JSX.Element[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className={`calendar-day ${selectedDate === day ? 'selected' : ''}`}
          onClick={() => setSelectedDate(day)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(day)}
        >
          <div className="date-number">{day}</div>
          <div className="calendar-items">
            {calendarItems[day]?.map((item) => (
              <div
                key={item.uniqueId}
                className="calendar-item"
                draggable
                onDragStart={() => handleDragStartLocal(item)}
                onClick={(e) => e.stopPropagation()} // Prevents navigation to detailed view
              >
                {item.content}
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents navigation to detailed view
                    handleDelete(day, item.uniqueId);
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const handleDragStartLocal = (item: CalendarItem) => {
    setDraggedItem(item);
    handleDragStart(item);
  };

  return (
    <div className="calendar-days">
      {daysOfWeek.map((day, index) => (
        <div key={index} className="calendar-day-header">{day}</div>
      ))}
      {renderDays()}
    </div>
  );
};

export default CalendarDays;
