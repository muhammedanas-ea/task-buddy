export interface Task {
  id: string;
  title: string;
  dueon: string;
  status: "TO-DO" | "IN-PROGRESS" | "COMPLETED";
  category: "Work" | "Personal";
  description?: string;
  imageUrl?: string;
}
