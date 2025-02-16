import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import './DayDetail.css'; // Import the CSS file
import AddItemModal from './AddItemModal'; // Import the new modal component

interface CalendarItem {
  uniqueId: string;
  content: string;
  startTime: string;
  endTime: string;
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
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  const [itemsByTimeSlot, setItemsByTimeSlot] = useState<CalendarItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newItemContent, setNewItemContent] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    // Initialize itemsByTimeSlot with calendarItems for the selected day
    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    if (calendarItems[monthKey] && calendarItems[monthKey][day]) {
      setItemsByTimeSlot(calendarItems[monthKey][day]);
    }
  }, [day, calendarItems, currentDate]);

  const handleAddItem = () => {
    if (startTime && endTime && newItemContent) {
      const newItem = {
        uniqueId: nanoid(),
        content: newItemContent,
        startTime,
        endTime,
      };

      // Check for duplicates and remove one copy if found
      setItemsByTimeSlot((prevItems) => {
        const newItems = prevItems.filter(item => !(item.content === newItemContent && item.startTime === startTime && item.endTime === endTime));
        newItems.push(newItem);
        return newItems;
      });

      // Update the calendarItems state in the parent component
      setCalendarItems((prevItems) => {
        const newItems = { ...prevItems };
        const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
        if (!newItems[monthKey]) newItems[monthKey] = {};
        if (!newItems[monthKey][day]) newItems[monthKey][day] = [];
        newItems[monthKey][day] = newItems[monthKey][day].filter(item => !(item.content === newItemContent && item.startTime === startTime && item.endTime === endTime));
        newItems[monthKey][day].push(newItem);
        return newItems;
      });

      setShowModal(false);
      setNewItemContent('');
      setStartTime('');
      setEndTime('');
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewItemContent('');
    setStartTime('');
    setEndTime('');
  };

  const calculateItemPosition = (startTime: string, endTime: string) => {
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const top = (startHour / 24) * 100;
    const height = ((endHour - startHour) / 24) * 100;
    return { top: `${top}%`, height: `${height}%` };
  };

  return (
    <div className="day-detail">
      <button className="back-button" onClick={() => setSelectedDate(null)}>Back</button>
      <h2>{months[currentDate.getMonth()]} {day}, {currentDate.getFullYear()}</h2>
      <button className="add-item-button" onClick={openModal}>Add Item</button>
      <div className="day-schedule">
        <div className="time-slots">
          {timeSlots.map((time, index) => (
            <div key={index} className="time-slot">{time}</div>
          ))}
        </div>
        <div className="events">
          {itemsByTimeSlot.map((item) => {
            const { top, height } = calculateItemPosition(item.startTime, item.endTime);
            return (
              <div
                key={item.uniqueId}
                className="calendar-item"
                style={{ top, height }}
              >
                {item.content}
                <button
                  className="delete-button"
                  onClick={() => handleDelete(day, item.uniqueId)}
                >
                  X
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <AddItemModal
        showModal={showModal}
        closeModal={closeModal}
        newItemContent={newItemContent}
        setNewItemContent={setNewItemContent}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        handleAddItem={handleAddItem}
      />
    </div>
  );
};

export default DayDetail;
