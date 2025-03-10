'use client';

import { useState } from 'react';
import Image from 'next/image';
import useStore from '@/store';
import useTheme from '@/hooks/useTheme';
import AddBoardModal from './modals/AddBoardModal';

export default function Sidebar() {
  const { boards, currentBoard, setCurrentBoard, sidebarOpen, toggleSidebar } = useStore();
  const { darkMode, toggleDarkMode } = useTheme();
  const [showAddBoardModal, setShowAddBoardModal] = useState(false);
  
  if (!sidebarOpen) {
    return (
      <button
        className="fixed bottom-8 left-0 bg-primary hover:bg-primary-light rounded-r-full p-5 z-10"
        onClick={toggleSidebar}
      >
        <Image
          src="/assets/icon-show-sidebar.svg"
          alt="Show Sidebar"
          width={16}
          height={10}
        />
      </button>
    );
  }
  
  return (
    <aside className="w-64 border-r border-light-gray/25 bg-white dark:bg-dark-gray flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-xs uppercase tracking-widest text-light-gray mb-5">
          All Boards ({boards.length})
        </h2>
        
        <ul className="space-y-1 mb-8">
          {boards.map(board => (
            <li key={board.id}>
              <button
                className={`flex items-center w-full rounded-r-full py-3 px-6 text-left ${
                  currentBoard?.id === board.id
                    ? 'bg-primary text-white'
                    : 'text-light-gray hover:bg-primary/10 hover:text-primary dark:hover:bg-white'
                }`}
                onClick={() => setCurrentBoard(board.id)}
              >
                <Image
                  src="/assets/icon-board.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="mr-3"
                />
                <span>{board.name}</span>
              </button>
            </li>
          ))}
          
          <li>
            <button
              className="flex items-center w-full text-primary py-3 px-6 text-left"
              onClick={() => setShowAddBoardModal(true)}
            >
              <Image
                src="/assets/icon-board.svg"
                alt=""
                width={16}
                height={16}
                className="mr-3"
              />
              <span>+ Create New Board</span>
            </button>
          </li>
        </ul>
      </div>
      
      <div className="mt-auto p-6">
        <div className="bg-very-light-gray dark:bg-dark-bg flex items-center justify-center p-3 rounded-md mb-6">
          <Image
            src="/assets/icon-light-theme.svg"
            alt="Light Theme"
            width={18}
            height={18}
          />
          
          <div className="mx-6">
            <div className="w-10 h-5 bg-primary rounded-full relative">
              <div 
                className={`
                  absolute w-3.5 h-3.5 bg-white rounded-full top-[3px]
                  ${darkMode ? 'left-[22px]' : 'left-[4px]'}
                  transition-all duration-200
                `}
              />
              <button
                type="button"
                onClick={toggleDarkMode}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              />
            </div>
          </div>
          
          <Image
            src="/assets/icon-dark-theme.svg"
            alt="Dark Theme"
            width={15}
            height={15}
          />
        </div>
        
        <button
          className="flex items-center text-light-gray hover:text-medium-gray w-full py-2"
          onClick={toggleSidebar}
        >
          <Image
            src="/assets/icon-hide-sidebar.svg"
            alt="Hide Sidebar"
            width={18}
            height={16}
            className="mr-3"
          />
          <span>Hide Sidebar</span>
        </button>
      </div>
      
      {showAddBoardModal && (
        <AddBoardModal onClose={() => setShowAddBoardModal(false)} />
      )}
    </aside>
  );
} 