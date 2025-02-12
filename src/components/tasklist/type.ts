export interface TaskRowProps {
  title: string;
  bgColor: string;
  desc?: string;
  children: React.ReactNode;
}

export interface TaskCardProps {
  id: string;
  name: string;
  dueDate: string;
  status: string;
  category: string;
  isCompleted?: boolean;
  onDelete: (id: string) => void;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
}
