'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import useStore from '@/store';
import { Task } from '@/types';
import Modal from './Modal';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
}

export default function EditTaskModal({ task, onClose }: EditTaskModalProps) {
  const { currentBoard, updateTask } = useStore();
  
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [subtasks, setSubtasks] = useState(
    task.subtasks.map(subtask => ({
      id: subtask.id,
      title: subtask.title,
      isCompleted: subtask.isCompleted
    }))
  );
  
  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: uuidv4(), title: '', isCompleted: false }]);
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
    
    // Update the task
    if (currentBoard) {
      updateTask(
        currentBoard.id,
        {
          id: task.id,
          title,
          description,
          status,
          subtasks
        }
      );
    }
    
    onClose();
  };
  
  return (
    <Modal title="Edit Task" onClose={onClose}>
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
          
          <button
            type="button"
            className="btn-secondary w-full mt-3"
            onClick={handleAddSubtask}
          >
            + Add New Subtask
          </button>
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