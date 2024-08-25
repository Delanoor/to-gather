import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';

const TaskList = ({
  selectedDate,
  className,
}: {
  selectedDate?: Date;
  className?: string;
}) => {
  const { data: tasks, isLoading } = api.task.getTasksByDate.useQuery({
    date: selectedDate?.toDateString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  return (
    <div className={cn(className)}>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        tasks?.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-4 p-4 rounded-md bg-muted"
          >
            <div className="flex-1">
              <div className="font-medium">{task.title}</div>
              <div className="text-sm text-muted-foreground">
                Due: {task.dueDate.toLocaleDateString()}
              </div>
            </div>
            <Checkbox checked={task.completed} />
          </div>
        ))
      )}
      {/* <div className="flex items-center gap-4 p-4 rounded-md bg-muted">
        <div className="flex-1">
          <div className="font-medium">Finish quarterly report</div>
          <div className="text-sm text-muted-foreground">Due: April 15</div>
        </div>
        <Checkbox checked />
      </div>
      <div className="flex items-center gap-4 p-4 rounded-md bg-muted">
        <div className="flex-1">
          <div className="font-medium">Call with client</div>
          <div className="text-sm text-muted-foreground">Due: April 10</div>
        </div>
        <Checkbox />
      </div>
      <div className="flex items-center gap-4 p-4 rounded-md bg-muted">
        <div className="flex-1">
          <div className="font-medium">Prepare for team meeting</div>
          <div className="text-sm text-muted-foreground">Due: April 20</div>
        </div>
        <Checkbox />
      </div>
      <div className="flex items-center gap-4 p-4 rounded-md bg-muted">
        <div className="flex-1">
          <div className="font-medium">Review marketing strategy</div>
          <div className="text-sm text-muted-foreground">Due: April 25</div>
        </div>
        <Checkbox />
      </div>
      <div className="flex items-center gap-4 p-4 rounded-md bg-muted">
        <div className="flex-1">
          <div className="font-medium">Attend leadership workshop</div>
          <div className="text-sm text-muted-foreground">Due: May 1</div>
        </div>
        <Checkbox />
      </div> */}
    </div>
  );
};

export default TaskList;
