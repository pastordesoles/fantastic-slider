"use client";

import clsx from "clsx";

import type { RangeComponentProps } from "@/types/range";

import { Label } from "./components/Label/Label";
import { Thumb } from "./components/Thumb/Thumb";
import { Track } from "./components/Track/Track";
import { RangeProvider, useRangeContext } from "./context/RangeContext";
import styles from "./Range.module.css";

const RangeContent = () => {
	const context = useRangeContext();

	return (
		<fieldset
			className={clsx(
				styles.range,
				context.mode === "fixed" && styles["range--fixed"],
			)}
			data-mode={context.mode}
		>
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

const Range = (props: RangeComponentProps) => {
	return (
		<RangeProvider config={props}>
			<RangeContent />
		</RangeProvider>
	);
};

export { Range };
