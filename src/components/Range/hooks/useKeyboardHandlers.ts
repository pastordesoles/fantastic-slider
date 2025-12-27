import { useCallback } from "react";

import type {
	FixedRangeProps,
	RangeProps as NormalRangeProps,
} from "@/types/range";

import type { useRangeState } from "./useRangeState";

type RangeState = ReturnType<typeof useRangeState>;
type RangeProps = NormalRangeProps | FixedRangeProps;

const useKeyboardHandlers = (state: RangeState, props: RangeProps) => {
	const step = "step" in props ? (props.step ?? 1) : 1;
	const min = "min" in props ? props.min : 0;
	const max = "max" in props ? props.max : 100;
	const handleMinKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			let handled = true;

			if (state.mode === "normal") {
				const { minValue, maxValue } = state;
				let newValue = minValue;

				switch (e.key) {
					case "ArrowRight":
					case "ArrowUp":
						newValue = minValue + step;
						break;
					case "ArrowLeft":
					case "ArrowDown":
						newValue = minValue - step;
						break;
					case "Home":
						newValue = min;
						break;
					case "End":
						newValue = maxValue;
						break;
					case "PageUp":
						newValue = minValue + step * 10;
						break;
					case "PageDown":
						newValue = minValue - step * 10;
						break;
					default:
						handled = false;
				}

				if (handled) {
					e.preventDefault();
					state.updateMinValue(newValue);
				}
			} else {
				const { minIndex, maxIndex } = state;
				let newIndex = minIndex;

				switch (e.key) {
					case "ArrowRight":
					case "ArrowUp":
						newIndex = minIndex + 1;
						break;
					case "ArrowLeft":
					case "ArrowDown":
						newIndex = minIndex - 1;
						break;
					case "Home":
						newIndex = 0;
						break;
					case "End":
						newIndex = maxIndex;
						break;
					case "PageUp":
						newIndex = minIndex + 2;
						break;
					case "PageDown":
						newIndex = minIndex - 2;
						break;
					default:
						handled = false;
				}

				if (handled) {
					e.preventDefault();
					state.updateMinIndex(newIndex);
				}
			}
		},
		[state, step, min],
	);

	const handleMaxKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			let handled = true;

			if (state.mode === "normal") {
				const { minValue, maxValue } = state;
				let newValue = maxValue;

				switch (e.key) {
					case "ArrowRight":
					case "ArrowUp":
						newValue = maxValue + step;
						break;
					case "ArrowLeft":
					case "ArrowDown":
						newValue = maxValue - step;
						break;
					case "Home":
						newValue = minValue;
						break;
					case "End":
						newValue = max;
						break;
					case "PageUp":
						newValue = maxValue + step * 10;
						break;
					case "PageDown":
						newValue = maxValue - step * 10;
						break;
					default:
						handled = false;
				}

				if (handled) {
					e.preventDefault();
					state.updateMaxValue(newValue);
				}
			} else {
				const { minIndex, maxIndex } = state;
				let newIndex = maxIndex;

				switch (e.key) {
					case "ArrowRight":
					case "ArrowUp":
						newIndex = maxIndex + 1;
						break;
					case "ArrowLeft":
					case "ArrowDown":
						newIndex = maxIndex - 1;
						break;
					case "Home":
						newIndex = minIndex;
						break;
					case "End":
						newIndex = Number.MAX_SAFE_INTEGER;
						break;
					case "PageUp":
						newIndex = maxIndex + 2;
						break;
					case "PageDown":
						newIndex = maxIndex - 2;
						break;
					default:
						handled = false;
				}

				if (handled) {
					e.preventDefault();
					state.updateMaxIndex(newIndex);
				}
			}
		},
		[state, step, max],
	);

	return {
		handleMinKeyDown,
		handleMaxKeyDown,
	};
};

export { useKeyboardHandlers };
