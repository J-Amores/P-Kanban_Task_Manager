'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import useStore from '@/store';
import Modal from './Modal';

interface AddBoardModalProps {
  onClose: () => void;
}

export default function AddBoardModal({ onClose }: AddBoardModalProps) {
  const { addBoard } = useStore();
  
  const [name, setName] = useState('');
  const [columns, setColumns] = useState([
    { id: uuidv4(), name: 'Todo' },
    { id: uuidv4(), name: 'Doing' }
  ]);
  
  const handleAddColumn = () => {
    setColumns([...columns, { id: uuidv4(), name: '' }]);
  };
  
  const handleRemoveColumn = (id: string) => {
    setColumns(columns.filter(column => column.id !== id));
  };
  
  const handleColumnNameChange = (id: string, value: string) => {
    setColumns(
      columns.map(column => 
        column.id === id ? { ...column, name: value } : column
      )
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) return;
    if (columns.some(column => !column.name.trim())) return;
    
    // Add the board
    addBoard(name, columns.map(({ name }) => ({ name })));
    onClose();
  };
  
  return (
    <Modal title="Add New Board" onClose={onClose}>
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
          
          {columns.map(column => (
            <div key={column.id} className="flex items-center mb-3">
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
          Create New Board
        </button>
      </form>
    </Modal>
  );
} 