import { EditIcon, Ellipsis, Trash2 } from "lucide-react";
import { BoardCardProps } from "./type";

const BoardCard = ({ id, title, category, dueDate, onDelete, openMenuId, setOpenMenuId }: BoardCardProps) => {
  
  const handleEllipsisClick = () => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDeleteClick = () => {
    onDelete(id);
    setOpenMenuId(null);
  };

  return (
    <div className="bg-white p-4 rounded-[12px] flex flex-col justify-between min-h-25 relative">
      <div className="flex justify-between items-start">
        <h2 className="text-[14px] font-bold max-w-48">{title}</h2>
        <Ellipsis
          onClick={handleEllipsisClick}
          className="cursor-pointer"
          size={16}
        />
      </div>
      <div className="flex items-center justify-between text-[11px] text-gray-400">
        <p>{category}</p>
        <p>{dueDate}</p>
      </div>
      {openMenuId === id && (
        <div className="absolute w-32 right-5 top-8 bg-white border border-gray-300 rounded-[12px] shadow-lg z-10 p-2">
          <button className="flex text-[16px] gap-2 items-center w-full p-1 hover:bg-gray-100">
            <EditIcon size={16} />
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="flex gap-2 text-red-500 text-[16px] items-center w-full p-1 hover:bg-gray-100"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default BoardCard;
