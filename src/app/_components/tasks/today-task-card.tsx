import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { IconTrash } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';

const TodayTaskCard = ({
  className,
}: {
  className?: string;
}) => {
  const [tasks] = api.task.getTasks.useSuspenseQuery({
    date: new Date().toDateString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  return (
    <div className={cn(className)}>
      <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
        <Checkbox />
        <div className="flex-1 text-sm">Finish quarterly report</div>
        <Button variant="ghost" size="icon" className="hover:bg-card">
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
        <Checkbox checked />
        <div className="flex-1 text-sm line-through text-muted-foreground">
          Call with client
        </div>
        <Button variant="ghost" size="icon" className="hover:bg-card">
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
        <Checkbox />
        <div className="flex-1 text-sm">Prepare for team meeting</div>
        <Button variant="ghost" size="icon" className="hover:bg-card">
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TodayTaskCard;
