
"use client"

import { useState, type SVGProps } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function Tasks() {
  const [friends, setFriends] = useState([
    {
      name: "John Doe",
      tasks: [
        {
          title: "Finish quarterly report",
          dueDate: "April 15",
          completed: false,
        },
        {
          title: "Call with client",
          dueDate: "April 10",
          completed: true,
        },
      ],
    },
    {
      name: "Jane Smith",
      tasks: [
        {
          title: "Prepare for team meeting",
          dueDate: "April 20",
          completed: false,
        },
        {
          title: "Review marketing strategy",
          dueDate: "April 25",
          completed: false,
        },
      ],
    },
    {
      name: "Bob Johnson",
      tasks: [
        {
          title: "Attend leadership workshop",
          dueDate: "May 1",
          completed: false,
        },
      ],
    },
  ])
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">To-Gather</h1>
        <Button variant="secondary" size="sm">
          Share Calendar
        </Button>
      </header>
      <main className="flex-1 grid grid-cols-[300px_1fr] gap-6 p-6">
        <div className="bg-card rounded-lg shadow-md p-6">
          <Calendar
            mode="single"
            className="[&_td]:w-10 [&_td]:h-10 [&_th]:w-10 [&_[name=day]]:w-10 [&_[name=day]]:h-10"
          />
          <Separator className="my-4" />
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Today's Tasks</div>
              <Button variant="ghost" size="icon">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                <Checkbox />
                <div className="flex-1 text-sm">Finish quarterly report</div>
                <Button variant="ghost" size="icon">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                <Checkbox checked />
                <div className="flex-1 text-sm line-through text-muted-foreground">Call with client</div>
                <Button variant="ghost" size="icon">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                <Checkbox />
                <div className="flex-1 text-sm">Prepare for team meeting</div>
                <Button variant="ghost" size="icon">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Tasks</h2>
            <Button size="sm">Add Task</Button>
          </div>
          <Separator className="my-4" />
          <ScrollArea className="max-h-[70vh]">
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 rounded-md bg-muted">
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
              </div>
            </div>
          </ScrollArea>
        </div>
        <div className="bg-card rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Friends</h2>
            <Button size="sm">Add Friend</Button>
          </div>
          <Separator className="my-4" />
          <ScrollArea className="max-h-[70vh]">
            <div className="grid gap-4">
              {friends.map((friend) => (
                <div key={friend.name} className="flex items-start gap-4 p-4 rounded-md bg-muted">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt={friend.name} />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{friend.name}</div>
                    <div className="grid gap-2 mt-2">
                      {friend.tasks.map((task, index) => (
                        <div key={index} className="flex items-center gap-4 p-2 rounded-md bg-card">
                          <Checkbox checked={task.completed} />
                          <div className="flex-1">
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-muted-foreground">Due: {task.dueDate}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  )
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}


function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}