import React from 'react';
import './AddItemModal.css'; // Import the CSS file for the modal

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
  handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
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
  handleKeyPress,
}) => {
  if (!showModal) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>X</button>
        <h3>Add New Item</h3>
        <input
          type="text"
          placeholder="Item content"
          value={newItemContent}
          onChange={(e) => setNewItemContent(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input
          type="time"
          placeholder="Start time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="time"
          placeholder="End time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button onClick={handleAddItem}>Add Item</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default AddItemModal;
