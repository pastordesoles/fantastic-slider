import { useRef } from "react";
import type {
	FixedRangeProps,
	RangeProps as NormalRangeProps,
} from "@/types/range";
import { useDragHandlers } from "./useDragHandlers";
import { useKeyboardHandlers } from "./useKeyboardHandlers";
import { useRangeState } from "./useRangeState";

type RangeProps = NormalRangeProps | FixedRangeProps;

/**
 * Unified hook that consolidates all range slider logic
 *
 * This hook handles both normal and fixed modes, returning all necessary
 * state, handlers, and configuration in a single object
 */
export function useRange(props: RangeProps) {
	const trackRef = useRef<HTMLDivElement>(null);
	const minThumbRef = useRef<HTMLDivElement>(null);
	const maxThumbRef = useRef<HTMLDivElement>(null);

	const isFixedMode = "values" in props;

	// Extract props for both modes (always extract in same order)
	const fixedProps = isFixedMode ? (props as FixedRangeProps) : null;
	const normalProps = !isFixedMode ? (props as NormalRangeProps) : null;

	const values = fixedProps?.values ?? [];
	const initialMinIndex = fixedProps?.initialMinIndex;
	const initialMaxIndex = fixedProps?.initialMaxIndex;
	const fixedOnChange = fixedProps?.onChange;
	const fixedLabel = fixedProps?.label ?? "Fixed Range Slider";
	const currency = fixedProps?.currency ?? "€";

	const min = normalProps?.min ?? 0;
	const max = normalProps?.max ?? 100;
	const step = normalProps?.step ?? 1;
	const initialMinValue = normalProps?.initialMinValue;
	const initialMaxValue = normalProps?.initialMaxValue;
	const normalOnChange = normalProps?.onChange;
	const normalLabel = normalProps?.label ?? "Range Slider";

	// Always call hooks in the same order regardless of mode
	const rangeState = useRangeState(
		isFixedMode
			? {
					mode: "fixed",
					values,
					initialMinIndex,
					initialMaxIndex,
					onValueChange: (minVal, maxVal, minIdx, maxIdx) => {
						fixedOnChange?.({
							minValue: minVal,
							maxValue: maxVal,
							minIndex: minIdx,
							maxIndex: maxIdx,
						});
					},
				}
			: {
					mode: "normal",
					min,
					max,
					step,
					initialMinValue,
					initialMaxValue,
					onValueChange: (minVal, maxVal) => {
						normalOnChange?.({ minValue: minVal, maxValue: maxVal });
					},
				},
	);

	const dragHandlers = useDragHandlers(
		isFixedMode && rangeState.mode === "fixed"
			? {
					mode: "fixed",
					trackRef,
					getIndexFromPosition: rangeState.getIndexFromPosition,
					minIndex: rangeState.minIndex,
					maxIndex: rangeState.maxIndex,
					updateMinIndex: rangeState.updateMinIndex,
					updateMaxIndex: rangeState.updateMaxIndex,
				}
			: rangeState.mode === "normal"
				? {
						mode: "normal",
						trackRef,
						getValueFromPosition: rangeState.getValueFromPosition,
						minValue: rangeState.minValue,
						maxValue: rangeState.maxValue,
						updateMinValue: rangeState.updateMinValue,
						updateMaxValue: rangeState.updateMaxValue,
					}
				: ({
						mode: "normal",
						trackRef,
						getValueFromPosition: () => 0,
						minValue: 0,
						maxValue: 100,
						updateMinValue: () => {},
						updateMaxValue: () => {},
					} as const),
	);

	const keyboardHandlers = useKeyboardHandlers(
		isFixedMode && rangeState.mode === "fixed"
			? {
					mode: "fixed",
					valuesLength: values.length,
					minIndex: rangeState.minIndex,
					maxIndex: rangeState.maxIndex,
					updateMinIndex: rangeState.updateMinIndex,
					updateMaxIndex: rangeState.updateMaxIndex,
				}
			: rangeState.mode === "normal"
				? {
						mode: "normal",
						min,
						max,
						step,
						minValue: rangeState.minValue,
						maxValue: rangeState.maxValue,
						updateMinValue: rangeState.updateMinValue,
						updateMaxValue: rangeState.updateMaxValue,
					}
				: ({
						mode: "normal",
						min: 0,
						max: 100,
						step: 1,
						minValue: 0,
						maxValue: 100,
						updateMinValue: () => {},
						updateMaxValue: () => {},
					} as const),
	);

	// Return appropriate values based on mode
	if (isFixedMode && rangeState.mode === "fixed") {
		return {
			mode: "fixed" as const,
			trackRef,
			minThumbRef,
			maxThumbRef,
			label: fixedLabel,
			currency,
			minValue: rangeState.minValue,
			maxValue: rangeState.maxValue,
			minPercentage: rangeState.getPercentage(rangeState.minIndex),
			maxPercentage: rangeState.getPercentage(rangeState.maxIndex),
			activeThumb: dragHandlers.activeThumb,
			setActiveThumb: dragHandlers.setActiveThumb,
			handleMinKeyDown: keyboardHandlers.handleMinKeyDown,
			handleMaxKeyDown: keyboardHandlers.handleMaxKeyDown,
			// Fixed mode specific
			minIndex: rangeState.minIndex,
			maxIndex: rangeState.maxIndex,
			valuesLength: values.length,
		};
	}

	if (rangeState.mode === "normal") {
		return {
			mode: "normal" as const,
			trackRef,
			minThumbRef,
			maxThumbRef,
			label: normalLabel,
			minValue: rangeState.minValue,
			maxValue: rangeState.maxValue,
			minPercentage: rangeState.getPercentage(rangeState.minValue),
			maxPercentage: rangeState.getPercentage(rangeState.maxValue),
			activeThumb: dragHandlers.activeThumb,
			setActiveThumb: dragHandlers.setActiveThumb,
			handleMinKeyDown: keyboardHandlers.handleMinKeyDown,
			handleMaxKeyDown: keyboardHandlers.handleMaxKeyDown,
			// Normal mode specific
			min,
			max,
			updateMinValue: rangeState.updateMinValue,
			updateMaxValue: rangeState.updateMaxValue,
		};
	}

	throw new Error("Invalid state mode");
}
