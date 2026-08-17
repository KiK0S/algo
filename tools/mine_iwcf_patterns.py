#!/usr/bin/env python3
"""Mine repeated C++ contest idioms from an iwcf-style workspace.

The script is read-only: it scans .cpp files, excludes generated run artifacts,
counts regex-based idioms, and prints a Markdown report.
"""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path


DEFAULT_ROOT = Path("/home/kikos/dev/iwcf")
EXCLUDED_PARTS = {"runs", "artifacts"}


@dataclass(frozen=True)
class Pattern:
    key: str
    regex: str
    candidate: str
    kind: str
    pain: int


PATTERNS = [
    Pattern("personal_template", r"#define\s+all\(|#define\s+forn\(|mt19937\s+rng\(time\(0\)\)", "/templates/base_template", "template", 4),
    Pattern("solve_loop_while_cin", r"while\s*\(\s*cin\s*>>[^)]*\)\s*solve\s*\(", "/templates/base_template", "template", 2),
    Pattern("multi_test_t", r"int\s+_t\s*;\s*cin\s*>>\s*_t|while\s*\(\s*_t--\s*\)", "/templates/base_template", "template", 1),
    Pattern("read_array_indexed", r"(forn\s*\([^\n]*\)|for\s*\([^\n]*i\s*=\s*0[^\n]*i\s*<\s*n[^\n]*\))[^\n]*cin\s*>>\s*\w+\s*\[\s*i\s*\]", "/templates/input", "template", 2),
    Pattern("read_vector_by_ref", r"for\s*\(\s*auto\s*&\s*\w+\s*:\s*\w+\s*\)\s*cin\s*>>", "/templates/input", "template", 1),
    Pattern("decrement_indices", r"cin\s*>>[^;]+;\s*(--\w+|\w+--)|cin\s*>>[^;]+,\s*\w+--", "/templates/decrement_indices", "template", 1),
    Pattern("undirected_edges", r"g\s*\[\s*\w+\s*\]\s*\.push_back\s*\(\s*\w+\s*\)\s*;\s*g\s*\[\s*\w+\s*\]\s*\.push_back\s*\(\s*\w+\s*\)", "/templates/input", "template", 2),
    Pattern("dfs_recursive", r"\b(?:void|int|ll|pii|auto|ret|bool)\s+dfs\s*\(", "/templates/dfs_tree", "template", 3),
    Pattern("bfs_queue", r"\bqueue\s*<|queue\s+\w+", "/templates/bfs_dist", "template", 2),
    Pattern("dijkstra_pq", r"priority_queue\s*<[^;]*(dist|pair)|set\s*<\s*(?:pii|pair<[^>]*>)\s*>[^;]*(dist|dijkstra)", "/templates/dijkstra", "template", 3),
    Pattern("coordinate_compress", r"sort\s*\(\s*all\s*\([^)]*\)\s*\)\s*;[^\n]*(?:\n[^\n]*){0,3}unique\s*\(|lower_bound\s*\(\s*all\s*\(\s*(?:coords|coord|vals|values|xs|ys|comp)", "/templates/compress_unique", "template", 2),
    Pattern("binary_search_l_false", r"while\s*\(\s*l\s*\+\s*1\s*<\s*r\s*\)", "/templates/lower_bound_l_false_r_true", "template", 2),
    Pattern("prefix_sum", r"\b(?:pref|prefs|prefix|psum|sum)\s*\[[^\]]+\]\s*=.*\+|vector\s*<[^>]+>\s+(?:pref|prefs|prefix|psum)\s*\([^;]*(?:n\s*\+\s*1|n\+1)", "/templates/static_rsq", "template", 2),
    Pattern("two_pointer", r"for\s*\([^\n]*\b(?:r|ptr)\b[^\n]*\)\s*\{[^{}]{0,300}while\s*\([^)]*\b(?:r|ptr)\b", "/templates/two_pointers", "template", 1),
    Pattern("monotonic_stack", r"while\s*\(\s*\w+\.back\(\)\s*!=|while\s*\(\s*!\s*\w+\.empty\(\)\s*&&[^)]*\w+\.back\(\)", "/templates/monotonic_stack", "template", 2),
    Pattern("ordered_set_pbds", r"__gnu_pbds|tree\s*<\s*[^,]+\s*,\s*null_type|order_of_key|find_by_order", "/templates/ordered_set", "template", 2),
    Pattern("dsu_inline", r"\bfind\s*\(\s*int\s+\w+\s*\).*\bparent|\bunite\s*\(|\bmerge\s*\(\s*int\s+\w+\s*,\s*int\s+\w+\s*\)", "/templates/dsu_short", "template", 3),
    Pattern("fenwick_inline", r"\bi\s*\+=\s*i\s*&\s*-i|\bi\s*-=\s*i\s*&\s*-i|Fenwick|fenwick", "/templates/fenwick_sum", "template", 3),
    Pattern("segtree_inline", r"\bstruct\s+(?:seg|segtree|Segment|Tree)\b|\bclass\s+(?:seg|segtree|Segment|Tree)\b|\bbuild\s*\(\s*int\s+v\s*,\s*int\s+tl", "/templates/segtree", "template", 5),
    Pattern("grid_dirs", r"dx\s*\[[^\]]*\]\s*=|dy\s*\[[^\]]*\]\s*=|for\s*\([^\n]*d\s*=\s*0[^\n]*d\s*<\s*4", "/templates/grid4", "template", 1),
    Pattern("modpow", r"\b(?:binpow|bpow|modpow|powmod|fexp)\s*\(|while\s*\(\s*b\s*\)\s*\{[^{}]{0,300}b\s*>>=\s*1", "/templates/modpow", "template", 2),
    Pattern("bitmask_dp", r"1\s*<<\s*n|\(\s*1\s*<<\s*\w+\s*\)", "/templates/bitmask_loop", "template", 1),
    Pattern("randomized", r"mt19937|shuffle\s*\(|uniform_|rng\s*\(", "/templates/base_template", "template", 1),
    Pattern("stress_harness", r"brute|stress|assert\s*\(|rand\s*\(", "/templates/stress_harness", "template", 2),
]


def iter_cpp_files(root: Path) -> list[Path]:
    result: list[Path] = []
    for path in root.rglob("*.cpp"):
        if any(part in EXCLUDED_PARTS for part in path.parts):
            continue
        result.append(path)
    return sorted(result)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def trimmed_example(text: str, match: re.Match[str]) -> str:
    line_start = text.rfind("\n", 0, match.start()) + 1
    line_end = text.find("\n", match.end())
    if line_end == -1:
        line_end = len(text)
    return text[line_start:line_end].strip()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", nargs="?", type=Path, default=DEFAULT_ROOT)
    parser.add_argument("--examples", type=int, default=2)
    args = parser.parse_args()

    files = iter_cpp_files(args.root)
    texts = []
    for path in files:
        try:
            texts.append((path, read_text(path)))
        except OSError:
            continue

    print("# iwcf Pattern Scan")
    print()
    print(f"- Root: `{args.root}`")
    print(f"- C++ files scanned: `{len(texts)}`")
    print(f"- Excluded path parts: `{', '.join(sorted(EXCLUDED_PARTS))}`")
    print()
    print("| Pattern | Files | Candidate | Kind | Score |")
    print("| --- | ---: | --- | --- | ---: |")

    rows = []
    for pattern in PATTERNS:
        regex = re.compile(pattern.regex, re.S)
        examples: list[tuple[Path, str]] = []
        count = 0
        for path, text in texts:
            match = regex.search(text)
            if not match:
                continue
            count += 1
            if len(examples) < args.examples:
                examples.append((path, trimmed_example(text, match)))
        score = count * pattern.pain
        rows.append((score, count, pattern, examples))

    for score, count, pattern, _ in sorted(rows, reverse=True):
        print(
            f"| `{pattern.key}` | {count} | `{pattern.candidate}` | {pattern.kind} | {score} |"
        )

    print()
    print("## Examples")
    for _, count, pattern, examples in sorted(rows, reverse=True):
        if count == 0 or not examples:
            continue
        print()
        print(f"### `{pattern.key}` -> `{pattern.candidate}`")
        for path, line in examples:
            rel = path.relative_to(args.root)
            print(f"- `{rel}`: `{line}`")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
