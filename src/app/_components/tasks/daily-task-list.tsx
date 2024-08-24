'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { IconPlus, IconTrash } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { CreateTasksSchema, createTasksSchema } from '@/types/task';
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
  const { data: tasks } = api.task.getDailyTasks.useQuery({
    date: new Date().toDateString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const { mutate: createTasks, isPending } = api.task.createTasks.useMutation({
    onSuccess: () => {
      toast.success('Tasks created');
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

  const form = useForm<CreateTasksSchema>({
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
    resolver: zodResolver(createTasksSchema),
  });

  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: 'tasks',
  });

  const onSubmit = (data: CreateTasksSchema) => {
    console.log('🚀 ~ onSubmit ~ data:', data);
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
            {fields.map((field, index) => (
              <div className="inline-flex items-center space-x-2 w-full p-2">
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`tasks.${index}.completed`}
                  render={({ field }) => (
                    <FormItem>
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
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input className="text-sm" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:bg-card"
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
