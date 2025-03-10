'use client';

import { useState } from 'react';
import Image from 'next/image';
import useStore from '@/store';
import { Task } from '@/types';
import Modal from './Modal';
import EditTaskModal from './EditTaskModal';
import DeleteTaskModal from './DeleteTaskModal';

interface TaskDetailModalProps {
  task: Task;
  columnId: string;
  onClose: () => void;
}

export default function TaskDetailModal({ task, columnId, onClose }: TaskDetailModalProps) {
  const { currentBoard, toggleSubtask } = useStore();
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const completedSubtasks = task.subtasks.filter(subtask => subtask.isCompleted).length;
  const totalSubtasks = task.subtasks.length;
  
  const handleToggleSubtask = (subtaskId: string) => {
    if (currentBoard) {
      toggleSubtask(currentBoard.id, columnId, task.id, subtaskId);
    }
  };
  
  return (
    <>
      <Modal title={task.title} onClose={onClose}>
        <div className="relative">
          <button 
            className="absolute right-0 top-0"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Image 
              src="/assets/icon-vertical-ellipsis.svg" 
              alt="Menu" 
              width={5} 
              height={20} 
            />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 top-8 bg-white dark:bg-dark-gray shadow-md rounded-lg p-4 z-10">
              <button 
                className="text-light-gray hover:text-medium-gray block mb-4 w-full text-left"
                onClick={() => {
                  setShowEditTaskModal(true);
                  setShowDropdown(false);
                }}
              >
                Edit Task
              </button>
              <button 
                className="text-destructive hover:text-destructive-light block w-full text-left"
                onClick={() => {
                  setShowDeleteTaskModal(true);
                  setShowDropdown(false);
                }}
              >
                Delete Task
              </button>
            </div>
          )}
          
          <p className="text-light-gray mb-6">
            {task.description || 'No description provided.'}
          </p>
          
          {totalSubtasks > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-3 dark:text-white">
                Subtasks ({completedSubtasks} of {totalSubtasks})
              </h3>
              
              <div className="space-y-2">
                {task.subtasks.map(subtask => (
                  <div 
                    key={subtask.id}
                    className="flex items-center p-3 bg-very-light-gray dark:bg-dark-bg rounded"
                  >
                    <input
                      type="checkbox"
                      id={subtask.id}
                      checked={subtask.isCompleted}
                      onChange={() => handleToggleSubtask(subtask.id)}
                      className="mr-3"
                    />
                    <label 
                      htmlFor={subtask.id}
                      className={`text-sm ${
                        subtask.isCompleted ? 'line-through text-light-gray' : 'dark:text-white'
                      }`}
                    >
                      {subtask.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-bold mb-2 dark:text-white">
              Current Status
            </h3>
            <div className="bg-white dark:bg-dark-gray p-2 border border-light-gray/25 rounded">
              {task.status}
            </div>
          </div>
        </div>
      </Modal>
      
      {showEditTaskModal && (
        <EditTaskModal 
          task={task}
          onClose={() => {
            setShowEditTaskModal(false);
          }}
        />
      )}
      
      {showDeleteTaskModal && (
        <DeleteTaskModal 
          taskName={task.title}
          columnId={columnId}
          taskId={task.id}
          onClose={() => {
            setShowDeleteTaskModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
} 