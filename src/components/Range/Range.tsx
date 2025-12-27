"use client";

import type {
	FixedRangeProps,
	RangeProps as NormalRangeProps,
} from "@/types/range";
import { Label } from "./components/Label";
import { Thumb } from "./components/Thumb";
import { Track } from "./components/Track";
import { RangeProvider, useRangeContext } from "./context/RangeContext";
import styles from "./Range.module.css";

type RangeProps = NormalRangeProps | FixedRangeProps;

function RangeContent() {
	const context = useRangeContext();
	const isFixed = context.mode === "fixed";

	return (
		<div className={isFixed ? styles["fixed-range"] : styles.range}>
			<div
				className={isFixed ? styles["fixed-range__label"] : styles.range__label}
				id={isFixed ? "fixed-range-label" : "range-label"}
			>
				{context.label}
			</div>

			<div
				className={
					isFixed ? styles["fixed-range__values"] : styles.range__values
				}
			>
				<Label type="min" />
				<Label type="max" />
			</div>

			<div
				className={
					isFixed ? styles["fixed-range__slider"] : styles.range__slider
				}
			>
				<Track>
					<Thumb ref={context.minThumbRef} type="min" />
					<Thumb ref={context.maxThumbRef} type="max" />
				</Track>
			</div>
		</div>
	);
}

export default function Range(props: RangeProps) {
	return (
		<RangeProvider config={props}>
			<RangeContent />
		</RangeProvider>
	);
}
