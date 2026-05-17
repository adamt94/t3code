/**
 * ProjectDiffPanel
 *
 * Content panel (right side) for the project working-tree diff feature.
 * Shows `git diff HEAD` output using the same @pierre/diffs renderer as
 * the existing DiffPanel — stripped of thread/turn navigation.
 *
 * Self-contained in `project-diff/` — delete this folder to remove the feature.
 */

import { parsePatchFiles } from "@pierre/diffs";
import { FileDiff, type FileDiffMetadata, Virtualizer } from "@pierre/diffs/react";
import { useQuery } from "@tanstack/react-query";
import type { EnvironmentId } from "@t3tools/contracts";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Columns2Icon,
  RefreshCwIcon,
  Rows3Icon,
  TextWrapIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { cn } from "~/lib/utils";
import { buildPatchCacheKey, resolveDiffThemeName } from "../../lib/diffRendering";
import { workingTreeDiffQueryOptions } from "../../lib/providerReactQuery";
import { useGitStatus } from "../../lib/gitStatusState";
import { useSettings } from "../../hooks/useSettings";
import { useTheme } from "../../hooks/useTheme";
import { DiffPanelLoadingState, DiffPanelShell } from "../DiffPanelShell";
import { ProjectDiffEmptyState } from "./ProjectDiffEmptyState";
import { Toggle, ToggleGroup } from "../ui/toggle-group";
import { openInPreferredEditor } from "../../editorPreferences";
import { readLocalApi } from "../../localApi";
import { resolvePathLinkTarget } from "../../terminal-links";

// ── Shared with DiffPanel.tsx — duplicated intentionally so this feature
//    module has zero runtime coupling to the thread-diff code. ─────────────────

type DiffRenderMode = "stacked" | "split";
type DiffThemeType = "light" | "dark";

const DIFF_PANEL_UNSAFE_CSS = `
[data-diffs-header],
[data-diff],
[data-file],
[data-error-wrapper],
[data-virtualizer-buffer] {
  --diffs-bg: color-mix(in srgb, var(--card) 90%, var(--background)) !important;
  --diffs-light-bg: color-mix(in srgb, var(--card) 90%, var(--background)) !important;
  --diffs-dark-bg: color-mix(in srgb, var(--card) 90%, var(--background)) !important;
  --diffs-token-light-bg: transparent;
  --diffs-token-dark-bg: transparent;

  --diffs-bg-context-override: color-mix(in srgb, var(--background) 97%, var(--foreground));
  --diffs-bg-hover-override: color-mix(in srgb, var(--background) 94%, var(--foreground));
  --diffs-bg-separator-override: color-mix(in srgb, var(--background) 95%, var(--foreground));
  --diffs-bg-buffer-override: color-mix(in srgb, var(--background) 90%, var(--foreground));

  --diffs-bg-addition-override: color-mix(in srgb, var(--background) 92%, var(--success));
  --diffs-bg-addition-number-override: color-mix(in srgb, var(--background) 88%, var(--success));
  --diffs-bg-addition-hover-override: color-mix(in srgb, var(--background) 85%, var(--success));
  --diffs-bg-addition-emphasis-override: color-mix(in srgb, var(--background) 80%, var(--success));

  --diffs-bg-deletion-override: color-mix(in srgb, var(--background) 92%, var(--destructive));
  --diffs-bg-deletion-number-override: color-mix(in srgb, var(--background) 88%, var(--destructive));
  --diffs-bg-deletion-hover-override: color-mix(in srgb, var(--background) 85%, var(--destructive));
  --diffs-bg-deletion-emphasis-override: color-mix(
    in srgb,
    var(--background) 80%,
    var(--destructive)
  );

  background-color: var(--diffs-bg) !important;
}

[data-file-info] {
  background-color: color-mix(in srgb, var(--card) 94%, var(--foreground)) !important;
  border-block-color: var(--border) !important;
  color: var(--foreground) !important;
}

[data-diffs-header] {
  position: sticky !important;
  top: 0;
  z-index: 4;
  background-color: color-mix(in srgb, var(--card) 94%, var(--foreground)) !important;
  border-bottom: 1px solid var(--border) !important;
}

[data-line-type="addition"]:is([data-line], [data-column-number], [data-gutter-buffer], [data-no-newline]),
[data-line-type="change-addition"]:is([data-line], [data-column-number], [data-gutter-buffer], [data-no-newline]) {
  --diffs-line-bg: var(--diffs-bg-addition) !important;
  --diffs-computed-diff-line-bg: var(--diffs-bg-addition) !important;
  --diffs-computed-selected-line-bg: var(--diffs-bg-addition) !important;
  background-color: var(--diffs-bg-addition) !important;
}

[data-line-type="deletion"]:is([data-line], [data-column-number], [data-gutter-buffer], [data-no-newline]),
[data-line-type="change-deletion"]:is([data-line], [data-column-number], [data-gutter-buffer], [data-no-newline]) {
  --diffs-line-bg: var(--diffs-bg-deletion) !important;
  --diffs-computed-diff-line-bg: var(--diffs-bg-deletion) !important;
  --diffs-computed-selected-line-bg: var(--diffs-bg-deletion) !important;
  background-color: var(--diffs-bg-deletion) !important;
}

[data-line-type="addition"]:is([data-column-number], [data-gutter-buffer]),
[data-line-type="change-addition"]:is([data-column-number], [data-gutter-buffer]) {
  color: var(--diffs-fg-number-addition-override, var(--diffs-addition-base)) !important;
  background-color: var(--diffs-bg-addition-number-override, var(--diffs-bg-addition)) !important;
}

[data-line-type="deletion"]:is([data-column-number], [data-gutter-buffer]),
[data-line-type="change-deletion"]:is([data-column-number], [data-gutter-buffer]) {
  color: var(--diffs-fg-number-deletion-override, var(--diffs-deletion-base)) !important;
  background-color: var(--diffs-bg-deletion-number-override, var(--diffs-bg-deletion)) !important;
}

[data-title] {
  cursor: pointer;
  transition:
    color 120ms ease,
    text-decoration-color 120ms ease;
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 2px;
}

[data-title]:hover {
  color: color-mix(in srgb, var(--foreground) 84%, var(--primary)) !important;
  text-decoration-color: currentColor;
}
`;

type RenderablePatch =
  | { kind: "files"; files: FileDiffMetadata[] }
  | { kind: "raw"; text: string; reason: string };

function getRenderablePatch(patch: string | undefined, cacheScope: string): RenderablePatch | null {
  if (!patch) return null;
  const normalized = patch.trim();
  if (normalized.length === 0) return null;
  try {
    const parsed = parsePatchFiles(normalized, buildPatchCacheKey(normalized, cacheScope));
    const files = parsed.flatMap((p) => p.files);
    if (files.length > 0) return { kind: "files", files };
    return { kind: "raw", text: normalized, reason: "Unsupported diff format. Showing raw patch." };
  } catch {
    return { kind: "raw", text: normalized, reason: "Failed to parse patch. Showing raw patch." };
  }
}

function resolveFileDiffPath(fileDiff: FileDiffMetadata): string {
  const raw = fileDiff.name ?? fileDiff.prevName ?? "";
  return raw.startsWith("a/") || raw.startsWith("b/") ? raw.slice(2) : raw;
}

function buildFileDiffRenderKey(fileDiff: FileDiffMetadata): string {
  return fileDiff.cacheKey ?? `${fileDiff.prevName ?? "none"}:${fileDiff.name}`;
}

function getDiffCollapseIconClassName(fileDiff: FileDiffMetadata): string {
  switch (fileDiff.type) {
    case "new":
      return "text-[var(--diffs-addition-base)]";
    case "deleted":
      return "text-[var(--diffs-deletion-base)]";
    case "change":
    case "rename-pure":
    case "rename-changed":
      return "text-[var(--diffs-modified-base)]";
    default:
      return "text-muted-foreground/80";
  }
}
// ─────────────────────────────────────────────────────────────────────────────

export interface ProjectDiffPanelProps {
  environmentId: EnvironmentId;
  cwd: string;
  projectName: string;
  /** Called when the user clicks the back arrow in the header. */
  onBack: () => void;
  /** Scroll to this file path when it changes (driven by the file tree). */
  selectedFilePath?: string | null;
  /** Changes on every file-tree click, including repeated clicks on the same selected file. */
  selectedFileFocusKey?: string | null;
}

export function ProjectDiffPanel(props: ProjectDiffPanelProps) {
  const { environmentId, cwd, projectName, onBack, selectedFilePath, selectedFileFocusKey } = props;
  const { resolvedTheme } = useTheme();
  const settings = useSettings();

  const [diffRenderMode, setDiffRenderMode] = useState<DiffRenderMode>("stacked");
  const [diffWordWrap, setDiffWordWrap] = useState(settings.diffWordWrap);
  const [collapsedDiffFileKeys, setCollapsedDiffFileKeys] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const patchViewportRef = useRef<HTMLDivElement>(null);

  const gitStatus = useGitStatus({ environmentId, cwd });

  const diffQuery = useQuery(workingTreeDiffQueryOptions({ environmentId, cwd }));

  const patch = diffQuery.data?.diff;
  const truncated = diffQuery.data?.truncated ?? false;

  const renderablePatch = useMemo(
    () => getRenderablePatch(patch, `project-diff:${resolvedTheme}`),
    [patch, resolvedTheme],
  );

  const renderableFiles = useMemo(() => {
    if (!renderablePatch || renderablePatch.kind !== "files") return [];
    return renderablePatch.files;
  }, [renderablePatch]);

  const scrollSelectedFileIntoView = useCallback((filePath: string) => {
    const root = patchViewportRef.current;
    if (!root) return false;

    const target = Array.from(root.querySelectorAll<HTMLElement>("[data-diff-file-path]")).find(
      (el) => el.dataset.diffFilePath === filePath,
    );
    if (!target) return false;

    const scroller = root.querySelector<HTMLElement>(".project-diff-scroll-container");
    if (!scroller) {
      target.scrollIntoView({ block: "start" });
      return true;
    }

    const scrollerRect = scroller.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    scroller.scrollBy({
      top: targetRect.top - scrollerRect.top - 8,
      behavior: "smooth",
    });
    return true;
  }, []);

  useEffect(() => {
    if (!selectedFilePath) return;
    if (scrollSelectedFileIntoView(selectedFilePath)) return;

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scrollSelectedFileIntoView(selectedFilePath);
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [renderableFiles, scrollSelectedFileIntoView, selectedFileFocusKey, selectedFilePath]);

  const openFileInEditor = useCallback(
    (filePath: string) => {
      const api = readLocalApi();
      if (!api) return;
      const targetPath = resolvePathLinkTarget(filePath, cwd);
      void openInPreferredEditor(api, targetPath).catch((err) => {
        console.warn("Failed to open diff file in editor.", err);
      });
    },
    [cwd],
  );

  const toggleDiffFileCollapsed = useCallback((fileKey: string) => {
    setCollapsedDiffFileKeys((current) => {
      const next = new Set(current);
      if (next.has(fileKey)) {
        next.delete(fileKey);
      } else {
        next.add(fileKey);
      }
      return next;
    });
  }, []);

  const headerRow = (
    <>
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to projects"
        className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground/70 hover:bg-accent hover:text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
      >
        <ArrowLeftIcon className="size-3.5" />
      </button>

      {/* Title */}
      <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground/80">
        {projectName}
        <span className="ml-1.5 text-muted-foreground/60 font-normal">working tree</span>
      </span>

      {/* Truncation warning */}
      {truncated && (
        <span
          title="Diff was truncated at the server size limit"
          className="inline-flex items-center"
        >
          <TriangleAlertIcon className="size-3.5 text-amber-500/70" />
        </span>
      )}

      {/* Refresh button */}
      <button
        type="button"
        onClick={() => void diffQuery.refetch()}
        disabled={diffQuery.isFetching}
        aria-label="Refresh diff"
        title="Refresh diff"
        className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground/60 hover:bg-accent hover:text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
      >
        <RefreshCwIcon className={cn("size-3", diffQuery.isFetching && "animate-spin")} />
      </button>

      {/* Stacked / split toggle */}
      <ToggleGroup
        className="shrink-0"
        variant="outline"
        size="xs"
        value={[diffRenderMode]}
        onValueChange={(value) => {
          const next = value[0];
          if (next === "stacked" || next === "split") setDiffRenderMode(next);
        }}
      >
        <Toggle value="stacked" aria-label="Stacked diff view">
          <Rows3Icon className="size-3" />
        </Toggle>
        <Toggle value="split" aria-label="Split diff view">
          <Columns2Icon className="size-3" />
        </Toggle>
      </ToggleGroup>

      {/* Word wrap toggle */}
      <Toggle
        aria-label={diffWordWrap ? "Disable word wrap" : "Enable word wrap"}
        title={diffWordWrap ? "Disable word wrap" : "Enable word wrap"}
        variant="outline"
        size="xs"
        pressed={diffWordWrap}
        onPressedChange={(pressed) => setDiffWordWrap(Boolean(pressed))}
      >
        <TextWrapIcon className="size-3" />
      </Toggle>
    </>
  );

  return (
    <DiffPanelShell mode="sidebar" header={headerRow}>
      {/* Truncation warning banner */}
      {truncated && (
        <p className="border-b border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-[11px] text-amber-600/80 dark:text-amber-400/80">
          Diff truncated — the working tree has too many changes to display in full.
        </p>
      )}

      <div ref={patchViewportRef} className="min-h-0 min-w-0 flex-1 overflow-hidden">
        {/* Non-git repo detected via git status subscription */}
        {gitStatus.data?.isRepo === false ? (
          <ProjectDiffEmptyState kind="not-git" />
        ) : diffQuery.isError ? (
          <ProjectDiffEmptyState
            kind="error"
            errorMessage={diffQuery.error instanceof Error ? diffQuery.error.message : null}
            onRetry={() => void diffQuery.refetch()}
          />
        ) : !renderablePatch ? (
          diffQuery.isLoading ? (
            <DiffPanelLoadingState label="Loading working tree diff..." />
          ) : (
            <ProjectDiffEmptyState kind="clean" />
          )
        ) : renderablePatch.kind === "files" ? (
          <Virtualizer
            className="project-diff-scroll-container h-full min-h-0 overflow-auto px-2 pb-2"
            config={{ overscrollSize: 600, intersectionObserverMargin: 1200 }}
          >
            {renderableFiles.map((fileDiff) => {
              const filePath = resolveFileDiffPath(fileDiff);
              const fileKey = buildFileDiffRenderKey(fileDiff);
              const themedFileKey = `${fileKey}:${resolvedTheme}`;
              const collapsed = collapsedDiffFileKeys.has(fileKey);
              return (
                <div
                  key={themedFileKey}
                  data-diff-file-path={filePath}
                  className="group/diff-file mb-2 rounded-md first:mt-2 last:mb-0"
                  onClickCapture={(event) => {
                    const composedPath = (event.nativeEvent as MouseEvent).composedPath?.() ?? [];
                    const clickedHeader = composedPath.some(
                      (node) => node instanceof Element && node.hasAttribute("data-title"),
                    );
                    if (!clickedHeader) return;
                    openFileInEditor(filePath);
                  }}
                >
                  <FileDiff
                    fileDiff={fileDiff}
                    renderHeaderPrefix={() => (
                      <button
                        type="button"
                        className={cn(
                          "inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 transition-colors hover:bg-foreground/10 focus-visible:outline-hidden",
                          getDiffCollapseIconClassName(fileDiff),
                        )}
                        aria-label={collapsed ? `Expand ${filePath}` : `Collapse ${filePath}`}
                        aria-expanded={!collapsed}
                        title={collapsed ? "Expand diff" : "Collapse diff"}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleDiffFileCollapsed(fileKey);
                        }}
                      >
                        {collapsed ? (
                          <ChevronRightIcon className="size-4" />
                        ) : (
                          <ChevronDownIcon className="size-4" />
                        )}
                      </button>
                    )}
                    options={{
                      collapsed,
                      diffStyle: diffRenderMode === "split" ? "split" : "unified",
                      lineDiffType: "none",
                      overflow: diffWordWrap ? "wrap" : "scroll",
                      theme: resolveDiffThemeName(resolvedTheme),
                      themeType: resolvedTheme as DiffThemeType,
                      unsafeCSS: DIFF_PANEL_UNSAFE_CSS,
                    }}
                  />
                </div>
              );
            })}
          </Virtualizer>
        ) : (
          <div className="h-full overflow-auto p-2">
            <div className="space-y-2">
              <p className="text-[11px] text-muted-foreground/75">{renderablePatch.reason}</p>
              <pre
                className={cn(
                  "max-h-[72vh] rounded-md border border-border/70 bg-background/70 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground/90",
                  diffWordWrap
                    ? "overflow-auto whitespace-pre-wrap wrap-break-word"
                    : "overflow-auto",
                )}
              >
                {renderablePatch.text}
              </pre>
            </div>
          </div>
        )}
      </div>
    </DiffPanelShell>
  );
}
