import { useCallback, useEffect, useState } from "react";

// Normal mode props
interface NormalDragHandlersProps {
	mode: "normal";
	trackRef: React.RefObject<HTMLDivElement | null>;
	getValueFromPosition: (trackElement: HTMLElement, clientX: number) => number;
	minValue: number;
	maxValue: number;
	updateMinValue: (value: number) => void;
	updateMaxValue: (value: number) => void;
}

// Fixed mode props
interface FixedDragHandlersProps {
	mode: "fixed";
	trackRef: React.RefObject<HTMLDivElement | null>;
	getIndexFromPosition: (trackElement: HTMLElement, clientX: number) => number;
	minIndex: number;
	maxIndex: number;
	updateMinIndex: (index: number) => void;
	updateMaxIndex: (index: number) => void;
}

type UseDragHandlersProps = NormalDragHandlersProps | FixedDragHandlersProps;

/**
 * Unified hook for handling drag interactions on range sliders
 *
 * Supports both normal mode (continuous values) and fixed mode (discrete indices)
 */
export function useDragHandlers(props: UseDragHandlersProps) {
	const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);

	const handleMove = useCallback(
		(clientX: number) => {
			if (!activeThumb || !props.trackRef.current) return;

			if (props.mode === "normal") {
				const newValue = props.getValueFromPosition(
					props.trackRef.current,
					clientX,
				);

				if (activeThumb === "min") {
					props.updateMinValue(newValue);
				} else {
					props.updateMaxValue(newValue);
				}
			} else {
				const newIndex = props.getIndexFromPosition(
					props.trackRef.current,
					clientX,
				);

				if (activeThumb === "min") {
					props.updateMinIndex(newIndex);
				} else {
					props.updateMaxIndex(newIndex);
				}
			}
		},
		[activeThumb, props],
	);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			handleMove(e.clientX);
		},
		[handleMove],
	);

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			if (e.touches.length > 0) {
				handleMove(e.touches[0].clientX);
			}
		},
		[handleMove],
	);

	const handleEnd = useCallback(() => {
		setActiveThumb(null);
	}, []);

	useEffect(() => {
		if (activeThumb) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleEnd);
			document.addEventListener("touchmove", handleTouchMove);
			document.addEventListener("touchend", handleEnd);

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleEnd);
				document.removeEventListener("touchmove", handleTouchMove);
				document.removeEventListener("touchend", handleEnd);
			};
		}
	}, [activeThumb, handleMouseMove, handleTouchMove, handleEnd]);

	return {
		activeThumb,
		setActiveThumb,
	};
}
