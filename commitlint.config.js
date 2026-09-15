/**
 * Conventional Commits, enforced on every commit via .husky/commit-msg.
 * Format: <type>(<scope>): <subject>
 * Example: feat(investor): add marketplace tier filter
 *
 * Scopes map to the top-level route groups so `git log --oneline` reads
 * as a changelog: business | buyer | investor | admin | landing | ui |
 * auth | infra | docs.
 *
 * Keep this list and the one in CONTRIBUTING.md ("Commits" section)
 * identical — if one changes, change the other in the same commit.
 */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "business",
        "buyer",
        "investor",
        "admin",
        "landing",
        "auth",
        "ui",
        "types",
        "infra",
        "docs",
        "deps",
      ],
    ],
  },
};

export default config;
