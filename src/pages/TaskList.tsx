// TaskList.tsx
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";
import TaskRow from "../components/tasklist/TaskRow";
import Filter from "../components/Filter";
import TaskCard from "../components/tasklist/TaskCard";
import AddTask from "../components/tasklist/AddTask";
import useTasks from "../hooks/useTasks";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { GenerateError } from "../toast/Toast";
import { db } from "../firebase/config";
import Loading from "../components/Loading";
import Search from "../components/Search";

const TaskList = () => {
  const {
    loading,
    error,
    getTasksByStatus,
    filters,
    setSearchQuery,
    setCategory,
    hasResults,
  } = useTasks();

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const handleCheckboxChange = (taskId: string, checked: boolean) => {
    setSelectedTasks((prev) =>
      checked ? [...prev, taskId] : prev.filter((id) => id !== taskId)
    );
    setShowBulkActions(checked || selectedTasks.length > 0);
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedTasks.map((taskId) => deleteDoc(doc(db, "tasks", taskId)))
      );
      setSelectedTasks([]);
      setShowBulkActions(false);
    } catch (err) {
      console.error("Error deleting tasks:", err);
      GenerateError("Failed to delete tasks. Please try again.");
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    try {
      setShowStatusDropdown(!showStatusDropdown)
      await Promise.all(
        selectedTasks.map((taskId) =>
          updateDoc(doc(db, "tasks", taskId), {
            status: newStatus,
            isCompleted: newStatus === "COMPLETED",
          })
        )
      );
      setSelectedTasks([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error("Error updating task statuses:", error);
      GenerateError("Failed to update task statuses. Please try again.");
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      GenerateError("Failed to delete task. Please try again.");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      const taskRef = doc(db, "tasks", draggableId);
      await updateDoc(taskRef, {
        status: destination.droppableId,
        isCompleted: destination.droppableId === "COMPLETED",
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      GenerateError("Failed to update task status. Please try again.");
    }
  };

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="py-12">
        <div className="max-w-md mx-auto bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Filter
        searchQuery={filters.searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={filters.category}
        onCategoryChange={setCategory}
      />
      {!hasResults && filters.searchQuery ? (
        <Search />
      ) : (
        <>
          <div className="hidden md:grid grid-cols-5 border-t border-t-gray-300 py-5 text-[13px] font-bold">
            <div className="col-span-2">Task name</div>
            <div>Due on</div>
            <div>Task Status</div>
            <div>Task Category</div>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="mb-6 space-y-7">
              <TaskRow
                desc="No Tasks in To-Do"
                title="Todo"
                bgColor="bg-[#FAC3FF]"
                droppableId="TO-DO"
              >
                <AddTask />
                {getTasksByStatus("TO-DO").map((task, index) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    index={index}
                    name={task.title}
                    dueDate={task.dueon}
                    status={task.status}
                    category={task.category}
                    onDelete={handleDelete}
                    isSelected={selectedTasks.includes(task.id)}
                    onCheckboxChange={handleCheckboxChange}
                  />
                ))}
              </TaskRow>
              <TaskRow
                desc="No Tasks In Progress"
                title="In Progress"
                bgColor="bg-[#85D9F1]"
                droppableId="IN-PROGRESS"
              >
                {getTasksByStatus("IN-PROGRESS").map((task, index) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    index={index}
                    name={task.title}
                    dueDate={task.dueon}
                    status={task.status}
                    category={task.category}
                    onDelete={handleDelete}
                    isSelected={selectedTasks.includes(task.id)}
                    onCheckboxChange={handleCheckboxChange}
                  />
                ))}
              </TaskRow>
              <TaskRow
                desc="No Completed Tasks"
                title="Completed"
                bgColor="bg-[#CEFFCC]"
                droppableId="COMPLETED"
              >
                {getTasksByStatus("COMPLETED").map((task, index) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    index={index}
                    name={task.title}
                    dueDate={task.dueon}
                    status={task.status}
                    category={task.category}
                    isCompleted
                    onDelete={handleDelete}
                    isSelected={selectedTasks.includes(task.id)}
                    onCheckboxChange={handleCheckboxChange}
                  />
                ))}
              </TaskRow>
            </div>
          </DragDropContext>

          {/* Bulk Actions Popup */}
          {showBulkActions && selectedTasks.length > 0 && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#2D2D2D] rounded-[12px] px-6 py-3 shadow-lg">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedTasks([]);
                    setShowStatusDropdown(false);
                  }}
                  className="flex items-center text-white cursor-pointer gap-2 px-2 rounded-[12px] border border-gray-300"
                >
                  <span>{selectedTasks.length} Tasks Selected</span>
                  <span className="text-lg">×</span>
                </button>
                <div className="w-px h-6 bg-gray-600" />
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="text-white bg-[#8D8A8A24] cursor-pointer px-4 py-1 border rounded-[12px] border-gray-300"
                  >
                    Status
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-[#2D2D2D] rounded-[12px] shadow-lg p-2 border border-gray-300 min-w-[120px]">
                      <button
                        onClick={() => handleBulkStatusUpdate("TO-DO")}
                        className="block w-full text-white text-left px-4 py-2 hover:bg-[#8D8A8A24] rounded-[4px]"
                      >
                        TO-DO
                      </button>
                      <button
                        onClick={() => handleBulkStatusUpdate("IN-PROGRESS")}
                        className="block w-full text-white text-left px-4 py-2 hover:bg-[#8D8A8A24] rounded-[4px]"
                      >
                        IN-PROGRESS
                      </button>
                      <button
                        onClick={() => handleBulkStatusUpdate("COMPLETED")}
                        className="block w-full text-white text-left px-4 py-2 hover:bg-[#8D8A8A24] rounded-[4px]"
                      >
                        COMPLETED
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleBulkDelete}
                  className="text-[#DA2F2F] bg-[#FF353524] cursor-pointer px-4 py-1 border rounded-[12px] border-gray-300"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;
