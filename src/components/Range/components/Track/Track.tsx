import { forwardRef, type ReactNode } from "react";
import styles from "./Track.module.css";

interface TrackProps {
	minPercentage: number;
	maxPercentage: number;
	children: ReactNode;
	mode: "normal" | "fixed";
}

export const Track = forwardRef<HTMLDivElement, TrackProps>(
	({ minPercentage, maxPercentage, children, mode }, ref) => {
		const trackClass =
			mode === "fixed" ? styles["fixed-range__track"] : styles.range__track;
		const activeClass =
			mode === "fixed"
				? styles["fixed-range__track-active"]
				: styles["range__track-active"];

		return (
			<div ref={ref} className={trackClass}>
				<div
					className={activeClass}
					style={{
						left: `${minPercentage}%`,
						width: `${maxPercentage - minPercentage}%`,
					}}
				/>
				{children}
			</div>
		);
	},
);

Track.displayName = "Track";
