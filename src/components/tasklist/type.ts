export interface TaskRowProps {
  title: string;
  bgColor: string;
  desc?: string;
  droppableId: string;
  children: React.ReactNode;
}

export interface TaskCardProps {
  id: string;
  index: number;
  name: string;
  dueDate: string;
  status: string;
  category: string;
  isCompleted?: boolean;
  onDelete: (id: string) => void;
}
