import { useCallback, useState } from "react";
import type {
	FixedRangeProps,
	RangeProps as NormalRangeProps,
} from "@/types/range";

type RangeProps = NormalRangeProps | FixedRangeProps;

function isFixedRange(props: RangeProps): props is FixedRangeProps {
	return "values" in props;
}

export function useRangeState(props: RangeProps) {
	const isNormalMode = !isFixedRange(props);

	const normalMin = isNormalMode ? props.min : 0;
	const normalMax = isNormalMode ? props.max : 100;
	const normalStep = isNormalMode ? (props.step ?? 1) : 1;
	const normalInitialMin = isNormalMode
		? (props.initialMinValue ?? props.min)
		: 0;
	const normalInitialMax = isNormalMode
		? (props.initialMaxValue ?? props.max)
		: 100;

	const fixedValues = isFixedRange(props) ? props.values : [];
	const fixedInitialMinIndex = isFixedRange(props)
		? (props.initialMinIndex ?? 0)
		: 0;
	const fixedInitialMaxIndex = isFixedRange(props)
		? (props.initialMaxIndex ?? props.values.length - 1)
		: 0;

	const [minValue, setMinValue] = useState(normalInitialMin);
	const [maxValue, setMaxValue] = useState(normalInitialMax);
	const [minIndex, setMinIndex] = useState(fixedInitialMinIndex);
	const [maxIndex, setMaxIndex] = useState(fixedInitialMaxIndex);

	const updateMinValue = useCallback(
		(value: number) => {
			const clampedValue = Math.max(normalMin, Math.min(value, maxValue));
			setMinValue(clampedValue);
			if (isNormalMode) {
				props.onChange?.({ minValue: clampedValue, maxValue });
			}
		},
		[normalMin, maxValue, isNormalMode, props],
	);

	const updateMaxValue = useCallback(
		(value: number) => {
			const clampedValue = Math.min(normalMax, Math.max(value, minValue));
			setMaxValue(clampedValue);
			if (isNormalMode) {
				props.onChange?.({ minValue, maxValue: clampedValue });
			}
		},
		[normalMax, minValue, isNormalMode, props],
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
			const step = normalStep;
			return Math.round(value / step) * step;
		},
		[normalMin, normalMax, normalStep],
	);

	const updateMinIndex = useCallback(
		(index: number) => {
			const clampedIndex = Math.max(0, Math.min(index, maxIndex));
			setMinIndex(clampedIndex);
			if (isFixedRange(props)) {
				props.onChange?.({
					minValue: fixedValues[clampedIndex],
					maxValue: fixedValues[maxIndex],
					minIndex: clampedIndex,
					maxIndex,
				});
			}
		},
		[maxIndex, fixedValues, props],
	);

	const updateMaxIndex = useCallback(
		(index: number) => {
			const clampedIndex = Math.min(
				fixedValues.length - 1,
				Math.max(index, minIndex),
			);
			setMaxIndex(clampedIndex);
			if (isFixedRange(props)) {
				props.onChange?.({
					minValue: fixedValues[minIndex],
					maxValue: fixedValues[clampedIndex],
					minIndex,
					maxIndex: clampedIndex,
				});
			}
		},
		[minIndex, fixedValues, props],
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

			const exactIndex = (percentage / 100) * (fixedValues.length - 1);
			return Math.round(exactIndex);
		},
		[fixedValues.length],
	);

	if (isNormalMode) {
		return {
			mode: "normal" as const,
			minValue,
			maxValue,
			minPercentage: getValuePercentage(minValue),
			maxPercentage: getValuePercentage(maxValue),
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
		minPercentage: getIndexPercentage(minIndex),
		maxPercentage: getIndexPercentage(maxIndex),
		updateMinIndex,
		updateMaxIndex,
		getPercentage: getIndexPercentage,
		getIndexFromPosition,
	};
}
