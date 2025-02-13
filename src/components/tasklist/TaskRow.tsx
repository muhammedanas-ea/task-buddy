import { ChevronDown } from "lucide-react";
import { TaskRowProps } from "./type";
import TaskCard from "./TaskCard";
import React from "react";

const TaskRow = ({ title, bgColor, desc, children }: TaskRowProps) => {
  const taskCount = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === TaskCard
  ).length;

  return (
    <div>
      <div
        className={`flex items-center ${bgColor} justify-between p-3 rounded-lg cursor-pointer`}
      >
        <h2 className="font-semibold">
          {title} ({taskCount})
        </h2>
        <ChevronDown className={`w-5 h-5 transform`} />
      </div>
      <div className="bg-[#F1F1F1] rounded-b-lg shadow">
        {taskCount > 0 ? (
          children
        ) : (
          <div className="flex flex-col items-center justify-center py-8 min-h-56">
            <p className="text-[#2F2F2F] font-medium text-[15px] text-center">
              {desc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskRow;
