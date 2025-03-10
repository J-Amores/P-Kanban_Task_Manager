'use client';

import useStore from '@/store';
import Modal from './Modal';

interface DeleteTaskModalProps {
  taskName: string;
  columnId: string;
  taskId: string;
  onClose: () => void;
}

export default function DeleteTaskModal({ taskName, columnId, taskId, onClose }: DeleteTaskModalProps) {
  const { currentBoard, deleteTask } = useStore();
  
  const handleDelete = () => {
    if (currentBoard) {
      deleteTask(currentBoard.id, columnId, taskId);
    }
    onClose();
  };
  
  return (
    <Modal title="Delete this task?" onClose={onClose}>
      <div className="text-light-gray mb-6">
        Are you sure you want to delete the '{taskName}' task and its subtasks? This action cannot be reversed.
      </div>
      
      <div className="flex space-x-4">
        <button
          className="btn-destructive flex-1"
          onClick={handleDelete}
        >
          Delete
        </button>
        
        <button
          className="btn-secondary flex-1"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
} 