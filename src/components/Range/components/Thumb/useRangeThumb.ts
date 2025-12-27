import { useEffect, useState } from "react";
import { useRangeContext } from "../../context/RangeContext";

type ThumbType = "min" | "max";

interface UseRangeThumbProps {
	type: ThumbType;
	thumbRef: React.RefObject<HTMLDivElement>;
}

export function useRangeThumb({ type, thumbRef }: UseRangeThumbProps) {
	const context = useRangeContext();
	const [showBullet, setShowBullet] = useState(false);

	const isMin = type === "min";
	const isFixedMode = context.mode === "fixed";

	const value = isMin ? context.minValue : context.maxValue;
	const position = isMin ? context.minPercentage : context.maxPercentage;
	const isActive = context.activeThumb === type;

	const handleKeyDown = isMin
		? context.handleMinKeyDown
		: context.handleMaxKeyDown;

	const thumbDistance = Math.abs(context.minPercentage - context.maxPercentage);
	const isSeparated = thumbDistance < 1;

	const handleInteractionStart = () => context.setActiveThumb(type);

	const label = isMin ? "Minimum value" : "Maximum value";

	let ariaValueMin: number;
	let ariaValueMax: number;
	let ariaValueNow: number;
	let ariaValueText: string;
	let ariaLabelledBy: string;

	if (isFixedMode && context.mode === "fixed") {
		ariaValueMin = 0;
		ariaValueMax = context.valuesLength - 1;
		ariaValueNow = isMin ? context.minIndex : context.maxIndex;
		ariaValueText = `${label}: ${context.currency}${value.toFixed(2)}`;
		ariaLabelledBy = "fixed-range-label";
	} else {
		ariaValueMin = context.mode === "normal" ? context.min : 0;
		ariaValueMax = context.mode === "normal" ? context.max : 100;
		ariaValueNow = value;
		ariaValueText = `${label}: ${value}`;
		ariaLabelledBy = "range-label";
	}

	const baseClass = isFixedMode ? "fixed-range__thumb" : "range__thumb";
	const activeClass = isFixedMode
		? "fixed-range__thumb--active"
		: "range__thumb--active";
	const separatedClass = isFixedMode
		? "fixed-range__thumb--separated"
		: "range__thumb--separated";

	useEffect(() => {
		if (thumbRef.current) {
			thumbRef.current.style.left = `${position}%`;
		}
	}, [position, thumbRef]);

	return {
		value,
		position,
		label,
		isActive,
		isSeparated,
		showBullet,
		currency:
			isFixedMode && context.mode === "fixed" ? context.currency : undefined,
		handleInteractionStart,
		handleKeyDown,
		setShowBullet,
		ariaValueMin,
		ariaValueMax,
		ariaValueNow,
		ariaValueText,
		ariaLabelledBy,
		baseClass,
		activeClass,
		separatedClass,
	};
}
