import TaskRow from "../components/tasklist/TaskRow";
import Filter from "../components/Filter";
import TaskCard from "../components/tasklist/TaskCard";
import AddTask from "../components/tasklist/AddTask";
import useTasks from "../hooks/useTasks";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { GenerateError } from "../toast/Toast";
import { db } from "../firebase/config";

const TaskList = () => {
  const { loading, error, getTasksByStatus } = useTasks();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleDelete = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      GenerateError("Failed to delete task. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 h-[90vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B1984]"></div>
      </div>
    );
  }

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
    <div>
      <Filter />
      <div className="hidden md:grid grid-cols-5 border-t border-t-gray-300 py-5 text-[13px] font-bold">
        <div className="col-span-2">Task name</div>
        <div>Due on</div>
        <div>Task Status</div>
        <div>Task Category</div>
      </div>
      <div className="mb-6 space-y-7">
        <TaskRow desc="No Tasks in To-Do" title="Todo" bgColor="bg-[#FAC3FF]">
          <AddTask />
          {getTasksByStatus("TO-DO").map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              name={task.title}
              dueDate={task.dueon}
              status={task.status}
              category={task.category}
              onDelete={handleDelete}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
            />
          ))}
        </TaskRow>
        <TaskRow
          desc="No Tasks In Progress"
          title="In Progress"
          bgColor="bg-[#85D9F1]"
        >
          {getTasksByStatus("IN-PROGRESS").map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              name={task.title}
              dueDate={task.dueon}
              status={task.status}
              category={task.category}
              onDelete={handleDelete}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
            />
          ))}
        </TaskRow>
        <TaskRow
          desc="No Completed Tasks"
          title="Completed"
          bgColor="bg-[#CEFFCC]"
        >
          {getTasksByStatus("COMPLETED").map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              name={task.title}
              dueDate={task.dueon}
              status={task.status}
              category={task.category}
              isCompleted
              onDelete={handleDelete}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
            />
          ))}
        </TaskRow>
      </div>
    </div>
  );
};

export default TaskList;
