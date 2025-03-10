'use client';

import { useEffect } from 'react';
import useStore from '@/store';
import useTheme from '@/hooks/useTheme';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Board from '@/components/Board';
import EmptyBoard from '@/components/EmptyBoard';

export default function Home() {
  const { currentBoard, boards, setCurrentBoard } = useStore();
  const { darkMode } = useTheme();

  // Set the first board as current if there is one and none is selected
  useEffect(() => {
    if (boards.length > 0 && !currentBoard) {
      setCurrentBoard(boards[0].id);
    }
  }, [boards, currentBoard, setCurrentBoard]);

  return (
    <main className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          {currentBoard ? (
            <Board board={currentBoard} />
          ) : (
            <EmptyBoard />
          )}
        </div>
      </div>
    </main>
  );
} 