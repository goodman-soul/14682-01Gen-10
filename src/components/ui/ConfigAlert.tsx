import React from "react";
import { AlertTriangle, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfigIssue } from "@/types";

interface ConfigAlertProps {
  issues: ConfigIssue[];
  onDismiss?: () => void;
  className?: string;
}

export const ConfigAlert: React.FC<ConfigAlertProps> = ({
  issues,
  onDismiss,
  className,
}) => {
  if (issues.length === 0) return null;

  const hasError = issues.some((i) => i.severity === "error");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-4",
        hasError
          ? "bg-gradient-to-r from-rose-500/10 to-red-500/10 border-rose-500/30"
          : "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex-shrink-0 p-2 rounded-lg",
            hasError ? "bg-rose-500/20" : "bg-amber-500/20"
          )}
        >
          <AlertTriangle
            className={cn(
              "w-5 h-5",
              hasError ? "text-rose-400" : "text-amber-400"
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              "text-sm font-semibold mb-2",
              hasError ? "text-rose-300" : "text-amber-300"
            )}
          >
            {hasError ? "站点配置存在问题" : "站点配置待完善"}
          </h4>
          <ul className="space-y-1.5">
            {issues.map((issue, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm text-slate-300"
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                    issue.severity === "error"
                      ? "bg-rose-400"
                      : "bg-amber-400"
                  )}
                />
                <span className="flex-1">{issue.message}</span>
                {issue.action && (
                  <a
                    href={issue.actionLink || "#"}
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md transition-colors",
                      hasError
                        ? "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                        : "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                    )}
                  >
                    <Settings className="w-3 h-3" />
                    {issue.action}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-0.5",
          hasError
            ? "bg-gradient-to-r from-rose-500/50 via-red-500/50 to-rose-500/50"
            : "bg-gradient-to-r from-amber-500/50 via-orange-500/50 to-amber-500/50"
        )}
      />
    </div>
  );
};
