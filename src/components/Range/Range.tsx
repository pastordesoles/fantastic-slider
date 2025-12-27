"use client";

import type {
	FixedRangeProps,
	RangeProps as NormalRangeProps,
} from "@/types/range";
import { Label } from "./components/Label";
import { Thumb } from "./components/Thumb";
import { Track } from "./components/Track";
import { useRange } from "./hooks/useRange";
import styles from "./Range.module.css";

/**
 * Range Component - Unified range slider with two modes
 *
 * This component automatically detects its mode based on props:
 * - Normal mode: when min/max props are provided
 * - Fixed mode: when values array prop is provided
 */

type RangeProps = NormalRangeProps | FixedRangeProps;

export default function Range(props: RangeProps) {
	const range = useRange(props);

	const {
		mode,
		trackRef,
		minThumbRef,
		maxThumbRef,
		label,
		minValue,
		maxValue,
		minPercentage,
		maxPercentage,
		activeThumb,
		setActiveThumb,
		handleMinKeyDown,
		handleMaxKeyDown,
	} = range;

	// Mode-specific styles and props
	const isFixed = mode === "fixed";
	const containerClass = isFixed ? styles["fixed-range"] : styles.range;
	const labelClass = isFixed
		? styles["fixed-range__label"]
		: styles.range__label;
	const labelId = isFixed ? "fixed-range-label" : "range-label";
	const valuesClass = isFixed
		? styles["fixed-range__values"]
		: styles.range__values;
	const sliderClass = isFixed
		? styles["fixed-range__slider"]
		: styles.range__slider;

	return (
		<div className={containerClass}>
			<div className={labelClass} id={labelId}>
				{label}
			</div>

			<div className={valuesClass}>
				{isFixed ? (
					<>
						<Label
							value={minValue}
							label="Minimum value"
							currency={range.currency}
						/>
						<Label
							value={maxValue}
							label="Maximum value"
							currency={range.currency}
						/>
					</>
				) : (
					<>
						<Label
							editable={true}
							value={minValue}
							min={range.min}
							max={maxValue}
							label="Minimum value"
							onValueChange={range.updateMinValue}
						/>
						<Label
							editable={true}
							value={maxValue}
							min={minValue}
							max={range.max}
							label="Maximum value"
							onValueChange={range.updateMaxValue}
						/>
					</>
				)}
			</div>

			<div className={sliderClass}>
				<Track
					ref={trackRef}
					minPercentage={minPercentage}
					maxPercentage={maxPercentage}
					mode={mode}
				>
					<Thumb
						ref={minThumbRef}
						value={minValue}
						position={minPercentage}
						label="Minimum value"
						isActive={activeThumb === "min"}
						onMouseDown={() => setActiveThumb("min")}
						onTouchStart={() => setActiveThumb("min")}
						onKeyDown={handleMinKeyDown}
						{...(isFixed
							? {
									index: range.minIndex,
									valuesLength: range.valuesLength,
									currency: range.currency,
								}
							: {
									min: range.min,
									max: range.max,
								})}
					/>

					<Thumb
						ref={maxThumbRef}
						value={maxValue}
						position={maxPercentage}
						label="Maximum value"
						isActive={activeThumb === "max"}
						onMouseDown={() => setActiveThumb("max")}
						onTouchStart={() => setActiveThumb("max")}
						onKeyDown={handleMaxKeyDown}
						{...(isFixed
							? {
									index: range.maxIndex,
									valuesLength: range.valuesLength,
									currency: range.currency,
								}
							: {
									min: range.min,
									max: range.max,
								})}
					/>
				</Track>
			</div>
		</div>
	);
}
