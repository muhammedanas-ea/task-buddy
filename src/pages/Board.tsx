import { useState } from "react";
import { BoardColumn } from "../components/board/BoardColumn";
import BoardCard from "../components/board/BoardCard";
import Filter from "../components/Filter";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import useTasks from "../hooks/useTasks";
import { GenerateError } from "../toast/Toast";
import Loading from "../components/Loading";
import Search from "../components/Search";

const Board = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
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
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
          <BoardColumn
            descrption="No Tasks in To-Do"
            title="TO-DO"
            bgColor="bg-[#FAC3FF]"
          >
            {getTasksByStatus("TO-DO").map((task) => (
              <BoardCard
                key={task.id}
                id={task.id}
                title={task.title}
                category={task.category}
                dueDate={task.dueon}
                onDelete={handleDelete}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
              />
            ))}
          </BoardColumn>
          <BoardColumn
            descrption="No Tasks In Progress"
            title="IN-PROGRESS"
            bgColor="bg-[#85D9F1]"
          >
            {getTasksByStatus("IN-PROGRESS").map((task) => (
              <BoardCard
                key={task.id}
                id={task.id}
                title={task.title}
                category={task.category}
                dueDate={task.dueon}
                onDelete={handleDelete}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
              />
            ))}
          </BoardColumn>
          <BoardColumn
            descrption="No Completed Tasks"
            title="COMPLETED"
            bgColor="bg-[#A2D6A0]"
          >
            {getTasksByStatus("COMPLETED").map((task) => (
              <BoardCard
                key={task.id}
                id={task.id}
                title={task.title}
                category={task.category}
                dueDate={task.dueon}
                isCompleted
                onDelete={handleDelete}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
              />
            ))}
          </BoardColumn>
        </div>
      )}
    </div>
  );
};

export default Board;
