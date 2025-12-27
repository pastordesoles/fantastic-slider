import { useCallback } from "react";

// Normal mode props
interface NormalKeyboardHandlersProps {
	mode: "normal";
	min: number;
	max: number;
	step: number;
	minValue: number;
	maxValue: number;
	updateMinValue: (value: number) => void;
	updateMaxValue: (value: number) => void;
}

// Fixed mode props
interface FixedKeyboardHandlersProps {
	mode: "fixed";
	valuesLength: number;
	minIndex: number;
	maxIndex: number;
	updateMinIndex: (index: number) => void;
	updateMaxIndex: (index: number) => void;
}

type UseKeyboardHandlersProps =
	| NormalKeyboardHandlersProps
	| FixedKeyboardHandlersProps;

/**
 * Unified hook for handling keyboard navigation on range sliders
 *
 * Supports both normal mode (continuous values) and fixed mode (discrete indices)
 *
 * Keyboard shortcuts:
 * - ArrowRight/ArrowUp: Increase value/index
 * - ArrowLeft/ArrowDown: Decrease value/index
 * - Home: Jump to minimum
 * - End: Jump to maximum
 * - PageUp: Large increase (10*step for normal, +2 for fixed)
 * - PageDown: Large decrease (10*step for normal, -2 for fixed)
 */
export function useKeyboardHandlers(props: UseKeyboardHandlersProps) {
	const handleMinKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (props.mode === "normal") {
				const { min, step, minValue, maxValue, updateMinValue } = props;
				let newValue = minValue;

				switch (e.key) {
					case "ArrowRight":
					case "ArrowUp":
						e.preventDefault();
						newValue = Math.min(minValue + step, maxValue);
						break;
					case "ArrowLeft":
					case "ArrowDown":
						e.preventDefault();
						newValue = Math.max(minValue - step, min);
						break;
					case "Home":
						e.preventDefault();
						newValue = min;
						break;
					case "End":
						e.preventDefault();
						newValue = maxValue;
						break;
					case "PageUp":
						e.preventDefault();
						newValue = Math.min(minValue + step * 10, maxValue);
						break;
					case "PageDown":
						e.preventDefault();
						newValue = Math.max(minValue - step * 10, min);
						break;
					default:
						return;
				}

				updateMinValue(newValue);
			} else {
				// Fixed mode
				const { minIndex, maxIndex, updateMinIndex } = props;
				let newIndex = minIndex;

				switch (e.key) {
					case "ArrowRight":
					case "ArrowUp":
						e.preventDefault();
						newIndex = Math.min(minIndex + 1, maxIndex);
						break;
					case "ArrowLeft":
					case "ArrowDown":
						e.preventDefault();
						newIndex = Math.max(minIndex - 1, 0);
						break;
					case "Home":
						e.preventDefault();
						newIndex = 0;
						break;
					case "End":
						e.preventDefault();
						newIndex = maxIndex;
						break;
					case "PageUp":
						e.preventDefault();
						newIndex = Math.min(minIndex + 2, maxIndex);
						break;
					case "PageDown":
						e.preventDefault();
						newIndex = Math.max(minIndex - 2, 0);
						break;
					default:
						return;
				}

				updateMinIndex(newIndex);
			}
		},
		[props],
	);

	const handleMaxKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (props.mode === "normal") {
				const { max, step, minValue, maxValue, updateMaxValue } = props;
				let newValue = maxValue;

				switch (e.key) {
					case "ArrowRight":
					case "ArrowUp":
						e.preventDefault();
						newValue = Math.min(maxValue + step, max);
						break;
					case "ArrowLeft":
					case "ArrowDown":
						e.preventDefault();
						newValue = Math.max(maxValue - step, minValue);
						break;
					case "Home":
						e.preventDefault();
						newValue = minValue;
						break;
					case "End":
						e.preventDefault();
						newValue = max;
						break;
					case "PageUp":
						e.preventDefault();
						newValue = Math.min(maxValue + step * 10, max);
						break;
					case "PageDown":
						e.preventDefault();
						newValue = Math.max(maxValue - step * 10, minValue);
						break;
					default:
						return;
				}

				updateMaxValue(newValue);
			} else {
				// Fixed mode
				const { valuesLength, minIndex, maxIndex, updateMaxIndex } = props;
				let newIndex = maxIndex;

				switch (e.key) {
					case "ArrowRight":
					case "ArrowUp":
						e.preventDefault();
						newIndex = Math.min(maxIndex + 1, valuesLength - 1);
						break;
					case "ArrowLeft":
					case "ArrowDown":
						e.preventDefault();
						newIndex = Math.max(maxIndex - 1, minIndex);
						break;
					case "Home":
						e.preventDefault();
						newIndex = minIndex;
						break;
					case "End":
						e.preventDefault();
						newIndex = valuesLength - 1;
						break;
					case "PageUp":
						e.preventDefault();
						newIndex = Math.min(maxIndex + 2, valuesLength - 1);
						break;
					case "PageDown":
						e.preventDefault();
						newIndex = Math.max(maxIndex - 2, minIndex);
						break;
					default:
						return;
				}

				updateMaxIndex(newIndex);
			}
		},
		[props],
	);

	return {
		handleMinKeyDown,
		handleMaxKeyDown,
	};
}
