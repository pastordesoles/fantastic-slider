import { useCallback, useEffect, useState } from "react";
import type { useRangeState } from "./useRangeState";

type RangeState = ReturnType<typeof useRangeState>;

export function useDragHandlers(
	state: RangeState,
	trackRef: React.RefObject<HTMLDivElement | null>,
) {
	const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);

	const handleMove = useCallback(
		(clientX: number) => {
			if (!activeThumb || !trackRef.current) return;

			if (state.mode === "normal") {
				const newValue = state.getValueFromPosition(trackRef.current, clientX);
				if (activeThumb === "min") {
					state.updateMinValue(newValue);
				} else {
					state.updateMaxValue(newValue);
				}
			} else {
				const newIndex = state.getIndexFromPosition(trackRef.current, clientX);
				if (activeThumb === "min") {
					state.updateMinIndex(newIndex);
				} else {
					state.updateMaxIndex(newIndex);
				}
			}
		},
		[activeThumb, state, trackRef],
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
