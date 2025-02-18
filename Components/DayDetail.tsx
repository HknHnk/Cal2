import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import './DayDetail.css';
import AddItemModal from './AddItemModal';

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
  setCalendarItems: React.Dispatch<React.SetStateAction<Record<string, Record<number, CalendarItem[]>>>>;
}

const DayDetail: React.FC<DayDetailProps> = ({
  day,
  currentDate,
  calendarItems,
  handleDragStart,
  handleDelete,
  setSelectedDate,
  months,
  setCalendarItems,
}) => {
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  const [itemsByTimeSlot, setItemsByTimeSlot] = useState<CalendarItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newItemContent, setNewItemContent] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    if (calendarItems[monthKey] && calendarItems[monthKey][day]) {
      setItemsByTimeSlot(calendarItems[monthKey][day]);
    } else {
      setItemsByTimeSlot([]);
    }
  }, [day, calendarItems, currentDate]);

  const calculateItemPosition = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startRow = startHour * 2 + (startMinute >= 30 ? 1 : 0) + 1; // +1 to account for header
    const endRow = endHour * 2 + (endMinute > 30 ? 2 : endMinute > 0 ? 1 : 0) + 1;

    return { startRow, endRow };
  };

  const renderCalendarItems = () => {
    return itemsByTimeSlot
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .map((item) => {
        const { startRow, endRow } = calculateItemPosition(item.startTime, item.endTime);
        return (
          <div
            key={item.uniqueId}
            className="calendar-item"
            style={{ gridRow: `${startRow} / ${endRow}`, gridColumn: '1 / -1' }}
          >
            {item.content} ({item.startTime} - {item.endTime})
            <button
              className="delete-button"
              onClick={() => handleDelete(day, item.uniqueId)}
            >
              X
            </button>
          </div>
        );
      });
  };

  return (
    <div className="day-detail">
      <button className="back-button" onClick={() => setSelectedDate(null)}>Back</button>
      <h2>{months[currentDate.getMonth()]} {day}, {currentDate.getFullYear()}</h2>
      <button className="add-item-button" onClick={() => setShowModal(true)}>Add Item</button>
      <div className="day-schedule">
        <div className="time-slots">
          {timeSlots.map((time, index) => (
            <div key={index} className="time-slot">{time}</div>
          ))}
        </div>
        <div className="events">
          {renderCalendarItems()}
        </div>
      </div>
      <AddItemModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        newItemContent={newItemContent}
        setNewItemContent={setNewItemContent}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        handleAddItem={() => {
          if (startTime && endTime && newItemContent) {
            const newItem = {
              uniqueId: nanoid(),
              content: newItemContent,
              startTime,
              endTime,
            };
            setItemsByTimeSlot((prevItems) => [...prevItems, newItem]);
            setShowModal(false);
          }
        }}
      />
    </div>
  );
};

export default DayDetail;
