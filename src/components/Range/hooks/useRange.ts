import { useRef } from "react";

import type {
	FixedRangeProps,
	RangeProps as NormalRangeProps,
} from "@/types/range";

import { useDragHandlers } from "./useDragHandlers";
import { useKeyboardHandlers } from "./useKeyboardHandlers";
import { useRangeState } from "./useRangeState";

type RangeProps = NormalRangeProps | FixedRangeProps;

const isFixedRange = (props: RangeProps): props is FixedRangeProps => {
	return "values" in props;
};

const useRange = (props: RangeProps) => {
	const trackRef = useRef<HTMLDivElement>(null);
	const minThumbRef = useRef<HTMLDivElement>(null);
	const maxThumbRef = useRef<HTMLDivElement>(null);

	const rangeState = useRangeState(props);
	const dragHandlers = useDragHandlers(rangeState, trackRef);
	const keyboardHandlers = useKeyboardHandlers(rangeState, props);

	const baseReturn = {
		trackRef,
		minThumbRef,
		maxThumbRef,
		label: props.label ?? "Range Slider",
		minValue: rangeState.minValue,
		maxValue: rangeState.maxValue,
		minPercentage: rangeState.minPercentage,
		maxPercentage: rangeState.maxPercentage,
		activeThumb: dragHandlers.activeThumb,
		setActiveThumb: dragHandlers.setActiveThumb,
		handleMinKeyDown: keyboardHandlers.handleMinKeyDown,
		handleMaxKeyDown: keyboardHandlers.handleMaxKeyDown,
	};

	if (isFixedRange(props)) {
		if (rangeState.mode !== "fixed") {
			throw new Error("Invalid state: expected fixed mode");
		}
		return {
			mode: "fixed" as const,
			...baseReturn,
			currency: props.currency ?? "€",
			minIndex: rangeState.minIndex,
			maxIndex: rangeState.maxIndex,
			valuesLength: props.values.length,
		};
	}

	return {
		mode: "normal" as const,
		...baseReturn,
		min: props.min,
		max: props.max,
		updateMinValue: rangeState.updateMinValue,
		updateMaxValue: rangeState.updateMaxValue,
	};
};

export { useRange };
