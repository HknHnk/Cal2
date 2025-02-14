import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import './DayDetail.css'; // Import the CSS file

interface CalendarItem {
  uniqueId: string;
  content: string;
}

interface DayDetailProps {
  day: number;
  currentDate: Date;
  calendarItems: Record<string, Record<number, CalendarItem[]>>;
  handleDragStart: (item: CalendarItem | string) => void;
  handleDelete: (day: number, uniqueId: string) => void;
  setSelectedDate: (day: number | null) => void;
  months: string[];
  setCalendarItems: React.Dispatch<React.SetStateAction<Record<string, Record<number, CalendarItem[]>>>>; // Add this prop
}

const DayDetail: React.FC<DayDetailProps> = ({
  day,
  currentDate,
  calendarItems,
  handleDragStart,
  handleDelete,
  setSelectedDate,
  months,
  setCalendarItems, // Add this prop
}) => {
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const [itemsByTimeSlot, setItemsByTimeSlot] = useState<Record<string, CalendarItem[]>>({});
  const [showModal, setShowModal] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<string | null>(null);
  const [newItemContent, setNewItemContent] = useState('');

  useEffect(() => {
    // Initialize itemsByTimeSlot with calendarItems for the selected day
    const initialItemsByTimeSlot: Record<string, CalendarItem[]> = {};
    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    if (calendarItems[monthKey] && calendarItems[monthKey][day]) {
      calendarItems[monthKey][day].forEach((item) => {
        const timeSlot = item.content.split(' ')[0]; // Assuming the content starts with the time slot
        if (!initialItemsByTimeSlot[timeSlot]) initialItemsByTimeSlot[timeSlot] = [];
        initialItemsByTimeSlot[timeSlot].push(item);
      });
    }
    setItemsByTimeSlot(initialItemsByTimeSlot);
  }, [day, calendarItems, currentDate]);

  const handleAddItem = () => {
    if (currentSlot && newItemContent) {
      const newItem = {
        uniqueId: nanoid(),
        content: `${currentSlot} ${newItemContent}`,
      };

      setItemsByTimeSlot((prevItems) => {
        const newItems = { ...prevItems };
        if (!newItems[currentSlot]) newItems[currentSlot] = [];
        // Remove duplicates
        newItems[currentSlot] = newItems[currentSlot].filter(item => item.content !== newItem.content);
        newItems[currentSlot].push(newItem);
        return newItems;
      });

      // Update the calendarItems state in the parent component
      setCalendarItems((prevItems) => {
        const newItems = { ...prevItems };
        const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
        if (!newItems[monthKey]) newItems[monthKey] = {};
        if (!newItems[monthKey][day]) newItems[monthKey][day] = [];
        // Remove duplicates
        newItems[monthKey][day] = newItems[monthKey][day].filter(item => item.content !== newItem.content);
        newItems[monthKey][day].push(newItem);
        return newItems;
      });

      setShowModal(false);
      setNewItemContent('');
    }
  };

  const openModal = (timeSlot: string) => {
    setCurrentSlot(timeSlot);
    setShowModal(true);
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
            <div key={index} className="event-slot">
              <button onClick={() => openModal(time)}>Add Item</button>
              {itemsByTimeSlot[time]?.map((item) => (
                <div
                  key={item.uniqueId}
                  className="calendar-item"
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
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h3>Add Item to {currentSlot}</h3>
            <input
              type="text"
              value={newItemContent}
              onChange={(e) => setNewItemContent(e.target.value)}
            />
            <button onClick={handleAddItem}>Add</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayDetail;
