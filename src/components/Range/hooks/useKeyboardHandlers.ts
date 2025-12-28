import { useCallback } from "react";

import type { RangeComponentProps } from "@/types/range";

import type { useRangeState } from "./useRangeState";

type RangeState = ReturnType<typeof useRangeState>;

const useKeyboardHandlers = (state: RangeState, props: RangeComponentProps) => {
	const step = "step" in props ? (props.step ?? 1) : 1;
	const min = "min" in props ? props.min : 0;
	const max = "max" in props ? props.max : 100;
	const onMinKeyDown = useCallback(
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
				let newIdx = minIndex;

				switch (e.key) {
					case "ArrowRight":
					case "ArrowUp":
						newIdx = minIndex + 1;
						break;
					case "ArrowLeft":
					case "ArrowDown":
						newIdx = minIndex - 1;
						break;
					case "Home":
						newIdx = 0;
						break;
					case "End":
						newIdx = maxIndex;
						break;
					case "PageUp":
						newIdx = minIndex + 2;
						break;
					case "PageDown":
						newIdx = minIndex - 2;
						break;
					default:
						handled = false;
				}

				if (handled) {
					e.preventDefault();
					state.updateMinIndex(newIdx);
				}
			}
		},
		[state, step, min],
	);

	const onMaxKeyDown = useCallback(
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
				let newIdx = maxIndex;

				switch (e.key) {
					case "ArrowRight":
					case "ArrowUp":
						newIdx = maxIndex + 1;
						break;
					case "ArrowLeft":
					case "ArrowDown":
						newIdx = maxIndex - 1;
						break;
					case "Home":
						newIdx = minIndex;
						break;
					case "End":
						newIdx = Number.MAX_SAFE_INTEGER;
						break;
					case "PageUp":
						newIdx = maxIndex + 2;
						break;
					case "PageDown":
						newIdx = maxIndex - 2;
						break;
					default:
						handled = false;
				}

				if (handled) {
					e.preventDefault();
					state.updateMaxIndex(newIdx);
				}
			}
		},
		[state, step, max],
	);

	return {
		handleMinKeyDown: onMinKeyDown,
		handleMaxKeyDown: onMaxKeyDown,
	};
};

export { useKeyboardHandlers };
