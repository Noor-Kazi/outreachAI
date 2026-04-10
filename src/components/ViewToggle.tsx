import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ViewOption {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface ViewToggleProps {
    options: ViewOption[];
    activeView: string;
    onViewChange: (viewId: string) => void;
}

export function ViewToggle({ options, activeView, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex p-1 space-x-1 bg-muted/50 backdrop-blur-sm rounded-xl border border-border/50 w-full sm:w-auto">
            {options.map((option) => {
                const isActive = activeView === option.id;
                return (
                    <button
                        key={option.id}
                        onClick={() => onViewChange(option.id)}
                        className={`
              relative flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg flex-1 sm:flex-none
              ${isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}
            `}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeViewParams"
                                className="absolute inset-0 bg-primary rounded-lg shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <option.icon className="w-4 h-4" />
                            {option.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
