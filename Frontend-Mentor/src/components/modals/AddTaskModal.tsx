'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import useStore from '@/store';
import Modal from './Modal';

interface AddTaskModalProps {
  onClose: () => void;
}

export default function AddTaskModal({ onClose }: AddTaskModalProps) {
  const { currentBoard, addTask } = useStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(currentBoard?.columns[0]?.name || '');
  const [subtasks, setSubtasks] = useState([
    { id: uuidv4(), title: '' },
    { id: uuidv4(), title: '' }
  ]);
  
  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: uuidv4(), title: '' }]);
  };
  
  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };
  
  const handleSubtaskTitleChange = (id: string, value: string) => {
    setSubtasks(
      subtasks.map(subtask => 
        subtask.id === id ? { ...subtask, title: value } : subtask
      )
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) return;
    if (subtasks.some(subtask => !subtask.title.trim())) return;
    
    // Find the column ID based on the status
    const columnId = currentBoard?.columns.find(column => column.name === status)?.id;
    
    // Add the task
    if (currentBoard && columnId) {
      addTask(
        currentBoard.id,
        columnId,
        {
          title,
          description,
          status,
          subtasks: subtasks.map(({ title }) => ({ 
            id: uuidv4(),
            title, 
            isCompleted: false 
          }))
        }
      );
    }
    
    onClose();
  };
  
  return (
    <Modal title="Add New Task" onClose={onClose}>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 dark:text-white">
              Title
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Take coffee break"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 dark:text-white">
              Description
            </label>
            <textarea
              className="input min-h-[112px]"
              placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 dark:text-white">
              Subtasks
            </label>
            
            {subtasks.map(subtask => (
              <div key={subtask.id} className="flex items-center mb-3">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="e.g. Make coffee"
                  value={subtask.title}
                  onChange={(e) => handleSubtaskTitleChange(subtask.id, e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="ml-4"
                  onClick={() => handleRemoveSubtask(subtask.id)}
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
            
            <div>
              <button
                type="button"
                className="btn-secondary w-full mt-3"
                onClick={handleAddSubtask}
              >
                + Add New Subtask
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 dark:text-white">
              Status
            </label>
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              {currentBoard?.columns.map(column => (
                <option key={column.id} value={column.name}>
                  {column.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 