/**
 * ProjectDiffSidebarContent
 *
 * Replaces the normal project/thread sidebar when the project diff route is
 * active. Shows a back button, project name + branch, and the live file tree.
 *
 * Self-contained in `project-diff/` — delete this folder to remove the feature.
 */

import { memo, useCallback } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { EnvironmentId, ProjectId } from "@t3tools/contracts";
import { useTheme } from "../../hooks/useTheme";
import { useGitStatus } from "../../lib/gitStatusState";
import { selectProjectByRef, useStore } from "../../store";
import { SidebarContent, SidebarGroup, SidebarHeader } from "../ui/sidebar";
import { DiffStatLabel } from "../chat/DiffStatLabel";
import { ProjectDiffFilesTree } from "./ProjectDiffFilesTree";

interface ProjectDiffSidebarContentProps {
  environmentId: string;
  projectId: string;
  selectedFilePath?: string | null;
}

export const ProjectDiffSidebarContent = memo(function ProjectDiffSidebarContent(
  props: ProjectDiffSidebarContentProps,
) {
  const { environmentId, projectId, selectedFilePath } = props;
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();

  const project = useStore((store) =>
    selectProjectByRef(store, {
      environmentId: environmentId as EnvironmentId,
      projectId: ProjectId.make(projectId),
    }),
  );

  const gitStatus = useGitStatus({
    environmentId: project?.environmentId ?? null,
    cwd: project?.cwd ?? null,
  });

  const workingTreeFiles = gitStatus.data?.workingTree.files ?? [];
  const totalInsertions = gitStatus.data?.workingTree.insertions ?? 0;
  const totalDeletions = gitStatus.data?.workingTree.deletions ?? 0;
  const branchName = gitStatus.data?.refName ?? null;

  const handleBack = useCallback(() => {
    void navigate({ to: "/" });
  }, [navigate]);

  const handleFileClick = useCallback(
    (filePath: string) => {
      void navigate({
        to: "/project/$environmentId/$projectId",
        params: { environmentId, projectId },
        search: { gitDiffFilePath: filePath, gitDiffFocus: String(Date.now()) },
      });
    },
    [environmentId, navigate, projectId],
  );

  return (
    <>
      <SidebarHeader className="gap-0 border-b border-border px-3 py-2">
        {/* Back button */}
        <button
          type="button"
          onClick={handleBack}
          className="mb-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="size-3" />
          <span>Back</span>
        </button>

        {/* Project name */}
        <span className="truncate text-xs font-medium text-foreground/90">
          {project?.name ?? "Project"}
        </span>

        {/* Branch + stats row */}
        <div className="mt-0.5 flex items-center gap-2">
          {branchName && (
            <span className="truncate font-mono text-[10px] text-muted-foreground/60">
              {branchName}
            </span>
          )}
          {(totalInsertions > 0 || totalDeletions > 0) && (
            <span className="ml-auto shrink-0 font-mono text-[10px] tabular-nums">
              <DiffStatLabel additions={totalInsertions} deletions={totalDeletions} />
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-0 py-0">
          <ProjectDiffFilesTree
            environmentId={environmentId as EnvironmentId}
            cwd={project?.cwd ?? ""}
            workingTreeFiles={workingTreeFiles}
            resolvedTheme={resolvedTheme}
            onFileClick={handleFileClick}
            selectedFilePath={selectedFilePath ?? null}
          />
        </SidebarGroup>
      </SidebarContent>
    </>
  );
});
