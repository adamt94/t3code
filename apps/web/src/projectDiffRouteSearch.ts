export interface ProjectDiffRouteSearch {
  gitDiffFilePath?: string | undefined;
  gitDiffFocus?: string | undefined;
}

function normalizeSearchString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

export function parseProjectDiffRouteSearch(
  search: Record<string, unknown>,
): ProjectDiffRouteSearch {
  const gitDiffFilePath = normalizeSearchString(search.gitDiffFilePath);
  if (!gitDiffFilePath) {
    return {};
  }
  const gitDiffFocus = normalizeSearchString(search.gitDiffFocus);
  return gitDiffFocus ? { gitDiffFilePath, gitDiffFocus } : { gitDiffFilePath };
}
