'use client';

import { useState } from 'react';
import Image from 'next/image';
import useStore from '@/store';
import useTheme from '@/hooks/useTheme';
import AddTaskModal from './modals/AddTaskModal';
import EditBoardModal from './modals/EditBoardModal';
import DeleteBoardModal from './modals/DeleteBoardModal';

export default function Header() {
  const { currentBoard, sidebarOpen, toggleSidebar } = useStore();
  const { darkMode, toggleDarkMode } = useTheme();
  
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const hasColumns = currentBoard?.columns.length > 0;
  
  return (
    <header className="flex items-center justify-between border-b border-light-gray/25 bg-white dark:bg-dark-gray h-16 md:h-20 px-4">
      <div className="flex items-center">
        <div className="hidden md:block mr-8">
          <Image 
            src={darkMode ? '/assets/logo-dark.svg' : '/assets/logo-light.svg'} 
            alt="Kanban Logo" 
            width={152} 
            height={25} 
          />
        </div>
        <div className="md:hidden mr-4">
          <Image 
            src="/assets/logo-mobile.svg" 
            alt="Kanban Logo" 
            width={24} 
            height={25} 
          />
        </div>
        <h1 className="text-xl font-bold dark:text-white">
          {currentBoard?.name || 'No Board Selected'}
        </h1>
        <button 
          className="md:hidden ml-2"
          onClick={() => toggleSidebar()}
        >
          <Image 
            src={sidebarOpen ? '/assets/icon-chevron-up.svg' : '/assets/icon-chevron-down.svg'} 
            alt={sidebarOpen ? "Hide sidebar" : "Show sidebar"} 
            width={10} 
            height={7} 
          />
        </button>
      </div>
      
      <div className="flex items-center">
        <button 
          className="btn-primary rounded-full py-2 px-4 md:px-6 text-sm font-bold flex items-center"
          disabled={!hasColumns}
          onClick={() => setShowAddTaskModal(true)}
        >
          <span className="hidden md:inline">+ Add New Task</span>
          <span className="md:hidden">+</span>
        </button>
        
        <button 
          className="ml-4"
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
          <div className="absolute right-4 top-16 bg-white dark:bg-dark-gray shadow-md rounded-lg p-4 z-10">
            <button 
              className="text-light-gray hover:text-medium-gray block mb-4 w-full text-left"
              onClick={() => {
                setShowEditBoardModal(true);
                setShowDropdown(false);
              }}
            >
              Edit Board
            </button>
            <button 
              className="text-destructive hover:text-destructive-light block w-full text-left"
              onClick={() => {
                setShowDeleteBoardModal(true);
                setShowDropdown(false);
              }}
            >
              Delete Board
            </button>
          </div>
        )}
      </div>
      
      {showAddTaskModal && (
        <AddTaskModal onClose={() => setShowAddTaskModal(false)} />
      )}
      
      {showEditBoardModal && (
        <EditBoardModal 
          board={currentBoard!} 
          onClose={() => setShowEditBoardModal(false)} 
        />
      )}
      
      {showDeleteBoardModal && (
        <DeleteBoardModal 
          boardName={currentBoard?.name || ''} 
          onClose={() => setShowDeleteBoardModal(false)} 
        />
      )}
    </header>
  );
} 