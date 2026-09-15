"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Shuffle } from "lucide-react";

const ARRAY_SIZE = 16;
const INITIAL_ARRAY = [40, 75, 25, 90, 50, 20, 80, 60, 30, 85, 45, 95, 35, 70, 55, 65];

interface AnimationStep {
  type: "compare" | "update" | "sorted";
  indices?: number[];
  index?: number;
  array?: number[];
  comparisons: number;
  swaps: number;
}

const SPEED_MS_MAP = {
  "0.5x": 450,
  "1x": 250,
  "2x": 130,
} as const;

type SpeedOption = keyof typeof SPEED_MS_MAP;

function buildBubbleSortSteps(initialArr: number[]): AnimationStep[] {
  const arr = [...initialArr];
  const steps: AnimationStep[] = [];
  let compCount = 0;
  let swapCount = 0;

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      compCount++;
      steps.push({
        type: "compare",
        indices: [j, j + 1],
        comparisons: compCount,
        swaps: swapCount,
      });

      if (arr[j] > arr[j + 1]) {
        swapCount++;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        steps.push({
          type: "update",
          array: [...arr],
          comparisons: compCount,
          swaps: swapCount,
        });
      }
    }
    steps.push({
      type: "sorted",
      index: arr.length - i - 1,
      comparisons: compCount,
      swaps: swapCount,
    });
  }
  steps.push({
    type: "sorted",
    index: 0,
    comparisons: compCount,
    swaps: swapCount,
  });

  return steps;
}

export function AlgorithmVisualizer() {
  const [array, setArray] = useState<number[]>(INITIAL_ARRAY);
  const [initialRunArray, setInitialRunArray] = useState<number[]>(INITIAL_ARRAY);
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [comparing, setComparing] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const stepsRef = useRef<AnimationStep[]>([]);
  const currentStepRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speedRef = useRef<number>(SPEED_MS_MAP["1x"]);

  const isRunningRef = useRef(true);
  isRunningRef.current = isRunning;
  const isPausedRef = useRef(false);
  isPausedRef.current = isPaused;

  const executeNextStep = useCallback(() => {
    if (!isRunningRef.current || isPausedRef.current) return;

    if (currentStepRef.current >= stepsRef.current.length) {
      // Sort complete
      setIsRunning(false);
      setIsPaused(false);
      setComparing([]);

      // Auto restart after 4.5s
      timerRef.current = setTimeout(() => {
        handleShuffleAndRun();
      }, 4500);
      return;
    }

    const step = stepsRef.current[currentStepRef.current];
    setComparisons(step.comparisons);
    setSwaps(step.swaps);

    if (step.type === "compare") {
      setComparing(step.indices || []);
    } else if (step.type === "update") {
      if (step.array) setArray(step.array);
    } else if (step.type === "sorted") {
      if (step.index !== undefined) {
        setSortedIndices((prev) => (prev.includes(step.index!) ? prev : [...prev, step.index!]));
      }
      setComparing([]);
    }

    currentStepRef.current++;
    timerRef.current = setTimeout(executeNextStep, speedRef.current);
  }, []);

  const startSortWithArray = useCallback(
    (arr: number[]) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setArray([...arr]);
      setInitialRunArray([...arr]);
      setComparing([]);
      setSortedIndices([]);
      setComparisons(0);
      setSwaps(0);
      currentStepRef.current = 0;
      stepsRef.current = buildBubbleSortSteps(arr);

      setIsRunning(true);
      setIsPaused(false);
      isRunningRef.current = true;
      isPausedRef.current = false;

      timerRef.current = setTimeout(executeNextStep, speedRef.current);
    },
    [executeNextStep]
  );

  const handleShuffleAndRun = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const newArr: number[] = [];
    for (let i = 0; i < ARRAY_SIZE; i++) {
      newArr.push(Math.floor(Math.random() * 75) + 20); // 20 to 95
    }
    startSortWithArray(newArr);
  }, [startSortWithArray]);

  // Initial Auto-start
  useEffect(() => {
    startSortWithArray(INITIAL_ARRAY);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startSortWithArray]);

  return (
    <div className="w-full max-w-[500px] bg-surface-primary border-4 border-text-primary dark:border-border-default rounded-xl shadow-[8px_8px_0px_var(--text-primary)] dark:shadow-[8px_8px_0px_var(--border-hover)] hover:shadow-[8px_8px_0px_var(--accent-primary)] dark:hover:shadow-[8px_8px_0px_var(--accent-primary)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-150 overflow-hidden flex flex-col animate-in fade-in slide-in-from-right-8 duration-700">
      {/* Visualizer Header */}
      <div className="flex justify-between items-center py-3 px-4 bg-surface-secondary border-b-4 border-text-primary dark:border-border-default">
        <div className="flex items-center gap-2.5">
          <h3 className="m-0 font-black text-xl uppercase tracking-tight text-text-primary">Bubble Sort</h3>
          <span className="font-mono [font-feature-settings:'liga'_0,'calt'_0] text-xs font-bold bg-text-primary text-surface-primary py-1 px-2 rounded-sm">
            O(N²)
          </span>
        </div>
        <button
          type="button"
          onClick={handleShuffleAndRun}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-primary text-text-primary border-2 border-text-primary dark:border-border-default rounded-md cursor-pointer font-heading text-xs font-bold transition-all duration-150 hover:bg-surface-secondary hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_var(--text-primary)] dark:hover:shadow-[2px_2px_0px_var(--border-default)] active:translate-y-0 active:shadow-none"
          title="Shuffle Array"
        >
          <Shuffle className="w-3.5 h-3.5 text-accent-primary" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* Bars Chart Area */}
      <div className="h-[220px] flex items-end p-4 gap-1 [background-image:linear-gradient(to_right,var(--grid-lines)_1px,transparent_1px),linear-gradient(to_top,var(--grid-lines)_1px,transparent_1px)] [background-size:20px_20px]">
        {array.map((value, idx) => {
          const isComparing = comparing.includes(idx);
          const isSorted = sortedIndices.includes(idx);

          return (
            <div
              key={idx}
              className={`flex-1 border-2 border-b-0 rounded-t flex justify-center items-start pt-1 transition-all duration-150 relative overflow-hidden ${isComparing
                ? "bg-accent-primary border-text-primary dark:border-accent-primary"
                : isSorted
                  ? "bg-text-primary border-text-primary"
                  : "bg-text-primary border-text-primary"
                }`}
              style={{ height: `${value}%` }}
            >
              <span className="font-mono [font-feature-settings:'liga'_0,'calt'_0] text-[10px] font-bold text-surface-primary [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 pointer-events-none">
                {value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Live Counters & Complexity Specs */}
      <div className="grid grid-cols-3 divide-x-2 divide-text-primary dark:divide-border-default border-t-2 border-text-primary dark:border-border-default bg-surface-primary text-center">
        <div className="py-2 px-1">
          <span className="block font-mono text-[10px] text-text-tertiary uppercase tracking-wider">Comparisons</span>
          <span className="font-mono text-sm font-bold text-text-primary">{comparisons}</span>
        </div>
        <div className="py-2 px-1">
          <span className="block font-mono text-[10px] text-text-tertiary uppercase tracking-wider">Swaps</span>
          <span className="font-mono text-sm font-bold text-accent-primary-hover">{swaps}</span>
        </div>
        <div className="py-2 px-1">
          <span className="block font-mono text-[10px] text-text-tertiary uppercase tracking-wider">Aux Space</span>
          <span className="font-mono text-sm font-bold text-text-primary">O(1)</span>
        </div>
      </div>

      {/* CP Hub Footer Link */}
      <div className="py-2.5 px-4 bg-surface-secondary/70 border-t-2 border-text-primary dark:border-border-default flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-text-secondary font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-accent-success inline-block" />
          <span>Algorithm Lab</span>
        </div>
        <Link
          href="/cp-hub?tab=roadmaps"
          className="font-heading text-xs font-bold text-text-primary hover:text-accent-primary-hover inline-flex items-center gap-1 group transition-colors"
        >
          <span>Explore Sorting Roadmaps</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
