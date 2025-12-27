import { useCallback, useState } from "react";

import type {
	FixedRangeProps,
	RangeProps as NormalRangeProps,
} from "@/types/range";

type RangeProps = NormalRangeProps | FixedRangeProps;

const isFixedRange = (props: RangeProps): props is FixedRangeProps => {
	return "values" in props;
};

const useRangeState = (props: RangeProps) => {
	const isFixed = isFixedRange(props);

	const normalState = useNormalRangeState(
		isFixed ? { min: 0, max: 100 } : props,
	);
	const fixedState = useFixedRangeState(isFixed ? props : { values: [] });

	return isFixed ? fixedState : normalState;
};

const useNormalRangeState = (props: NormalRangeProps) => {
	const min = props.min;
	const max = props.max;
	const step = props.step ?? 1;

	const [minValue, setMinValue] = useState(props.initialMinValue ?? props.min);
	const [maxValue, setMaxValue] = useState(props.initialMaxValue ?? props.max);

	const updateMinValue = useCallback(
		(value: number) => {
			const clampedValue = Math.max(min, Math.min(value, maxValue));
			setMinValue(clampedValue);
			props.onChange?.({ minValue: clampedValue, maxValue });
		},
		[min, maxValue, props],
	);

	const updateMaxValue = useCallback(
		(value: number) => {
			const clampedValue = Math.min(max, Math.max(value, minValue));
			setMaxValue(clampedValue);
			props.onChange?.({ minValue, maxValue: clampedValue });
		},
		[max, minValue, props],
	);

	const getValuePercentage = useCallback(
		(value: number) => {
			return ((value - min) / (max - min)) * 100;
		},
		[min, max],
	);

	const getValueFromPosition = useCallback(
		(trackElement: HTMLElement, clientX: number): number => {
			const rect = trackElement.getBoundingClientRect();
			const percentage = Math.max(
				0,
				Math.min(100, ((clientX - rect.left) / rect.width) * 100),
			);
			const value = min + (percentage / 100) * (max - min);
			return Math.round(value / step) * step;
		},
		[min, max, step],
	);

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
};

const useFixedRangeState = (props: FixedRangeProps) => {
	const values = props.values;

	const [minIndex, setMinIndex] = useState(props.initialMinIndex ?? 0);
	const [maxIndex, setMaxIndex] = useState(
		props.initialMaxIndex ?? props.values.length - 1,
	);

	const updateMinIndex = useCallback(
		(index: number) => {
			const clampedIndex = Math.max(0, Math.min(index, maxIndex));
			setMinIndex(clampedIndex);
			props.onChange?.({
				minValue: values[clampedIndex],
				maxValue: values[maxIndex],
				minIndex: clampedIndex,
				maxIndex,
			});
		},
		[maxIndex, values, props],
	);

	const updateMaxIndex = useCallback(
		(index: number) => {
			const clampedIndex = Math.min(
				values.length - 1,
				Math.max(index, minIndex),
			);
			setMaxIndex(clampedIndex);
			props.onChange?.({
				minValue: values[minIndex],
				maxValue: values[clampedIndex],
				minIndex,
				maxIndex: clampedIndex,
			});
		},
		[minIndex, values, props],
	);

	const getIndexPercentage = useCallback(
		(index: number) => {
			if (values.length <= 1) return 0;
			return (index / (values.length - 1)) * 100;
		},
		[values.length],
	);

	const getIndexFromPosition = useCallback(
		(trackElement: HTMLElement, clientX: number): number => {
			const rect = trackElement.getBoundingClientRect();
			const percentage = Math.max(
				0,
				Math.min(100, ((clientX - rect.left) / rect.width) * 100),
			);
			const exactIndex = (percentage / 100) * (values.length - 1);
			return Math.round(exactIndex);
		},
		[values.length],
	);

	return {
		mode: "fixed" as const,
		minIndex,
		maxIndex,
		minValue: values[minIndex],
		maxValue: values[maxIndex],
		minPercentage: getIndexPercentage(minIndex),
		maxPercentage: getIndexPercentage(maxIndex),
		updateMinIndex,
		updateMaxIndex,
		getPercentage: getIndexPercentage,
		getIndexFromPosition,
	};
};

export { useRangeState };
