import { TaskForm } from '@/components/tasks/TaskForm';
import { MainLayout } from '@/components/layout/MainLayout';

export default function NewTask() {
  return (
    <MainLayout>
      <TaskForm />
    </MainLayout>
  );
}
