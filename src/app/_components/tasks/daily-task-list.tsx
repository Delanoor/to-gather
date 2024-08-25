'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { IconPlus, IconTrash } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { UpdateTasksSchema, updateTasksSchema } from '@/types/task';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const DailyTaskList = ({
  className,
}: {
  className?: string;
}) => {
  const router = useRouter();
  const { data: tasks, isLoading } = api.task.getDailyTasks.useQuery({
    date: new Date().toDateString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const { mutate: createTasks, isPending } = api.task.updateTasks.useMutation({
    onSuccess: () => {
      toast.success('Tasks updated');
      router.refresh();
    },
    onError: () => {
      toast.error('Failed to create tasks');
    },
  });

  const { mutate: deleteTask } = api.task.deleteTask.useMutation({
    onSuccess: () => {
      toast.success('Task deleted');
      router.refresh();
    },
    onError: () => {
      toast.error('Failed to delete task');
    },
  });

  const form = useForm<UpdateTasksSchema>({
    defaultValues: {
      tasks: tasks?.map((task) => ({
        taskId: String(task.id),
        title: task.title,
        dueDate: task.dueDate.toDateString(),
        completed: task.completed,
      })),
    },
    values: tasks && {
      tasks: tasks?.map((task) => ({
        taskId: String(task.id),
        title: task.title,
        dueDate: task.dueDate.toDateString(),
        completed: task.completed,
      })),
    },
    resolver: zodResolver(updateTasksSchema),
  });

  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: 'tasks',
  });

  const onSubmit = (data: UpdateTasksSchema) => {
    createTasks(data);
  };

  return (
    <div className={cn(className)}>
      <div className="flex items-center justify-between">
        <div className="font-medium">Today's Tasks</div>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => {
            append({
              taskId: '',
              title: '',
              dueDate: new Date().toDateString(),
              completed: false,
            });
          }}
        >
          <IconPlus className="h-4 w-4" />
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <div className="space-y-1">
            {isLoading && (
              <div className="space-y-1">
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
              </div>
            )}
            {fields.map((field, index) => (
              <div className="flex items-center space-x-1 w-full px-2 hover:bg-muted rounded">
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`tasks.${index}.completed`}
                  render={({ field }) => (
                    <FormItem className="flex">
                      <FormControl>
                        <Checkbox
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`tasks.${index}.title`}
                  render={({ field: formField }) => (
                    <FormItem className="flex-1 w-full focus-visible:underline">
                      <FormControl>
                        <Input
                          className={cn(
                            'border-none shadow-none py-0 h-6 text-sm focus-visible:ring-0 focus-visible:underline w-full',
                            {
                              'line-through': field.completed,
                            },
                          )}
                          {...formField}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (!field.taskId) {
                      remove(index);
                    } else {
                      deleteTask({ id: field.taskId });
                    }
                  }}
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="self-end">
            <Button disabled={isPending}>Save</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DailyTaskList;
