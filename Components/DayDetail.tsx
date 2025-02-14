import React, { useState } from 'react';
import { nanoid } from 'nanoid';

interface CalendarItem {
  uniqueId: string;
  content: string;
}

interface DayDetailProps {
  day: number;
  currentDate: Date;
  calendarItems: Record<number, CalendarItem[]>;
  handleDragStart: (item: CalendarItem | string) => void;
  handleDelete: (day: number, uniqueId: string) => void;
  setSelectedDate: (day: number | null) => void;
  months: string[];
}

const DayDetail: React.FC<DayDetailProps> = ({
  day,
  currentDate,
  calendarItems,
  handleDragStart,
  handleDelete,
  setSelectedDate,
  months,
}) => {
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const [itemsByTimeSlot, setItemsByTimeSlot] = useState<Record<string, CalendarItem[]>>({});
  const [draggedItem, setDraggedItem] = useState<CalendarItem | null>(null);

  const handleDrop = (timeSlot: string) => {
    if (draggedItem) {
      const newItem = {
        ...draggedItem,
        uniqueId: nanoid(),
      };
      setItemsByTimeSlot((prevItems) => {
        const newItems = { ...prevItems };
        if (!newItems[timeSlot]) newItems[timeSlot] = [];
        newItems[timeSlot].push(newItem);
        return newItems;
      });
      setDraggedItem(null);
    }
  };

  const handleDragStartLocal = (item: CalendarItem) => {
    setDraggedItem(item);
    handleDragStart(item);
  };

  return (
    <div className="day-detail">
      <button className="back-button" onClick={() => setSelectedDate(null)}>Back</button>
      <h2>{months[currentDate.getMonth()]} {day}, {currentDate.getFullYear()}</h2>
      <div className="day-schedule">
        <div className="time-slots">
          {timeSlots.map((time, index) => (
            <div key={index} className="time-slot">{time}</div>
          ))}
        </div>
        <div className="events">
          {timeSlots.map((time, index) => (
            <div
              key={index}
              className="event-slot"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(time)}
            >
              {itemsByTimeSlot[time]?.map((item) => (
                <div
                  key={item.uniqueId}
                  className="calendar-item"
                  draggable
                  onDragStart={() => handleDragStartLocal(item)}
                >
                  {item.content}
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(day, item.uniqueId)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayDetail;