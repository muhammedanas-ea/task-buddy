import { EditIcon, Ellipsis, Trash2 } from "lucide-react";
import { TaskCardProps } from "./type";
import drag from "../../assets/icons/drag_icon.png";
import check from "../../assets/icons/checkmark.png";
import completedCheck from "../../assets/icons/color-checkmark.png";

const TaskCard = ({
  id,
  name,
  dueDate,
  status,
  isCompleted,
  category,
  onDelete,
  openMenuId,
  setOpenMenuId,
}: TaskCardProps) => {
  const handleEllipsisClick = () => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDeleteClick = () => {
    onDelete(id);
    setOpenMenuId(null);
  };

  return (
    <div className="grid items-center md:grid-cols-5 p-4 border-b text-[14px] bg-[#F1F1F1] hover:bg-white border-b-gray-300 last:border-b-0">
      <div className="flex items-center gap-2 md:col-span-2">
        <input type="checkbox" className="rounded border-gray-300" />
        <img src={drag} alt="drag" />
        {!isCompleted ? (
          <img src={check} alt="check" />
        ) : (
          <img src={completedCheck} alt="completedCheck" />
        )}
        <span className={`${isCompleted ? "line-through" : ""}`}>{name}</span>
      </div>
      <span className="hidden md:block">{dueDate}</span>
      <div className="hidden md:block">
        <button className="bg-[#DDDADD] hover:bg-gray-400 px-4 rounded-[4px] py-1 cursor-pointer">
          {status}
        </button>
      </div>
      <div className="md:flex justify-between items-center hidden relative">
        <span>{category}</span>
        <button
          onClick={handleEllipsisClick}
          className="hover:text-gray-700 cursor-pointer"
        >
          <Ellipsis className="w-4 h-4" />
        </button>
        {openMenuId === id && (
          <div className="absolute w-32 right-0 top-4 bg-[#FFF9F9] border border-gray-300 rounded-[12px] shadow-lg z-10 p-2">
            <button className="flex text-[16px] gap-2 items-center w-full p-1 hover:bg-gray-100">
              <EditIcon size={16} />
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex gap-2 text-[#DA2F2F] text-[16px] items-center w-full p-1 hover:bg-gray-100"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
