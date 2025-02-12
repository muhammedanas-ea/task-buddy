import React from "react";
import { BoardColumnProps } from "./type";

export const BoardColumn = ({ title, bgColor, descrption, children }: BoardColumnProps) => {
  const hasChildren = React.Children.count(children) > 0;

  return (
    <div className="bg-[#F1F1F1] rounded-[12px] px-4 py-5">
      <span className={`${bgColor} rounded-[4px] text-[14px] px-3 py-2`}>
        {title}
      </span>
      <div className="pt-8 space-y-3">
        {hasChildren ? ( 
          children
        ) : (
          <div className="flex flex-col items-center justify-center py-8 min-h-72">
            <p className="text-[#2F2F2F] font-medium text-[15px] text-center">
              {descrption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
