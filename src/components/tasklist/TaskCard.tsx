import { EditIcon, Ellipsis, Trash2 } from "lucide-react";
import { TaskCardProps } from "./type";
import { useState, useRef, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import drag from "../../assets/icons/drag_icon.png";
import check from "../../assets/icons/checkmark.png";
import completedCheck from "../../assets/icons/color-checkmark.png";
import EditTaskModal from "../EditTaskModal";
import { Draggable } from "@hello-pangea/dnd";

const TaskCard = ({
  id,
  index,
  name,
  dueDate,
  status,
  isCompleted,
  category,
  onDelete,
  openMenuId,
  setOpenMenuId,
}: TaskCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const ellipsisDropdownRef = useRef<HTMLDivElement>(null);

  const handleEllipsisClick = () => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDeleteClick = () => {
    onDelete(id);
    setOpenMenuId(null);
  };

  const updateTaskStatus = async (newStatus: string) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, {
        status: newStatus,
        isCompleted: newStatus === "COMPLETED",
      });
      setIsStatusDropdownOpen(false);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const statusOptions = [
    { label: "TO-DO", value: "TO-DO" },
    { label: "IN-PROGRESS", value: "IN-PROGRESS" },
    { label: "COMPLETED", value: "COMPLETED" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }

      if (
        ellipsisDropdownRef.current &&
        !ellipsisDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenMenuId]);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="grid items-center grid-cols-3 md:grid-cols-5 p-4 border-b text-[14px] bg-[#F1F1F1] hover:bg-white border-b-gray-300 last:border-b-0"
        >
          <div className="flex items-center gap-2 col-span-2">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() =>
                updateTaskStatus(isCompleted ? "TO-DO" : "COMPLETED")
              }
              className="rounded border-gray-300"
            />
            <div {...provided.dragHandleProps}>
              <img src={drag} alt="drag" />
            </div>
            {!isCompleted ? (
              <img src={check} alt="check" />
            ) : (
              <img src={completedCheck} alt="completedCheck" />
            )}
            <span className={`${isCompleted ? "line-through" : ""}`}>
              {name}
            </span>
          </div>
          <span className="hidden md:block">{dueDate}</span>
          <div className="hidden md:block relative" ref={statusDropdownRef}>
            <button
              className="bg-[#DDDADD] hover:bg-gray-400 px-4 rounded-[4px] py-1 cursor-pointer"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            >
              {status}
            </button>
            {isStatusDropdownOpen && (
              <div className="absolute w-32 top-8 bg-[#FFF9F9] border border-gray-300 rounded-[12px] shadow-lg z-10">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateTaskStatus(option.value)}
                    className="block w-full text-left px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-100 first:rounded-t-[12px] last:rounded-b-[12px]"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div
            className="flex justify-end md:justify-between items-center relative"
            ref={ellipsisDropdownRef}
          >
            <span className="hidden md:block">{category}</span>
            <button
              onClick={handleEllipsisClick}
              className="hover:text-gray-700 cursor-pointer"
            >
              <Ellipsis className="w-4 h-4" />
            </button>
            {openMenuId === id && (
              <div className="absolute w-32 right-0 top-4 bg-[#FFF9F9] border border-gray-300 rounded-[12px] shadow-lg z-10 p-2">
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
                  className="flex gap-2 text-[#DA2F2F] text-[16px] items-center w-full p-1 hover:bg-gray-100"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
