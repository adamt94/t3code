/**
 * ProjectDiffEmptyState
 *
 * Covers all non-loading, non-content states for the project diff feature:
 *   • "not-found"  — project doesn't exist in the store
 *   • "not-git"    — folder is not a git repository
 *   • "clean"      — working tree has no uncommitted changes
 *   • "error"      — diff fetch failed
 *
 * Uses the app's standard Empty component suite so it matches every other
 * empty state in the product.
 */

import {
  CheckCircle2Icon,
  CircleAlertIcon,
  FolderXIcon,
  GitBranchIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

export type ProjectDiffEmptyKind = "not-found" | "not-git" | "clean" | "error";

interface ProjectDiffEmptyStateProps {
  kind: ProjectDiffEmptyKind;
  /** Only used when kind === "error" */
  errorMessage?: string | null;
  /** Called when the user clicks the retry button (kind === "error" only) */
  onRetry?: () => void;
  /** Called when the user clicks the back button (kind === "not-found") */
  onBack?: () => void;
}

const CONFIG: Record<
  ProjectDiffEmptyKind,
  {
    Icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  }
> = {
  "not-found": {
    Icon: FolderXIcon,
    title: "Project not found",
    description:
      "This project no longer exists or may have been removed. Head back to choose another project.",
  },
  "not-git": {
    Icon: GitBranchIcon,
    title: "Not a git repository",
    description:
      "This project folder isn't tracked by git, so there's no working tree diff to show.",
  },
  clean: {
    Icon: CheckCircle2Icon,
    title: "Working tree is clean",
    description: "No uncommitted changes. Everything has been committed — nothing to diff.",
  },
  error: {
    Icon: CircleAlertIcon,
    title: "Failed to load diff",
    description: "Something went wrong while fetching the working tree diff.",
  },
};

export function ProjectDiffEmptyState({
  kind,
  errorMessage,
  onRetry,
  onBack,
}: ProjectDiffEmptyStateProps) {
  const { Icon, title, description } = CONFIG[kind];

  const resolvedDescription = kind === "error" && errorMessage ? errorMessage : description;

  return (
    <Empty>
      <div className="w-full max-w-sm rounded-3xl border border-border/55 bg-card/20 px-8 py-12 shadow-sm/5">
        <EmptyHeader className="max-w-none">
          <EmptyMedia variant="icon">
            <Icon className="size-4.5" />
          </EmptyMedia>

          <EmptyTitle className="text-foreground text-lg">{title}</EmptyTitle>

          <EmptyDescription className="mt-2 text-sm text-muted-foreground/78 leading-relaxed">
            {resolvedDescription}
          </EmptyDescription>
        </EmptyHeader>

        {(kind === "error" && onRetry) || (kind === "not-found" && onBack) ? (
          <EmptyContent className="mt-6">
            {kind === "error" && onRetry && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 px-3 text-xs"
                onClick={onRetry}
              >
                <RefreshCwIcon className="size-3.5" />
                Try again
              </Button>
            )}
            {kind === "not-found" && onBack && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 px-3 text-xs"
                onClick={onBack}
              >
                Go back
              </Button>
            )}
          </EmptyContent>
        ) : null}
      </div>
    </Empty>
  );
}
