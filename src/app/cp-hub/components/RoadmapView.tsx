"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowUpRight,
  Target,
  Code2,
  Compass,
  Lightbulb,
  ExternalLink,
  Layers,
  Menu,
  X,
} from "lucide-react";

export type Resource = {
  title: string;
  url?: string;
  type?: "problemset" | "documentation" | "guide" | "contest";
};

export type Topic = {
  title: string;
  description: string;
  resources: Resource[];
};

export type RoadmapStage = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  level: string;
  target: string;
  advice: string;
  topics: Topic[];
};

export type RoadmapGroup = {
  id: string;
  title: string;
  description: string;
  stages: RoadmapStage[];
};

export const roadmapGroups: RoadmapGroup[] = [
  {
    "id": "beginner",
    "title": "Beginner",
    "description": "Syntax fundamentals, basic math & problem-solving habits",
    "stages": [
      {
        "slug": "newbie",
        "number": "01",
        "title": "Newbie",
        "subtitle": "Build your programming foundation",
        "description": "Start with programming fundamentals, problem-solving habits, implementation, and basic mathematics.",
        "level": "Codeforces Newbie (< 1200)",
        "target": "Solve around 100 problems",
        "advice": "Focus heavily on syntax fluency and converting plain English problems into working code without bugs. Do not worry about advanced algorithms yet.",
        "topics": [
          {
            "title": "Programming Fundamentals",
            "description": "Master syntax, variables, conditional statements, loops, functions, arrays, strings, and standard input/output formatting in C++.",
            "resources": [
              {
                "title": "HackerRank C++ Language Proficiency Track",
                "url": "https://www.hackerrank.com/domains/cpp",
                "type": "problemset"
              },
              {
                "title": "CodeChef 500-1000 Beginner Difficulty Ladder",
                "url": "https://www.codechef.com/practice/beginner",
                "type": "problemset"
              },
              {
                "title": "Codeforces Div. 4 Implementation Problems",
                "url": "https://codeforces.com/problemset?tags=implementation&order=BY_SOLVED_DESC",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Implementation",
            "description": "Practice converting problem statements into clean, bug-free, and straightforward code without overcomplicating logic.",
            "resources": [
              {
                "title": "Codeforces Implementation Tag (Sorted by Solved)",
                "url": "https://codeforces.com/problemset?tags=implementation&order=BY_SOLVED_DESC",
                "type": "problemset"
              },
              {
                "title": "AtCoder Beginner Contest Tasks A & B Collection",
                "url": "https://kenkoooo.com/atcoder/#/table/",
                "type": "problemset"
              },
              {
                "title": "CSES Introductory Section Drills",
                "url": "https://cses.fi/problemset/list/#introductory",
                "type": "problemset"
              },
              {
                "title": "Div. 3 & Div. 4 Problems A and B (Codeforces)",
                "url": "https://codeforces.com/problemset?order=BY_SOLVED_DESC",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Basic Mathematics",
            "description": "Learn divisibility, prime numbers, factors, GCD, LCM, modular arithmetic, and simple arithmetic techniques.",
            "resources": [
              {
                "title": "CP-Algorithms: Euclidean Algorithm for GCD",
                "url": "https://cp-algorithms.com/algebra/euclid-algorithm.html",
                "type": "guide"
              },
              {
                "title": "Maths for Competitive Programming",
                "url": "https://www.youtube.com/playlist?list=PLtfqa971vD5FT6gYRxs0BDH-0WRz1FdCL",
                "type": "problemset"
              },
              {
                "title": "Number Theory & Math Problems (Codeforces)",
                "url": "https://codeforces.com/problemset?tags=math,number%20theory,900-1000",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Basic Data Structures",
            "description": "Become comfortable with arrays, strings, vectors, pairs, sets, and maps in the C++ Standard Template Library (STL).",
            "resources": [
              {
                "title": "USACO Guide Bronze: Introduction to Data Structures",
                "url": "https://usaco.guide/bronze/intro-ds",
                "type": "guide"
              },
              {
                "title": "C++ STL Containers Documentation (cppreference)",
                "url": "https://en.cppreference.com/w/cpp/container",
                "type": "documentation"
              },
              {
                "title": "GeeksforGeeks C++ STL Guide & Cheat Sheet",
                "url": "https://www.geeksforgeeks.org/the-c-standard-template-library-stl/",
                "type": "guide"
              },
              {
                "title": "CSES Distinct Numbers (Set/Map Drill)",
                "url": "https://cses.fi/problemset/task/1621",
                "type": "problemset"
              }
            ]
          }
        ]
      },
      {
        "slug": "beginner",
        "number": "02",
        "title": "Beginner",
        "subtitle": "Develop problem-solving confidence",
        "description": "Move beyond basic implementation and start recognizing common patterns in competitive programming.",
        "level": "Codeforces Pupil (1200 - 1399)",
        "target": "Solve around 200 problems",
        "advice": "Start participating in Codeforces Div. 3 contests regularly. Analyze test cases, write edge-case tests before submitting, and learn the power of prefix sums.",
        "topics": [
          {
            "title": "Sorting and Searching",
            "description": "Learn sorting techniques, binary search, lower_bound, upper_bound, and custom comparators.",
            "resources": [
              {
                "title": "USACO Guide Silver: Binary Search & Custom Comparators",
                "url": "https://usaco.guide/silver/binary-search",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Binary Search Tutorial",
                "url": "https://cp-algorithms.com/num_methods/binary_search.html",
                "type": "guide"
              },
              {
                "title": "CSES Sorting and Searching Section",
                "url": "https://cses.fi/problemset/list/#sorting",
                "type": "problemset"
              },
              {
                "title": "Codeforces Binary Search Tag",
                "url": "https://codeforces.com/problemset?tags=binary%20search,1000-1400",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Prefix Sum & Difference Arrays",
            "description": "Use prefix sums to answer range queries in O(1) and difference arrays for range update optimizations.",
            "resources": [
              {
                "title": "USACO Guide Silver: Introduction to Prefix Sums",
                "url": "https://usaco.guide/silver/prefix-sums",
                "type": "guide"
              },
              {
                "title": "CSES Static Range Sum Queries",
                "url": "https://cses.fi/problemset/task/1646",
                "type": "problemset"
              },
              {
                "title": "CSES Subarray Sums I & II",
                "url": "https://cses.fi/problemset/task/1660",
                "type": "problemset"
              },
              {
                "title": "Prefix Sum Technique",
                "url": "https://www.geeksforgeeks.org/dsa/understanding-prefix-sums/",
                "type": "guide"
              }
            ]
          },
          {
            "title": "Two Pointers Technique",
            "description": "Learn how to process arrays and strings using two moving indices for subarray optimization and sliding windows.",
            "resources": [
              {
                "title": "USACO Guide Silver: Two Pointers Technique",
                "url": "https://usaco.guide/silver/two-pointers",
                "type": "guide"
              },
              {
                "title": "CSES Sum of Two Values",
                "url": "https://cses.fi/problemset/task/1640",
                "type": "problemset"
              },
              {
                "title": "CSES Subarray Distinct Values (Sliding Window)",
                "url": "https://cses.fi/problemset/task/2428",
                "type": "problemset"
              },
              {
                "title": "Codeforces Two Pointers Problems",
                "url": "https://codeforces.com/problemset?tags=two%20pointers,1000-1400",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Greedy Techniques",
            "description": "Identify situations where making the best local choice leads to an optimal answer, and prove invariants.",
            "resources": [
              {
                "title": "USACO Guide Silver: Greedy Algorithms with Sorting",
                "url": "https://usaco.guide/silver/greedy-sorting",
                "type": "guide"
              },
              {
                "title": "CSES Movie Festival (Classic Interval Scheduling)",
                "url": "https://cses.fi/problemset/task/1629",
                "type": "problemset"
              },
              {
                "title": "CSES Tasks and Deadlines",
                "url": "https://cses.fi/problemset/task/1630",
                "type": "problemset"
              },
              {
                "title": "Codeforces Greedy Problems Collection",
                "url": "https://codeforces.com/problemset?tags=greedy,900-1400",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Basic Recursion & Backtracking",
            "description": "Understand recursive thinking, call stacks, base cases, state transitions, and simple backtracking.",
            "resources": [
              {
                "title": "CSES Apple Division (Classic Subset Backtracking)",
                "url": "https://cses.fi/problemset/task/1623",
                "type": "problemset"
              },
              {
                "title": "CSES Chessboard and Queens (N-Queens Backtracking)",
                "url": "https://cses.fi/problemset/task/1624",
                "type": "problemset"
              },
              {
                "title": "CSES Creating Strings (Permutation Generation)",
                "url": "https://cses.fi/problemset/task/1622",
                "type": "problemset"
              },
              {
                "title": "GeeksforGeeks Recursion & Backtracking Tutorial",
                "url": "https://www.geeksforgeeks.org/backtracking-algorithms/",
                "type": "guide"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "intermediate",
    "title": "Intermediate",
    "description": "Standard algorithmic paradigms, graphs & dynamic programming",
    "stages": [
      {
        "slug": "pre-intermediate",
        "number": "03",
        "title": "Pre-Intermediate",
        "subtitle": "Learn standard competitive programming techniques",
        "description": "Begin combining multiple ideas and solving problems that require more structured thinking.",
        "level": "Codeforces Specialist (1400 - 1599)",
        "target": "Solve around 300 problems",
        "advice": "This is where competitive programming starts getting mathematical and algorithmic. Pay close attention to time complexity constraints and bit manipulation.",
        "topics": [
          {
            "title": "Advanced Binary Search",
            "description": "Apply binary search on monotonic answer spaces, predicate functions, and continuous conditions.",
            "resources": [
              {
                "title": "USACO Guide Silver: Binary Search on Monotonic Answers",
                "url": "https://usaco.guide/silver/binary-search",
                "type": "guide"
              },
              {
                "title": "CSES Factory Machines",
                "url": "https://cses.fi/problemset/task/1620",
                "type": "problemset"
              },
              {
                "title": "CSES Array Division",
                "url": "https://cses.fi/problemset/task/1085",
                "type": "problemset"
              },
              {
                "title": "Codeforces Binary Search Tag",
                "url": "https://codeforces.com/problemset?tags=binary%20search,1300-1600",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Bit Manipulation & Bitmasks",
            "description": "Work with bitwise operators, masks, subsets, power sets, XOR properties, and binary representations.",
            "resources": [
              {
                "title": "CP-Algorithms: Bit Manipulation & Submask Enumeration",
                "url": "https://cp-algorithms.com/algebra/all-submasks.html",
                "type": "guide"
              },
              {
                "title": "USACO Guide Silver: Bitwise Operations & Subsets",
                "url": "https://usaco.guide/silver/intro-bitwise",
                "type": "guide"
              },
              {
                "title": "CSES Counting Tilings (Bitmask Practice)",
                "url": "https://cses.fi/problemset/task/2181",
                "type": "problemset"
              },
              {
                "title": "Basics of Bit Manipulation",
                "url": "https://www.hackerearth.com/practice/basic-programming/bit-manipulation/basics-of-bit-manipulation/practice-problems/",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Basic Dynamic Programming",
            "description": "Learn states, transitions, base cases, and 1D / 2D DP (Coin Change, 0/1 Knapsack, LIS, Grid Paths).",
            "resources": [
              {
                "title": "AtCoder Educational DP Contest (Tasks A through H)",
                "url": "https://atcoder.jp/contests/dp",
                "type": "contest"
              },
              {
                "title": "CSES Dynamic Programming Section (Coin Combinations, Grid Paths)",
                "url": "https://cses.fi/problemset/list/#dynamic",
                "type": "problemset"
              },
              {
                "title": "USACO Guide Gold: Introduction to Dynamic Programming",
                "url": "https://usaco.guide/gold/intro-dp",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Introduction to Dynamic Programming",
                "url": "https://cp-algorithms.com/dynamic_programming/intro-to-dp.html",
                "type": "guide"
              }
            ]
          },
          {
            "title": "Graph Fundamentals",
            "description": "Understand graphs, adjacency lists, Breadth-First Search (BFS), Depth-First Search (DFS), and connected components.",
            "resources": [
              {
                "title": "USACO Guide Silver: Graph Traversal (DFS & BFS)",
                "url": "https://usaco.guide/silver/graph-traversal",
                "type": "guide"
              },
              {
                "title": "CSES Building Roads & Labyrinth",
                "url": "https://cses.fi/problemset/list/#graph",
                "type": "problemset"
              },
              {
                "title": "CP-Algorithms: Breadth-First Search (BFS)",
                "url": "https://cp-algorithms.com/graph/breadth-first-search.html",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Depth-First Search (DFS)",
                "url": "https://cp-algorithms.com/graph/depth-first-search.html",
                "type": "guide"
              }
            ]
          },
          {
            "title": "Disjoint Set Union (DSU)",
            "description": "Learn DSU with path compression and union by rank for connected components and Kruskal-style problems.",
            "resources": [
              {
                "title": "CP-Algorithms: Disjoint Set Union (DSU)",
                "url": "https://cp-algorithms.com/data_structures/disjoint_set_union.html",
                "type": "guide"
              },
              {
                "title": "USACO Guide Gold: Disjoint Set Union",
                "url": "https://usaco.guide/gold/dsu",
                "type": "guide"
              },
              {
                "title": "CSES Road Construction",
                "url": "https://cses.fi/problemset/task/1676",
                "type": "problemset"
              },
              {
                "title": "AtCoder Library Practice Contest: Disjoint Set Union",
                "url": "https://atcoder.jp/contests/practice2/tasks/practice2_a",
                "type": "problemset"
              }
            ]
          }
        ]
      },
      {
        "slug": "intermediate",
        "number": "04",
        "title": "Intermediate",
        "subtitle": "Combine algorithms and data structures",
        "description": "Start solving problems where the main challenge is choosing and combining the right techniques.",
        "level": "Codeforces Expert (1600 - 1899)",
        "target": "Solve around 400 problems",
        "advice": "At this stage, you must master the classic trees and range query data structures (Segment Trees, Fenwick Trees) and understand Dijkstra thoroughly.",
        "topics": [
          {
            "title": "Advanced Dynamic Programming",
            "description": "Practice knapsack variations, Longest Increasing Subsequence in O(N log N), interval DP, digit DP, and bitmask DP.",
            "resources": [
              {
                "title": "AtCoder Educational DP Contest (Tasks I to Z)",
                "url": "https://atcoder.jp/contests/dp",
                "type": "contest"
              },
              {
                "title": "USACO Guide Gold: DP with Bitmasks",
                "url": "https://usaco.guide/gold/dp-bitmasks",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Divide and Conquer DP Optimization",
                "url": "https://cp-algorithms.com/dynamic_programming/divide-and-conquer-dp.html",
                "type": "guide"
              },
              {
                "title": "Codeforces Dynamic Programming Tag",
                "url": "https://codeforces.com/problemset?tags=dp",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Shortest Path Algorithms",
            "description": "Learn Dijkstra with priority queue, Bellman-Ford for negative weights, Floyd-Warshall for all pairs, and 0-1 BFS.",
            "resources": [
              {
                "title": "CP-Algorithms: Dijkstra Algorithm with Priority Queue",
                "url": "https://cp-algorithms.com/graph/dijkstra.html",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Bellman-Ford & Negative Cycles",
                "url": "https://cp-algorithms.com/graph/bellman_ford.html",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Floyd-Warshall for All-Pairs Shortest Paths",
                "url": "https://cp-algorithms.com/graph/all-pair-shortest-path-floyd-warshall.html",
                "type": "guide"
              },
              {
                "title": "CSES Shortest Routes I & II",
                "url": "https://cses.fi/problemset/task/1671",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Trees",
            "description": "Understand tree traversals, subtree sizes, tree diameter, tree Euler tours, and dynamic programming on trees.",
            "resources": [
              {
                "title": "CSES Tree Algorithms Section (Subtree Queries, Tree Diameter)",
                "url": "https://cses.fi/problemset/list/#tree",
                "type": "problemset"
              },
              {
                "title": "USACO Guide Gold: Tree Euler Tour Technique",
                "url": "https://usaco.guide/gold/tree-euler",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Tree Diameter and Centroids",
                "url": "https://cp-algorithms.com/graph/tree_diameter.html",
                "type": "guide"
              },
              {
                "title": "Codeforces Tree Problems Collection",
                "url": "https://codeforces.com/problemset?tags=trees",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Segment Tree",
            "description": "Master range queries, point updates, lazy propagation, range updates, and custom merge functions.",
            "resources": [
              {
                "title": "CP-Algorithms: Segment Tree with Point & Range Updates",
                "url": "https://cp-algorithms.com/data_structures/segment_tree.html",
                "type": "guide"
              },
              {
                "title": "USACO Guide Gold: Point Update Range Sum / Min",
                "url": "https://usaco.guide/gold/PURS",
                "type": "guide"
              },
              {
                "title": "CSES Range Queries Section",
                "url": "https://cses.fi/problemset/list/#range",
                "type": "problemset"
              },
              {
                "title": "AtCoder Library Practice Contest: Segment Tree",
                "url": "https://atcoder.jp/contests/practice2/tasks/practice2_j",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Fenwick Tree (BIT)",
            "description": "Use Binary Indexed Trees for concise, high-speed prefix and range query implementations with low overhead.",
            "resources": [
              {
                "title": "CP-Algorithms: Fenwick Tree (Binary Indexed Tree)",
                "url": "https://cp-algorithms.com/data_structures/fenwick.html",
                "type": "guide"
              },
              {
                "title": "CSES Dynamic Range Sum Queries",
                "url": "https://cses.fi/problemset/task/1648",
                "type": "problemset"
              },
              {
                "title": "AtCoder Library Practice Contest: Fenwick Tree",
                "url": "https://atcoder.jp/contests/practice2/tasks/practice2_b",
                "type": "problemset"
              },
              {
                "title": "USACO Guide Gold: Point Update Range Sum with BIT",
                "url": "https://usaco.guide/gold/purs",
                "type": "guide"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "advanced",
    "title": "Advanced",
    "description": "Complex tree queries, flows, combinatorics & Div. 1 problems",
    "stages": [
      {
        "slug": "advanced",
        "number": "05",
        "title": "Advanced",
        "subtitle": "Handle complex algorithmic problems",
        "description": "Build deeper knowledge of advanced data structures, graph algorithms, and mathematical techniques.",
        "level": "Codeforces Candidate Master (1900 - 2099)",
        "target": "Solve around 500 problems",
        "advice": "Focus on LCA, strongly connected components, string algorithms like KMP, and modular inverse mathematics.",
        "topics": [
          {
            "title": "Lowest Common Ancestor (LCA)",
            "description": "Learn binary lifting, sparse tables for trees, distance between arbitrary nodes, and path queries.",
            "resources": [
              {
                "title": "CP-Algorithms: LCA Binary Lifting",
                "url": "https://cp-algorithms.com/graph/lca.html",
                "type": "guide"
              },
              {
                "title": "CSES Company Queries I & II",
                "url": "https://cses.fi/problemset/task/1687",
                "type": "problemset"
              },
              {
                "title": "USACO Guide Platinum: Lowest Common Ancestor",
                "url": "https://usaco.guide/plat/lca",
                "type": "guide"
              },
              {
                "title": "CSES Distance Queries",
                "url": "https://cses.fi/problemset/task/1135",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Strongly Connected Components",
            "description": "Understand Kosaraju's and Tarjan's algorithms for condensing directed graphs into Directed Acyclic Graphs (DAGs).",
            "resources": [
              {
                "title": "CP-Algorithms: Strongly Connected Components (Kosaraju & Tarjan)",
                "url": "https://cp-algorithms.com/graph/strongly-connected-components.html",
                "type": "guide"
              },
              {
                "title": "CSES Planets and Kingdoms",
                "url": "https://cses.fi/problemset/task/1683",
                "type": "problemset"
              },
              {
                "title": "USACO Guide Platinum: Strongly Connected Components",
                "url": "https://usaco.guide/plat/scc",
                "type": "guide"
              },
              {
                "title": "CSES Flight Routes Check",
                "url": "https://cses.fi/problemset/task/1682",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Minimum Spanning Tree",
            "description": "Learn Kruskal's, Prim's, and Boruvka's algorithms alongside DSU-based graph construction.",
            "resources": [
              {
                "title": "CP-Algorithms: Minimum Spanning Tree (Kruskal & Prim)",
                "url": "https://cp-algorithms.com/graph/mst_kruskal.html",
                "type": "guide"
              },
              {
                "title": "CSES Road Reparation",
                "url": "https://cses.fi/problemset/task/1675",
                "type": "problemset"
              },
              {
                "title": "USACO Guide Gold: Minimum Spanning Trees",
                "url": "https://usaco.guide/gold/mst",
                "type": "guide"
              },
              {
                "title": "Codeforces MST Problems",
                "url": "https://codeforces.com/problemset?tags=graphs",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "String Algorithms",
            "description": "Study prefix function, Knuth-Morris-Pratt (KMP), Z-function, polynomial string hashing, and trie structures.",
            "resources": [
              {
                "title": "CP-Algorithms: Prefix Function & KMP Algorithm",
                "url": "https://cp-algorithms.com/string/prefix-func.html",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Z-function for String Matching",
                "url": "https://cp-algorithms.com/string/z-function.html",
                "type": "guide"
              },
              {
                "title": "CSES String Algorithms Section (Word Combinations, Finding Patterns)",
                "url": "https://cses.fi/problemset/list/#string",
                "type": "problemset"
              },
              {
                "title": "USACO Guide Gold: String Hashing",
                "url": "https://usaco.guide/gold/string-hashing",
                "type": "guide"
              }
            ]
          },
          {
            "title": "Number Theory",
            "description": "Explore modular inverse, Chinese Remainder Theorem, Euler's totient function, and linear Diophantine equations.",
            "resources": [
              {
                "title": "CP-Algorithms: Modular Multiplicative Inverse",
                "url": "https://cp-algorithms.com/algebra/module-inverse.html",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Extended Euclidean Algorithm",
                "url": "https://cp-algorithms.com/algebra/extended-euclid-algorithm.html",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Chinese Remainder Theorem",
                "url": "https://cp-algorithms.com/algebra/chinese-remainder-theorem.html",
                "type": "guide"
              },
              {
                "title": "CSES Exponentiation & Counting Divisors",
                "url": "https://cses.fi/problemset/list/#math",
                "type": "problemset"
              }
            ]
          }
        ]
      },
      {
        "slug": "advanced-1",
        "number": "06",
        "title": "Advanced 1",
        "subtitle": "Master deeper problem-solving patterns",
        "description": "Focus on advanced combinations of techniques and harder implementation details for Div. 1 contests.",
        "level": "Codeforces Master (2100 - 2299)",
        "target": "Solve around 600 problems",
        "advice": "Upsolve Div. 1 Problem B/C. Implement Heavy-Light Decomposition and persistent segment trees from scratch until fluent.",
        "topics": [
          {
            "title": "Heavy-Light Decomposition (HLD)",
            "description": "Decompose trees into heavy and light paths to process path queries and subtree updates in O(log² N).",
            "resources": [
              {
                "title": "CP-Algorithms: Heavy-Light Decomposition Guide",
                "url": "https://cp-algorithms.com/graph/hld.html",
                "type": "guide"
              },
              {
                "title": "USACO Guide Platinum: Heavy-Light Decomposition",
                "url": "https://usaco.guide/plat/hld",
                "type": "guide"
              },
              {
                "title": "CSES Distinct Colors & Subtree Queries",
                "url": "https://cses.fi/problemset/list/#tree",
                "type": "problemset"
              },
              {
                "title": "SPOJ QTREE - Query on a Tree (Classic HLD Benchmark)",
                "url": "https://www.spoj.com/problems/QTREE/",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Advanced Segment Trees",
            "description": "Study dynamic segment trees, segment tree beats, persistent segment trees, and complex node merging.",
            "resources": [
              {
                "title": "CP-Algorithms: Persistent Segment Trees",
                "url": "https://cp-algorithms.com/data_structures/segment_tree.html#persistent-segment-tree",
                "type": "guide"
              },
              {
                "title": "USACO Guide Platinum: Persistent Segment Trees",
                "url": "https://usaco.guide/plat/persistent-segtree",
                "type": "guide"
              },
              {
                "title": "CSES Range Queries and Copies (Persistent Segment Tree)",
                "url": "https://cses.fi/problemset/task/1737",
                "type": "problemset"
              },
              {
                "title": "AtCoder Library: Lazy Segment Tree (Range Updates)",
                "url": "https://atcoder.jp/contests/practice2/tasks/practice2_k",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Advanced Graph Algorithms",
            "description": "Explore bridges, articulation points, 2-SAT, Eulerian circuits, and biconnected component decomposition.",
            "resources": [
              {
                "title": "CP-Algorithms: 2-SAT Problem Tutorial & Implementation",
                "url": "https://cp-algorithms.com/graph/2SAT.html",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Finding Bridges & Articulation Points",
                "url": "https://cp-algorithms.com/graph/bridge-searching.html",
                "type": "guide"
              },
              {
                "title": "CSES Eulerian Subgraphs & Coin Collector",
                "url": "https://cses.fi/problemset/list/#graph",
                "type": "problemset"
              },
              {
                "title": "AtCoder Library Practice Contest: 2-SAT",
                "url": "https://atcoder.jp/contests/practice2/tasks/practice2_h",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Advanced String Algorithms",
            "description": "Learn suffix arrays with LCP, suffix automaton, Aho-Corasick automaton, and palindromic trees.",
            "resources": [
              {
                "title": "CP-Algorithms: Suffix Array O(N log N) Construction & LCP",
                "url": "https://cp-algorithms.com/string/suffix-array.html",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Suffix Automaton Theory & Practice",
                "url": "https://cp-algorithms.com/string/suffix-automaton.html",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Aho-Corasick Multi-Pattern Matching",
                "url": "https://cp-algorithms.com/string/aho_corasick.html",
                "type": "guide"
              },
              {
                "title": "CSES Finding Patterns & Pattern Positions",
                "url": "https://cses.fi/problemset/task/2102",
                "type": "problemset"
              }
            ]
          }
        ]
      },
      {
        "slug": "advanced-2",
        "number": "07",
        "title": "Advanced 2",
        "subtitle": "Explore specialized competitive programming topics",
        "description": "Focus on advanced structures and techniques commonly used in ICPC Regional & National level contests.",
        "level": "Codeforces Grandmaster (2400+)",
        "target": "Solve around 700 problems",
        "advice": "Network flows and game theory (Sprague-Grundy) frequently appear in high-stakes regional contests. Practice modeling techniques.",
        "topics": [
          {
            "title": "Network Flow",
            "description": "Study maximum flow (Edmonds-Karp, Dinic), minimum cut, min-cost max-flow, and flow-based modeling reductions.",
            "resources": [
              {
                "title": "CP-Algorithms: Maximum Flow with Dinic's Algorithm",
                "url": "https://cp-algorithms.com/graph/dinic.html",
                "type": "guide"
              },
              {
                "title": "USACO Guide Platinum: Maximum Flow & Min Cut",
                "url": "https://usaco.guide/plat/maxflow",
                "type": "guide"
              },
              {
                "title": "CSES Download Speed (Maximum Flow)",
                "url": "https://cses.fi/problemset/task/1694",
                "type": "problemset"
              },
              {
                "title": "CSES Police Chase (Minimum Cut)",
                "url": "https://cses.fi/problemset/task/1695",
                "type": "problemset"
              },
              {
                "title": "AtCoder Library Practice Contest: Max Flow",
                "url": "https://atcoder.jp/contests/practice2/tasks/practice2_d",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Matching",
            "description": "Learn Hopcroft-Karp for maximum bipartite matching, Konig's theorem, and minimum path covers in DAGs.",
            "resources": [
              {
                "title": "CP-Algorithms: Maximum Bipartite Matching (Kuhn's Algorithm)",
                "url": "https://cp-algorithms.com/graph/kuhn_maximum_bipartite_matching.html",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Hopcroft-Karp Algorithm for Faster Matching",
                "url": "https://cp-algorithms.com/graph/hopcroft_karp.html",
                "type": "guide"
              },
              {
                "title": "CSES School Dance (Bipartite Matching)",
                "url": "https://cses.fi/problemset/task/1696",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Advanced Combinatorics",
            "description": "Practice combinatorial counting, Burnside's lemma, inclusion-exclusion, Lucas' theorem, and generating functions.",
            "resources": [
              {
                "title": "CP-Algorithms: Burnside's Lemma & Polya Enumeration",
                "url": "https://cp-algorithms.com/combinatorics/burnside.html",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Inclusion-Exclusion Principle",
                "url": "https://cp-algorithms.com/combinatorics/inclusion-exclusion.html",
                "type": "guide"
              },
              {
                "title": "CSES Creating Strings II & Distributing Apples",
                "url": "https://cses.fi/problemset/task/1715",
                "type": "problemset"
              },
              {
                "title": "Codeforces Combinatorics Tag",
                "url": "https://codeforces.com/problemset?tags=combinatorics",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Game Theory",
            "description": "Understand impartial games, Nim-sum, Sprague-Grundy theorem, and winning/losing state DAG analysis.",
            "resources": [
              {
                "title": "CP-Algorithms: Sprague-Grundy Theorem & Game of Nim",
                "url": "https://cp-algorithms.com/game_theory/sprague-grundy-nim.html",
                "type": "guide"
              },
              {
                "title": "USACO Guide Gold: Game Theory",
                "url": "https://usaco.guide/gold/game-theory",
                "type": "guide"
              },
              {
                "title": "CSES Nim Game I & II",
                "url": "https://cses.fi/problemset/task/1730",
                "type": "problemset"
              },
              {
                "title": "CSES Stair Game & Grundy's Game",
                "url": "https://cses.fi/problemset/task/2207",
                "type": "problemset"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "beyond",
    "title": "Beyond",
    "description": "Research-level algorithms, World Finals preparation & specialized DS",
    "stages": [
      {
        "slug": "beyond",
        "number": "08",
        "title": "Beyond",
        "subtitle": "Develop your own advanced specialization",
        "description": "After completing the main roadmap, choose specialized topics based on your interests, research, and ICPC World Finals goals.",
        "level": "Beyond the Roadmap (World Finalist)",
        "target": "Build depth through contest simulations and research",
        "advice": "Simulate full 5-hour 3-person team contests, master quick paper debugging, and maintain team code notebooks.",
        "topics": [
          {
            "title": "Research-Level Algorithms",
            "description": "Explore cutting-edge algorithmic techniques, papers, contest editorials, and unconventional problem formulations.",
            "resources": [
              {
                "title": "CP-Algorithms Hub & Encyclopedia",
                "url": "https://cp-algorithms.com/",
                "type": "guide"
              },
              {
                "title": "Stanford ACM-ICPC Team Notebook",
                "url": "https://github.com/jaehyunp/stanfordacm",
                "type": "documentation"
              },
              {
                "title": "KACTL Algorithm Library (KTH Royal Institute)",
                "url": "https://github.com/kth-competitive-programming/kactl",
                "type": "documentation"
              },
              {
                "title": "Codeforces Catalog of Advanced Editorials",
                "url": "https://codeforces.com/catalog",
                "type": "documentation"
              }
            ]
          },
          {
            "title": "ICPC Preparation & Strategy",
            "description": "Practice 3-person team contests, virtual contest simulations, problem distribution, upsolving, and debugging on paper.",
            "resources": [
              {
                "title": "Official ICPC Global Website & Archives",
                "url": "https://icpc.global/",
                "type": "contest"
              },
              {
                "title": "Open Kattis (ICPC World Finals & Regional Problems)",
                "url": "https://open.kattis.com/",
                "type": "problemset"
              },
              {
                "title": "Virtual Judge (VJudge ICPC Regional Archives)",
                "url": "https://vjudge.net/",
                "type": "problemset"
              },
              {
                "title": "Codeforces Gym (Past Regional & National Contests)",
                "url": "https://codeforces.com/gyms",
                "type": "contest"
              }
            ]
          },
          {
            "title": "Specialized Data Structures",
            "description": "Study link-cut trees, treaps (implicit and explicit), splay trees, KD-trees, and persistent data structures.",
            "resources": [
              {
                "title": "CP-Algorithms: Treap and Cartesian Trees",
                "url": "https://cp-algorithms.com/data_structures/treap.html",
                "type": "guide"
              },
              {
                "title": "CP-Algorithms: Randomized Heap",
                "url": "https://cp-algorithms.com/data_structures/randomized_heap.html",
                "type": "guide"
              },
              {
                "title": "USACO Guide Platinum: Treaps & Balanced BSTs",
                "url": "https://usaco.guide/plat/treaps",
                "type": "guide"
              },
              {
                "title": "CSES Reversals and Sums (Implicit Treap)",
                "url": "https://cses.fi/problemset/task/2074",
                "type": "problemset"
              }
            ]
          },
          {
            "title": "Contest Practice & Upsolving",
            "description": "Regularly participate in Codeforces Div. 1/2, AtCoder Grand Contests (AGC), ICPC regional past contests, and virtual rounds.",
            "resources": [
              {
                "title": "Codeforces Contests Schedule & Calendar",
                "url": "https://codeforces.com/contests",
                "type": "contest"
              },
              {
                "title": "AtCoder Contests Calendar",
                "url": "https://atcoder.jp/contests/",
                "type": "contest"
              },
              {
                "title": "CodeChef Contests Calendar",
                "url": "https://www.codechef.com/contests",
                "type": "contest"
              },
              {
                "title": "CLIST.by - All Competitive Programming Contests",
                "url": "https://clist.by/",
                "type": "contest"
              }
            ]
          }
        ]
      }
    ]
  }
];

// Flatten all stages for fast lookups
const allStages: RoadmapStage[] = roadmapGroups.flatMap((g) => g.stages);

export default function RoadmapView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read stage from searchParams or default to first stage
  const stageParam = searchParams.get("stage") || "newbie";
  const [selectedSlug, setSelectedSlug] = useState<string>(() => {
    return allStages.some((s) => s.slug === stageParam) ? stageParam : "newbie";
  });

  // Expanded accordion sections in sidebar (default all open)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    beginner: true,
    intermediate: true,
    advanced: true,
    beyond: true,
  });

  // Mobile sidebar drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync state if user navigates with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search).get("stage");
      if (p && allStages.some((s) => s.slug === p)) {
        setSelectedSlug(p);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSelectStage = (slug: string) => {
    setSelectedSlug(slug);
    setMobileSidebarOpen(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", "roadmaps");
      url.searchParams.set("stage", slug);
      window.history.replaceState(null, "", url.toString());
    }
  };

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const activeStage =
    allStages.find((s) => s.slug === selectedSlug) || allStages[0];

  // Find current group of the active stage
  const activeGroup = roadmapGroups.find((g) =>
    g.stages.some((s) => s.slug === activeStage.slug)
  );

  // Prev / Next stage helpers
  const currentIndex = allStages.findIndex((s) => s.slug === activeStage.slug);
  const prevStage = currentIndex > 0 ? allStages[currentIndex - 1] : null;
  const nextStage =
    currentIndex < allStages.length - 1 ? allStages[currentIndex + 1] : null;

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-7xl pt-8 pb-16">
      {/* Mobile Stage Selector Strip */}
      <div className="lg:hidden mb-6 flex items-center justify-between gap-3 p-3.5 bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-xl shadow-[3px_3px_0px_var(--border-brutalist)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono text-xs font-black uppercase text-accent-primary shrink-0">
            STAGE {activeStage.number}
          </span>
          <span className="text-sm font-bold text-text-primary truncate">
            {activeStage.title}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border-default text-xs font-bold text-text-primary shrink-0 cursor-pointer"
        >
          <Menu className="h-3.5 w-3.5" />
          <span>Select Stage</span>
        </button>
      </div>

      {/* Main 2-Column Documentation Layout (Programiz Style) */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        {/* =========================================================
            LEFT SIDEBAR (Programiz Style Tree Navigation)
           ========================================================= */}
        {/* Mobile Backdrop & Drawer */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-surface-primary p-5 overflow-y-auto border-r border-border-default transition-transform duration-200
            lg:static lg:z-auto lg:w-72 xl:w-80 lg:p-0 lg:border-r-0 lg:bg-transparent lg:shrink-0 lg:translate-x-0
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Mobile Drawer Close Button */}
          <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-border-default">
            <span className="font-heading text-sm font-bold text-text-primary flex items-center gap-2">
              <Compass className="h-4 w-4 text-accent-primary" />
              <span>Roadmap Stages</span>
            </span>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-surface-secondary text-text-secondary cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Programiz Sidebar Container */}
          <div className="lg:sticky lg:top-[calc(var(--nav-height)+80px)] space-y-3 bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-4 shadow-[4px_4px_0px_0px_var(--border-default)]">
            <div className="pb-3 border-b border-border-default flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">
                Learning Tracks
              </span>
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-secondary border border-border-default text-text-secondary">
                8 Stages
              </span>
            </div>

            {/* Accordion Groups (Beginner, Intermediate, Advanced, Beyond) */}
            <div className="space-y-2">
              {roadmapGroups.map((group) => {
                const isOpen = openGroups[group.id] ?? true;
                const isGroupActive = group.stages.some(
                  (s) => s.slug === activeStage.slug
                );

                return (
                  <div
                    key={group.id}
                    className={`rounded-xl border transition-all duration-150 overflow-hidden ${isGroupActive
                      ? "border-accent-primary/60 bg-surface-secondary/40"
                      : "border-border-default/80 bg-surface-primary/40"
                      }`}
                  >
                    {/* Category Header with Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className="w-full flex items-center justify-between p-3 text-left font-heading text-sm font-bold text-text-primary hover:text-accent-primary transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${isGroupActive ? "bg-accent-primary" : "bg-text-tertiary/60"
                            }`}
                        />
                        <span>{group.title}</span>
                      </span>
                      <span className="text-text-tertiary">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </span>
                    </button>

                    {/* Nested Stage Items (Clean Connected Timeline inside accordion) */}
                    {isOpen && (
                      <div className="px-3 pb-3 pt-1">
                        <div className="space-y-1 py-0.5">
                          {group.stages.map((stage, sIdx) => {
                            const isSelected = activeStage.slug === stage.slug;
                            const isFirst = sIdx === 0;
                            const isLast = sIdx === group.stages.length - 1;

                            return (
                              <div
                                key={stage.slug}
                                className="group/item relative flex items-stretch gap-2.5"
                              >
                                {/* Continuous Timeline Column */}
                                <div className="relative flex items-center justify-center w-3.5 shrink-0">
                                  {/* Top connector line segment */}
                                  {!isFirst && (
                                    <div
                                      className="absolute top-0 bottom-1/2 w-[2px] -translate-x-1/2 left-1/2 pointer-events-none"
                                      style={{ backgroundColor: "var(--border-default)" }}
                                      aria-hidden="true"
                                    />
                                  )}
                                  {/* Bottom connector line segment */}
                                  {!isLast && (
                                    <div
                                      className="absolute top-1/2 bottom-0 w-[2px] -translate-x-1/2 left-1/2 pointer-events-none"
                                      style={{ backgroundColor: "var(--border-default)" }}
                                      aria-hidden="true"
                                    />
                                  )}

                                  {/* Node Dot */}
                                  <div
                                    className={`relative z-10 rounded-full transition-all ${isSelected
                                      ? "w-2.5 h-2.5 border-2 border-surface-elevated shadow-xs scale-110"
                                      : "w-1.5 h-1.5 border border-border-default group-hover/item:border-accent-primary group-hover/item:scale-125"
                                      }`}
                                    style={{
                                      backgroundColor: isSelected
                                        ? "var(--accent-primary)"
                                        : "var(--surface-primary)",
                                    }}
                                    aria-hidden="true"
                                  />
                                </div>

                                {/* Stage Action Button */}
                                <button
                                  type="button"
                                  onClick={() => handleSelectStage(stage.slug)}
                                  className={`flex-1 min-w-0 flex items-center justify-between gap-2 py-2 px-2.5 rounded-lg text-xs transition-all cursor-pointer ${isSelected
                                    ? "bg-accent-primary text-accent-primary-text font-bold shadow-[2px_2px_0px_var(--border-brutalist)] border border-text-primary dark:border-border-default"
                                    : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary font-medium"
                                    }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span
                                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${isSelected
                                        ? "bg-accent-primary-text/15 text-accent-primary-text"
                                        : "bg-surface-primary border border-border-default/60 text-text-tertiary group-hover/item:text-text-primary"
                                        }`}
                                    >
                                      {stage.number}
                                    </span>
                                    <span className="truncate">{stage.title}</span>
                                  </div>

                                  <span
                                    className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded shrink-0 ${isSelected
                                      ? "bg-accent-primary-text/20 text-accent-primary-text font-bold"
                                      : "text-text-tertiary"
                                      }`}
                                  >
                                    {stage.topics.length} topics
                                  </span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* =========================================================
            RIGHT MAIN PANEL (Clean Documentation / About Page Style)
           ========================================================= */}
        <main className="flex-1 min-w-0 space-y-8">
          {/* Stage Header Section */}
          <div className="pb-8 border-b border-border-default">
            {/* Breadcrumb Path */}
            <div className="flex items-center gap-2 font-mono text-xs text-text-tertiary mb-3">
              <span>Roadmap</span>
              <span>/</span>
              <span className="text-text-secondary">{activeGroup?.title}</span>
              <span>/</span>
              <span className="text-accent-primary font-bold">
                Stage {activeStage.number}: {activeStage.title}
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-3">
              {activeStage.title}
            </h1>
            <p className="text-base sm:text-lg font-semibold text-accent-text-on-surface mb-3">
              {activeStage.subtitle}
            </p>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl mb-6">
              {activeStage.description}
            </p>

            {/* Stage Metadata Chips */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-surface-secondary px-3 py-1.5 font-mono text-xs font-bold text-text-primary">
                <span className="w-2 h-2 rounded-full bg-accent-primary" />
                <span>{activeStage.level}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-surface-secondary px-3 py-1.5 font-mono text-xs font-bold text-text-primary">
                <Target className="h-3.5 w-3.5 text-accent-primary" />
                <span>Target: {activeStage.target}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-surface-secondary px-3 py-1.5 font-mono text-xs font-bold text-text-primary">
                <BookOpen className="h-3.5 w-3.5 text-accent-primary" />
                <span>{activeStage.topics.length} Core Modules</span>
              </div>
            </div>
          </div>

          {/* Curriculum Guide (Matching About Page Timeline Style) */}
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-3 border-b border-border-default/80">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2.5">
                <Code2 className="h-5 w-5 text-accent-primary" />
                <span>Topics &amp; Recommended Drills</span>
              </h2>
              <span className="font-mono text-xs font-bold text-text-tertiary uppercase tracking-wider">
                Step-by-Step Curriculum
              </span>
            </div>

            {/* Continuous Connected Steps List (Clean About-Page Timeline Style) */}
            <div className="relative">
              {/* Continuous Vertical Timeline Line (Guaranteed rendering) */}
              <div
                className="absolute left-[7px] top-2.5 bottom-6 w-[2px] pointer-events-none"
                style={{ backgroundColor: "var(--border-default)" }}
                aria-hidden="true"
              />

              {activeStage.topics.map((topic, index) => (
                <div key={topic.title} className="relative pb-10 last:pb-2 pl-7">
                  {/* Clean Accent Dot Node sitting on vertical line */}
                  <div
                    className="absolute left-[2px] top-1.5 w-3 h-3 rounded-full border-2 border-surface-primary shadow-xs z-10"
                    style={{ backgroundColor: "var(--accent-primary)" }}
                    aria-hidden="true"
                  />

                  {/* Topic Content */}
                  <div>
                    <span className="font-mono text-xs text-accent-primary-hover font-bold uppercase tracking-wider block mb-1">
                      {`MODULE ${String(index + 1).padStart(2, "0")}`}
                    </span>

                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-text-primary mb-2">
                      {topic.title}
                    </h3>

                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl mb-4">
                      {topic.description}
                    </p>

                    {/* Resources Compact Interactive List */}
                    <div className="pt-1">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-tertiary mb-2.5 flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-accent-primary" />
                        <span>Practice &amp; Study Resources:</span>
                      </div>

                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {topic.resources.map((resource) => {
                          if (!resource.url) {
                            return (
                              <div
                                key={resource.title}
                                className="flex items-center gap-2.5 rounded-xl border border-border-default bg-surface-secondary/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-text-secondary"
                              >
                                <CheckCircle2 className="h-4 w-4 text-accent-primary shrink-0" />
                                <span className="truncate">{resource.title}</span>
                              </div>
                            );
                          }

                          const typeBadge =
                            resource.type === "problemset"
                              ? "Problemset"
                              : resource.type === "documentation"
                                ? "Docs"
                                : resource.type === "contest"
                                  ? "Contest"
                                  : "Guide";

                          return (
                            <a
                              key={resource.title}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center justify-between gap-2.5 rounded-xl border border-border-default bg-surface-elevated hover:bg-surface-secondary hover:border-accent-primary px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-text-primary transition-all duration-150 hover:shadow-[3px_3px_0px_var(--accent-primary)] hover:-translate-x-0.5 hover:-translate-y-0.5 no-underline"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-surface-secondary border border-border-default text-text-tertiary shrink-0 group-hover:text-accent-primary transition-colors">
                                  {typeBadge}
                                </span>
                                <span className="truncate group-hover:text-accent-primary transition-colors">
                                  {resource.title}
                                </span>
                              </div>
                              <ArrowUpRight className="h-3.5 w-3.5 text-text-tertiary shrink-0 group-hover:text-accent-primary transition-colors" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Advice Callout */}
          <div className="rounded-xl border border-border-brutalist dark:border-border-default bg-surface-elevated p-5 shadow-[4px_4px_0px_var(--accent-primary)]">
            <div className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-primary text-accent-primary-text font-bold">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-text-primary mb-1">
                  Senior Advice for {activeStage.title}:
                </h4>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {activeStage.advice}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Stage Navigation (Previous & Next Controls) */}
          <div className="pt-6 border-t border-border-default flex flex-col sm:flex-row items-center justify-between gap-4">
            {prevStage ? (
              <button
                type="button"
                onClick={() => handleSelectStage(prevStage.slug)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border-default bg-surface-secondary hover:bg-surface-elevated px-4 py-2.5 text-xs sm:text-sm font-bold text-text-primary transition-all cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>
                  Previous: Stage {prevStage.number} ({prevStage.title})
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextStage && (
              <button
                type="button"
                onClick={() => handleSelectStage(nextStage.slug)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border-2 border-text-primary dark:border-border-default bg-accent-primary text-accent-primary-text hover:bg-accent-primary-hover px-5 py-2.5 text-xs sm:text-sm font-bold shadow-[3px_3px_0px_0px_var(--border-brutalist)] transition-all cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                <span>
                  Next: Stage {nextStage.number} ({nextStage.title})
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
