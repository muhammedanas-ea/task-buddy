import { useEffect, useState, useMemo } from "react";
import { Task } from "../type/type";
import { useUserAuth } from "../context/userAuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export type TaskStatus = "TO-DO" | "IN-PROGRESS" | "COMPLETED";
export type TaskCategory = "Work" | "Personal";

interface TaskFilters {
  searchQuery: string;
  category: TaskCategory | null;
}

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    searchQuery: "",
    category: null
  });
  
  const { user } = useUserAuth();

  useEffect(() => {
    if (!user) return;
    
    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];
        setTasks(tasksData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const filteredTasks = useMemo(() => {
    const { searchQuery, category } = filters;
    return tasks.filter((task) => {
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !category || task.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [tasks, filters]);

  const getTasksByStatus = (status: TaskStatus) => 
    filteredTasks.filter(task => task.status === status);

  const setSearchQuery = (searchQuery: string) => 
    setFilters(prev => ({ ...prev, searchQuery }));

  const setCategory = (category: TaskCategory | null) => 
    setFilters(prev => ({ ...prev, category }));

  const hasResults = filteredTasks.length > 0;

  return {
    loading,
    error,
    filters,
    hasResults,
    getTasksByStatus,
    setSearchQuery,
    setCategory
  };
};

export default useTasks;