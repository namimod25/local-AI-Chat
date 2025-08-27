import { Moon, Plus, Sun } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarPrimitive,
} from "~/components/ui/sidebar";
import { useTheme } from "./ThemeProvider";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { db } from "~/lib/dexie";
import {useLiveQuery} from 'dexie-react-hooks';
import { Link, useLocation } from "react-router";



export const ChatSidebar = () => {
  const [activeThread, setActiveThread] = useState("");
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [textInput, setTextInput] = useState("");

  const { setTheme, theme } = useTheme();

  const location = useLocation();

const threads = useLiveQuery(() => db.getThreads(), []); //<-trigger query

  const handleToggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const handleCreateThread = async () => {
    const threadId = await db.addThread(textInput);

    setDialogIsOpen(false);
    setTextInput("");
  };

  useLayoutEffect(() => {
   const activeThread = location.pathname.split("/")[2]
    setActiveThread(activeThread)    //Highlight active thread
  }, [location.pathname]);

  return (
    <>
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>
        
        <div>
          <label htmlFor="thread-title">thread title</label>
          <Input id="thread-title" value={textInput} onChange={(e) => {
            setTextInput(e.target.value);
            }}
            placeholder=" Kamu mau nulis apa?"
            />
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setDialogIsOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateThread}>Create thread</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <SidebarPrimitive>
      <SidebarHeader>
        <Button onClick={() => setDialogIsOpen(true)} className="w-full justify-start" variant="ghost">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
            <SidebarMenu>
              {threads?.map((threads) => (   //<-map store in db // read and list treads from db and  /*-dynamic routing */
                <SidebarMenuItem key={threads.id}>
                  <Link to={`/thread/${threads.id}`}> 
                    <SidebarMenuButton isActive={threads.id === activeThread}>
                      {threads.title}
                      </SidebarMenuButton>
                  </Link>
                  </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          onClick={handleToggleTheme}
          variant="ghost"
          className="w-full justify-start"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />{" "}
          Toggle Theme
        </Button>
      </SidebarFooter>
    </SidebarPrimitive>
    </>
  );
};
