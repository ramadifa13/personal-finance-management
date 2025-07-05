
import * as Progress from "@radix-ui/react-progress";
import { cn } from "@/lib/utils"; 

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

const ProgressBar = ({ value, max = 100, className }: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100); 
  return (
    <Progress.Root
      className={cn("relative h-3 w-full overflow-hidden rounded-full bg-muted", className)}
      value={percentage}
      max={100}
    >
      <Progress.Indicator
        className="h-full bg-green-500 transition-transform duration-300"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </Progress.Root>
  );
};


export default ProgressBar;
