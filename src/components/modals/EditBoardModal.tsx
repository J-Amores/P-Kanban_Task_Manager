'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import useStore from '@/store';
import { Board } from '@/types';
import Modal from './Modal';

interface EditBoardModalProps {
  board: Board;
  onClose: () => void;
}

export default function EditBoardModal({ board, onClose }: EditBoardModalProps) {
  const { updateBoard } = useStore();
  
  const [name, setName] = useState(board.name);
  const [columns, setColumns] = useState(
    board.columns.map(column => ({
      id: column.id,
      name: column.name
    }))
  );
  
  // Update local state if board prop changes
  useEffect(() => {
    setName(board.name);
    setColumns(board.columns.map(column => ({
      id: column.id,
      name: column.name
    })));
  }, [board]);
  
  const handleAddColumn = () => {
    const newColumn = { id: '', name: '' };
    console.log('Adding new column:', newColumn);
    setColumns([...columns, newColumn]);
  };
  
  const handleRemoveColumn = (id: string) => {
    console.log('Removing column with id:', id);
    setColumns(columns.filter(column => column.id !== id));
  };
  
  const handleColumnNameChange = (id: string, value: string) => {
    console.log('Changing column name:', id, value);
    setColumns(
      columns.map(column => 
        column.id === id ? { ...column, name: value } : column
      )
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      console.log('Board name is empty, not submitting');
      return;
    }
    
    if (columns.some(column => !column.name.trim())) {
      console.log('Some column names are empty, not submitting');
      return;
    }
    
    // Prepare columns data for update
    const updatedColumns = columns.map(column => ({
      id: column.id || uuidv4(),
      name: column.name
    }));
    
    console.log('Updating board with:', {
      boardId: board.id,
      name,
      columns: updatedColumns
    });
    
    // Update the board
    updateBoard(
      board.id,
      name,
      updatedColumns
    );
    
    // Close the modal after successful update
    console.log('Board updated, closing modal');
    onClose();
  };
  
  return (
    <Modal title="Edit Board" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2 dark:text-white">
            Board Name
          </label>
          <input
            type="text"
            className="input"
            placeholder="e.g. Web Design"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2 dark:text-white">
            Board Columns
          </label>
          
          {columns.map((column, index) => (
            <div key={column.id || `new-${index}`} className="flex items-center mb-3">
              <input
                type="text"
                className="input flex-1"
                placeholder="e.g. Todo"
                value={column.name}
                onChange={(e) => handleColumnNameChange(column.id, e.target.value)}
                required
              />
              <button
                type="button"
                className="ml-4"
                onClick={() => handleRemoveColumn(column.id)}
              >
                <Image
                  src="/assets/icon-cross.svg"
                  alt="Remove"
                  width={15}
                  height={15}
                />
              </button>
            </div>
          ))}
          
          <button
            type="button"
            className="btn-secondary w-full mt-3"
            onClick={handleAddColumn}
          >
            + Add New Column
          </button>
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full"
        >
          Save Changes
        </button>
      </form>
    </Modal>
  );
} 