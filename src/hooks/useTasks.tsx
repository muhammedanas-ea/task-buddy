import { useEffect, useState } from "react";
import { Task } from "../type/type";
import { useUserAuth } from "../context/userAuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const getTasksByStatus = (status: Task["status"]) =>
    tasks.filter((task) => task.status === status);

  return { tasks, loading, error, getTasksByStatus };
};

export default useTasks;
