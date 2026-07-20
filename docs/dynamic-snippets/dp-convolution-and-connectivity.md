# DP, convolution, and offline connectivity snippets

## Compact mask loops

- `/bricks/submasks`: every submask including zero.
- `/bricks/proper_submasks`: non-empty proper submasks.
- `/bricks/supermasks`: fixed-width supermasks.
- `/bricks/subset_partitions`: ordered complementary subset pairs.
- `/bricks/disjoint_masks`: ordered disjoint mask pairs in `O(3^bits)`.
- `/bricks/subset_zeta` and `/bricks/subset_mobius`: in-place SOS transforms.

## Convolutions

- `/solvers/fft_ntt`: existing interactive FFT/NTT generator for ordinary
  polynomial convolution.
- `/solvers/fwt_convolution`: XOR, AND, and OR convolutions modulo an odd
  prime. Input lengths are padded to a power of two.
- `/solvers/sos_dp`: reusable subset/superset zeta and Möbius transforms.

## Offline dynamic connectivity

`/solvers/offline_dynamic_connectivity` combines a segment tree over operation
time with `/solvers/rollback_dsu`. It accepts edge additions, removals, and
connectivity queries. Repeated copies of the same undirected edge are supported;
each removal closes the most recently added active copy.

## Standard DP

- `/solvers/dp_knapsack`: 0/1 and unbounded one-dimensional knapsack.
- `/solvers/lis`: strict or nondecreasing LIS with index reconstruction.
- `/solvers/digit_dp`: decimal bound DP with caller-provided state transition
  and acceptance predicates. Leading zeroes are passed to the transition.
- `/solvers/turtle_dp`: right/down grid path counting and min/max path
  reconstruction with optional blocked cells.
- `/solvers/substring_dp`: substring partitioning and longest palindromic
  subsequence examples.

## DP optimizations

- `/solvers/divide_conquer_dp`: partition DP with monotone optimal splits.
- `/solvers/knuth_dp`: interval DP under the quadrangle inequality and
  monotone-opt conditions.
- `/solvers/convex_hull_trick`: minimum queries with lines added in decreasing
  slope order and query `x` values supplied in nondecreasing order.
- `/solvers/li_chao_tree`: arbitrary line insertion and minimum queries over an
  integer coordinate interval.
- `/solvers/monotone_queue_dp`: sliding-window minimum recurrence.
- `/solvers/aliens_trick`: integer lambda search for an exact selected count.
  The penalized solver must minimize `original + lambda * count`, return both
  values, and prefer the larger count when penalized objectives tie.
