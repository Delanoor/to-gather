'use client';

import { cn } from '@/lib/utils';

const DailyTaskCard = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 p-2 rounded-md hover:bg-muted',
        className,
      )}
    >
      {/* <Checkbox checked={task.completed} />
      <Input className="flex-1 text-sm">{task.title}</Input>
      <Button variant="ghost" size="icon" className="hover:bg-card">
        <IconTrash className="h-4 w-4" />
      </Button> */}
    </div>
  );
};

export default DailyTaskCard;
