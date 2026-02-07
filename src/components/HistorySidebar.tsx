import { motion, AnimatePresence } from "framer-motion";
import { Clock, User, ChevronRight, Trash2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { OutreachHistory } from "@/types/outreach";
import { formatDistanceToNow } from "date-fns";

interface HistorySidebarProps {
  history: OutreachHistory[];
  onSelect: (item: OutreachHistory) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export function HistorySidebar({ history, onSelect, onDelete, selectedId }: HistorySidebarProps) {
  return (
    <div className="h-full flex flex-col bg-sidebar text-sidebar-foreground">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="font-semibold flex items-center gap-2">
          <Database className="h-4 w-4 text-sidebar-primary" />
          Knowledge Base
        </h2>
        <p className="text-xs text-sidebar-foreground/60 mt-1">
          {history.length} previous outreach{history.length !== 1 ? 'es' : ''}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          <AnimatePresence mode="popLayout">
            {history.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 text-center text-sidebar-foreground/50"
              >
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No history yet</p>
                <p className="text-xs mt-1">Generated outreach will appear here</p>
              </motion.div>
            ) : (
              history.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`group rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedId === item.id 
                      ? 'bg-sidebar-accent' 
                      : 'hover:bg-sidebar-accent/50'
                  }`}
                  onClick={() => onSelect(item)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 border border-sidebar-border">
                      <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                        {item.profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm truncate">
                          {item.profile.name}
                        </p>
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                      <p className="text-xs text-sidebar-foreground/60 truncate">
                        {item.profile.role} at {item.profile.company}
                      </p>
                      <p className="text-xs text-sidebar-foreground/40 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
