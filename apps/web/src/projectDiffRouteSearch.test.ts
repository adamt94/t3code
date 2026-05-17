import { describe, expect, it } from "vitest";

import { parseProjectDiffRouteSearch } from "./projectDiffRouteSearch";

describe("parseProjectDiffRouteSearch", () => {
  it("parses a selected project diff file path", () => {
    expect(
      parseProjectDiffRouteSearch({ gitDiffFilePath: "src/app.ts", gitDiffFocus: "42" }),
    ).toEqual({
      gitDiffFilePath: "src/app.ts",
      gitDiffFocus: "42",
    });
  });

  it("drops empty selected file path values", () => {
    expect(parseProjectDiffRouteSearch({ gitDiffFilePath: "  ", gitDiffFocus: "42" })).toEqual({});
  });
});
