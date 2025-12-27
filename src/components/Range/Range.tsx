"use client";

import clsx from "clsx";

import type {
	FixedRangeProps,
	RangeProps as NormalRangeProps,
} from "@/types/range";

import { Label } from "./components/Label/Label";
import { Thumb } from "./components/Thumb/Thumb";
import { Track } from "./components/Track/Track";
import { RangeProvider, useRangeContext } from "./context/RangeContext";
import styles from "./Range.module.css";

type RangeProps = NormalRangeProps | FixedRangeProps;

const RangeContent = () => {
	const context = useRangeContext();
	const isFixed = context.mode === "fixed";

	return (
		<fieldset className={clsx(styles.range, isFixed && styles["range--fixed"])}>
			<legend className={styles.range__label}>{context.label}</legend>

			<div className={styles.range__values}>
				<Label type="min" />
				<Label type="max" />
			</div>

			<div className={styles.range__slider}>
				<Track>
					<Thumb ref={context.minThumbRef} type="min" />
					<Thumb ref={context.maxThumbRef} type="max" />
				</Track>
			</div>
		</fieldset>
	);
};

const Range = (props: RangeProps) => {
	return (
		<RangeProvider config={props}>
			<RangeContent />
		</RangeProvider>
	);
};

export { Range };
