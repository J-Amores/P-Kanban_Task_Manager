'use client';

import { useState } from 'react';
import AddBoardModal from './modals/AddBoardModal';

export default function EmptyBoard() {
  const [showAddBoardModal, setShowAddBoardModal] = useState(false);
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h2 className="text-lg font-bold text-light-gray mb-6">
        {`You don't have any boards yet.`}
      </h2>
      
      <button
        className="btn-primary"
        onClick={() => setShowAddBoardModal(true)}
      >
        + Create New Board
      </button>
      
      {showAddBoardModal && (
        <AddBoardModal onClose={() => setShowAddBoardModal(false)} />
      )}
    </div>
  );
} 