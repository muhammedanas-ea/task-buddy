import { DragDropContext, DropResult } from "@hello-pangea/dnd";
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

  if (loading) {
    return <Loading />;
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
                  />
                ))}
              </TaskRow>
            </div>
          </DragDropContext>
        </>
      )}
    </div>
  );
};

export default TaskList;
