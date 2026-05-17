import {
  type EnvironmentId,
  OrchestrationGetFullThreadDiffInput,
  OrchestrationGetTurnDiffInput,
  ThreadId,
} from "@t3tools/contracts";
// Project working-tree diff feature import — remove to roll back
import type { VcsGetWorkingTreeDiffResult } from "@t3tools/contracts";
import { queryOptions } from "@tanstack/react-query";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import { ensureEnvironmentApi } from "../environmentApi";

const decodeFullThreadDiffInput = Schema.decodeUnknownOption(OrchestrationGetFullThreadDiffInput);
const decodeTurnDiffInput = Schema.decodeUnknownOption(OrchestrationGetTurnDiffInput);

interface CheckpointDiffQueryInput {
  environmentId: EnvironmentId | null;
  threadId: ThreadId | null;
  fromTurnCount: number | null;
  toTurnCount: number | null;
  ignoreWhitespace: boolean;
  cacheScope?: string | null;
  enabled?: boolean;
}

export const providerQueryKeys = {
  all: ["providers"] as const,
  checkpointDiff: (input: CheckpointDiffQueryInput) =>
    [
      "providers",
      "checkpointDiff",
      input.environmentId ?? null,
      input.threadId,
      input.fromTurnCount,
      input.toTurnCount,
      input.ignoreWhitespace,
      input.cacheScope ?? null,
    ] as const,
};

function decodeCheckpointDiffRequest(input: CheckpointDiffQueryInput) {
  if (input.fromTurnCount === 0) {
    return decodeFullThreadDiffInput({
      threadId: input.threadId,
      toTurnCount: input.toTurnCount,
      ignoreWhitespace: input.ignoreWhitespace,
    }).pipe(Option.map((fields) => ({ kind: "fullThreadDiff" as const, input: fields })));
  }

  return decodeTurnDiffInput({
    threadId: input.threadId,
    fromTurnCount: input.fromTurnCount,
    toTurnCount: input.toTurnCount,
    ignoreWhitespace: input.ignoreWhitespace,
  }).pipe(Option.map((fields) => ({ kind: "turnDiff" as const, input: fields })));
}

function asCheckpointErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "";
}

function normalizeCheckpointErrorMessage(error: unknown): string {
  const message = asCheckpointErrorMessage(error).trim();
  if (message.length === 0) {
    return "Failed to load checkpoint diff.";
  }

  const lower = message.toLowerCase();
  if (lower.includes("not a git repository")) {
    return "Turn diffs are unavailable because this project is not a git repository.";
  }

  if (
    lower.includes("checkpoint unavailable for thread") ||
    lower.includes("checkpoint invariant violation")
  ) {
    const separatorIndex = message.indexOf(":");
    if (separatorIndex >= 0) {
      const detail = message.slice(separatorIndex + 1).trim();
      if (detail.length > 0) {
        return detail;
      }
    }
  }

  return message;
}

function isCheckpointTemporarilyUnavailable(error: unknown): boolean {
  const message = asCheckpointErrorMessage(error).toLowerCase();
  return (
    message.includes("exceeds current turn count") ||
    message.includes("checkpoint is unavailable for turn") ||
    message.includes("filesystem checkpoint is unavailable")
  );
}

// ── Project working-tree diff feature ─────────────────────────────────────────
// Delete this entire block (and the import above) to roll back the feature.

export interface WorkingTreeDiffQueryInput {
  environmentId: EnvironmentId | null;
  cwd: string | null;
  enabled?: boolean;
}

export const workingTreeDiffQueryKeys = {
  workingTreeDiff: (input: WorkingTreeDiffQueryInput) =>
    ["vcs", "workingTreeDiff", input.environmentId ?? null, input.cwd ?? null] as const,
};

export function workingTreeDiffQueryOptions(input: WorkingTreeDiffQueryInput) {
  return queryOptions<VcsGetWorkingTreeDiffResult>({
    queryKey: workingTreeDiffQueryKeys.workingTreeDiff(input),
    queryFn: async () => {
      if (!input.environmentId || !input.cwd) {
        throw new Error("Working tree diff requires an environment and project path.");
      }
      const { ensureEnvironmentApi } = await import("../environmentApi");
      const api = ensureEnvironmentApi(input.environmentId);
      return api.vcs.getWorkingTreeDiff({ cwd: input.cwd });
    },
    enabled: (input.enabled ?? true) && !!input.environmentId && !!input.cwd,
    // Never auto-refetch — the refresh button calls refetch() explicitly.
    staleTime: Infinity,
    // Don't persist across route unmounts; each mount fetches fresh.
    gcTime: 0,
    retry: 1,
  });
}
// ──────────────────────────────────────────────────────────────────────────────

export function checkpointDiffQueryOptions(input: CheckpointDiffQueryInput) {
  const decodedRequest = decodeCheckpointDiffRequest(input);

  return queryOptions({
    queryKey: providerQueryKeys.checkpointDiff(input),
    queryFn: async () => {
      if (!input.environmentId || !input.threadId || decodedRequest._tag === "None") {
        throw new Error("Checkpoint diff is unavailable.");
      }
      const api = ensureEnvironmentApi(input.environmentId);
      try {
        if (decodedRequest.value.kind === "fullThreadDiff") {
          return await api.orchestration.getFullThreadDiff(decodedRequest.value.input);
        }
        return await api.orchestration.getTurnDiff(decodedRequest.value.input);
      } catch (error) {
        throw new Error(normalizeCheckpointErrorMessage(error), { cause: error });
      }
    },
    enabled:
      (input.enabled ?? true) &&
      !!input.environmentId &&
      !!input.threadId &&
      decodedRequest._tag === "Some",
    staleTime: Infinity,
    retry: (failureCount, error) => {
      if (isCheckpointTemporarilyUnavailable(error)) {
        return failureCount < 12;
      }
      return failureCount < 3;
    },
    retryDelay: (attempt, error) =>
      isCheckpointTemporarilyUnavailable(error)
        ? Math.min(5_000, 250 * 2 ** (attempt - 1))
        : Math.min(1_000, 100 * 2 ** (attempt - 1)),
  });
}
