'use client';

import { useState, useCallback } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import useStore from '@/store';
import { Board as BoardType } from '@/types';
import Column from './Column';
import EditBoardModal from './modals/EditBoardModal';

interface BoardProps {
  board: BoardType;
}

export default function Board({ board }: BoardProps) {
  const { moveTask, currentBoard, addColumn } = useStore();
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    
    // If there's no destination or the item is dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Move the task
    moveTask(
      board.id,
      source.droppableId,
      destination.droppableId,
      draggableId
    );
  };
  
  const handleAddColumn = () => {
    // Option 1: Use the EditBoardModal (comment out to use Option 2)
    // setShowEditBoardModal(true);
    
    // Option 2: Directly add a column
    if (currentBoard) {
      const newColumnName = `New Column ${currentBoard.columns.length + 1}`;
      console.log('Directly adding new column:', newColumnName);
      addColumn(currentBoard.id, newColumnName);
    }
  };
  
  const handleCloseEditModal = useCallback(() => {
    setShowEditBoardModal(false);
  }, []);
  
  // Use the current board from the store to ensure we have the latest data
  const displayBoard = currentBoard || board;
  
  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex h-full p-6 overflow-x-auto">
          {displayBoard.columns.map(column => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-w-[280px] mr-6"
                >
                  <Column column={column} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
          
          <div className="min-w-[280px] flex items-center justify-center bg-gradient-to-b from-light-gray/10 to-light-gray/5 dark:from-dark-gray/20 dark:to-dark-gray/10 rounded-md h-full">
            <button 
              className="text-light-gray hover:text-primary text-2xl font-bold"
              onClick={handleAddColumn}
              type="button"
            >
              + New Column
            </button>
          </div>
        </div>
      </DragDropContext>
      
      {showEditBoardModal && displayBoard && (
        <EditBoardModal 
          board={displayBoard} 
          onClose={handleCloseEditModal} 
        />
      )}
    </>
  );
} 