import { forwardRef } from "react";
import styles from "./Thumb.module.css";

interface ThumbProps {
	value: number;
	position: number;
	label: string;
	isActive: boolean;
	onMouseDown: () => void;
	onTouchStart: () => void;
	onKeyDown: (e: React.KeyboardEvent) => void;
	min?: number;
	max?: number;
	index?: number;
	valuesLength?: number;
	currency?: string;
}

export const Thumb = forwardRef<HTMLDivElement, ThumbProps>(
	(
		{
			value,
			position,
			label,
			isActive,
			onMouseDown,
			onTouchStart,
			onKeyDown,
			min,
			max,
			index,
			valuesLength,
			currency,
		},
		ref,
	) => {
		const isFixedMode = index !== undefined && valuesLength !== undefined;

		const ariaValueMin = isFixedMode ? 0 : min;
		const ariaValueMax = isFixedMode ? valuesLength - 1 : max;
		const ariaValueNow = isFixedMode ? index : value;
		const ariaValueText = isFixedMode
			? `${label}: ${currency}${value.toFixed(2)}`
			: `${label}: ${value}`;
		const ariaLabelledBy = isFixedMode ? "fixed-range-label" : "range-label";

		const baseClass = isFixedMode
			? styles["fixed-range__thumb"]
			: styles.range__thumb;
		const activeClass = isFixedMode
			? styles["fixed-range__thumb--active"]
			: styles["range__thumb--active"];
		const className = `${baseClass} ${isActive ? activeClass : ""}`;

		return (
			<div
				ref={ref}
				role="slider"
				aria-label={label}
				aria-labelledby={ariaLabelledBy}
				aria-valuemin={ariaValueMin}
				aria-valuemax={ariaValueMax}
				aria-valuenow={ariaValueNow}
				aria-valuetext={ariaValueText}
				tabIndex={0}
				className={className}
				style={{ left: `${position}%` }}
				onMouseDown={onMouseDown}
				onTouchStart={onTouchStart}
				onKeyDown={onKeyDown}
			/>
		);
	},
);

Thumb.displayName = "Thumb";
