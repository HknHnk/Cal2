import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import CalendarHeader from './CalendarHeader';
import CalendarDays from './CalendarDays';
import DayDetail from './DayDetail';
import DraggableItems from './DraggableItems';
import './Calendar.css';

interface CalendarItem {
  uniqueId: string;
  content: string;
}

type CalendarItemsState = Record<string, Record<number, CalendarItem[]>>;

interface DayDetailProps {
  day: number;
  currentDate: Date;
  calendarItems: CalendarItemsState;
  handleDragStart: (item: CalendarItem | string) => void;
  handleDelete: (day: number, uniqueId: string) => void;
  setSelectedDate: (date: number | null) => void;
  months: string[];
  setCalendarItems: React.Dispatch<React.SetStateAction<CalendarItemsState>>;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [draggedItem, setDraggedItem] = useState<CalendarItem | null>(null);
  const [calendarItems, setCalendarItems] = useState<CalendarItemsState>({});
  const [draggableItems, setDraggableItems] = useState<CalendarItem[]>([
    { uniqueId: nanoid(), content: 'Item 1' },
    { uniqueId: nanoid(), content: 'Item 2' },
  ]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDragStart = (item: CalendarItem | string) => {
    if (typeof item === 'string') {
      const newItem: CalendarItem = {
        uniqueId: nanoid(),
        content: item,
      };
      setDraggedItem(newItem);
    } else {
      setDraggedItem(item);
    }
  };

  const handleDrop = (day: number) => {
    if (draggedItem) {
      const newItem = {
        ...draggedItem,
        uniqueId: nanoid(),
      };

      const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

      setCalendarItems((prevItems) => {
        const newItems = { ...prevItems };
        if (!newItems[monthKey]) newItems[monthKey] = {};
        if (!newItems[monthKey][day]) newItems[monthKey][day] = [];

        // Check for duplicates
        const isDuplicate = newItems[monthKey][day].some(item => item.content === newItem.content);
        if (!isDuplicate) {
          newItems[monthKey][day].push(newItem);
        }

        return newItems;
      });

      setDraggableItems((prevItems) => prevItems.filter(item => item.uniqueId !== draggedItem.uniqueId));
      setDraggedItem(null);
    }
  };

  const handleDelete = (day: number, uniqueId: string) => {
    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

    setCalendarItems((prevItems) => {
      const newItems = { ...prevItems };
      if (newItems[monthKey] && newItems[monthKey][day]) {
        newItems[monthKey][day] = newItems[monthKey][day].filter((item) => item.uniqueId !== uniqueId);
        if (newItems[monthKey][day].length === 0) delete newItems[monthKey][day];
      }
      return newItems;
    });
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className={`calendar ${isFullScreen ? 'full-screen' : ''}`}>
      <CalendarHeader
        currentDate={currentDate}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
        toggleFullScreen={toggleFullScreen}
        isFullScreen={isFullScreen}
        months={months}
      />
      {selectedDate === null ? (
        <CalendarDays
          currentDate={currentDate}
          daysOfWeek={daysOfWeek}
          calendarItems={calendarItems}
          handleDrop={handleDrop}
          handleDragStart={handleDragStart}
          handleDelete={handleDelete}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      ) : (
        <DayDetail
          day={selectedDate}
          currentDate={currentDate}
          calendarItems={calendarItems}
          handleDragStart={handleDragStart}
          handleDelete={handleDelete}
          setSelectedDate={setSelectedDate}
          months={months}
          setCalendarItems={setCalendarItems} // Pass this prop
        />
      )}
      <DraggableItems
        draggableItems={draggableItems}
        handleDragStart={handleDragStart}
      />
    </div>
  );
};

export default Calendar;
