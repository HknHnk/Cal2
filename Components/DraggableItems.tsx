import React from 'react';

interface CalendarItem {
  uniqueId: string;
  content: string;
}

interface DraggableItemsProps {
  draggableItems: CalendarItem[];
  handleDragStart: (item: CalendarItem | string) => void;
}

const DraggableItems: React.FC<DraggableItemsProps> = ({
  draggableItems,
  handleDragStart,
}) => {
  return (
    <div className="draggable-items">
      {draggableItems.map(item => (
        <div
          key={item.uniqueId}
          className="draggable-item"
          draggable
          onDragStart={() => handleDragStart(item.content)}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};

export default DraggableItems;