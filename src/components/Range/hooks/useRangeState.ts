import { useCallback, useState } from "react";

// Base props shared by both modes
interface BaseRangeStateProps {
	onValueChange?: (...args: number[]) => void;
}

// Normal mode props
interface NormalRangeStateProps extends BaseRangeStateProps {
	mode: "normal";
	min: number;
	max: number;
	step: number;
	initialMinValue?: number;
	initialMaxValue?: number;
	onValueChange?: (minValue: number, maxValue: number) => void;
}

// Fixed mode props
interface FixedRangeStateProps extends BaseRangeStateProps {
	mode: "fixed";
	values: number[];
	initialMinIndex?: number;
	initialMaxIndex?: number;
	onValueChange?: (
		minValue: number,
		maxValue: number,
		minIndex: number,
		maxIndex: number,
	) => void;
}

type UseRangeStateProps = NormalRangeStateProps | FixedRangeStateProps;

/**
 * Unified hook for managing range state in both normal and fixed modes
 *
 * Normal mode: Works with continuous values between min and max
 * Fixed mode: Works with discrete indices from a values array
 */
export function useRangeState(props: UseRangeStateProps) {
	const isNormalMode = props.mode === "normal";

	// Normal mode values
	const normalMin = isNormalMode ? props.min : 0;
	const normalMax = isNormalMode ? props.max : 100;
	const normalStep = isNormalMode ? props.step : 1;
	const normalInitialMin = isNormalMode
		? (props.initialMinValue ?? props.min)
		: 0;
	const normalInitialMax = isNormalMode
		? (props.initialMaxValue ?? props.max)
		: 100;

	// Fixed mode values
	const fixedValues = !isNormalMode ? props.values : [];
	const fixedInitialMinIndex = !isNormalMode ? (props.initialMinIndex ?? 0) : 0;
	const fixedInitialMaxIndex = !isNormalMode
		? (props.initialMaxIndex ?? props.values.length - 1)
		: 0;

	// State hooks - always called in the same order
	const [minValue, setMinValue] = useState(normalInitialMin);
	const [maxValue, setMaxValue] = useState(normalInitialMax);
	const [minIndex, setMinIndex] = useState(fixedInitialMinIndex);
	const [maxIndex, setMaxIndex] = useState(fixedInitialMaxIndex);

	// Normal mode callbacks
	const updateMinValue = useCallback(
		(value: number) => {
			const clampedValue = Math.max(normalMin, Math.min(value, maxValue));
			setMinValue(clampedValue);
			if (isNormalMode) {
				props.onValueChange?.(clampedValue, maxValue);
			}
		},
		[normalMin, maxValue, props, isNormalMode],
	);

	const updateMaxValue = useCallback(
		(value: number) => {
			const clampedValue = Math.min(normalMax, Math.max(value, minValue));
			setMaxValue(clampedValue);
			if (isNormalMode) {
				props.onValueChange?.(minValue, clampedValue);
			}
		},
		[normalMax, minValue, props, isNormalMode],
	);

	const getValuePercentage = useCallback(
		(value: number) => {
			return ((value - normalMin) / (normalMax - normalMin)) * 100;
		},
		[normalMin, normalMax],
	);

	const getValueFromPosition = useCallback(
		(trackElement: HTMLElement, clientX: number): number => {
			const rect = trackElement.getBoundingClientRect();
			const percentage = Math.max(
				0,
				Math.min(100, ((clientX - rect.left) / rect.width) * 100),
			);
			const value = normalMin + (percentage / 100) * (normalMax - normalMin);
			return Math.round(value / normalStep) * normalStep;
		},
		[normalMin, normalMax, normalStep],
	);

	// Fixed mode callbacks
	const updateMinIndex = useCallback(
		(index: number) => {
			const clampedIndex = Math.max(0, Math.min(index, maxIndex));
			setMinIndex(clampedIndex);
			if (!isNormalMode) {
				props.onValueChange?.(
					fixedValues[clampedIndex],
					fixedValues[maxIndex],
					clampedIndex,
					maxIndex,
				);
			}
		},
		[maxIndex, fixedValues, props, isNormalMode],
	);

	const updateMaxIndex = useCallback(
		(index: number) => {
			const clampedIndex = Math.min(
				fixedValues.length - 1,
				Math.max(index, minIndex),
			);
			setMaxIndex(clampedIndex);
			if (!isNormalMode) {
				props.onValueChange?.(
					fixedValues[minIndex],
					fixedValues[clampedIndex],
					minIndex,
					clampedIndex,
				);
			}
		},
		[minIndex, fixedValues, props, isNormalMode],
	);

	const getIndexPercentage = useCallback(
		(index: number) => {
			if (fixedValues.length <= 1) return 0;
			return (index / (fixedValues.length - 1)) * 100;
		},
		[fixedValues.length],
	);

	const getIndexFromPosition = useCallback(
		(trackElement: HTMLElement, clientX: number): number => {
			const rect = trackElement.getBoundingClientRect();
			const percentage = Math.max(
				0,
				Math.min(100, ((clientX - rect.left) / rect.width) * 100),
			);

			// Map percentage to closest index
			const exactIndex = (percentage / 100) * (fixedValues.length - 1);
			return Math.round(exactIndex);
		},
		[fixedValues.length],
	);

	// Return appropriate values based on mode
	if (isNormalMode) {
		return {
			mode: "normal" as const,
			minValue,
			maxValue,
			updateMinValue,
			updateMaxValue,
			getPercentage: getValuePercentage,
			getValueFromPosition,
		};
	}

	return {
		mode: "fixed" as const,
		minIndex,
		maxIndex,
		minValue: fixedValues[minIndex],
		maxValue: fixedValues[maxIndex],
		updateMinIndex,
		updateMaxIndex,
		getPercentage: getIndexPercentage,
		getIndexFromPosition,
	};
}
