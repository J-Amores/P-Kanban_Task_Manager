'use client';

import { Column as ColumnType } from '@/types';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
}

export default function Column({ column }: ColumnProps) {
  const { name, tasks } = column;
  
  // Generate a random color for the column dot
  const getRandomColor = () => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500',
    ];
    
    // Use the column name to generate a consistent color
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <div className={`w-3 h-3 rounded-full mr-3 ${getRandomColor()}`}></div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-light-gray">
          {name} ({tasks.length})
        </h3>
      </div>
      
      <div className="space-y-5">
        {tasks.map((task, index) => (
          <TaskCard key={task.id} task={task} index={index} columnId={column.id} />
        ))}
      </div>
    </div>
  );
} 