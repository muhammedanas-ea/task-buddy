export interface BoardColumnProps {
  title: string;
  bgColor: string;
  descrption?: string;
  children: React.ReactNode;
}

export interface BoardCardProps {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  isCompleted?: boolean;
  onDelete: (id: string) => void;
}
