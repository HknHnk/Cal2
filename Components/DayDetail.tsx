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

  const handleDeleteItem = (day: number, uniqueId: string) => {
    setItemsByTimeSlot((prevItems) => prevItems.filter(item => item.uniqueId !== uniqueId));
    setCalendarItems((prevItems) => {
      const newItems = { ...prevItems };
      const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
      newItems[monthKey][day] = newItems[monthKey][day].filter(item => item.uniqueId !== uniqueId);
      return newItems;
    });
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
    const startMinute = parseInt(startTime.split(':')[1]);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1]);

    const startRow = startHour * 2 + Math.floor(startMinute / 30) + 1;
    const endRow = endHour * 2 + Math.floor(endMinute / 30) + 1;

    return { startRow, endRow };
  };

  const calculateOverlap = (items: CalendarItem[]) => {
    const overlaps: { [key: string]: number } = {};
    items.forEach((item, index) => {
      overlaps[item.uniqueId] = 0;
      for (let i = 0; i < items.length; i++) {
        if (i !== index && itemsOverlap(item, items[i])) {
          overlaps[item.uniqueId]++;
        }
      }
    });
    return overlaps;
  };

  const itemsOverlap = (item1: CalendarItem, item2: CalendarItem) => {
    return (
      (item1.startTime < item2.endTime && item1.endTime > item2.startTime) ||
      (item2.startTime < item1.endTime && item2.endTime > item1.startTime)
    );
  };

  const overlaps = calculateOverlap(itemsByTimeSlot);

  // Calculate the maximum number of overlapping items
  const maxOverlap = Math.max(...Object.values(overlaps), 0);

  const assignColumns = (items: CalendarItem[]) => {
    const columns: { [key: string]: number } = {};
    const usedColumns: { [key: number]: boolean } = {};

    items.forEach(item => {
      let column = 1;
      while (usedColumns[column]) {
        column++;
      }
      columns[item.uniqueId] = column;
      usedColumns[column] = true;

      items.forEach(otherItem => {
        if (item !== otherItem && itemsOverlap(item, otherItem)) {
          usedColumns[columns[otherItem.uniqueId]] = true;
        }
      });
    });

    return columns;
  };

  const columns = assignColumns(itemsByTimeSlot);

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
        <div className="events" style={{ display: 'grid', gridTemplateColumns: `repeat(${maxOverlap + 2}, 1fr)`, gridTemplateRows: 'repeat(48, 1fr)' }}>
          {itemsByTimeSlot
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((item) => {
              const { startRow, endRow } = calculateItemPosition(item.startTime, item.endTime);
              const column = columns[item.uniqueId] + 1; // +1 to account for the time column
              return (
                <div
                  key={item.uniqueId}
                  className="calendar-item"
                  style={{ gridColumn: column, gridRow: `${startRow} / ${endRow}` }}
                >
                  {item.content}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteItem(day, item.uniqueId)}
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
