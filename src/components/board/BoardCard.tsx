import { EditIcon, Ellipsis, Trash2 } from "lucide-react";
import { BoardCardProps } from "./type";
import EditTaskModal from "../EditTaskModal";
import { useState } from "react";

const BoardCard = ({
  id,
  title,
  isCompleted,
  category,
  dueDate,
  onDelete,
}: BoardCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = () => {
    onDelete(id);
  };

  return (
    <div className="bg-white p-4 rounded-[12px] flex flex-col justify-between min-h-25 relative">
      <div className="flex justify-between items-start">
        <h2
          className={`${
            isCompleted ? "line-through" : ""
          } text-[14px] font-bold max-w-48`}
        >
          {title}
        </h2>
        <div className="relative menu:hover group">
          <Ellipsis className="cursor-pointer" size={16} />
          <div className="absolute invisible group-hover:visible w-32 right-0 top-3 bg-white border border-gray-300 rounded-[12px] shadow-lg z-10 p-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex text-[16px] gap-2 items-center w-full p-1 hover:bg-gray-100"
            >
              <EditIcon size={16} />
              Edit
            </button>
            <EditTaskModal
              taskId={id}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
            <button
              onClick={handleDeleteClick}
              className="flex gap-2 text-red-500 text-[16px] items-center w-full p-1 hover:bg-gray-100"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] text-gray-400">
        <p>{category}</p>
        <p>{dueDate}</p>
      </div>
    </div>
  );
};

export default BoardCard;
