/**
 * Project Git Diff Route
 *
 * Path: /_chat/project/:environmentId/:projectId
 *
 * Renders the GitHub-style working-tree diff view.
 * The left sidebar is handled by Sidebar.tsx detecting this route.
 * This route renders only the right content panel (ProjectDiffPanel).
 *
 * To remove this feature: delete this file, the project-diff/ folder,
 * and revert the surgical changes in Sidebar.tsx.
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Suspense, useCallback } from "react";
import { EnvironmentId, ProjectId } from "@t3tools/contracts";
import { DiffWorkerPoolProvider } from "../components/DiffWorkerPoolProvider";
import {
  DiffPanelLoadingState,
  DiffPanelShell,
  DiffPanelHeaderSkeleton,
} from "../components/DiffPanelShell";
import { SidebarInset } from "../components/ui/sidebar";
import { selectProjectByRef, useStore } from "../store";
import { ProjectDiffPanel } from "../components/project-diff/ProjectDiffPanel";
import { ProjectDiffEmptyState } from "../components/project-diff/ProjectDiffEmptyState";
import { parseProjectDiffRouteSearch } from "../projectDiffRouteSearch";

// ── Route definition ──────────────────────────────────────────────────────────

export const Route = createFileRoute("/_chat/project/$environmentId/$projectId")({
  validateSearch: (search) => parseProjectDiffRouteSearch(search),
  component: ProjectDiffRouteView,
});

// ── Loading fallback ──────────────────────────────────────────────────────────

function ProjectDiffLoadingFallback() {
  return (
    <DiffPanelShell mode="sidebar" header={<DiffPanelHeaderSkeleton />}>
      <DiffPanelLoadingState label="Loading working tree diff..." />
    </DiffPanelShell>
  );
}

// ── Route component ───────────────────────────────────────────────────────────

function ProjectDiffRouteView() {
  const { environmentId, projectId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const project = useStore((store) =>
    selectProjectByRef(store, {
      environmentId: environmentId as EnvironmentId,
      projectId: ProjectId.make(projectId),
    }),
  );

  const handleBack = useCallback(() => {
    void navigate({ to: "/" });
  }, [navigate]);

  // Project not found — show a proper empty state
  if (!project) {
    return (
      <SidebarInset className="h-dvh min-h-0 overflow-hidden bg-background text-foreground">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
          <ProjectDiffEmptyState kind="not-found" onBack={handleBack} />
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset className="h-dvh min-h-0 overflow-hidden bg-background text-foreground">
      <DiffWorkerPoolProvider>
        <Suspense fallback={<ProjectDiffLoadingFallback />}>
          <ProjectDiffPanel
            environmentId={project.environmentId}
            cwd={project.cwd}
            projectName={project.name}
            onBack={handleBack}
            selectedFilePath={search.gitDiffFilePath ?? null}
            selectedFileFocusKey={search.gitDiffFocus ?? null}
          />
        </Suspense>
      </DiffWorkerPoolProvider>
    </SidebarInset>
  );
}
