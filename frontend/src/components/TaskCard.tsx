// src/components/TaskCard.tsx
import { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow rounded p-4 mb-2">
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-gray-500">{task.description}</p>
      <div className="flex justify-between mt-2">
        <button onClick={() => onEdit(task.id)} className="text-blue-500">
          Edit
        </button>
        <button onClick={() => onDelete(task.id)} className="text-red-500">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
