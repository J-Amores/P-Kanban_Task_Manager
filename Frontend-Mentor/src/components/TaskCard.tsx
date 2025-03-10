'use client';

import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task } from '@/types';
import TaskDetailModal from './modals/TaskDetailModal';

interface TaskCardProps {
  task: Task;
  index: number;
  columnId: string;
}

export default function TaskCard({ task, index, columnId }: TaskCardProps) {
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  
  const completedSubtasks = task.subtasks.filter(subtask => subtask.isCompleted).length;
  const totalSubtasks = task.subtasks.length;
  
  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="bg-white dark:bg-dark-gray p-4 rounded-lg shadow-md cursor-pointer hover:opacity-80"
            onClick={() => setShowTaskDetail(true)}
          >
            <h4 className="font-bold mb-2 dark:text-white">
              {task.title}
            </h4>
            
            {totalSubtasks > 0 && (
              <p className="text-xs text-light-gray">
                {completedSubtasks} of {totalSubtasks} subtasks
              </p>
            )}
          </div>
        )}
      </Draggable>
      
      {showTaskDetail && (
        <TaskDetailModal
          task={task}
          columnId={columnId}
          onClose={() => setShowTaskDetail(false)}
        />
      )}
    </>
  );
} 