import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: ReactNode;
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  className,
}: MetricCardProps) => {
  return (
    <Card
      className={cn(
        "p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lg border border-transparent hover:border-primary/20 hover:bg-accent/40",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <p
              className={cn(
                "text-sm font-medium",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">{icon}</div>
      </div>
    </Card>
  );
};
