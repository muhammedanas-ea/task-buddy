import { ChevronDown, Search, X } from "lucide-react";
import { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";

const Filter = () => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [value, setValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClear = () => {
    setValue("");
  };

  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  return (
    <div className="py-6">
      <div className="flex justify-end md:hidden mb-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#7B1984] cursor-pointer hover:bg-[#7b1984d2] rounded-[41px] px-6 text-[12px] font-bold py-2 text-white"
        >
          ADD TASK
        </button>
      </div>
      <div className="flex gap-5 md:items-center flex-col md:flex-row md:justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-3 relative">
          <h1 className="text-[12px] font-medium text-gray-500">Filter by:</h1>
          <div className="flex items-center gap-3">
            <button
              className="flex cursor-pointer text-gray-500 items-center gap-3 px-4 py-2 border border-gray-300 rounded-[60px]"
              onClick={toggleCategoryDropdown}
            >
              <span className="text-[12px] font-medium">Category</span>
              <ChevronDown
                className={`${showCategoryDropdown ? "rotate-180" : ""}`}
                size={18}
              />
            </button>
            {showCategoryDropdown && (
              <div className="absolute w-32 top-10 left-12 bg-[#FFF9F9] border border-gray-300 rounded-[12px] shadow-lg z-10">
                <button
                  onClick={toggleCategoryDropdown}
                  className="block w-full text-left rounded-t-[12px] px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-100"
                >
                  Work
                </button>
                <button
                  onClick={toggleCategoryDropdown}
                  className="block w-full text-left rounded-b-[12px] px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-100"
                >
                  Personal
                </button>
              </div>
            )}
            <button className="flex text-gray-500 items-center gap-3 px-4 py-2 border border-gray-300 rounded-[60px]">
              <span className="text-[12px] font-medium">Due Date</span>
              <ChevronDown size={18} />
            </button>
          </div>
        </div>
        <div className="flex  items-center gap-4">
          <div className="relative flex-1 md:flex-initial">
            <input
              className="pl-10 pr-8 py-2 text-[12px] border border-gray-300 rounded-[60px] w-full"
              type="text"
              placeholder="Search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-500"
            />
            {value && (
              <X
                size={18}
                className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                onClick={handleClear}
              />
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#7B1984] hidden md:block cursor-pointer hover:bg-[#7b1984d2] rounded-[41px] px-6 text-[12px] font-bold py-3 text-white"
          >
            ADD TASK
          </button>
          <CreateTaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Filter;
