import React from 'react';

interface AddItemModalProps {
  showModal: boolean;
  closeModal: () => void;
  newItemContent: string;
  setNewItemContent: (content: string) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  handleAddItem: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  showModal,
  closeModal,
  newItemContent,
  setNewItemContent,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  handleAddItem,
}) => {
  if (!showModal) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>×</button>
        <h3>Add Item</h3>
        <input
          type="text"
          placeholder="Content"
          value={newItemContent}
          onChange={(e) => setNewItemContent(e.target.value)}
        />
        <input
          type="time"
          placeholder="Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="time"
          placeholder="End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button onClick={handleAddItem}>Add</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default AddItemModal;
