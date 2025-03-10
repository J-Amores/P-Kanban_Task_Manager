'use client';

import useStore from '@/store';
import Modal from './Modal';

interface DeleteBoardModalProps {
  boardName: string;
  onClose: () => void;
}

export default function DeleteBoardModal({ boardName, onClose }: DeleteBoardModalProps) {
  const { currentBoard, deleteBoard } = useStore();
  
  const handleDelete = () => {
    if (currentBoard) {
      deleteBoard(currentBoard.id);
    }
    onClose();
  };
  
  return (
    <Modal title="Delete this board?" onClose={onClose}>
      <div className="text-light-gray mb-6">
        Are you sure you want to delete the '{boardName}' board? This action will remove all columns and tasks and cannot be reversed.
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